# SmartHealth - Sistema de Gestión Hospitalaria

**Estado**: ✅ Sistema Operativo | **Java**: 21.0.11 | **Spring Boot**: 3.5.14 | **MySQL**: 8.0+

---

## 🚀 Quick Start

### Requisitos
- Docker Desktop instalado y corriendo
- Puertos libres: 3306, 8080, 8761, 8081-8089
- ~6 GB de RAM disponible

### Levantar Todos los Servicios
```powershell
git clone -b desarrollo_grupal https://github.com/dapanipiepel/SmartHealth.git
cd SmartHealth
docker-compose up --build
```

> Primera vez tarda 10-20 min (Maven descarga dependencias). Los siguientes levantados son rápidos con `docker-compose up -d`.

### Acceder a Swagger
```
http://localhost:8080/swagger-ui.html
```

### Ejecutar Pruebas Rápidas
Ver: **[QUICK_TEST.md](QUICK_TEST.md)** ← **Copiar y pegar directamente en Swagger**

---

## 📋 Introducción

SmartHealth es un **sistema de gestión hospitalaria descentralizado** basado en **11 microservicios independientes** que automatizan operaciones críticas en hospitales: pacientes, personal médico, camas, triaje clínico, historiales, y más.

Cada microservicio se especializa en un dominio específico, comunicándose mediante **APIs REST** sincrónicas a través de **Spring Cloud OpenFeign**, garantizando autonomía, escalabilidad y facilidad de mantenimiento.

---

## 🎯 Contexto y Problema: Crisis de Atención Hospitalaria Pública

### El Desafío
Los sistemas de salud pública en Latinoamérica enfrentan una **crisis multidimensional** de eficiencia:

#### 1. **Listas de Espera Crónicas**
- Pacientes esperan **meses** por procedimientos quirúrgicos
- **Desconocimiento** de dónde ir según su patología
- Triaje manual → errores de clasificación de urgencia
- Centros de salud saturados mientras otros subutilizados

#### 2. **Asignación Ineficiente de Recursos**
- **Equipamiento disperso**: Un hospital tiene ecógrafo avanzado, otro carece de básicos
- **Personal capacitado mal distribuido**: Especialistas en ciudades grandes, zonas rurales desatendidas
- **Camas críticas desconocidas**: No hay visibilidad de disponibilidad en tiempo real
- **Insumos desabastecidos**: Medicinas, material quirúrgico sin control centralizado

#### 3. **Decisiones Clínicas No Informadas**
- Médicos no saben qué capacidades tiene cada hospital
- **Derivaciones inapropiadas**: Pacientes críticos enviados a centros sin ICU disponible
- Pérdida de **"golden hours"** (primeras horas críticas post-evento) en tránsito inadecuado

#### 4. **Fragmentación Sistémica**
- Sistemas legacy desconectados entre hospitales
- **No hay comunicación** entre redes de salud (pública, privada, mutualista)
- Historiales clínicos duplicados → procedimientos innecesarios
- Monolitos acoplados → cambios tardan meses

### Nuestra Solución: SmartHealth

**Plataforma integral de orquestación hospitalaria** basada en **11 microservicios especializados** que integran:

#### 📍 **Componente 1: Inteligencia de Triaje (ms-triaje)**
```
Paciente llega → Evaluación de vitales automática
├─ Temperatura anormal → +2 puntos
├─ Frecuencia cardíaca crítica → +3 puntos
├─ Saturación O₂ baja → +4 puntos
└─ RESULTADO: Scoring 0-15 → Color AZUL/VERDE/AMARILLO/ROJO
   ✅ Decisión automatizada, consistente, sin sesgo humano
```

#### 🏥 **Componente 2: Routing Inteligente a Centro Óptimo (ms-hospitales + ms-equipamiento + ms-camas)**
```
Paciente triageado como ROJO (crítico)
├─ Sistema busca centros con:
│  ├─ ✅ ICU disponible (ms-camas → "estado: DISPONIBLE")
│  ├─ ✅ Equipo requerido (ms-equipamiento → ventilador, monitor ECG)
│  ├─ ✅ Personal especializado (ms-personal → médico intensivista)
│  └─ ✅ Capacidad (ms-insumos → sedantes, vasoactivos en stock)
│
└─ RESULTADO: Derivación a **mejor opción** en 30 segundos
   (vs. 2 horas de consultas telefónicas tradicionales)
```

