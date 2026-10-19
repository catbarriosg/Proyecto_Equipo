# Integración frontend React + backend SmartHealth

Este documento explica cómo quedó conectado el frontend (`clinica-react/`) con el backend de microservicios (`backend/`, adaptado desde SmartHealth para que la **clínica** sea el foco del sistema).

## Cómo levantar el sistema

Requisitos: Docker Desktop encendido y ~6 GB de RAM libres.

```bash
docker compose up --build        # desde la raíz del proyecto
```

| Servicio | Dirección |
|---|---|
| Frontend (React servido por nginx) | http://localhost:3000 |
| API (gateway) | http://localhost:8080 |
| Swagger de todos los servicios | http://localhost:8080/swagger-ui.html |
| Eureka | http://localhost:8761 |

La primera construcción tarda (Maven descarga dependencias). Los datos de ejemplo se cargan solo al crear el volumen de MySQL; para recargarlos: `docker compose down -v`.

Por defecto se levantan solo los servicios que usa la clínica (8 JVM). Los servicios internos sin vistas (camas, triaje, insumos, equipamiento, listas de espera) están en un perfil opcional:

```bash
docker compose --profile internos up -d
```

**Memoria:** Docker necesita al menos 3 GB para el perfil por defecto y unos 5 GB con los servicios internos. Si Docker Desktop usa WSL, el límite se define en `%USERPROFILE%\.wslconfig` (`[wsl2] memory=...`) y se aplica después de `wsl --shutdown`. Con poca memoria, las conexiones a `localhost` por IPv6 pueden quedar colgadas; `http://127.0.0.1:3000` sigue funcionando.

### Desarrollo del frontend con recarga en caliente

```bash
docker compose up --build ms-gateway ms-auth ms-citas ms-pacientes ms-personal ms-hospitales ms-historial
cd clinica-react && npm install && npm run dev      # http://localhost:5173
```

Vite reenvía `/api` al gateway (`vite.config.js`). Para trabajar **sin backend** (base simulada en `localStorage`), crea `clinica-react/.env.local` con `VITE_USE_API=false`.

### Cuentas de demostración

| Rol | Correo | Contraseña | Acceso |
|---|---|---|---|
| Administrador | admin@clinica.cl | Admin123! | /acceso-administracion |
| Médico (Medicina General) | dr.juan@clinica.cl | Medico123! | /acceso-medico |
| Médica (Pediatría) | dra.maria@clinica.cl | Medico123! | /acceso-medico |
| Paciente | ana.perez@gmail.com | Paciente123! | /login |

## Arquitectura

```
Navegador ──► nginx (frontend :3000) ──/api──► ms-gateway (:8080) ──► Eureka ──► microservicios ──► MySQL
                                               │
                                               └─ valida el JWT y agrega X-Usuario-Id, X-Usuario-Rol,
                                                  X-Paciente-Id y X-Personal-Id para los servicios
```

| Servicio | Responsabilidad en la clínica | Rutas |
|---|---|---|
| ms-auth (nuevo) | Cuentas, login, registro de pacientes, tokens JWT (BCrypt) | `/api/auth/**` |
| ms-citas (nuevo) | Agenda de horas: disponibilidad, reservar, reprogramar, cancelar, estados | `/api/citas/**` |
| ms-pacientes | Ficha del paciente (RUT validado con dígito verificador) | `/api/pacientes/**` |
| ms-personal | Médicos (vista pública), especialidades y personal | `/api/medicos/**`, `/api/especialidades/**`, `/api/personal/**` |
| ms-hospitales | Sucursales de la clínica | `/api/sucursales/**` (`/api/hospitales/**` para administrar) |
| ms-historial | Historial de atenciones del paciente | `/api/historial/**` |
| camas, triaje, insumos, equipamiento, listas de espera | Servicios internos sin vistas; solo administrador | `/api/camas/**`, etc. |

### Seguridad

- El gateway rechaza con **401** las rutas privadas sin token válido y con **403** las que no corresponden al rol (`ReglasAcceso.java`).
- Los servicios aplican las reglas de propiedad: un paciente solo ve sus citas, su ficha y su historial; un médico solo su agenda.
- Públicas: login, registro, médicos, especialidades, sucursales y disponibilidad de horas.

### Reglas de negocio de las citas (ms-citas)

- Horario: lunes a viernes 08:00–19:30, sábado 09:00–13:30, bloques de 30 minutos, hasta 90 días hacia adelante.
- Un médico no puede tener dos citas activas en el mismo horario (restricción única `franja` en la base de datos) y un paciente tampoco.
- El paciente modifica o cancela con **más de 24 horas** de anticipación; el personal no tiene esa restricción.
- Código de reserva `AM-000001`, generado por el backend.

### Formato de errores

Todos los servicios que usa el frontend responden igual, y el frontend muestra `mensaje`:

```json
{ "timestamp": "...", "status": 409, "error": "CONFLICTO", "mensaje": "Ese horario ya fue reservado...", "errores": { "campo": "..." } }
```

## Frontend

| Carpeta | Contenido |
|---|---|
| `src/api/http/` | Cliente HTTP (token, errores, sesión vencida) y funciones por recurso |
| `src/api/local/` | Misma interfaz sobre una base simulada en `localStorage` (CRUD, para trabajar sin backend) |
| `src/api/index.js` | Elige la implementación según `VITE_USE_API` |
| `src/context/` | Sesión del usuario (`useSesion`) |
| `src/components/RutaProtegida.jsx` | Protege rutas por rol y vuelve a la página pedida después del login |
| `src/hooks/useCarga.js` | Carga de datos con estados de carga y error |
| `src/utils/` | Reglas de horario, RUT y formato de fechas, teléfonos y estados |

Los componentes no saben de dónde vienen los datos: siempre llaman a `api.<recurso>.<acción>()`.
