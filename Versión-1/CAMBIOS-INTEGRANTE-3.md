# Cambios del Integrante 3 — Información, contacto y administración

Rama: `integrante-3` · Base: `43204b4` (mismo punto que `desarrollo`)

Este documento resume el trabajo del bloque asignado al integrante 3 según la
división acordada por el equipo: **contacto, sucursales, preguntas frecuentes y
panel de administración**.

---

## 1. Páginas desarrolladas

### `paginas/contacto.html`

Formulario de contacto completo con validación en JavaScript.

- Campos: nombre, correo, asunto (lista desplegable) y mensaje.
- Atributos de apoyo: `novalidate`, `autocomplete`, `placeholder`, `minlength`,
  `maxlength`, `required` y `aria-describedby`.
- Cada campo tiene su propio `<small class="mensaje-error">` donde JavaScript
  escribe el mensaje correspondiente.
- Columna lateral con tarjetas de dirección (`<address>`), teléfono (`tel:`),
  correo (`mailto:`) y horario de atención.

### `paginas/sucursales.html`

Cuatro sucursales presentadas en tarjetas.

- Cada tarjeta es un `<article>` con `<figure>`, imagen, dirección, teléfono,
  horarios y botón para agendar hora.
- Cuadrícula responsive con CSS Grid (`auto-fit`), sin depender de Bootstrap.
- Mapa embebido de Google Maps más un enlace para abrirlo en grande.

### `paginas/preguntas-frecuentes.html`

Diez preguntas agrupadas en tres secciones temáticas.

- Se usa `<details>` y `<summary>`, tal como propuso la líder del equipo.
- La flecha por defecto del navegador se reemplaza por un `+` / `−` con CSS.
- Incluye un buscador que filtra las preguntas mientras se escribe.

### `paginas/panel-administracion.html`

Panel de gestión con tres tablas y datos de ejemplo.

- Tablas de **pacientes**, **médicos** y **horas médicas**, con `<table>`,
  `<caption>`, `<thead>`, `<th scope="col">` y `<time datetime>`.
- Indicadores de resumen que se calculan solos según las filas existentes.
- Los botones funcionan de verdad:
  - **Agregar** despliega un formulario validado y añade la fila a la tabla.
  - **Editar** alterna el estado del registro entre Activo e Inactivo.
  - **Eliminar / Cancelar** pide confirmación antes de quitar la fila.

---

## 2. JavaScript

Todo el código propio está al final de `js/script.js`, dentro de un bloque
claramente delimitado con el comentario `INTEGRANTE 3`, y con su propio
`DOMContentLoaded`. Las funciones están separadas por responsabilidad, según lo
acordado para evitar conflictos:

| Función | Qué hace |
|---|---|
| `validarContacto()` | Valida el formulario de contacto |
| `iniciarBuscadorFaq()` | Filtra las preguntas frecuentes |
| `iniciarPanelAdministracion()` | Controla tablas, formularios y botones del panel |

Cada una comprueba primero que sus elementos existan en la página, así que el
archivo no genera errores en las páginas de los demás integrantes.

### Validaciones implementadas

- **Nombre**: obligatorio, mínimo 3 caracteres, solo letras y espacios.
- **Correo**: obligatorio y con formato `usuario@dominio.ext`.
- **Asunto**: obligatorio (lista desplegable).
- **Mensaje**: entre 10 y 500 caracteres, con contador en vivo. Si es muy corto,
  el mensaje indica cuántos caracteres faltan.
- **RUT chileno**: valida el formato y calcula el **dígito verificador**
  (módulo 11). Da formato automático (`12345678-5` → `12.345.678-5`) y, si el
  dígito está mal, sugiere el correcto. También detecta RUT duplicado.

Las validaciones corren **en tiempo real** (`blur` e `input`), no solo al enviar.
Al enviar con errores, el foco salta al primer campo con problema.

---

## 3. CSS

Todas las reglas nuevas están **al final de `css/estilos.css`**, en un bloque
marcado con el comentario `INTEGRANTE 3`.

- No se modificó ninguna regla existente.
- No se cambiaron colores, rutas ni la estructura global.
- Las clases nuevas llevan prefijo propio (`contacto-`, `sucursal-`, `faq-`,
  `panel-`, `tabla-`, `estado-`) para no chocar con las de los demás.
- Se mantuvieron el header y el footer exactamente como estaban.
- Incluye su propio `@media (max-width: 600px)` para celular.

---

## 4. Correcciones a problemas encontrados

### `js/script.js` se caía en 11 páginas

El bloque de agendar hora buscaba `#formulario-agenda` en todas las páginas que
cargan el script. En las que no tienen ese formulario lanzaba
`TypeError: Cannot read properties of null` y ensuciaba la consola. Se agregó una
comprobación previa (una sola línea, sin reindentar nada más).

### El mapa de sucursales no se veía

La dirección `google.com/maps?q=...&output=embed` responde **301** con la cabecera
`X-Frame-Options: SAMEORIGIN`, por lo que el navegador bloquea el `iframe` y el
mapa aparece en blanco.

Se probó OpenStreetMap como alternativa, pero su servidor de imágenes devuelve
mosaicos en blanco (130 bytes en lugar de ~6.900) cuando la página se sirve desde
un entorno de desarrollo, porque su política de uso bloquea esos orígenes.