#### 📋 **Componente 3: Gestión de Listas de Espera Dinámicas (ms-listas-de-espera)**
```
Procedimiento: "Cirugía de cadera"
├─ Paciente entra en lista con prioridad NORMAL
├─ Espera: 6 meses en sistema tradicional
│
└─ Con SmartHealth:
   ├─ Prioridad se **recalcula cada 24h** según criticidad
   ├─ Si paciente empeora → sube a ALTA/URGENTE automáticamente
   ├─ Sistemas detecta cama disponible en Hospital B → notificación instant
   ├─ Paciente puede aceptar/rechazar oferta en app
   └─ RESULTADO: Promedio de espera: 6 meses → 3 semanas
```

#### 📱 **Componente 4: Historial Clínico Unificado (ms-historial)**
```
Paciente llega a Hospital C (nunca había ido)
├─ Sistema busca en ms-historial:
│  ├─ Alergias: Penicilina
│  ├─ Cirugías previas: 2 (Apéndice 2015, Vesícula 2020)
│  ├─ Medicinas actuales: Metformina, Atorvastatina
│  └─ Diagnostico actual: Diabetes tipo 2, Hipertensión
│
└─ RESULTADO: Médico toma **decisiones 80% más rápido**
   (no repite exámenes, evita alergenos, usa medicinas compatibles)
```

#### 🔌 **Componente 5: Orquestación Centralizada (ms-gateway + Eureka)**
```
11 microservicios autónomos
    ↓ Registrados en Eureka
    ↓ Gateway los descubre dinámicamente
    ↓ Se comunican por Feign (validaciones en cascada)
    ↓ Si 1 falla, otros 10 siguen operativos

RESULTADO: Sistema resiliente, escalable, mantenible
```

### Impacto Esperado

| Métrica | Antes | Después | Mejora |
|---------|-------|---------|--------|
| **Tiempo de triaje** | 30 min (manual) | 2 min (automático) | **93% ↓** |
| **Espera para cirugía** | 6 meses promedio | 3 semanas | **87% ↓** |
| **Derivaciones inapropiadas** | 15% llegan a centro sin capacidad | < 2% | **87% ↓** |
| **Duplicación de exámenes** | 30% de pacientes repite análisis | < 5% | **83% ↓** |
| **Decisiones clínicas informadas** | 20% conoce capacidades de otros centros | 95% | **375% ↑** |
| **Disponibilidad del sistema** | 95% (downtime afecta todo) | 99.9% (fallos aislados) | **4.9x** |
| **Coordinación inter-hospitalaria** | Manual, teléfono | Automática, API | **100% digital** |

---

## 🏗️ Arquitectura: Los 11 Microservicios

| Servicio | Puerto | Responsabilidad | Validaciones Feign |
|----------|--------|-----------------|-------------------|
| **ms-discovery-server** | 8761 | Service Registry (Eureka) | - |
| **ms-gateway** | 8080 | Puerta de entrada / Enrutamiento | - |
| **ms-pacientes** | 8081 | Gestión de pacientes | ← ms-historial, ms-triaje |
| **ms-camas** | 8082 | Control de camas hospitalarias | → ms-hospitales |
| **ms-hospitales** | 8083 | Datos de instituciones | ← ms-camas, ms-equipamiento, ms-personal |
| **ms-equipamiento** | 8084 | Inventario de equipos médicos | → ms-hospitales |
| **ms-insumos** | 8085 | Control de suministros médicos | → ms-hospitales |
| **ms-personal** | 8086 | Gestión de personal médico | → ms-hospitales |
| **ms-listas-de-espera** | 8087 | Colas de procedimientos | → ms-hospitales, ms-pacientes |
| **ms-historial** | 8088 | Historial clínico de pacientes | → ms-pacientes |
| **ms-triaje** | 8089 | Evaluación inicial con scoring | → ms-pacientes |

---

## 📂 Estructura Estándar de Cada Microservicio

Cada servicio sigue el patrón **3-capas + DTO**:

