# ========================================
# SmartHealth - Startup All Microservices
# ========================================
# Este script levanta todos los microservicios del proyecto en orden

$ErrorActionPreference = "Continue"

# ========================================
# FUNCIONES AUXILIARES
# ========================================
function Find-ProjectRoot {
    <#
    .SYNOPSIS
    Busca la raíz del proyecto SmartHealth ascendiendo en la jerarquía de directorios
    #>
    
    # Primero intenta con $PSScriptRoot
    $current = if ($PSScriptRoot) { $PSScriptRoot } else { Get-Location }
    
    Write-Host "DEBUG: Buscando raíz del proyecto desde: $current" -ForegroundColor Gray
    
    # Buscar hacia arriba hasta encontrar ms-discovery-server
    $maxLevels = 10
    $level = 0
    
    while ($level -lt $maxLevels) {
        Write-Host "DEBUG: Nivel $level - Verificando: $current" -ForegroundColor Gray
        
        $testPath = Join-Path $current "ms-discovery-server"
        if (Test-Path $testPath) {
            Write-Host "DEBUG: ✅ Encontrado en: $current" -ForegroundColor Green
            return $current
        }
        
        $parent = Split-Path -Parent $current
        if ($parent -eq $current) {
            # Llegamos a la raíz del disco
            break
        }
        
        $current = $parent
        $level++
    }
    
    return $null
}

# ========================================
# CONFIGURACION
# ========================================
$STARTUP_TIMEOUT = 30
$HEALTH_CHECK_TIMEOUT = 3
$HEALTH_CHECK_RETRIES = 10

# Buscar raíz del proyecto automáticamente
$BASE_PATH = Find-ProjectRoot

