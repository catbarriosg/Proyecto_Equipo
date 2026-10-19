#!/usr/bin/env python3
"""
SmartHealth - Monitor de Servicios Integrado en VS Code
Verifica el estado de todos los microservicios usando la API de Eureka
"""

import sys
import subprocess

# ============================================================================
# Verificar e instalar 'requests' si no está disponible
# ============================================================================
try:
    import requests
except ImportError:
    print("⚠️  Instalando paquete 'requests' necesario...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "requests", "-q"])
        import requests
        print("✅ Paquete 'requests' instalado exitosamente\n")
    except subprocess.CalledProcessError:
        print("❌ Error: No se pudo instalar 'requests'. Intenta manualmente:")
        print("   python -m pip install requests")
        sys.exit(1)

import time
from datetime import datetime
import json
from xml.etree import ElementTree as ET

# Configuración de servicios esperados
EXPECTED_SERVICES = {
    "MS-DISCOVERY-SERVER": {"name": "Discovery Server (Eureka)", "port": 8761},
    "MS-GATEWAY": {"name": "API Gateway", "port": 8080},
    "MS-HOSPITALES": {"name": "Servicio de Hospitales", "port": 8083},
    "MS-CAMAS": {"name": "Servicio de Camas", "port": 8082},
    "MS-EQUIPAMIENTO": {"name": "Servicio de Equipamiento", "port": 8084},
    "MS-PACIENTES": {"name": "Servicio de Pacientes", "port": 8081},
    "MS-PERSONAL": {"name": "Servicio de Personal", "port": 8086},
    "MS-LISTAS-DE-ESPERA": {"name": "Servicio de Listas de Espera", "port": 8087},
    "MS-HISTORIAL": {"name": "Servicio de Historial", "port": 8088},
    "MS-TRIAJE": {"name": "Servicio de Triaje", "port": 8089},
    "MS-INSUMOS": {"name": "Servicio de Insumos", "port": 8085},
}

EUREKA_URL = "http://localhost:8761/eureka/apps"

def get_eureka_services():
    """Obtiene la lista de servicios registrados en Eureka"""
    try:
        response = requests.get(EUREKA_URL, timeout=3, headers={"Accept": "application/json"})
        if response.status_code == 200:
            data = response.json()
            services = {}
            
            if "applications" in data and "application" in data["applications"]:
                apps = data["applications"]["application"]
                
                # Si es una sola aplicación, convertir a lista
                if not isinstance(apps, list):
                    apps = [apps]
                
                for app in apps:
                    app_name = app.get("name", "UNKNOWN").upper()
                    instances = app.get("instance", [])
                    
                    # Si instance es un string, convertir a lista
                    if isinstance(instances, str):
                        instances = [instances] if instances else []
                    elif not isinstance(instances, list):
                        instances = [instances]
                    
                    # Filtrar solo instancias UP
                    up_instances = []
                    for i in instances:
                        if isinstance(i, dict) and i.get("status") == "UP":
                            up_instances.append(i)
                    
                    if up_instances:
                        instance = up_instances[0]
                        port_info = instance.get("port", {})
                        if isinstance(port_info, dict):
                            port = port_info.get("$", "N/A")
                        else:
                            port = port_info
                        
                        services[app_name] = {
                            "status": "UP",
                            "port": port,
                            "ip": instance.get("ipAddr", "N/A")
                        }
                    else:
                        services[app_name] = {"status": "DOWN"}
            
            return services
    except Exception as e:
        return None

def check_eureka_status():
    """Verifica si Eureka está disponible"""
    try:
        response = requests.get(EUREKA_URL, timeout=2, headers={"Accept": "application/json"})
        return response.status_code == 200
    except:
        return False

def print_header():
    """Imprime el encabezado del dashboard"""
    print("\n" + "="*100)
    print("SmartHealth - Dashboard de Servicios (Eureka API)".center(100))
    print("="*100)
    print(f"Última actualización: {datetime.now().strftime('%H:%M:%S')}")
    print("="*100 + "\n")

def print_service_status(app_name, expected, actual):
    """Imprime el estado de un servicio"""
    service_name = expected["name"].ljust(38)
    expected_port = str(expected["port"])
    
    if actual and actual.get("status") == "UP":
        actual_port = str(actual.get("port", "N/A"))
        status = f"🟢 ACTIVO (puerto: {actual_port})"
    else:
        status = f"🔴 INACTIVO (esperado: {expected_port})"
    
    print(f"{status:<30} {service_name}")

def print_summary(up, down, total):
    """Imprime un resumen del estado general"""
    percentage = int((up / total) * 100) if total > 0 else 0
    
    print("\n" + "="*100)
    print(f"RESUMEN: {up}/{total} servicios activos ({percentage}%)".ljust(100))
    print("="*100)
    
    if up == total:
        print("✅ TODOS LOS SERVICIOS ESTÁN ACTIVOS - SISTEMA LISTO PARA PRUEBAS".center(100))
    elif up > 0:
        print(f"⚠️  {up} servicios corriendo, {down} aún compilando o con problemas".center(100))
    else:
        print("❌ EUREKA NO DISPONIBLE - Verifica que Discovery Server (8761) esté corriendo".center(100))
    
    print("="*100 + "\n")

def main():
    """Función principal"""
    # Verificar si Eureka está disponible
    eureka_available = check_eureka_status()
    
    if not eureka_available:
        print("\n" + "="*100)
        print("❌ ERROR: Discovery Server (Eureka) no está disponible en puerto 8761".center(100))
        print("="*100)
        print("\nPara levantar Eureka:")
        print("  cd 'c:\\Users\\danie\\OneDrive\\Documentos\\Proyectos\\SmartHealth\\ms-discovery-server'")
        print("  .\\mvnw.cmd spring-boot:run -DskipTests=true")
        print("\n")
        return
    
    print_header()
    
    # Obtener servicios de Eureka
    eureka_services = get_eureka_services()
    
    if eureka_services is None:
        print("❌ No se pudo conectar a Eureka en http://localhost:8761/eureka/apps")
        return
    
    print(f"{'Estado':<30} {'Servicio':<40}")
    print("-"*100)
    
    up_count = 0
    down_count = 0
    
    # Mostrar estado de cada servicio esperado
    for app_name, expected in EXPECTED_SERVICES.items():
        # MS-DISCOVERY-SERVER está disponible si Eureka responde
        if app_name == "MS-DISCOVERY-SERVER":
            if eureka_available:
                print(f"{'🟢 ACTIVO (puerto: 8761)':<30} {expected['name']:<40}")
                up_count += 1
            else:
                print(f"{'🔴 INACTIVO (esperado: 8761)':<30} {expected['name']:<40}")
                down_count += 1
        else:
            actual = eureka_services.get(app_name)
            print_service_status(app_name, expected, actual)
            
            if actual and actual.get("status") == "UP":
                up_count += 1
            else:
                down_count += 1
    
    total = len(EXPECTED_SERVICES)
    print_summary(up_count, down_count, total)
    
    # Información adicional
    print("\n📚 ENLACES ÚTILES:")
    print("-" * 100)
    print("  • Eureka Dashboard:              http://localhost:8761")
    print("  • Eureka API (JSON):              http://localhost:8761/eureka/apps")
    print("  • API Gateway:                   http://localhost:8080/swagger-ui/index.html")
    print("  • Health Check (Gateway):        http://localhost:8080/actuator/health")
    print("  • Documentación:                 INSTRUCCIONES_VS_CODE.md")
    print("\n")


if __name__ == "__main__":
    # Si se pasa argumento -watch, actualizar cada N segundos
    if len(sys.argv) > 1 and sys.argv[1] == "-watch":
        interval = int(sys.argv[2]) if len(sys.argv) > 2 else 5
        try:
            while True:
                main()
                print(f"Actualizando en {interval} segundos (Ctrl+C para salir)...\n")
                time.sleep(interval)
        except KeyboardInterrupt:
            print("\n\n👋 Monitor detenido.")
    else:
        main()