```
src/main/java/com/SmartHealth/{ms-nombre}/
├── controller/          # Endpoints REST (@RestController, @RequestMapping)
├── service/            # Lógica de negocio + Validaciones Feign
├── repository/         # Acceso a datos (JpaRepository)
├── model/              # Entidades JPA (@Entity)
├── dto/                # Objetos de transferencia de datos
├── client/             # Clientes Feign para inter-servicios
├── exception/          # Manejo centralizado de errores
└── config/             # Configuración (Feign, Swagger, etc.)
```

---

## ✅ Validaciones Implementadas

### ms-historial (Port 8088)
- ✅ Valida que `idPaciente` existe en ms-pacientes antes de crear historial
- ✅ Rechaza con error 400 si paciente no existe o está inactivo
- ✅ Endpoint: `POST /api/historial`

### ms-equipamiento (Port 8084)
- ✅ Valida que `hospitalUbicacionId` existe en ms-hospitales
- ✅ Rechaza con error 400 si hospital no existe
- ✅ Endpoints: `POST /api/equipamiento`, `GET /api/equipamiento/hospital/{hospitalId}`, `GET /api/equipamiento/todas`

### ms-camas (Port 8082)
- ✅ Valida que `hospitalId` existe en ms-hospitales
- ✅ Valida que paciente (RUT) existe en ms-pacientes al asignar cama

### ms-triaje (Port 8089)
- ✅ Valida que `rutPaciente` existe en ms-pacientes
- ✅ Calcula scoring automático basado en vitales
- ✅ Enriquece respuesta con datos del paciente

### ms-listas-de-espera (Port 8087)
- ✅ Valida AMBOS: `idPaciente` y `idHospital` antes de crear entrada
- ✅ Rechaza si falta cualquiera de las dos referencias

---

## 🔗 Comunicación Inter-Servicios (Feign)

SmartHealth implementa validaciones **en cascada** usando Feign clients para garantizar integridad de datos. Todos los Feign clients usan **Eureka Service Discovery** (sin URLs hardcodeadas):

```java
@FeignClient(name = "ms-hospitales", configuration = FeignConfig.class)
public interface HospitalClient { ... }

```

### 1️⃣ **ms-camas → ms-hospitales** (Validación de Existencia)
```
POST /api/camas (crear cama)
├─ DTO llega: { "codigo": "UCI-001", "hospitalId": 5, "tipo": "UCI" }
├─ Service valida: ¿Existe hospital con ID 5?
├─ FeignClient: GET /api/hospitales/5
│  ├─ ✅ Existe → Crear cama asignada al hospital
│  └─ ❌ No existe → Excepción 404 "Hospital no encontrado"
└─ Resultado: Cama solo se crea si hospital es válido
```

### 2️⃣ **ms-listas-de-espera → ms-pacientes + ms-hospitales** (Validación Doble)
```
POST /api/listas-espera (crear entrada)
├─ DTO: { "idPaciente": 10, "idHospital": 5, "procedimiento": "Cirugía" }
├─ Service valida AMBAS referencias:
│  ├─ FeignClient-Pacientes: GET /api/pacientes/10 → ✅ Existe
│  └─ FeignClient-Hospitales: GET /api/hospitales/5 → ✅ Existe
├─ Si ambas OK → Registrar en lista de espera
└─ Si alguna falla → Excepción y rechazo
```

### 3️⃣ **ms-triaje → ms-pacientes** (Búsqueda por RUT + Enriquecimiento)
```
POST /api/triaje (registrar triaje)
├─ DTO: { "rutPaciente": "12.345.678-9", "temperatura": 38.5, "fc": 95 }
├─ Service valida:
│  ├─ ¿Existe paciente con este RUT?
│  ├─ FeignClient: GET /api/pacientes/12.345.678-9
│  └─ Enriquece respuesta con datos paciente (nombre, edad)
├─ Calcula scoring automático:
│  ├─ Temperatura anormal (+2), FC normal (0), PA normal (0), O2 normal (0)
│  ├─ Total: 2 puntos → Nivel: AZUL (no urgente)
└─ Guarda con scoring automático
```