if (-not $BASE_PATH) {
    Write-Host "❌ ERROR: No se encontró la estructura del proyecto" -ForegroundColor Red
    Write-Host "   Asegúrate de clonar el repositorio correctamente o de estar en el directorio SmartHealth" -ForegroundColor Yellow
    Write-Host "   Ubicación actual: $(Get-Location)" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Raíz del proyecto encontrada en: $BASE_PATH" -ForegroundColor Green

$LOG_FILE = "$BASE_PATH\startup_$(Get-Date -Format 'yyyyMMdd_HHmmss').log"

# Definición de microservicios en orden de levantamiento
$SERVICES = @(
    @{ Name = "ms-discovery-server"; Port = 8761; Path = "$BASE_PATH\ms-discovery-server" },
    @{ Name = "ms-gateway"; Port = 8080; Path = "$BASE_PATH\ms-gateway" },
    @{ Name = "ms-hospitales"; Port = 8083; Path = "$BASE_PATH\ms-hospitales" },
    @{ Name = "ms-camas"; Port = 8082; Path = "$BASE_PATH\ms-camas" },
    @{ Name = "ms-equipamiento"; Port = 8084; Path = "$BASE_PATH\ms-equipamiento" },
    @{ Name = "ms-pacientes"; Port = 8081; Path = "$BASE_PATH\ms-pacientes" },
    @{ Name = "ms-personal"; Port = 8086; Path = "$BASE_PATH\ms-personal" },
    @{ Name = "ms-listas-de-espera"; Port = 8087; Path = "$BASE_PATH\ms-listas-de-espera" },
    @{ Name = "ms-historial"; Port = 8088; Path = "$BASE_PATH\ms-historial" },
    @{ Name = "ms-triaje"; Port = 8089; Path = "$BASE_PATH\ms-triaje" },
    @{ Name = "ms-insumos"; Port = 8085; Path = "$BASE_PATH\ms-insumos" }
)

$SERVICES_STARTED = @()
$SERVICES_FAILED = @()
$START_TIME = Get-Date
$PIDS = @{}

# ========================================
# FUNCIONES AUXILIARES
# ========================================

function Write-Log {
    param(
        [string]$Message,
        [ValidateSet("INFO", "SUCCESS", "WARNING", "ERROR")]
        [string]$Level = "INFO"
    )
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[$timestamp] [$Level] $Message"
    
    switch ($Level) {
        "SUCCESS" { Write-Host $logMessage -ForegroundColor Green }
        "ERROR"   { Write-Host $logMessage -ForegroundColor Red }
        "WARNING" { Write-Host $logMessage -ForegroundColor Yellow }
        default   { Write-Host $logMessage -ForegroundColor White }
    }
    
    Add-Content -Path $LOG_FILE -Value $logMessage -ErrorAction SilentlyContinue
}

function Start-Microservice {
    param(
        [hashtable]$Service,
        [int]$MaxRetries = 3
    )
    
    $serviceName = $Service.Name
    $servicePath = $Service.Path
    $port = $Service.Port
    $attemptCount = 0
    
    while ($attemptCount -lt $MaxRetries) {
        $attemptCount++
        
        if ($attemptCount -eq 1) {
            Write-Log "🚀 Abriendo terminal para $serviceName (puerto $port)" "INFO"
        } else {
            Write-Log "🔄 Reintentando $serviceName (intento $attemptCount/$MaxRetries)" "WARNING"
        }
        
        if (-not (Test-Path $servicePath)) {
            Write-Log "[ERROR] Ruta no encontrada: $servicePath" "ERROR"
            $SERVICES_FAILED += $serviceName
            return $false
        }
        
        try {
            # Crear comando PowerShell que se ejecutará en la nueva terminal
            $startupCommand = @"
`$host.UI.RawUI.WindowTitle = '$serviceName (Puerto $port)'
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "$serviceName - SmartHealth" -ForegroundColor Cyan
Write-Host "Puerto: $port" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
cd '$servicePath'
Write-Host "Iniciando microservicio..." -ForegroundColor Yellow
.\mvnw.cmd spring-boot:run -DskipTests=true
"@
            
            # Abrir nueva terminal PowerShell VISIBLE
            $process = Start-Process -FilePath "powershell.exe" `
                -ArgumentList "-NoExit", "-Command", $startupCommand `
                -WorkingDirectory $servicePath `
                -PassThru
            
            Write-Log "✅ Terminal abierta para $serviceName (PID: $($process.Id))" "SUCCESS"
            
            # Esperar a que el puerto esté disponible (máximo 40 segundos)
            $maxAttempts = 20
            $attempt = 0
            $portAvailable = $false
            
            while ($attempt -lt $maxAttempts) {
                $attempt++
                try {
                    $tcpClient = New-Object System.Net.Sockets.TcpClient
                    $tcpClient.Connect("127.0.0.1", $port)
                    $tcpClient.Close()
                    $portAvailable = $true
                    Write-Log "✅ $serviceName está operativo en puerto $port" "SUCCESS"
                    break
                } catch {
                    Start-Sleep -Seconds 2
                }
            }
            
            if ($portAvailable) {
                $SERVICES_STARTED += $serviceName
                return $true
            } else {
                Write-Log "⚠️  Timeout: $serviceName no respondió en tiempo esperado" "WARNING"
                # Continuar con siguiente intento
            }
            
        } catch {
            Write-Log "❌ Error al abrir terminal para $serviceName : $_" "ERROR"
        }
        
        if ($attemptCount -lt $MaxRetries) {
            Start-Sleep -Seconds 5
        }
    }
    
    Write-Log "❌ Falló levantar $serviceName después de $MaxRetries intentos" "ERROR"
    $SERVICES_FAILED += $serviceName
    return $false
}

function Show-Status {
    Write-Host ""
    Write-Host "====== ESTADO ACTUAL ======"
    Write-Host "Servicios iniciados: $($SERVICES_STARTED.Count)/$($SERVICES.Count)"
    Write-Host "Servicios fallidos: $($SERVICES_FAILED.Count)"
    
    if ($SERVICES_FAILED.Count -gt 0) {
        Write-Host "Fallidos: $($SERVICES_FAILED -join ', ')"
    }
    Write-Host ""
}

function Main {
    Write-Log "======================================" "INFO"
    Write-Log "SmartHealth - Startup All Microservices" "INFO"
    Write-Log "======================================" "INFO"
    Write-Log "Base Path: $BASE_PATH" "INFO"
    Write-Log "Log File: $LOG_FILE" "INFO"
    Write-Log "Start Time: $START_TIME" "INFO"
    Write-Log "" "INFO"
    
    # Iniciar servicios en orden
    foreach ($service in $SERVICES) {
        Start-Microservice $service
    }
    
    Show-Status
    
    Write-Log "======================================" "INFO"
    Write-Log "STARTUP COMPLETADO" "INFO"
    Write-Log "======================================" "INFO"
    Write-Log "Eureka Dashboard: http://localhost:8761" "INFO"
    Write-Log "API Gateway: http://localhost:8080" "INFO"
    Write-Log "" "INFO"
    
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host "✅ Todas las terminales están abiertas" -ForegroundColor Green
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Terminales visibles abiertos para:" -ForegroundColor Yellow
    $SERVICES_STARTED | ForEach-Object { Write-Host "  ✅ $_" -ForegroundColor Green }
    Write-Host ""
    Write-Host "Monitorea los logs en cada terminal para verificar que el servicio está iniciado." -ForegroundColor Yellow
    Write-Host "Espera a que veas 'Started [ServiceName]Application' en cada terminal." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Este script se mantendrá en ejecución. Presione Ctrl+C para terminar." -ForegroundColor Cyan
    Write-Host ""
    
    # Mantener script en ejecución
    while ($true) {
        Start-Sleep -Seconds 10
    }
}

# Ejecutar main
try {
    Main
} catch {
    Write-Log "[ERROR] Error fatal: $_" "ERROR"
    exit 1
}