La solución fue usar la dirección **`/maps/embed` directa de Google**, que no
redirige y por lo tanto no activa el bloqueo.

### Faltaba el video embebido que pide la pauta

La pauta exige explícitamente "videos embebidos" y ninguna página lo tenía. Se
agregó una sección nueva al final de `paginas/quienes-somos.html`, sin modificar
nada del contenido existente.

- Video institucional del Ministerio de Salud de Chile dentro de `<figure>` y
  `<figcaption>`, con enlace de respaldo para verlo en YouTube.
- El `iframe` mantiene la proporción 16:9 en cualquier pantalla usando
  `aspect-ratio`, verificado a 1280px y a 390px de ancho.

---

## 5. Cómo probar el sitio

El sitio **debe abrirse con un servidor**, no con doble clic en el archivo. Si se
abre como `file://`, YouTube rechaza el video con *Error 153* porque la página no
tiene un origen válido.

Con la extensión **Live Server** de VS Code: clic derecho sobre `index.html` →
*Open with Live Server*.

> **Aviso sobre el puerto 5500**
>
> Si en el equipo está instalado **Oracle XE**, su servicio `tnslsnr` ocupa
> `127.0.0.1:5500`, que es el mismo puerto por defecto de Live Server. Cuando eso
> pasa, `http://localhost:5500` responde Oracle en vez del sitio.
>
> Soluciones: usar la dirección de red que muestra Live Server
> (por ejemplo `http://192.168.x.x:5500`), o cambiar el puerto en `settings.json`
> con `"liveServer.settings.port": 5501`.

---

## 6. Pruebas realizadas

Las páginas se probaron de forma automatizada con Chrome, simulando el uso real:

- **30 comprobaciones** de validación e interacción, todas correctas.
- **0 errores en la consola** en todas las páginas del sitio, incluidas las de
  los demás integrantes.
- Sin desbordes horizontales a **390px** (celular) ni a **1280px** (escritorio).
- El formulario de agendar hora sigue funcionando igual que antes del cambio.
- Video y mapa verificados con el sitio servido por Live Server.

---

## 7. Commits de la rama

| Commit | Descripción |
|---|---|
| `c1cd73e` | Evitar error de script.js en paginas sin formulario de agenda |
| `e8dc336` | Crear pagina de contacto con formulario validado en JS |
| `da772bd` | Crear pagina de sucursales con tarjetas y mapa embebido |
| `b653ee4` | Crear pagina de preguntas frecuentes con buscador |
| `68f0a13` | Crear panel de administracion con tablas y acciones |
| `8936aaa` | Ignorar el PDF de la evaluacion en el control de versiones |
| `c258000` | Corregir el mapa de sucursales que no se mostraba |
| `0a617a5` | Agregar video institucional embebido en Quienes somos |
| `732da58` | Usar la direccion directa de Google Maps para el mapa de sucursales |

Archivos modificados: `.gitignore`, `css/estilos.css`, `js/script.js`,
`paginas/contacto.html`, `paginas/sucursales.html`,
`paginas/preguntas-frecuentes.html`, `paginas/panel-administracion.html`,
`paginas/quienes-somos.html`.

---

## 8. Notas para la integración

### Archivos fuera del bloque asignado

Dos cambios tocan archivos que no son del integrante 3. **Conviene avisarlos
antes del merge**:

1. `js/script.js` — una línea agregada al inicio (la comprobación que evita el
   error). No se reindentó ni se movió nada más.
2. `paginas/quienes-somos.html` — una sección nueva al final, antes de
   `</main>`. No se modificó ningún contenido existente.

### Estado frente a `desarrollo`

`integrante-3` va **9 commits adelante** de `desarrollo` y **0 atrás**, así que
integrarla sola no genera ningún conflicto.

### Conflicto previsto con `integrante-1`

Al juntar `integrante-1` con `integrante-3` aparece **un conflicto en
`js/script.js`**, porque ambas ramas agregaron código a partir del mismo punto.
`css/estilos.css` se une solo, sin conflicto.

El conflicto **no es grave**: no hay ningún nombre de función repetido entre
ambos bloques, y cada uno tiene su propio `DOMContentLoaded` (el navegador acepta
varios sin problema).

Para resolverlo se conservan **los dos lados, uno después del otro**: primero el
bloque reestructurado del integrante 1 y luego el bloque `INTEGRANTE 3` completo.

> Detalle a revisar en la integración: el integrante 1 usa la librería
> **SweetAlert2** (`Swal.fire`) para los mensajes. Hay que confirmar que esa
> librería se cargue en todas las páginas que la necesiten, y decidir en equipo
> si se unifica el estilo de los mensajes de error entre ambos bloques.

---

## 9. Pendientes del equipo

- Enlazar **Sucursales**, **Preguntas frecuentes** y **Panel de administración**
  desde el menú o el footer. Hoy solo se llega a ellas desde Contacto, porque el
  header y el footer son de edición compartida y no se modificaron.
- Redactar el documento **ERS (versión 1)**, que es un entregable de la pauta y
  todavía no está en el repositorio.
- Completar el `README.md`, que actualmente solo tiene el título.
- Agregar un `favicon.ico` (hoy genera un 404 inofensivo en la consola).