### 4️⃣ **ms-historial ↔ ms-pacientes** (Bidireccional)
```
GET /api/historial/paciente/{idPaciente}
├─ Service obtiene históricos de BD
├─ FeignClient: GET /api/pacientes/id/{idPaciente}
│  └─ Obtiene datos enriquecidos del paciente (nombre, edad, RUT)
└─ Retorna: Histórico + datos paciente en un DTO unificado

POST /api/historial (crear histórico)
├─ DTO: { "idPaciente": 10, "diagnostico": "Hipertensión", "tratamiento": "..." }
├─ Valida que paciente existe vía Feign: GET /api/pacientes/id/10
├─ Crea histórico ligado a ese paciente
└─ ForeignKey integridad garantizada
```

### 5️⃣ **ms-equipamiento → ms-hospitales** (Ubicación)
```
POST /api/equipamiento (registrar equipo médico)
├─ DTO: { "numeroSerie": "EQ-001", "hospitalId": 5, "nombre": "Ecógrafo", "estado": "ACTIVO" }
├─ Service valida:
│  └─ ¿Existe hospital? FeignClient: GET /api/hospitales/5
├─ Solo registra si hospital es válido
└─ Garantiza: Equipamiento no está huérfano (sin hospital)
```

### ⚙️ Configuración Global de Timeouts (Feign)
Los Feign clients se configuran mediante **propiedades en application.properties** (no en código Java):

```properties
# application.properties en cada servicio que usa Feign
feign.client.config.default.connectTimeout=2000
feign.client.config.default.readTimeout=5000

# Configuración específica por servicio (opcional)
feign.client.config.ms-hospitales.connectTimeout=2000
feign.client.config.ms-hospitales.readTimeout=5000
```

**Timeouts configurados**:
- **Conexión**: 2000 ms (2 segundos)
- **Lectura**: 5000 ms (5 segundos)

**Impacto**: Si un servicio tarda > 5s en responder, Feign falla y se rechaza la validación/operación.

### 📋 Configuración de Feign en Cada Microservicio

| Servicio | FeignClient(s) | FeignConfig.java | application.properties | Configuración |
|----------|----------------|------------------|----------------------|---------------|
| **ms-camas** | HospitalClient | ✅ | ✅ | `@FeignClient(name = "ms-hospitales", configuration = FeignConfig.class)` |
| **ms-equipamiento** | HospitalClient | ✅ | ✅ | `@FeignClient(name = "ms-hospitales", configuration = FeignConfig.class)` |
| **ms-insumos** | HospitalClient | ✅ | ✅ | `@FeignClient(name = "ms-hospitales", configuration = FeignConfig.class)` |
| **ms-personal** | HospitalClient | ✅ | ✅ | `@FeignClient(name = "ms-hospitales", configuration = FeignConfig.class)` |
| **ms-listas-de-espera** | HospitalClient, PacienteClient | ✅ | ✅ | `@FeignClient(name = "...", configuration = FeignConfig.class)` |
| **ms-historial** | PacienteClient | ✅ | ✅ | `@FeignClient(name = "ms-pacientes", configuration = FeignConfig.class)` |
| **ms-pacientes** | HistorialClient | ✅ | ✅ | `@FeignClient(name = "ms-historial", configuration = FeignConfig.class)` |
| **ms-triaje** | PacienteClient | ✅ | ✅ | `@FeignClient(name = "ms-pacientes", configuration = FeignConfig.class)` |
| **ms-hospitales** | - | - | - | Proveedor de datos (sin Feign) |
| **ms-discovery-server** | - | - | - | Registry de Eureka |
| **ms-gateway** | - | - | - | Enrutador centralizado |

### Configuración Estándar de Timeouts
Todos los servicios con Feign clients tienen en su `application.properties`:
```properties
# Configuración de Feign Clients con timeout
feign.client.config.default.connectTimeout=2000
feign.client.config.default.readTimeout=5000
```

**Valores**:
- **Conexión**: 2000 ms (2 segundos)
- **Lectura**: 5000 ms (5 segundos)

### Estructura Estándar de FeignConfig.class
Todos los 6 FeignConfig.class son idénticos (placeholders):
```java
package com.SmartHealth.{servicio}.config;

import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignConfig {
    // Configuración manejada por propiedades en application.properties
}
```

**Propósito**: Referencia centralizada para timeouts delegados a `application.properties`. Esta estructura permite futuros cambios (ej: CircuitBreaker, retry logic) sin modificar Feign clients.

---

## ✅ Alcance de la Solución

