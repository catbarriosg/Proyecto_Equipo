# Clínica Agenda Médica — Versión 1 (HTML, CSS y JavaScript)

Esta carpeta guarda la primera versión del sitio, entregada en la Evaluación Parcial 1. Ya no forma parte de la aplicación actual: se conserva como referencia de cómo era el proyecto antes de migrarlo a React.

La versión actual está en `clinica-react/` (frontend) y `backend/` (microservicios). Ver el [README principal](../README.md).

## Cómo abrirla

- Abrir `index.html` en el navegador, o
- Construir su imagen de Docker desde esta carpeta: `docker build -t clinica-v1 .` y luego `docker run -p 8081:80 clinica-v1` (http://localhost:8081).

## Contenido de la carpeta

| Archivo o carpeta | Qué es |
| --- | --- |
| `index.html`, `paginas/`, `css/`, `js/`, `img/` | El sitio en HTML |
| `Dockerfile`, `nginx.conf`, `.dockerignore` | Empaquetado del sitio HTML con nginx |
| `DEFINITION-OF-DONE.md` | Criterios del equipo para dar por terminada una página HTML |
| `CAMBIOS-INTEGRANTE-3.md` | Resumen del trabajo del integrante 3 en la versión HTML |
| `pruebagit.html` | Página de prueba usada al aprender Git |
| `react-borradores/` | Versiones intermedias de `App.jsx` de la migración a React, que la aplicación ya no usa |
| `DSY1104 Evaluación Parcial 1_EE_EP_Estudiante.pdf` | Pauta de la Evaluación Parcial 1 (no se sube a GitHub) |

## Descripción del proyecto

Clínica Agenda Médica es un proyecto frontend desarrollado para representar un sistema web orientado a la gestión de horas médicas.

El sitio permite a los usuarios consultar información de la clínica, revisar especialidades y médicos disponibles, registrar sus datos y representar el proceso de agendamiento, modificación y cancelación de horas médicas.

El proyecto fue desarrollado utilizando HTML5, CSS3 y JavaScript, incorporando herramientas y librerías de apoyo para mejorar la presentación y experiencia de usuario.

## Objetivo

Desarrollar una interfaz web funcional y responsive para una clínica médica, aplicando los conocimientos de desarrollo frontend, estructura semántica HTML5, estilos CSS3, JavaScript, validación de formularios y control de versiones mediante Git y GitHub.

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript
- Bootstrap
- Lightbox2
- Git
- GitHub
- Visual Studio Code

## Funcionalidades principales

El proyecto contempla las siguientes funcionalidades:

- Página de inicio.
- Información de la clínica.
- Visualización de especialidades médicas.
- Visualización de médicos.
- Registro de pacientes.
- Inicio de sesión.
- Perfil del paciente.
- Agendamiento de horas médicas.
- Selección de especialidad y médico.
- Selección de fecha y horario disponible.
- Confirmación de una hora médica.
- Modificación de horas registradas.
- Cancelación de horas.
- Visualización del historial de atenciones.
- Información de sucursales.
- Formulario de contacto.
- Preguntas frecuentes.
- Panel de administración.

## Estructura del proyecto

```text
clinica_agenda_medica/
│
├── index.html
│
├── paginas/
│   ├── quienes-somos.html
│   ├── especialidades.html
│   ├── medicos.html
│   ├── agendar-hora.html
│   ├── mis-horas-medicas.html
│   ├── registro-paciente.html
│   ├── login.html
│   ├── perfil-paciente.html
│   ├── modificar-hora.html
│   ├── cancelar-hora.html
│   ├── historial-atenciones.html
│   ├── sucursales.html
│   ├── contacto.html
│   ├── preguntas-frecuentes.html
│   └── panel-administracion.html
│
├── css/
│   └── estilos.css
│
├── js/
│   └── script.js
│
├── img/
│
├── .gitignore
│
└── README.md