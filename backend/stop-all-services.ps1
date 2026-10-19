# ========================================
# SmartHealth - Stop All Microservices
# ========================================
# Este script detiene todos los microservicios del proyecto

$ErrorActionPreference = "Continue"

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "SmartHealth - Stop All Microservices" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Deteniendo procesos Java de Maven Spring Boot..." -ForegroundColor Yellow
Write-Host ""

# Buscar y matar procesos
$processes = Get-Process | Where-Object { $_.ProcessName -eq "java" }

if ($processes) {
    $count = 0
    foreach ($proc in $processes) {
        try {
            Stop-Process -Id $proc.Id -Force -ErrorAction Stop
            Write-Host "[OK] Detenido proceso Java PID: $($proc.Id)" -ForegroundColor Green
            $count++
        } catch {
            Write-Host "[ERROR] No se pudo detener PID $($proc.Id): $_" -ForegroundColor Yellow
        }
    }
    
    Write-Host ""
    Write-Host "[SUCCESS] Se detuvieron $count procesos Java" -ForegroundColor Green
} else {
    Write-Host "[WARNING] No hay procesos Java en ejecución" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "[OK] Todos los microservicios han sido detenidos" -ForegroundColor Green
Write-Host ""