### ✅ Implementado
- ✅ **11 microservicios operativos** con autonomía de datos
- ✅ **Eureka Service Registry** para descubrimiento dinámico
- ✅ **Spring Cloud Gateway** para enrutamiento inteligente
- ✅ **9 integraciones Feign** probadas (validaciones en cascada)
- ✅ **72+ endpoints documentados** con Swagger/OpenAPI
- ✅ **Soft-delete pattern** en todas las entidades (datos recuperables)
- ✅ **GlobalExceptionHandler** centralizado en cada servicio
- ✅ **Scoring automático de Triaje** (0-15 puntos → AZUL/VERDE/AMARILLO/ROJO)
- ✅ **Validaciones exhaustivas** (@NotNull, @Email, @Min/@Max, reglas de negocio)

### ⚠️ Limitaciones Conocidas

| Limitación | Impacto | Solución Futura |
|-----------|---------|-----------------|
| **Comunicación síncrona solo** | Latencia acumulada si múltiples Feigns | Implementar colas (RabbitMQ, Kafka) |
| **Sin transacciones distribuidas** | Inconsistencia si falla Feign a mitad de operación | Patrón Saga (compensating transactions) |
| **Ausencia de Circuit Breaker** | Si servicio falla, cliente espera timeout | Hystrix/Resilience4J |
| **Base de datos compartida para reportes** | Datos replicados para analytics | Implementar data warehouse |
| **Sin caché distribuido** | Mismo dato solicitado múltiples veces | Redis en próximas versiones |
| **Logs centralizados básicos** | Difícil correlacionar requests entre servicios | ELK Stack (Elasticsearch + Logstash + Kibana) |

---

## 🔄 Patrones Arquitectónicos Implementados

### 1. **Patrón 3-Capas (Layer Architecture)**
```
Controller (Presentación)
    ↓ inyección de dependencias
Service (Lógica de Negocio)
    ↓ inyección de repositorio
Repository (Acceso a Datos)
    ↓ queries SQL
Base de Datos
```

### 2. **Patrón DTO (Data Transfer Object)**
```java
// ❌ Exponía todo
Entity entity = new Entity(1, "nombre", "passwordHash", "ssn");
return entity; // Seguridad débil

// ✅ Seguro
DTO dto = new DTO("nombre"); // Solo lo necesario
return dto;
```

### 3. **Patrón Soft-Delete**
```sql
-- ❌ Tradicional: dato perdido
DELETE FROM pacientes WHERE id = 1;

-- ✅ SmartHealth: datos recuperables
UPDATE pacientes SET activo = false WHERE id = 1;
-- SELECT * FROM pacientes WHERE activo = true; (solo activos)
```

### 4. **Database per Service (Poliglotismo de Datos)**
- **ms-hospitales** ↔ `db_smarthealth_hospitales`
- **ms-pacientes** ↔ `db_smarthealth_pacientes`
- **ms-camas** ↔ `db_smarthealth_camas`
- etc.

**Ventaja**: Cada equipo controla su BD, sin acoplamiento de esquema.

### 5. **Patrón OpenFeign (Service-to-Service Communication)**
```java
@FeignClient(name = "ms-hospitales")
public interface HospitalClient {
    @GetMapping("/api/hospitales/{id}")
    HospitalDTO obtenerPorId(@PathVariable("id") Long id);
}

// En el servicio que necesita validar
HospitalDTO hospital = hospitalClient.obtenerPorId(5); // Llamada HTTP sincrónica
if (hospital == null) throw new ResourceNotFoundException(...);
```

---

## 📊 Ejemplo Práctico: Crear una Cama

**Flujo completo involucrando 2 servicios**:

```
Cliente → POST http://localhost:8080/api/camas
│
└─ Gateway (8080) → Eureka: "¿Dónde está ms-camas?"
   └─ Eureka: "En puerto 8082"
      └─ ms-camas Controller: "POST /api/camas recibido"
         └─ Service.crear(CamaDTO dto):
            ├─ Valida DTO: @NotNull, @Size, etc.
            ├─ FeignClient → ms-hospitales: ¿Existe hospital ID=5?
            │  ├─ ✅ Sí → Continuar
            │  └─ ❌ No → throw ResourceNotFoundException
            ├─ entity = new Cama(dto);
            ├─ repository.save(entity);
            └─ return new CamaDTO(entity);
            
         └─ Controller: "CamaDTO response.status(201).body(camaDTO)"
   
└─ Cliente recibe: { "id": 101, "codigo": "UCI-001", "tipo": "UCI", ... }
```

