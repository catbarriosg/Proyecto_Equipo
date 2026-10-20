# Definition of Done — Clínica Agenda Médica

Este documento define cuándo una página o funcionalidad se considera **terminada** dentro del proyecto. El objetivo es que los tres integrantes usen el mismo criterio antes de avisar "ya está lista" y en la revisión final.

> Este es un **acuerdo de equipo**, no un requisito de la pauta oficial. Pueden modificarlo libremente según cómo les vaya avanzando el proyecto.

---

## Checklist general (aplica a toda página)

Antes de marcar una página como terminada, debe cumplir:

- [ ] Usa el **header y footer común** sin modificar su estructura ni contenido.
- [ ] El **menú de navegación** está completo y en el mismo orden acordado.
- [ ] Todos los **enlaces** de la página funcionan (ninguno queda roto, vacío o apuntando a `#`).
- [ ] Usa **HTML semántico** donde corresponde (`<section>`, `<article>`, `<nav>`, etc.), no solo `<div>`.
- [ ] Mantiene la **identidad visual** del proyecto (colores, tipografías, estilos de botones ya definidos).
- [ ] Se ve correctamente en **tres tamaños de pantalla**: celular, tablet y computador — sin scroll horizontal ni elementos desbordados o superpuestos.
- [ ] No genera **errores en la consola** del navegador (revisar con DevTools abierto).
- [ ] El código incluye **comentarios** donde algo no sea evidente a simple vista, para que cualquier integrante pueda explicarlo.
- [ ] Se hizo **commit con mensaje claro** describiendo el cambio, y **push** a la rama correspondiente.

---

## Checklist adicional para páginas con formulario

Si la página incluye un formulario (registro, login, agendar hora, contacto, modificar/cancelar hora, etc.), además debe cumplir:

- [ ] Todos los campos obligatorios están **validados con JavaScript**.
- [ ] Los mensajes de error son **personalizados y claros** (no solo `alert()` genérico del navegador).
- [ ] Existen **validaciones en tiempo real** donde tenga sentido (ej: formato de email, largo de contraseña) — no solo al enviar el formulario.
- [ ] Si la acción genera algo dinámico (ID de reserva, confirmación, etc.), se muestra correctamente en pantalla.
- [ ] Se probó al menos una vez con **datos inválidos a propósito**, para confirmar que las validaciones realmente funcionan.

---

## Cómo se usa

1. Este checklist se acuerda **una sola vez entre los tres integrantes** y no se cambia sin avisar al equipo.
2. Cada integrante la revisa **antes** de avisar que una página está lista.
3. El integrante encargado de integración y revisión final la usa como criterio objetivo para aceptar el trabajo de los demás o pedir ajustes puntuales.
4. Sirve como respaldo para la defensa oral: ante la pregunta "¿cómo aseguraron la calidad del proyecto?", esta checklist es la respuesta.

---

## Historial de cambios

| Fecha | Cambio | Acordado por |
|-------|--------|---------------|
| _(completar)_ | Versión inicial de la propuesta | _(equipo)_ |
