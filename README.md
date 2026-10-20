# Clínica Agenda Médica

Aplicación web para consultar la clínica y gestionar horas médicas: un frontend en React conectado a un backend de microservicios Spring Boot.

## Estructura

```text
Proyecto_Equipo/
├── backend/            Microservicios Spring Boot (gateway, auth, citas, pacientes, personal…)
├── clinica-react/      Frontend en React + Vite (pruebas en src/pruebas/)
├── Versión-1/          Primera versión del sitio en HTML, CSS y JavaScript (Evaluación Parcial 1)
├── docker-compose.yml  Levanta el sistema completo
└── INTEGRACION.md      Arquitectura, cuentas de prueba y reglas de negocio
```

## Cómo levantarlo

Sistema completo (requiere Docker Desktop):

```bash
docker compose up --build
```

Luego abrir http://localhost:3000. Las cuentas de demostración están en [INTEGRACION.md](INTEGRACION.md).

Solo el frontend, sin backend (datos simulados en el navegador):

```bash
cd clinica-react
npm install
echo VITE_USE_API=false > .env.local
npm run dev
```

## Pruebas

```bash
cd clinica-react
npm test            # ejecuta las pruebas unitarias
npm run coverage    # genera el reporte de cobertura en coverage/index.html
```

## Tecnologías

- **Frontend:** React 19, Vite, React Router, Bootstrap 5, SweetAlert2.
- **Pruebas:** Vitest, React Testing Library, jsdom.
- **Backend:** Spring Boot, Spring Cloud Gateway, Eureka, MySQL.
- **Despliegue:** Docker y Docker Compose.

## Integrantes

Constanza Cabrera, Catalina Barrios y Santiago Mendoza — DSY1104 Desarrollo Fullstack II, Duoc UC.