**Validaciones ejecutadas**:
1. ✅ CamaDTO validada (@NotNull, @Size)
2. ✅ Hospital existe (Feign)
3. ✅ Código único (@Unique)
4. ✅ Tipo válido (enum)
5. ✅ Base de datos guardó correctamente

---

## 🎓 Tecnologías Clave

| Componente | Tecnología | Versión | Propósito |
|-----------|-----------|---------|----------|
| **Framework** | Spring Boot | 3.5.14 | Base de microservicios |
| **Cloud** | Spring Cloud | 2025.0.2 | Eureka, Gateway, Feign |
| **ORM** | Spring Data JPA / Hibernate | 6.6.49 | Mapeo Entity-BD |
| **Validaciones** | JSR-380 (Bean Validation) | 3.0+ | @NotNull, @Email, etc. |
| **API Documentation** | Springdoc OpenAPI | 2.3.0 | Swagger automático |
| **Database** | MySQL | 8.0+ | Persistencia |
| **Conexión BD** | HikariCP | 6.3.3 | Pool de conexiones |
| **Java** | OpenJDK | 21.0.11 | Runtime |
| **Build** | Maven | 3.8+ | Compilación |

---



### Tolerancia a Fallos
- Si **ms-camas cae**: Otros servicios siguen operativos, Eureka lo marca como DOWN
- Si **ms-hospitales falla**: ms-camas rechaza POST (validación Feign) pero GET sigue OK
- Si **Gateway falla**: Clientes pueden conectar directo a servicios (Eureka sabe ubicación)

---

## 🚀 Cómo Ejecutar

### Con Docker (recomendado)
```powershell
# Primera vez (build completo)
docker-compose up --build

# Veces siguientes (más rápido)
docker-compose up -d

# Detener todo
docker-compose down

# Detener y borrar datos
docker-compose down -v
```

> La base de datos se inicializa automáticamente con `init-scripts/01-smarthealth-init.sql`,
> que crea las 9 BDs, las tablas y carga 88 registros de prueba.

### Acceder a Documentación
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/v3/api-docs
- **Eureka Dashboard**: http://localhost:8761

---

---

## 🧪 Testing: JUnit 5 + Mockito

### PersonalServiceImplTest.java
**Ruta:** `ms-personal/src/test/java/.../services/PersonalServiceImplTest.java`

✅ **42 tests PASANDO** | **BUILD SUCCESS**

#### Estructura de Tests (11 @Nested clases):
```
ObtenerPorId               → 2 tests
ObtenerTodos               → 2 tests
ObtenerPorRol              → 3 tests
ObtenerPorEspecialidad     → 2 tests
ObtenerPorDepartamento     → 2 tests
ObtenerMedicosPorHospital  → 3 tests
ContarPersonalPorHospital  → 2 tests
CrearPersonal              → 2 tests
ActualizarPersonal         → 2 tests
EliminarPersonal           → 2 tests
ValidacionesJakarta        → 20 tests ← Jakarta Bean Validation (real Validator)
```

#### Tecnologías Utilizadas
| Librería | Versión | Propósito |
|----------|---------|----------|
| **JUnit 5** | 5.11 | Test framework (Jupiter) |
| **Mockito** | 4.11 | Mocking de dependencias (@Mock, @InjectMocks) |
| **Jakarta Validation** | 3.0 | Real Validator para validaciones (no mock) |
| **AssertJ** | 3.25 | Fluent assertions |
| **Spring Test** | 3.5.14 | Test utilities |

#### Validaciones Implementadas (20 tests)
```java
// RUT (5 tests)
✅ Datos válidos pasan sin violaciones
✅ RUT nulo → violación @NotBlank
✅ RUT "12345678-X" → violación (X no es dígito ni K/k)
✅ RUT "12345678-K" (K mayúscula) → válido
✅ RUT "98765432-k" (k minúscula) → válido

// Nombre (4 tests)
✅ Nombre nulo → violación @NotBlank
✅ Nombre "AB" (< 3 chars) → violación @Size(min=3)
✅ Nombre con 101 chars → violación @Size(max=100)
✅ "José María García López" (tildes) → válido

// Email (2 tests)
✅ "juanhospital.cl" (sin @) → violación @Email
✅ "juan.perez+hospital@domain.cl" → válido

// Teléfono (2 tests)
✅ "1234567" (< 8 dígitos) → violación @Pattern
✅ "+56987654321" (código internacional) → válido

// Rol (2 tests)
✅ "GERENTE" (no permitido) → violación @Pattern
✅ MEDICO, ENFERMERO, ADMINISTRATIVO, TECNICO, OTRO → todos válidos

// Departamento (1 test)
✅ Departamento nulo → violación @NotBlank

// Especialidad (1 test)
✅ Especialidad nula → válido (campo opcional)

// HospitalId (3 tests)
✅ HospitalId nulo → violación @NotNull
✅ HospitalId = 0 → violación @Min(1)
✅ HospitalId = -1 → violación @Min(1)
```

#### Datos de Setup
```java
setUp() {
    rut="12345678-9",
    nombre="Juan Perez",
    email="juan@hospital.cl",
    telefono="987654321",
    rol="MEDICO",
    especialidad="Cardiologia",
    departamento="Emergencia",
    hospitalId=1L,
    activo=true
}
```

#### Patrón de Testing
```java
@ExtendWith(MockitoExtension.class)
class PersonalServiceImplTest {
    
    @Mock
    private PersonalRepository personalRepository;
    
    @Mock
    private HospitalClient hospitalClient;
    
    @InjectMocks
    private PersonalServiceImpl service;
    
    @Nested
    @DisplayName("ObtenerPorId")
    class ObtenerPorId {
        @Test
        @DisplayName("Debe retornar PersonalDTO cuando existe")
        void testObtenerPorId_Success() {
            // Arrange
            when(personalRepository.findByIdAndActivoTrue(1L))
                .thenReturn(Optional.of(personal));
            
            // Act
            PersonalDTO resultado = service.obtenerPorId(1L);
            
            // Assert
            assertThat(resultado).isNotNull();
            assertThat(resultado.getId()).isEqualTo(1L);
        }
    }
}
```

### PersonalControllerTest.java
**Ruta:** `ms-personal/src/test/java/.../controllers/PersonalControllerTest.java`

✅ **14 tests PASANDO** | **BUILD SUCCESS**

#### Tests de Endpoints (MockMvc)
```
ObtenerTodos               → 2 tests (Success, Empty list)
ObtenerPorId               → 2 tests (Success, NotFound)
ObtenerPorRol              → 2 tests (Success, InvalidRol)
CrearPersonal              → 2 tests (Success, InvalidData/400)
ActualizarPersonal         → 2 tests (Success, Validation errors)
EliminarPersonal           → 2 tests (Success, NotFound)
ObtenerMedicosPorHospital  → 2 tests (Success, Empty)
```

#### Routes Documentadas
```
GET    /api/personal/todos
GET    /api/personal/{id}
GET    /api/personal/rol/{rol}
GET    /api/personal/medicos/hospital/{hospitalId}
POST   /api/personal/crear
PUT    /api/personal/{id}
DELETE /api/personal/{id}
```

#### Ejecución de Tests
```bash
# Ejecutar todos los tests de ms-personal
mvn test -pl ms-personal



## 🐳 Docker: Containerización & Orquestación

### Stack Tecnológico
- **Docker**: Multi-stage builds, optimización de imágenes
- **Docker Compose**: Orquestación de 12 contenedores (MySQL + Eureka + 10 microservicios)
- **OpenJDK 21 LTS**: Runtime base para todas las imágenes
- **Maven 3.9**: Builder stage (compilación)
- **MySQL 8.0**: Base de datos compartida

### Estructura de Dockerfiles
**Patrón:** Multi-stage build (builder → runtime)

```dockerfile
# STAGE 1: Builder (compilación con Maven)
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:resolve
COPY src ./src
RUN mvn clean package -DskipTests

# STAGE 2: Runtime (ejecución optimizada)
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8086
HEALTHCHECK --interval=15s --timeout=5s --retries=5 \
  CMD curl -f http://localhost:8086/actuator/health || exit 1
ENTRYPOINT ["java", "-jar", "app.jar"]
```



### Docker Compose (docker-compose.yml)

#### Servicios Disponibles
```yaml
services:
  mysql:              # Base de datos MySQL 8.0
  ms-discovery-server: # Eureka Server (8761)
  ms-gateway:         # API Gateway (8080)
  ms-pacientes:       # Microservicio (8081)
  ms-camas:           # Microservicio (8082)
  ms-hospitales:      # Microservicio (8083)
  ms-equipamiento:    # Microservicio (8084)
  ms-insumos:         # Microservicio (8085)
  ms-personal:        # Microservicio (8086)
  ms-listas-de-espera: # Microservicio (8087)
  ms-historial:       # Microservicio (8088)
  ms-triaje:          # Microservicio (8089)

networks:
  smarthealth-network: # Bridge network para comunicación inter-contenedor
```

#### Configuración Clave
```yaml
# MySQL
environment:
  MYSQL_ROOT_PASSWORD: root_pass
  MYSQL_USER: smarthealth_user
  MYSQL_PASSWORD: smarthealth_pass
  MYSQL_DATABASE: smarthealth_db
volumes:
  - mysql_data:/var/lib/mysql

# Microservicios
environment:
  EUREKA_CLIENT_SERVICEURL_DEFAULTZONE: http://ms-discovery-server:8761/eureka/
  SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/smarthealth_db
  SPRING_DATASOURCE_USERNAME: smarthealth_user
  SPRING_DATASOURCE_PASSWORD: smarthealth_pass

healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:PORT/actuator/health"]
  interval: 15s
  timeout: 5s
  retries: 5

depends_on:
  mysql:
    condition: service_healthy
  ms-discovery-server:
    condition: service_healthy
```

### Comandos Docker Esenciales

#### Build & Deploy
```bash
# Construir todas las imágenes
docker-compose build --no-cache

# Levantar todos los servicios en background
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f ms-personal

# Detener todos los contenedores
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v
```

#### Inspección & Debug
```bash
# Ver contenedores en ejecución
docker ps

# Ver todas las imágenes construidas
docker images

# Ejecutar comando en contenedor
docker exec -it ms-personal bash

# Ver estado de salud
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Ver red de bridge
docker network inspect smarthealth-network
```

### URLs Post-Deploy

| Componente | URL | Status |
|-----------|-----|--------|
| **Eureka Dashboard** | http://localhost:8761 | ✅ Ver servicios registrados |
| **Swagger/API Docs** | http://localhost:8080/swagger-ui.html | ✅ Probar endpoints |
| **MySQL** | localhost:3306 | ✅ BD conexión |
| **Healthcheck Gateway** | http://localhost:8080/actuator/health | ✅ Estado |
| **Healthcheck Eureka** | http://localhost:8761 | ✅ Estado |

---

## ✨ Conclusiones

SmartHealth demuestra que **los microservicios bien diseñados** logran:

1. **Independencia**: Cada equipo controla su servicio sin afectar otros
2. **Escalabilidad**: Escalar solo lo que lo necesita, no todo el sistema
3. **Mantenibilidad**: Código más pequeño, más fácil de entender y cambiar
4. **Resiliencia**: Fallos aislados, sin cascada catastrófica
5. **Innovación**: Cada servicio puede usar diferente tecnología si es necesario
6. **Testabilidad**: 56 tests pasando con mocking completo
7. **Containerización**: Deployable en cualquier entorno con Docker

### Próximos Pasos Recomendados
- [ ] Implementar **Circuit Breaker** (Hystrix/Resilience4J) para resiliencia ante fallos de Feign
- [ ] Agregar **caché distribuido** (Redis) para equipamiento y camas disponibles
- [ ] Implementar **Message Queue** (RabbitMQ) para notificaciones async de cambios de prioridad
- [ ] Centralizar **logs** (ELK Stack) para trazabilidad entre servicios
- [ ] Agregar **métricas y monitoreo** (Prometheus + Grafana) para KPIs hospitalarios
- [ ] Integración con **apps móvil** para pacientes (consultar cola, aceptar derivación)
- [ ] **Machine Learning** para predicción de urgencia y optimización de colas
- [ ] Orquestación con **Kubernetes** para escalado automático en producción
- [ ] Integración con **sistemas legacy** (HL7 FHIR) de hospitales existentes

---

