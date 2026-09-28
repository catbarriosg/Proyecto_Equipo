/* =========================================================================
   HORAS MÉDICAS — Agendar, modificar y cancelar
   El calendario semanal y las pantallas de modificar y cancelar son del
   integrante 2. Aquí se conectan con las reservas guardadas en localStorage,
   así el código del comprobante sirve para buscar, reagendar o cancelar.
   ========================================================================= */

const CLAVE_RESERVAS = "clinica.reservas";
const DIAS_ANTICIPACION = 90;
const NOMBRES_DIAS_CORTOS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

// Convierte "AAAA-MM-DD" en una fecha local (sin desfase de zona horaria)
function crearFechaLocal(valor) {
    const partes = valor.split("-");
    return new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]));
}

// "2026-10-05" -> "lunes, 5 de octubre de 2026"
function formatearFechaLarga(valor) {
    return crearFechaLocal(valor).toLocaleDateString("es-CL", {
        weekday: "long", day: "numeric", month: "long", year: "numeric"
    });
}

// Horarios de atención cada 30 minutos: lunes a viernes 08:00-19:30, sábado 09:00-13:30
function obtenerHorariosDelDia(fecha) {
    const dia = fecha.getDay();
    if (dia === 0) return []; // Domingo sin atención

    const inicio = dia === 6 ? 9 * 60 : 8 * 60;
    const fin = dia === 6 ? 13 * 60 + 30 : 19 * 60 + 30;
    const horarios = [];

    // Si la fecha es hoy, solo se ofrecen horas que aún no pasan
    const ahora = new Date();
    const esHoy = fecha.toDateString() === ahora.toDateString();
    const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes();

    for (let minutos = inicio; minutos <= fin; minutos += 30) {
        if (esHoy && minutos <= minutosAhora) continue;
        horarios.push(String(Math.floor(minutos / 60)).padStart(2, "0") + ":" + String(minutos % 60).padStart(2, "0"));
    }
    return horarios;
}


// ---------- Reservas guardadas ----------

function obtenerReservas() {
    return leerAlmacen(localStorage, CLAVE_RESERVAS, []);
}

function guardarReservas(reservas) {
    return guardarAlmacen(localStorage, CLAVE_RESERVAS, reservas);
}

function buscarReserva(codigo) {
    const buscado = codigo.trim().toUpperCase();
    return obtenerReservas().find(function (reserva) {
        return reserva.id === buscado;
    });
}

function actualizarReserva(reservaActualizada) {
    const reservas = obtenerReservas().map(function (reserva) {
        return reserva.id === reservaActualizada.id ? reservaActualizada : reserva;
    });
    return guardarReservas(reservas);
}

// Valida el código escrito y busca la reserva: la devuelve o muestra el error y devuelve null
function validarCodigoReserva(campo) {
    const valor = campo.value.trim().toUpperCase();
    campo.value = valor;

    if (valor === "") {
        mostrarErrorCampo(campo, "Ingresa el código de tu reserva.");
        return null;
    }
    if (!/^AM-\d{6,}$/.test(valor)) {
        mostrarErrorCampo(campo, "El código empieza con AM- seguido de números, por ejemplo: AM-1695420000.");
        return null;
    }

    const reserva = buscarReserva(valor);
    if (!reserva) {
        mostrarErrorCampo(campo, "No encontramos una reserva con el código " + valor + ". Revisa tu comprobante.");
        return null;
    }
    if (reserva.estado === "Cancelada") {
        mostrarErrorCampo(campo, "La reserva " + valor + " ya fue cancelada.");
        return null;
    }

    limpiarErrorCampo(campo);
    return reserva;
}


// ---------- Ventanas emergentes ----------

// Abre la ventana y pone el foco en "enfocar" (o en su primer botón);
// al cerrarla, el foco vuelve a "volverA"
function abrirModal(modal, volverA, enfocar) {
    modal.volverA = volverA || document.activeElement;
    modal.style.display = "flex";
    const destino = enfocar || modal.querySelector("button");
    if (destino) destino.focus();
}

function cerrarModal(modal) {
    modal.style.display = "none";
    if (modal.volverA && modal.volverA.offsetParent !== null) modal.volverA.focus();
}

// Cualquier ventana se cierra con Esc o haciendo clic fuera de ella
function iniciarModales() {
    const modales = document.querySelectorAll(".modal-mensaje");
    if (modales.length === 0) return;

    modales.forEach(function (modal) {
        modal.addEventListener("click", function (evento) {
            if (evento.target === modal) cerrarModal(modal);
        });
    });

    document.addEventListener("keydown", function (evento) {
        if (evento.key !== "Escape") return;
        modales.forEach(function (modal) {
            if (modal.style.display === "flex") cerrarModal(modal);
        });
    });
}


// ---------- Calendario semanal ----------

// Muestra 7 días desde la semana elegida y los horarios del día seleccionado.
// Se usa en Agendar y en Modificar. Guarda lo elegido en los campos ocultos #fecha y #hora.
function crearCalendario(contenedor) {
    const campoFecha = contenedor.querySelector("#fecha");
    const campoHora = contenedor.querySelector("#hora");
    const rango = contenedor.querySelector(".rango-semana");
    const dias = contenedor.querySelector(".dias-semana");
    const horas = contenedor.querySelector(".botones-hora");
    const tituloFecha = contenedor.querySelector(".titulo-fecha-seleccionada");
    const botonAnterior = contenedor.querySelector('[data-semana="-1"]');
    const botonSiguiente = contenedor.querySelector('[data-semana="1"]');
    const errorFecha = contenedor.querySelector("#error-fecha");
    const errorHora = contenedor.querySelector("#error-hora");

    // Se puede reservar desde hoy hasta DIAS_ANTICIPACION días más
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const limite = new Date(hoy);
    limite.setDate(limite.getDate() + DIAS_ANTICIPACION);
    let inicioSemana = new Date(hoy);

    function mostrarError(zona, elementoError, mensaje) {
        zona.classList.toggle("calendario-invalido", mensaje !== "");
        elementoError.textContent = mensaje;
    }

    function dibujarSemana() {
        const finSemana = new Date(inicioSemana);
        finSemana.setDate(finSemana.getDate() + 6);
        const opciones = { day: "numeric", month: "long" };
        rango.textContent = inicioSemana.toLocaleDateString("es-CL", opciones) + " al " +
            finSemana.toLocaleDateString("es-CL", opciones);

        dias.innerHTML = "";
        for (let i = 0; i < 7; i++) {
            const fecha = new Date(inicioSemana);
            fecha.setDate(fecha.getDate() + i);
            const valor = fechaLocalISO(fecha);
            const disponible = fecha <= limite && obtenerHorariosDelDia(fecha).length > 0;

            const boton = document.createElement("button");
            boton.type = "button";
            boton.className = "dia-box";
            boton.dataset.fecha = valor;
            boton.disabled = !disponible;
            boton.setAttribute("aria-label", formatearFechaLarga(valor) + (disponible ? "" : ", sin horas disponibles"));
            boton.innerHTML = '<span class="dia-nombre">' + NOMBRES_DIAS_CORTOS[fecha.getDay()] + '</span>' +
                '<span class="dia-numero">' + fecha.getDate() + '</span>';
            boton.addEventListener("click", function () { elegirDia(valor); });
            dias.appendChild(boton);
        }

        // No se puede volver a semanas pasadas ni avanzar más allá del límite
        const siguienteSemana = new Date(inicioSemana);
        siguienteSemana.setDate(siguienteSemana.getDate() + 7);
        botonAnterior.disabled = inicioSemana <= hoy;
        botonSiguiente.disabled = siguienteSemana > limite;
        marcarSeleccion();
    }

    function dibujarHoras() {
        horas.innerHTML = "";

        if (campoFecha.value === "") {
            tituloFecha.textContent = "Selecciona un día";
            horas.innerHTML = '<p class="texto-sin-horas">Primero elige un día en el calendario.</p>';
            return;
        }

        const textoFecha = formatearFechaLarga(campoFecha.value);
        tituloFecha.textContent = textoFecha.charAt(0).toUpperCase() + textoFecha.slice(1);

        obtenerHorariosDelDia(crearFechaLocal(campoFecha.value)).forEach(function (horario) {
            const boton = document.createElement("button");
            boton.type = "button";
            boton.className = "btn-hora";
            boton.dataset.hora = horario;
            boton.textContent = horario;
            boton.addEventListener("click", function () { elegirHora(horario); });
            horas.appendChild(boton);
        });
        marcarSeleccion();
    }

    // Marca el día y la hora elegidos sin volver a dibujar (así no se pierde el foco)
    function marcarSeleccion() {
        dias.querySelectorAll(".dia-box").forEach(function (boton) {
            const elegido = boton.dataset.fecha === campoFecha.value;
            boton.classList.toggle("activo", elegido);
            boton.setAttribute("aria-pressed", String(elegido));
        });
        horas.querySelectorAll(".btn-hora").forEach(function (boton) {
            const elegido = boton.dataset.hora === campoHora.value;
            boton.classList.toggle("seleccionada", elegido);
            boton.setAttribute("aria-pressed", String(elegido));
        });
    }

    function elegirDia(valor) {
        campoFecha.value = valor;
        campoHora.value = ""; // Al cambiar de día se elige la hora de nuevo
        mostrarError(dias, errorFecha, "");
        mostrarError(horas, errorHora, "");
        marcarSeleccion();
        dibujarHoras();
    }

    function elegirHora(valor) {
        campoHora.value = valor;
        mostrarError(horas, errorHora, "");
        marcarSeleccion();
    }

    botonAnterior.addEventListener("click", function () {
        inicioSemana.setDate(inicioSemana.getDate() - 7);
        if (inicioSemana < hoy) inicioSemana = new Date(hoy);
        dibujarSemana();
    });
    botonSiguiente.addEventListener("click", function () {
        inicioSemana.setDate(inicioSemana.getDate() + 7);
        dibujarSemana();
    });

    function reiniciar() {
        campoFecha.value = "";
        campoHora.value = "";
        inicioSemana = new Date(hoy);
        mostrarError(dias, errorFecha, "");
        mostrarError(horas, errorHora, "");
        dibujarSemana();
        dibujarHoras();
    }

    reiniciar();

    return {
        reiniciar: reiniciar,
        valor: function () {
            return { fecha: campoFecha.value, hora: campoHora.value };
        },
        validar: function () {
            if (campoFecha.value === "") {
                mostrarError(dias, errorFecha, "Selecciona un día en el calendario.");
                return false;
            }
            if (campoHora.value === "") {
                mostrarError(horas, errorHora, "Selecciona un horario disponible.");
                return false;
            }
            return true;
        },
        mostrarErrorHora: function (mensaje) {
            mostrarError(horas, errorHora, mensaje);
        },
        // Lleva el foco a la parte del calendario que falta completar
        enfocar: function () {
            const zona = campoFecha.value === "" ? dias : horas;
            const boton = zona.querySelector("button:not(:disabled)");
            if (boton) boton.focus();
        }
    };
}

// Muestra en la tarjeta del calendario el médico y la especialidad
function mostrarMedicoEnCalendario(contenedor, medico, especialidad) {
    contenedor.querySelector(".tarjeta-nombre-medico").textContent = medico;
    contenedor.querySelector(".tarjeta-especialidad").textContent = especialidad;
}


// ---------- AGENDAR HORA ----------

function iniciarAgendarHora() {
    const formulario = document.getElementById("formulario-agenda");
    if (!formulario) return; // Evita errores en las páginas que no tienen este formulario

    const especialidad = document.getElementById("especialidad");
    const medico = document.getElementById("medico");
    const selector = document.getElementById("selector-horario");
    const botonConfirmar = formulario.querySelector('button[type="submit"]');
    const modal = document.getElementById("modal-mensaje");
    const calendario = crearCalendario(selector);

    // Muestra solo los médicos de la especialidad elegida
    function filtrarMedicos() {
        let disponibles = 0;
        Array.from(medico.options).forEach(function (opcion) {
            if (opcion.value === "") return;
            const visible = especialidad.value === "" || opcion.dataset.especialidad === especialidad.value;
            opcion.hidden = !visible;
            opcion.disabled = !visible;
            if (visible) disponibles++;
        });

        const seleccionado = medico.options[medico.selectedIndex];
        if (seleccionado && seleccionado.disabled) medico.value = "";

        // Si la especialidad tiene un solo médico, se selecciona automáticamente
        if (especialidad.value !== "" && disponibles === 1) {
            medico.value = medico.querySelector('option[data-especialidad="' + especialidad.value + '"]').value;
        }
    }

    // Al elegir un médico se completa su especialidad
    function sincronizarEspecialidad() {
        const opcion = medico.options[medico.selectedIndex];
        if (opcion && opcion.dataset.especialidad) {
            especialidad.value = opcion.dataset.especialidad;
            limpiarErrorCampo(especialidad);
        }
    }

    // El calendario aparece cuando ya hay un médico elegido
    function mostrarCalendario() {
        const hayMedico = medico.value !== "";
        selector.hidden = !hayMedico;
        if (hayMedico) {
            mostrarMedicoEnCalendario(selector, medico.options[medico.selectedIndex].text,
                especialidad.options[especialidad.selectedIndex].text);
        }
    }

    const validarEspecialidad = function () { return validarSeleccion(especialidad, "Selecciona una especialidad médica."); };
    const validarMedico = function () { return validarSeleccion(medico, "Selecciona un médico."); };

    especialidad.addEventListener("change", function () {
        filtrarMedicos();
        validarEspecialidad();
        if (medico.value !== "" || medico.classList.contains("campo-invalido")) validarMedico();
        mostrarCalendario();
    });
    medico.addEventListener("change", function () {
        sincronizarEspecialidad();
        filtrarMedicos();
        validarMedico();
        mostrarCalendario();
    });

    // Datos recibidos desde Médicos o Especialidades (agendar-hora.html?medico=... o ?especialidad=...)
    const parametros = new URLSearchParams(window.location.search);
    if (parametros.get("medico") && medico.querySelector('option[value="' + CSS.escape(parametros.get("medico")) + '"]')) {
        medico.value = parametros.get("medico");
        sincronizarEspecialidad();
    } else if (parametros.get("especialidad") && especialidad.querySelector('option[value="' + CSS.escape(parametros.get("especialidad")) + '"]')) {
        especialidad.value = parametros.get("especialidad");
    }
    filtrarMedicos();
    mostrarCalendario();

    document.getElementById("cerrar-modal").addEventListener("click", function () {
        cerrarModal(modal);
    });

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        // Se ejecutan todas para que cada campo muestre su propio error
        const especialidadValida = validarEspecialidad();
        const medicoValido = validarMedico();
        if (!especialidadValida || !medicoValido) {
            enfocarPrimerError(formulario);
            return;
        }
        if (!calendario.validar()) {
            calendario.enfocar();
            return;
        }

        // Guarda la reserva para poder modificarla o cancelarla con su código
        const elegido = calendario.valor();
        const sesion = obtenerSesion();
        const reserva = {
            id: "AM-" + Date.now(),
            especialidad: especialidad.options[especialidad.selectedIndex].text,
            medico: medico.options[medico.selectedIndex].text,
            fecha: elegido.fecha,
            hora: elegido.hora,
            estado: "Confirmada",
            correo: sesion ? sesion.correo : ""
        };
        const reservas = obtenerReservas();
        reservas.push(reserva);
        guardarReservas(reservas);

        document.getElementById("texto-modal").textContent = "¡Hora médica agendada correctamente!";

        // Comprobante con los datos de la reserva (textContent evita insertar HTML)
        const datosReserva = document.getElementById("datos-reserva");
        datosReserva.innerHTML = "";
        [
            ["Código de reserva", reserva.id],
            ["Especialidad", reserva.especialidad],
            ["Médico", reserva.medico],
            ["Fecha", formatearFechaLarga(reserva.fecha)],
            ["Hora", reserva.hora]
        ].forEach(function (dato) {
            const linea = document.createElement("p");
            const etiqueta = document.createElement("strong");
            etiqueta.textContent = dato[0] + ":";
            linea.append(etiqueta, " " + dato[1]);
            datosReserva.appendChild(linea);
        });
        const nota = document.createElement("p");
        nota.textContent = "Guarda el código: lo necesitas para modificar o cancelar tu hora.";
        datosReserva.appendChild(nota);

        abrirModal(modal, botonConfirmar);

        // Deja el formulario listo para una nueva reserva
        formulario.reset();
        [especialidad, medico].forEach(reiniciarCampo);
        filtrarMedicos();
        calendario.reiniciar();
        mostrarCalendario();
    });
}


// ---------- CANCELAR HORA ----------

function iniciarCancelarHora() {
    const formulario = document.getElementById("formulario-buscar-reserva");
    if (!formulario) return; // Solo actúa en cancelar-hora.html

    const campo = document.getElementById("codigo-reserva");
    const resultado = document.getElementById("resultado-reserva");
    const botonIniciar = document.getElementById("btn-iniciar-cancelacion");
    const modalConfirmacion = document.getElementById("modal-confirmacion-cancelar");
    const modalExito = document.getElementById("modal-exito-cancelacion");
    let reservaEncontrada = null;

    // Al corregir el código se quita la marca de error
    campo.addEventListener("input", function () {
        if (campo.classList.contains("campo-invalido")) reiniciarCampo(campo);
    });

    // 1. Buscar la reserva por su código
    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();
        reservaEncontrada = validarCodigoReserva(campo);

        if (!reservaEncontrada) {
            resultado.hidden = true;
            campo.focus();
            return;
        }

        document.getElementById("reserva-codigo-display").textContent = reservaEncontrada.id;
        document.getElementById("reserva-especialidad-display").textContent = reservaEncontrada.especialidad;
        document.getElementById("reserva-medico-display").textContent = reservaEncontrada.medico;
        document.getElementById("reserva-fecha-display").textContent = formatearFechaLarga(reservaEncontrada.fecha);
        document.getElementById("reserva-hora-display").textContent = reservaEncontrada.hora;
        resultado.hidden = false;
    });

    // 2. Pedir confirmación antes de cancelar (el foco queda en la opción segura)
    botonIniciar.addEventListener("click", function () {
        abrirModal(modalConfirmacion, botonIniciar, document.getElementById("btn-no-volver"));
    });

    // 3. "No, mantener hora": cierra la confirmación
    document.getElementById("btn-no-volver").addEventListener("click", function () {
        cerrarModal(modalConfirmacion);
    });

    // 4. "Sí, cancelar hora": marca la reserva como cancelada
    document.getElementById("btn-si-cancelar").addEventListener("click", function () {
        reservaEncontrada.estado = "Cancelada";
        actualizarReserva(reservaEncontrada);

        modalConfirmacion.style.display = "none";
        resultado.hidden = true;
        formulario.reset();
        reiniciarCampo(campo);
        abrirModal(modalExito, campo);
    });

    // 5. Cerrar el mensaje de éxito
    document.getElementById("btn-cerrar-exito-cancelacion").addEventListener("click", function () {
        cerrarModal(modalExito);
    });
}


// ---------- MODIFICAR HORA ----------

function iniciarModificarHora() {
    const formularioBuscar = document.getElementById("formulario-buscar-modificar");
    if (!formularioBuscar) return; // Solo actúa en modificar-hora.html

    const campo = document.getElementById("codigo-modificar");
    const contenedor = document.getElementById("contenedor-modificacion");
    const formularioNuevaFecha = document.getElementById("formulario-nueva-fecha");
    const selector = document.getElementById("selector-horario");
    const modalExito = document.getElementById("modal-exito-modificar");
    const calendario = crearCalendario(selector);
    let reserva = null;

    campo.addEventListener("input", function () {
        if (campo.classList.contains("campo-invalido")) reiniciarCampo(campo);
    });

    // 1. Buscar la reserva y mostrar sus datos actuales
    formularioBuscar.addEventListener("submit", function (evento) {
        evento.preventDefault();
        reserva = validarCodigoReserva(campo);

        if (!reserva) {
            contenedor.hidden = true;
            campo.focus();
            return;
        }

        document.getElementById("reserva-actual-medico").textContent = reserva.medico;
        document.getElementById("reserva-actual-fecha").textContent = formatearFechaLarga(reserva.fecha);
        document.getElementById("reserva-actual-hora").textContent = reserva.hora;
        mostrarMedicoEnCalendario(selector, reserva.medico, reserva.especialidad);
        calendario.reiniciar();
        contenedor.hidden = false;
    });

    // 2. Confirmar la nueva fecha y hora
    formularioNuevaFecha.addEventListener("submit", function (evento) {
        evento.preventDefault();
        if (!calendario.validar()) {
            calendario.enfocar();
            return;
        }

        const elegido = calendario.valor();
        if (elegido.fecha === reserva.fecha && elegido.hora === reserva.hora) {
            calendario.mostrarErrorHora("Elegiste la misma fecha y hora de tu reserva actual.");
            return;
        }

        reserva.fecha = elegido.fecha;
        reserva.hora = elegido.hora;
        actualizarReserva(reserva);

        document.getElementById("texto-exito-modificar").textContent =
            "Tu hora con " + reserva.medico + " quedó para el " + formatearFechaLarga(reserva.fecha) +
            " a las " + reserva.hora + ".";

        contenedor.hidden = true;
        formularioBuscar.reset();
        reiniciarCampo(campo);
        abrirModal(modalExito, campo);
    });

    // 3. Cerrar el mensaje de éxito
    document.getElementById("btn-cerrar-modificar").addEventListener("click", function () {
        cerrarModal(modalExito);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    iniciarModales();
    iniciarAgendarHora();
    iniciarCancelarHora();
    iniciarModificarHora();
});


/* =========================================================================
   INTEGRANTE 3 — Contacto, Preguntas frecuentes y Panel de administración
   Este bloque es independiente: cada función revisa que sus elementos
   existan en la página antes de actuar, así no genera errores en las
   páginas donde no corresponde.
   ========================================================================= */

// ---------- Funciones de apoyo para validar formularios ----------

// Muestra un mensaje de error bajo el campo y lo marca en rojo
function mostrarErrorCampo(campo, mensaje) {
    const contenedorError = document.getElementById("error-" + campo.id);
    if (contenedorError) {
        contenedorError.textContent = mensaje;
    }
    campo.classList.add("campo-invalido");
    campo.classList.remove("campo-valido");
}

// Limpia el mensaje de error y marca el campo como correcto
function limpiarErrorCampo(campo) {
    const contenedorError = document.getElementById("error-" + campo.id);
    if (contenedorError) {
        contenedorError.textContent = "";
    }
    campo.classList.remove("campo-invalido");
    campo.classList.add("campo-valido");
}

// Deja el campo sin marcas de validación (estado inicial)
function reiniciarCampo(campo) {
    const contenedorError = document.getElementById("error-" + campo.id);
    if (contenedorError) {
        contenedorError.textContent = "";
    }
    campo.classList.remove("campo-invalido", "campo-valido");
}

// Valida un nombre: obligatorio, mínimo 3 letras, solo letras y espacios
function validarNombre(campo) {
    const valor = campo.value.trim();
    const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;

    if (valor === "") {
        mostrarErrorCampo(campo, "El nombre es obligatorio.");
        return false;
    }
    if (valor.length < 3) {
        mostrarErrorCampo(campo, "El nombre debe tener al menos 3 caracteres.");
        return false;
    }
    if (!soloLetras.test(valor)) {
        mostrarErrorCampo(campo, "El nombre solo puede contener letras y espacios.");
        return false;
    }
    limpiarErrorCampo(campo);
    return true;
}

// Valida un correo electrónico con un formato básico usuario@dominio.ext
function validarCorreo(campo) {
    const valor = campo.value.trim();
    // "i": los correos no distinguen mayúsculas (Ana@Gmail.com es válido)
    const formatoCorreo = /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;

    if (valor === "") {
        mostrarErrorCampo(campo, "El correo es obligatorio.");
        return false;
    }
    if (!formatoCorreo.test(valor)) {
        mostrarErrorCampo(campo, "Correo no válido. Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.");
        return false;
    }
    limpiarErrorCampo(campo);
    return true;
}

// Valida que se haya elegido una opción de una lista desplegable
function validarSeleccion(campo, mensaje) {
    if (campo.value === "") {
        mostrarErrorCampo(campo, mensaje);
        return false;
    }
    limpiarErrorCampo(campo);
    return true;
}

// Valida el mensaje de contacto: obligatorio, entre 10 y 500 caracteres
function validarMensaje(campo) {
    const valor = campo.value.trim();

    if (valor === "") {
        mostrarErrorCampo(campo, "Escribe tu mensaje antes de enviar.");
        return false;
    }
    if (valor.length < 10) {
        mostrarErrorCampo(campo, "El mensaje es muy corto: faltan " + (10 - valor.length) + " caracteres.");
        return false;
    }
    if (valor.length > 500) {
        mostrarErrorCampo(campo, "El mensaje no puede superar los 500 caracteres.");
        return false;
    }
    limpiarErrorCampo(campo);
    return true;
}

// Calcula el dígito verificador de un RUT chileno (módulo 11)
function calcularDigitoVerificador(numeroRut) {
    let suma = 0;
    let multiplicador = 2;

    // Recorre el número de derecha a izquierda multiplicando por 2..7
    for (let i = numeroRut.length - 1; i >= 0; i--) {
        suma += parseInt(numeroRut[i], 10) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const resto = 11 - (suma % 11);
    if (resto === 11) return "0";
    if (resto === 10) return "K";
    return String(resto);
}

// Valida un RUT chileno: formato 12.345.678-9 (o sin puntos) y dígito verificador correcto
function validarRut(campo) {
    const valor = campo.value.trim().toUpperCase();
    const formatoRut = /^\d{1,2}\.?\d{3}\.?\d{3}-[\dK]$/;

    if (valor === "") {
        mostrarErrorCampo(campo, "El RUT es obligatorio.");
        return false;
    }
    if (!formatoRut.test(valor)) {
        mostrarErrorCampo(campo, "Formato inválido. Usa el formato 12.345.678-9");
        return false;
    }

    // Separa el número del dígito verificador y compara
    const rutLimpio = valor.replace(/\./g, "");
    const partes = rutLimpio.split("-");
    const digitoIngresado = partes[1];
    const digitoEsperado = calcularDigitoVerificador(partes[0]);

    if (digitoIngresado !== digitoEsperado) {
        mostrarErrorCampo(campo, "El dígito verificador no corresponde. ¿Quisiste decir " + formatearRut(partes[0] + digitoEsperado) + "?");
        return false;
    }

    limpiarErrorCampo(campo);
    return true;
}

// Da formato 12.345.678-9 a un RUT escrito sin puntos
function formatearRut(valor) {
    const limpio = valor.replace(/[^\dkK]/g, "").toUpperCase();
    if (limpio.length < 2) return limpio;
    const cuerpo = limpio.slice(0, -1);
    const digito = limpio.slice(-1);
    return cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "-" + digito;
}


// ---------- VALIDACIÓN CONTACTO ----------

function validarContacto() {
    const formulario = document.getElementById("formulario-contacto");
    if (!formulario) return; // Solo actúa en contacto.html

    const nombre = document.getElementById("contacto-nombre");
    const correo = document.getElementById("contacto-correo");
    const asunto = document.getElementById("contacto-asunto");
    const mensaje = document.getElementById("contacto-mensaje");
    const contador = document.getElementById("contador-mensaje");
    const mensajeExito = document.getElementById("mensaje-exito-contacto");

    // Validación en tiempo real: al salir del campo y mientras se escribe
    nombre.addEventListener("blur", function () { validarNombre(nombre); });
    nombre.addEventListener("input", function () {
        if (nombre.classList.contains("campo-invalido")) validarNombre(nombre);
    });

    correo.addEventListener("blur", function () { validarCorreo(correo); });
    correo.addEventListener("input", function () {
        if (correo.classList.contains("campo-invalido")) validarCorreo(correo);
    });

    asunto.addEventListener("change", function () {
        validarSeleccion(asunto, "Selecciona el asunto de tu mensaje.");
    });

    // El contador se actualiza con cada tecla
    mensaje.addEventListener("input", function () {
        contador.textContent = mensaje.value.length + " / 500";
        if (mensaje.classList.contains("campo-invalido")) validarMensaje(mensaje);
    });
    mensaje.addEventListener("blur", function () { validarMensaje(mensaje); });

    // Al enviar se validan todos los campos y se bloquea el envío si alguno falla
    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();
        mensajeExito.textContent = "";

        // Se ejecutan todas para que cada campo muestre su propio error
        const nombreValido = validarNombre(nombre);
        const correoValido = validarCorreo(correo);
        const asuntoValido = validarSeleccion(asunto, "Selecciona el asunto de tu mensaje.");
        const mensajeValido = validarMensaje(mensaje);

        if (!nombreValido || !correoValido || !asuntoValido || !mensajeValido) {
            // Lleva el foco al primer campo con error
            const primerError = formulario.querySelector(".campo-invalido");
            if (primerError) primerError.focus();
            return;
        }

        // Todo correcto: se muestra la confirmación y se limpia el formulario
        mensajeExito.textContent =
            "¡Gracias, " + nombre.value.trim() + "! Recibimos tu mensaje sobre \"" +
            asunto.options[asunto.selectedIndex].text + "\". Te responderemos a " + correo.value.trim() + ".";

        formulario.reset();
        contador.textContent = "0 / 500";
        [nombre, correo, asunto, mensaje].forEach(reiniciarCampo);
    });
}


// ---------- BUSCADOR DE PREGUNTAS FRECUENTES ----------

function iniciarBuscadorFaq() {
    const buscador = document.getElementById("buscador-faq");
    if (!buscador) return; // Solo actúa en preguntas-frecuentes.html

    const preguntas = document.querySelectorAll(".faq-item");
    const grupos = document.querySelectorAll(".faq-grupo");
    const sinResultados = document.getElementById("faq-sin-resultados");

    buscador.addEventListener("input", function () {
        const texto = buscador.value.trim().toLowerCase();
        let coincidencias = 0;

        // Muestra solo las preguntas cuyo texto contiene lo buscado
        preguntas.forEach(function (pregunta) {
            const coincide = pregunta.textContent.toLowerCase().includes(texto);
            pregunta.hidden = !coincide;
            if (coincide) {
                coincidencias++;
                // Abre la respuesta automáticamente cuando hay búsqueda activa
                pregunta.open = texto !== "";
            }
        });

        // Oculta los títulos de grupo que quedaron sin preguntas visibles
        grupos.forEach(function (grupo) {
            const visibles = grupo.querySelectorAll(".faq-item:not([hidden])").length;
            grupo.hidden = visibles === 0;
        });

        sinResultados.textContent = coincidencias === 0
            ? "No encontramos preguntas con \"" + buscador.value.trim() + "\". Prueba con otra palabra."
            : "";
    });
}


// ---------- PANEL DE ADMINISTRACIÓN ----------

// Actualiza los contadores de resumen según las filas de cada tabla
function actualizarResumenPanel() {
    const contadores = {
        "total-pacientes": "tabla-pacientes",
        "total-medicos": "tabla-medicos",
        "total-horas": "tabla-horas"
    };

    Object.keys(contadores).forEach(function (idContador) {
        const contador = document.getElementById(idContador);
        const tabla = document.getElementById(contadores[idContador]);
        if (contador && tabla) {
            contador.textContent = tabla.querySelectorAll("tbody tr").length;
        }
    });
}

// Muestra un aviso en la parte superior del panel durante unos segundos
function mostrarAvisoPanel(texto) {
    const aviso = document.getElementById("aviso-panel");
    if (!aviso) return;
    aviso.textContent = texto;
    clearTimeout(aviso.temporizador);
    aviso.temporizador = setTimeout(function () { aviso.textContent = ""; }, 4000);
}

// Crea una celda con los botones Editar y Eliminar
function crearCeldaAcciones() {
    const celda = document.createElement("td");
    celda.innerHTML =
        '<button type="button" class="boton-tabla boton-editar">Editar</button> ' +
        '<button type="button" class="boton-tabla boton-eliminar">Eliminar</button>';
    return celda;
}

// Agrega una fila nueva a la tabla indicada con los textos recibidos
function agregarFilaTabla(idTabla, valores) {
    const cuerpo = document.querySelector("#" + idTabla + " tbody");
    const fila = document.createElement("tr");

    valores.forEach(function (valor) {
        const celda = document.createElement("td");
        celda.textContent = valor;
        fila.appendChild(celda);
    });

    const celdaEstado = document.createElement("td");
    celdaEstado.innerHTML = '<span class="estado estado-activo">Activo</span>';
    fila.appendChild(celdaEstado);
    fila.appendChild(crearCeldaAcciones());

    fila.classList.add("fila-nueva");
    setTimeout(function () { fila.classList.remove("fila-nueva"); }, 2000);

    cuerpo.appendChild(fila);
    actualizarResumenPanel();
}

function iniciarPanelAdministracion() {
    const panel = document.querySelector(".panel-hero");
    if (!panel) return; // Solo actúa en panel-administracion.html

    actualizarResumenPanel();

    // Botones "Agregar": muestran u ocultan el formulario correspondiente
    document.querySelectorAll(".boton-agregar[data-formulario]").forEach(function (boton) {
        boton.addEventListener("click", function () {
            const formulario = document.getElementById(boton.dataset.formulario);
            formulario.hidden = !formulario.hidden;
            if (!formulario.hidden) formulario.querySelector("input, select").focus();
        });
    });

    // Botones "Cancelar" del formulario: lo ocultan y lo limpian
    document.querySelectorAll(".panel-formulario .boton-cancelar").forEach(function (boton) {
        boton.addEventListener("click", function () {
            const formulario = boton.closest("form");
            formulario.reset();
            formulario.querySelectorAll("input, select").forEach(reiniciarCampo);
            formulario.hidden = true;
        });
    });

    // Formulario de paciente: valida RUT y nombre, luego agrega la fila
    const formularioPaciente = document.getElementById("formulario-paciente");
    const rut = document.getElementById("paciente-rut");
    const nombrePaciente = document.getElementById("paciente-nombre");

    // Da formato al RUT automáticamente al salir del campo y lo valida
    rut.addEventListener("blur", function () {
        rut.value = formatearRut(rut.value);
        validarRut(rut);
    });
    nombrePaciente.addEventListener("blur", function () { validarNombre(nombrePaciente); });

    formularioPaciente.addEventListener("submit", function (evento) {
        evento.preventDefault();
        rut.value = formatearRut(rut.value);

        const rutValido = validarRut(rut);
        const nombreValido = validarNombre(nombrePaciente);
        if (!rutValido || !nombreValido) return;

        // Evita registrar dos veces el mismo RUT
        const rutsExistentes = Array.from(
            document.querySelectorAll("#tabla-pacientes tbody td:first-child")
        ).map(function (celda) { return celda.textContent.trim(); });

        if (rutsExistentes.includes(rut.value)) {
            mostrarErrorCampo(rut, "Ese RUT ya está registrado en la tabla.");
            return;
        }

        agregarFilaTabla("tabla-pacientes", [rut.value, nombrePaciente.value.trim()]);
        mostrarAvisoPanel("Paciente " + nombrePaciente.value.trim() + " agregado correctamente.");
        formularioPaciente.reset();
        [rut, nombrePaciente].forEach(reiniciarCampo);
        formularioPaciente.hidden = true;
    });

    // Formulario de médico: valida nombre y especialidad, luego agrega la fila
    const formularioMedico = document.getElementById("formulario-medico");
    const nombreMedico = document.getElementById("medico-nombre");
    const especialidad = document.getElementById("medico-especialidad");

    nombreMedico.addEventListener("blur", function () { validarNombre(nombreMedico); });
    especialidad.addEventListener("change", function () {
        validarSeleccion(especialidad, "Selecciona la especialidad del médico.");
    });

    formularioMedico.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const nombreValido = validarNombre(nombreMedico);
        const especialidadValida = validarSeleccion(especialidad, "Selecciona la especialidad del médico.");
        if (!nombreValido || !especialidadValida) return;

        agregarFilaTabla("tabla-medicos", [nombreMedico.value.trim(), especialidad.value]);
        mostrarAvisoPanel("Médico " + nombreMedico.value.trim() + " agregado correctamente.");
        formularioMedico.reset();
        [nombreMedico, especialidad].forEach(reiniciarCampo);
        formularioMedico.hidden = true;
    });

    // Acciones de las tablas: se escuchan en el contenedor para incluir filas nuevas
    document.querySelectorAll(".tabla-panel").forEach(function (tabla) {
        tabla.addEventListener("click", function (evento) {
            const boton = evento.target.closest(".boton-tabla");
            if (!boton) return;

            const fila = boton.closest("tr");
            const nombre = fila.querySelector("td:nth-child(2)").textContent.trim();

            // Editar: alterna el estado entre Activo e Inactivo
            if (boton.classList.contains("boton-editar")) {
                const estado = fila.querySelector(".estado");
                const activo = estado.classList.contains("estado-activo");
                estado.textContent = activo ? "Inactivo" : "Activo";
                estado.classList.toggle("estado-activo", !activo);
                estado.classList.toggle("estado-inactivo", activo);
                mostrarAvisoPanel(nombre + " ahora está " + estado.textContent.toLowerCase() + ".");
            }

            // Eliminar / Cancelar: pide confirmación antes de quitar la fila
            if (boton.classList.contains("boton-eliminar")) {
                const esHora = tabla.id === "tabla-horas";
                const pregunta = esHora
                    ? "¿Cancelar la hora del " + fila.querySelector("td:first-child").textContent.trim() + " con " + nombre + "?"
                    : "¿Eliminar a " + nombre + " del listado?";

                if (confirm(pregunta)) {
                    fila.remove();
                    actualizarResumenPanel();
                    mostrarAvisoPanel(esHora ? "Hora cancelada." : nombre + " fue eliminado del listado.");
                }
            }
        });
    });
}


// Inicia las funciones del integrante 3 cuando la página termina de cargar
document.addEventListener("DOMContentLoaded", function () {
    validarContacto();
    iniciarBuscadorFaq();
    iniciarPanelAdministracion();
});


/* =========================================================================
   ENCABEZADO — Menú responsivo, buscador del sitio y opciones de perfil
   Los botones ☰ y 👤 usan los componentes Collapse y Dropdown de Bootstrap;
   aquí se agrega el comportamiento propio del sitio.
   ========================================================================= */

// Páginas que se pueden encontrar con el buscador (rutas desde la raíz del sitio)
const paginasDelSitio = [
    { titulo: "Inicio", ruta: "index.html", claves: "inicio portada clinica galeria" },
    { titulo: "Quiénes somos", ruta: "paginas/quienes-somos.html", claves: "historia mision vision equipo video nosotros" },
    { titulo: "Especialidades", ruta: "paginas/especialidades.html", claves: "cardiologia pediatria dermatologia traumatologia ginecologia medicina general" },
    { titulo: "Médicos", ruta: "paginas/medicos.html", claves: "doctores doctoras profesionales" },
    { titulo: "Sucursales", ruta: "paginas/sucursales.html", claves: "direccion mapa ubicacion sedes horario" },
    { titulo: "Contacto", ruta: "paginas/contacto.html", claves: "mensaje correo telefono escribir consulta" },
    { titulo: "Preguntas frecuentes", ruta: "paginas/preguntas-frecuentes.html", claves: "faq ayuda dudas" },
    { titulo: "Agendar hora", ruta: "paginas/agendar-hora.html", claves: "reservar cita atencion nueva hora" },
    { titulo: "Mis horas médicas", ruta: "paginas/mis-horas-medicas.html", claves: "mis citas reservas" },
    { titulo: "Modificar hora", ruta: "paginas/modificar-hora.html", claves: "cambiar reagendar cita" },
    { titulo: "Cancelar hora", ruta: "paginas/cancelar-hora.html", claves: "anular eliminar cita" },
    { titulo: "Historial de atenciones", ruta: "paginas/historial-atenciones.html", claves: "atenciones anteriores registro" },
    { titulo: "Iniciar sesión", ruta: "paginas/login.html", claves: "login ingresar entrar cuenta" },
    { titulo: "Crear cuenta", ruta: "paginas/registro-paciente.html", claves: "registro registrarse paciente nuevo" },
    { titulo: "Mi perfil", ruta: "paginas/perfil-paciente.html", claves: "perfil datos personales paciente" },
    { titulo: "Panel de administración", ruta: "paginas/panel-administracion.html", claves: "admin administrador gestion" }
];

// Quita tildes y mayúsculas para comparar textos
function normalizarTexto(texto) {
    return texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
}

// Devuelve el nombre del archivo de una ruta (index.html si termina en "/")
function nombrePagina(ruta) {
    const partes = ruta.split("/");
    return partes[partes.length - 1] || "index.html";
}

// Marca en el menú el enlace de la página actual
function marcarPaginaActual() {
    const paginaActual = nombrePagina(window.location.pathname);

    document.querySelectorAll(".menu .nav-link, .menu-perfil .dropdown-item").forEach(function (enlace) {
        if (nombrePagina(new URL(enlace.href).pathname) === paginaActual) {
            enlace.classList.add("active");
            enlace.setAttribute("aria-current", "page");
        }
    });
}

// Cierra un bloque desplegable de Bootstrap si está abierto
function cerrarDesplegable(elemento) {
    if (elemento && elemento.classList.contains("show")) {
        bootstrap.Collapse.getOrCreateInstance(elemento, { toggle: false }).hide();
    }
}

function iniciarBuscadorSitio() {
    const panelBuscador = document.getElementById("buscador-sitio");
    const formulario = document.getElementById("formulario-buscador-sitio");
    const campo = document.getElementById("campo-buscador-sitio");
    const resultados = document.getElementById("resultados-buscador");
    const logo = document.querySelector(".header .logo");
    if (!panelBuscador || !formulario || !campo || !resultados || !logo) return;

    // La raíz del sitio se obtiene del enlace del logo (funciona desde index.html y desde /paginas)
    const raizSitio = new URL(".", logo.href);

    function buscarPaginas(texto) {
        const buscado = normalizarTexto(texto);
        if (buscado === "") return [];
        return paginasDelSitio.filter(function (pagina) {
            return normalizarTexto(pagina.titulo + " " + pagina.claves).includes(buscado);
        });
    }

    function mostrarResultados(texto) {
        const encontradas = buscarPaginas(texto);
        resultados.innerHTML = "";

        if (texto.trim() === "") return;

        if (encontradas.length === 0) {
            const aviso = document.createElement("p");
            aviso.className = "list-group-item mb-0";
            aviso.textContent = "No encontramos páginas con \"" + texto.trim() + "\".";
            resultados.appendChild(aviso);
            return;
        }

        encontradas.forEach(function (pagina) {
            const enlace = document.createElement("a");
            enlace.className = "list-group-item list-group-item-action";
            enlace.href = new URL(pagina.ruta, raizSitio).href;
            enlace.textContent = pagina.titulo;
            resultados.appendChild(enlace);
        });
    }

    campo.addEventListener("input", function () {
        mostrarResultados(campo.value);
    });

    // Al enviar se abre el primer resultado encontrado
    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();
        const encontradas = buscarPaginas(campo.value);
        if (encontradas.length > 0) {
            window.location.href = new URL(encontradas[0].ruta, raizSitio).href;
        } else {
            mostrarResultados(campo.value);
            campo.focus();
        }
    });

    // Al abrir el buscador se cierra el menú y se pone el cursor en el campo
    panelBuscador.addEventListener("show.bs.collapse", function () {
        cerrarDesplegable(document.getElementById("menu-principal"));
    });
    panelBuscador.addEventListener("shown.bs.collapse", function () {
        campo.focus();
    });

    // Al cerrarlo se limpia la búsqueda
    panelBuscador.addEventListener("hidden.bs.collapse", function () {
        formulario.reset();
        resultados.innerHTML = "";
    });

    // La tecla Escape cierra el buscador
    campo.addEventListener("keydown", function (evento) {
        if (evento.key === "Escape") cerrarDesplegable(panelBuscador);
    });
}

function iniciarEncabezado() {
    // Requiere el JavaScript de Bootstrap (bootstrap.bundle.min.js)
    if (!document.querySelector(".header") || typeof bootstrap === "undefined") return;

    marcarPaginaActual();
    iniciarBuscadorSitio();

    const menu = document.getElementById("menu-principal");
    if (!menu) return;

    // Al abrir el menú (☰) se cierra el buscador
    menu.addEventListener("show.bs.collapse", function () {
        cerrarDesplegable(document.getElementById("buscador-sitio"));
    });

    // En tablet y celular, el menú se cierra al elegir una opción
    menu.querySelectorAll(".nav-link").forEach(function (enlace) {
        enlace.addEventListener("click", function () {
            cerrarDesplegable(menu);
        });
    });
}

document.addEventListener("DOMContentLoaded", iniciarEncabezado);


/* =========================================================================
   CUENTAS — Crear cuenta e Iniciar sesión
   Los datos se guardan en localStorage solo para esta versión del proyecto
   (sin servidor). En un sistema real el registro y la contraseña se validan
   en el backend; aquí la contraseña se guarda cifrada con SHA-256, nunca en
   texto plano.
   ========================================================================= */

const CLAVE_USUARIOS = "clinica.usuarios";
const CLAVE_SESION = "clinica.sesion";
const CLAVE_INTENTOS = "clinica.intentosLogin";
const MAX_INTENTOS_LOGIN = 5;
const SEGUNDOS_BLOQUEO = 30;

// ---------- Acceso al almacenamiento (patrón repositorio) ----------
// Todo el acceso a localStorage pasa por estas funciones, así el resto del
// código no depende de cómo se guardan los datos. Usan try/catch porque el
// navegador puede bloquear el almacenamiento (modo privado, permisos).

function leerAlmacen(almacen, clave, valorPorDefecto) {
    try {
        const texto = almacen.getItem(clave);
        return texto ? JSON.parse(texto) : valorPorDefecto;
    } catch (error) {
        return valorPorDefecto;
    }
}

function guardarAlmacen(almacen, clave, valor) {
    try {
        almacen.setItem(clave, JSON.stringify(valor));
        return true;
    } catch (error) {
        return false;
    }
}

function obtenerUsuarios() {
    return leerAlmacen(localStorage, CLAVE_USUARIOS, []);
}

// El correo se compara sin mayúsculas ni espacios: Ana@Correo.cl = ana@correo.cl
function normalizarCorreo(correo) {
    return correo.trim().toLowerCase();
}

function buscarUsuarioPorCorreo(correo) {
    const buscado = normalizarCorreo(correo);
    return obtenerUsuarios().find(function (usuario) {
        return usuario.correo === buscado;
    });
}

function guardarUsuario(usuario) {
    const usuarios = obtenerUsuarios();
    usuarios.push(usuario);
    return guardarAlmacen(localStorage, CLAVE_USUARIOS, usuarios);
}

// La sesión va en localStorage si el usuario marca "Mantener la sesión iniciada";
// si no, en sessionStorage, que se borra al cerrar el navegador.
function obtenerSesion() {
    return leerAlmacen(sessionStorage, CLAVE_SESION, null) || leerAlmacen(localStorage, CLAVE_SESION, null);
}

function iniciarSesion(usuario, recordar) {
    const sesion = { correo: usuario.correo, nombre: usuario.nombre, apellido: usuario.apellido };
    guardarAlmacen(recordar ? localStorage : sessionStorage, CLAVE_SESION, sesion);
}

function cerrarSesion() {
    try {
        localStorage.removeItem(CLAVE_SESION);
        sessionStorage.removeItem(CLAVE_SESION);
    } catch (error) {
        // Si el almacenamiento no está disponible no hay sesión que cerrar
    }
}

// Cifra la contraseña con SHA-256 usando el correo como "sal", para que dos
// usuarios con la misma contraseña no queden con el mismo valor guardado.
async function cifrarContrasena(contrasena, correo) {
    const texto = normalizarCorreo(correo) + ":" + contrasena;

    if (window.crypto && window.crypto.subtle) {
        const bytes = new TextEncoder().encode(texto);
        const resumen = await window.crypto.subtle.digest("SHA-256", bytes);
        return Array.from(new Uint8Array(resumen)).map(function (byte) {
            return byte.toString(16).padStart(2, "0");
        }).join("");
    }

    // Respaldo si el navegador no permite crypto.subtle (sitio sin HTTPS)
    let hash = 5381;
    for (let i = 0; i < texto.length; i++) {
        hash = ((hash << 5) + hash + texto.charCodeAt(i)) | 0;
    }
    return "b" + (hash >>> 0).toString(16);
}


// ---------- Validaciones de los formularios de cuenta ----------

// Nombre o apellido: obligatorio, solo letras (con tildes y ñ), sin espacios,
// números ni caracteres especiales
function validarNombrePersona(campo, etiqueta) {
    const valor = campo.value.trim();
    const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+$/;

    if (valor === "") {
        mostrarErrorCampo(campo, "El " + etiqueta + " es obligatorio.");
        return false;
    }
    if (/\s/.test(valor)) {
        mostrarErrorCampo(campo, "El " + etiqueta + " no puede contener espacios.");
        return false;
    }
    if (/\d/.test(valor)) {
        mostrarErrorCampo(campo, "El " + etiqueta + " no puede contener números.");
        return false;
    }
    if (!soloLetras.test(valor)) {
        mostrarErrorCampo(campo, "El " + etiqueta + " no puede contener caracteres especiales.");
        return false;
    }
    if (valor.length < 2) {
        mostrarErrorCampo(campo, "El " + etiqueta + " debe tener al menos 2 letras.");
        return false;
    }
    limpiarErrorCampo(campo);
    return true;
}

// Correo del registro: formato válido y que no esté registrado
function validarCorreoNuevo(campo) {
    if (!validarCorreo(campo)) return false;

    if (buscarUsuarioPorCorreo(campo.value)) {
        mostrarErrorCampo(campo, "Este correo ya está registrado. Inicia sesión o usa otro correo.");
        return false;
    }
    limpiarErrorCampo(campo);
    return true;
}

// Fecha en formato AAAA-MM-DD según la zona horaria local
function fechaLocalISO(fecha) {
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");
    return fecha.getFullYear() + "-" + mes + "-" + dia;
}

// Fecha de nacimiento: obligatoria, no futura y de hace menos de 120 años
function validarFechaNacimiento(campo) {
    const valor = campo.value;

    if (valor === "") {
        mostrarErrorCampo(campo, "La fecha de nacimiento es obligatoria.");
        return false;
    }
    if (valor > campo.max) {
        mostrarErrorCampo(campo, "La fecha de nacimiento no puede ser posterior a hoy.");
        return false;
    }
    if (valor < campo.min) {
        mostrarErrorCampo(campo, "Revisa el año: la fecha no puede ser de hace más de 120 años.");
        return false;
    }
    limpiarErrorCampo(campo);
    return true;
}

// Contraseña: obligatoria y con al menos 8 caracteres
function validarContrasena(campo) {
    const valor = campo.value;

    if (valor === "") {
        mostrarErrorCampo(campo, "La contraseña es obligatoria.");
        return false;
    }
    if (valor.length < 8) {
        mostrarErrorCampo(campo, "La contraseña debe tener al menos 8 caracteres (faltan " + (8 - valor.length) + ").");
        return false;
    }
    limpiarErrorCampo(campo);
    return true;
}

// Repetir contraseña: obligatoria y debe coincidir con la primera
function validarRepetirContrasena(campo, campoOriginal) {
    if (campo.value === "") {
        mostrarErrorCampo(campo, "Repite la contraseña.");
        return false;
    }
    if (campo.value !== campoOriginal.value) {
        mostrarErrorCampo(campo, "Las contraseñas no coinciden.");
        return false;
    }
    limpiarErrorCampo(campo);
    return true;
}

// Calcula la seguridad de la contraseña (0 a 4) según largo y tipos de caracteres
function calcularSeguridadContrasena(contrasena) {
    if (contrasena.length === 0) return 0;
    let puntos = 0;
    if (contrasena.length >= 8) puntos++;
    if (/[a-zñ]/.test(contrasena) && /[A-ZÑ]/.test(contrasena)) puntos++;
    if (/\d/.test(contrasena)) puntos++;
    if (/[^A-Za-zÑñ0-9]/.test(contrasena)) puntos++;
    return Math.max(puntos, 1);
}

// Asigna la validación en tiempo real a un campo: al salir del campo, y mientras
// se escribe solo si ya mostraba un error (así no se marca rojo antes de tiempo)
function validarEnTiempoReal(campo, validar) {
    campo.addEventListener("blur", function () {
        if (campo.value !== "" || campo.classList.contains("campo-invalido")) validar();
    });
    campo.addEventListener(campo.tagName === "SELECT" || campo.type === "date" ? "change" : "input", function () {
        if (campo.classList.contains("campo-invalido")) validar();
    });
}

// Botones "Mostrar" / "Ocultar" de los campos de contraseña
function iniciarVerContrasena() {
    document.querySelectorAll(".boton-ver-contrasena").forEach(function (boton) {
        const campo = document.getElementById(boton.getAttribute("aria-controls"));
        boton.addEventListener("click", function () {
            const oculta = campo.type === "password";
            campo.type = oculta ? "text" : "password";
            boton.textContent = oculta ? "Ocultar" : "Mostrar";
            boton.setAttribute("aria-label", oculta ? "Ocultar contraseña" : "Mostrar contraseña");
            campo.focus();
        });
    });
}

// Lleva el foco al primer campo con error del formulario
function enfocarPrimerError(formulario) {
    const primerError = formulario.querySelector(".campo-invalido");
    if (primerError) primerError.focus();
}


// ---------- CREAR CUENTA ----------

function iniciarRegistro() {
    const formulario = document.getElementById("formulario-registro");
    if (!formulario) return; // Solo actúa en registro-paciente.html

    const nombre = document.getElementById("registro-nombre");
    const apellido = document.getElementById("registro-apellido");
    const correo = document.getElementById("registro-correo");
    const fechaNacimiento = document.getElementById("registro-fecha-nacimiento");
    const prevision = document.getElementById("registro-prevision");
    const contrasena = document.getElementById("registro-contrasena");
    const repetirContrasena = document.getElementById("registro-repetir-contrasena");
    const boton = document.getElementById("boton-registro");
    const mensajeExito = document.getElementById("mensaje-exito-registro");
    const medidor = document.getElementById("medidor-barra");
    const textoSeguridad = document.getElementById("seguridad-contrasena");

    // El calendario solo permite fechas entre hace 120 años y hoy
    const hoy = new Date();
    const hace120Anios = new Date(hoy.getFullYear() - 120, hoy.getMonth(), hoy.getDate());
    fechaNacimiento.max = fechaLocalISO(hoy);
    fechaNacimiento.min = fechaLocalISO(hace120Anios);

    const validaciones = [
        [nombre, function () { return validarNombrePersona(nombre, "nombre"); }],
        [apellido, function () { return validarNombrePersona(apellido, "apellido"); }],
        [correo, function () { return validarCorreoNuevo(correo); }],
        [fechaNacimiento, function () { return validarFechaNacimiento(fechaNacimiento); }],
        [contrasena, function () { return validarContrasena(contrasena); }],
        [repetirContrasena, function () { return validarRepetirContrasena(repetirContrasena, contrasena); }]
    ];

    validaciones.forEach(function (par) {
        validarEnTiempoReal(par[0], par[1]);
    });

    // Medidor de seguridad y revalidación de "Repetir contraseña" al cambiar la primera
    const nivelesSeguridad = ["", "Seguridad: débil", "Seguridad: media", "Seguridad: buena", "Seguridad: fuerte"];
    contrasena.addEventListener("input", function () {
        const nivel = calcularSeguridadContrasena(contrasena.value);
        medidor.className = "medidor-barra" + (nivel > 0 ? " nivel-" + nivel : "");
        textoSeguridad.textContent = nivelesSeguridad[nivel];

        if (repetirContrasena.value !== "") validarRepetirContrasena(repetirContrasena, contrasena);
    });

    iniciarVerContrasena();

    formulario.addEventListener("submit", async function (evento) {
        evento.preventDefault();
        mensajeExito.textContent = "";

        // Se ejecutan todas para que cada campo muestre su propio error
        const resultados = validaciones.map(function (par) { return par[1](); });
        if (resultados.includes(false)) {
            enfocarPrimerError(formulario);
            return;
        }

        // Evita envíos dobles mientras se procesa
        boton.disabled = true;
        boton.textContent = "Creando cuenta...";

        const usuario = {
            nombre: nombre.value.trim(),
            apellido: apellido.value.trim(),
            correo: normalizarCorreo(correo.value),
            fechaNacimiento: fechaNacimiento.value,
            prevision: prevision.value,
            contrasena: await cifrarContrasena(contrasena.value, correo.value),
            fechaRegistro: new Date().toISOString()
        };

        // Se revisa otra vez por si el correo se registró en otra pestaña
        if (buscarUsuarioPorCorreo(usuario.correo) || !guardarUsuario(usuario)) {
            if (buscarUsuarioPorCorreo(usuario.correo)) {
                mostrarErrorCampo(correo, "Este correo ya está registrado. Inicia sesión o usa otro correo.");
                correo.focus();
            } else {
                mostrarErrorCampo(correo, "No pudimos guardar tu cuenta. Revisa que el navegador permita guardar datos.");
            }
            boton.disabled = false;
            boton.textContent = "Crear cuenta";
            return;
        }

        mensajeExito.textContent = "¡Cuenta creada, " + usuario.nombre + "! Te llevamos a iniciar sesión...";
        formulario.querySelectorAll("input, select").forEach(function (campo) { campo.disabled = true; });

        // Redirige al inicio de sesión con el correo ya escrito
        setTimeout(function () {
            window.location.href = "login.html?correo=" + encodeURIComponent(usuario.correo);
        }, 2000);
    });
}


// ---------- INICIAR SESIÓN ----------

// Control de intentos fallidos: tras 5 errores se bloquea el botón 30 segundos
function obtenerIntentosLogin() {
    return leerAlmacen(sessionStorage, CLAVE_INTENTOS, { fallidos: 0, bloqueadoHasta: 0 });
}

function iniciarLogin() {
    const formulario = document.getElementById("formulario-login");
    if (!formulario) return; // Solo actúa en login.html

    const correo = document.getElementById("login-correo");
    const contrasena = document.getElementById("login-contrasena");
    const recordar = document.getElementById("login-recordar");
    const boton = document.getElementById("boton-login");
    const errorGeneral = document.getElementById("error-login-general");
    const avisoSesion = document.getElementById("aviso-sesion-activa");

    // Si ya hay una sesión iniciada se avisa y se ofrece cerrarla
    const sesion = obtenerSesion();
    if (sesion) {
        avisoSesion.hidden = false;
        avisoSesion.textContent = "Ya iniciaste sesión como " + sesion.nombre + " " + sesion.apellido + ".";
        const botonCerrar = document.createElement("button");
        botonCerrar.type = "button";
        botonCerrar.textContent = "Cerrar sesión";
        botonCerrar.addEventListener("click", function () {
            cerrarSesion();
            window.location.reload();
        });
        avisoSesion.appendChild(botonCerrar);
    }

    // Correo recibido desde el registro (login.html?correo=...)
    const parametros = new URLSearchParams(window.location.search);
    const correoRecibido = parametros.get("correo");
    if (correoRecibido) {
        correo.value = correoRecibido;
        contrasena.focus();
    }

    // Página a la que se vuelve tras iniciar sesión (login.html?volver=...).
    // Solo se aceptan páginas privadas del sitio, nunca direcciones externas.
    const volver = PAGINAS_PRIVADAS.includes(parametros.get("volver")) ? parametros.get("volver") : "";
    if (volver && !sesion) {
        avisoSesion.hidden = false;
        avisoSesion.textContent = "Inicia sesión para continuar a esa sección.";
    }

    const validarCorreoLogin = function () { return validarCorreo(correo); };
    const validarContrasenaLogin = function () {
        if (contrasena.value === "") {
            mostrarErrorCampo(contrasena, "Ingresa tu contraseña.");
            return false;
        }
        reiniciarCampo(contrasena);
        return true;
    };

    validarEnTiempoReal(correo, validarCorreoLogin);
    validarEnTiempoReal(contrasena, validarContrasenaLogin);
    iniciarVerContrasena();

    // Si hay un bloqueo activo, cuenta los segundos restantes
    let temporizadorBloqueo = null;
    function revisarBloqueo() {
        const intentos = obtenerIntentosLogin();
        const restantes = Math.ceil((intentos.bloqueadoHasta - Date.now()) / 1000);

        if (restantes > 0) {
            boton.disabled = true;
            errorGeneral.textContent = "Demasiados intentos fallidos. Intenta de nuevo en " + restantes + " segundos.";
            clearTimeout(temporizadorBloqueo);
            temporizadorBloqueo = setTimeout(revisarBloqueo, 1000);
            return true;
        }

        if (intentos.bloqueadoHasta) {
            guardarAlmacen(sessionStorage, CLAVE_INTENTOS, { fallidos: 0, bloqueadoHasta: 0 });
            errorGeneral.textContent = "";
        }
        boton.disabled = false;
        return false;
    }
    revisarBloqueo();

    formulario.addEventListener("submit", async function (evento) {
        evento.preventDefault();
        if (revisarBloqueo()) return;
        errorGeneral.textContent = "";

        const correoValido = validarCorreoLogin();
        const contrasenaValida = validarContrasenaLogin();
        if (!correoValido || !contrasenaValida) {
            enfocarPrimerError(formulario);
            return;
        }

        boton.disabled = true;
        boton.textContent = "Ingresando...";

        const usuario = buscarUsuarioPorCorreo(correo.value);
        const contrasenaCifrada = await cifrarContrasena(contrasena.value, correo.value);

        // Mensaje genérico: no se revela si el correo existe o no (buena práctica de seguridad)
        if (!usuario || usuario.contrasena !== contrasenaCifrada) {
            const intentos = obtenerIntentosLogin();
            intentos.fallidos++;
            if (intentos.fallidos >= MAX_INTENTOS_LOGIN) {
                intentos.bloqueadoHasta = Date.now() + SEGUNDOS_BLOQUEO * 1000;
            }
            guardarAlmacen(sessionStorage, CLAVE_INTENTOS, intentos);

            boton.textContent = "Iniciar sesión";
            boton.disabled = false;
            if (revisarBloqueo()) return;

            const quedan = MAX_INTENTOS_LOGIN - intentos.fallidos;
            errorGeneral.textContent = "Correo o contraseña incorrectos." +
                (quedan <= 2 ? " Te quedan " + quedan + " intento" + (quedan === 1 ? "" : "s") + "." : "");
            [correo, contrasena].forEach(function (campo) {
                campo.classList.remove("campo-valido");
                campo.classList.add("campo-invalido");
            });
            contrasena.value = "";
            contrasena.focus();
            return;
        }

        guardarAlmacen(sessionStorage, CLAVE_INTENTOS, { fallidos: 0, bloqueadoHasta: 0 });
        iniciarSesion(usuario, recordar.checked);
        boton.textContent = "¡Bienvenido, " + usuario.nombre + "!";
        window.location.href = volver || "../index.html";
    });
}


// ---------- PÁGINAS PRIVADAS ----------

// Páginas que solo tienen sentido con una sesión iniciada.
// Modificar y cancelar no están aquí: funcionan con el código de la reserva.
const PAGINAS_PRIVADAS = [
    "perfil-paciente.html",
    "mis-horas-medicas.html",
    "historial-atenciones.html"
];

function esPaginaPrivada() {
    return PAGINAS_PRIVADAS.includes(nombrePagina(window.location.pathname));
}

// Sin sesión, una página privada envía al inicio de sesión y luego vuelve a ella
function protegerPaginaPrivada() {
    if (esPaginaPrivada() && !obtenerSesion()) {
        window.location.replace("login.html?volver=" + encodeURIComponent(nombrePagina(window.location.pathname)));
    }
}

// Se ejecuta de inmediato para no mostrar la página privada ni un instante
protegerPaginaPrivada();

// Al cerrar sesión en una página privada se vuelve al inicio
function salirDeLaCuenta() {
    cerrarSesion();
    if (esPaginaPrivada()) {
        window.location.href = "../index.html";
    } else {
        window.location.reload();
    }
}


// ---------- MENÚ DE PERFIL SEGÚN LA SESIÓN ----------

// Sin sesión, el menú 👤 muestra solo "Iniciar sesión" y "Crear cuenta".
// Con sesión, saluda al usuario y cambia esas opciones por "Cerrar sesión".
function actualizarMenuPerfil() {
    const menuPerfil = document.querySelector(".menu-perfil");
    if (!menuPerfil) return;

    const sesion = obtenerSesion();
    if (!sesion) {
        PAGINAS_PRIVADAS.forEach(function (pagina) {
            const enlace = menuPerfil.querySelector('a[href$="' + pagina + '"]');
            if (enlace) enlace.closest("li").remove();
        });
        const separador = menuPerfil.querySelector(".dropdown-divider");
        if (separador) separador.closest("li").remove();
        return;
    }

    const titulo = menuPerfil.querySelector(".dropdown-header");
    if (titulo) titulo.textContent = "Hola, " + sesion.nombre;

    menuPerfil.querySelectorAll('a[href$="login.html"], a[href$="registro-paciente.html"]').forEach(function (enlace) {
        enlace.closest("li").remove();
    });

    const itemCerrar = document.createElement("li");
    itemCerrar.innerHTML = '<hr class="dropdown-divider">';
    const itemBoton = document.createElement("li");
    const botonCerrar = document.createElement("button");
    botonCerrar.type = "button";
    botonCerrar.className = "dropdown-item boton-cerrar-sesion";
    botonCerrar.textContent = "Cerrar sesión";
    botonCerrar.addEventListener("click", salirDeLaCuenta);
    itemBoton.appendChild(botonCerrar);
    menuPerfil.append(itemCerrar, itemBoton);

    // Quita el separador que queda al inicio al sacar los dos enlaces
    const primerItem = menuPerfil.querySelector("li:nth-child(2) .dropdown-divider");
    if (primerItem) primerItem.closest("li").remove();
}

// ---------- PERFIL DEL PACIENTE ----------

// Completa la tarjeta "Mis datos" con la cuenta que tiene la sesión iniciada
function mostrarDatosPerfil() {
    const nombre = document.getElementById("perfil-nombre");
    const sesion = obtenerSesion();
    if (!nombre || !sesion) return; // Solo actúa en perfil-paciente.html

    const usuario = buscarUsuarioPorCorreo(sesion.correo) || sesion;
    nombre.textContent = usuario.nombre + " " + usuario.apellido;
    document.getElementById("perfil-correo").textContent = usuario.correo;
    document.getElementById("perfil-fecha-nacimiento").textContent = usuario.fechaNacimiento
        ? crearFechaLocal(usuario.fechaNacimiento).toLocaleDateString("es-CL")
        : "No registrada";
    document.getElementById("perfil-prevision").textContent = usuario.prevision || "No indicada";
}

document.addEventListener("DOMContentLoaded", function () {
    actualizarMenuPerfil();
    iniciarRegistro();
    iniciarLogin();
    mostrarDatosPerfil();
});


/* =========================================================================
   ACCESIBILIDAD — Botón flotante y panel con ayudas de accesibilidad
   Se crea desde aquí para que esté en todas las páginas sin repetir HTML.
   Las preferencias se guardan en localStorage y se aplican al cargar cada
   página. Cada modo agrega una clase "a11y-..." en <html> (ver estilos.css).
   ========================================================================= */

const CLAVE_ACCESIBILIDAD = "clinica.accesibilidad";
const NIVELES_TEXTO = [100, 115, 130, 150];

// Opciones que se activan y desactivan, con el nombre que se anuncia
const OPCIONES_ACCESIBILIDAD = {
    contraste: "Alto contraste",
    grises: "Escala de grises",
    enlaces: "Resaltar enlaces",
    fuente: "Fuente legible",
    espaciado: "Espaciado de texto",
    cursor: "Cursor grande",
    guia: "Guía de lectura",
    animaciones: "Pausar animaciones"
};

// Textos que se pueden leer en voz alta
const SELECTOR_TEXTO_LEIBLE = "h1, h2, h3, h4, h5, h6, p, li, td, th, label, summary, figcaption, blockquote, .etiqueta-seccion";

function leerPreferenciasAccesibilidad() {
    const preferencias = leerAlmacen(localStorage, CLAVE_ACCESIBILIDAD, {});
    preferencias.texto = Math.min(Math.max(parseInt(preferencias.texto, 10) || 0, 0), NIVELES_TEXTO.length - 1);
    return preferencias;
}

function aplicarPreferenciasAccesibilidad(preferencias) {
    const raiz = document.documentElement;
    Object.keys(OPCIONES_ACCESIBILIDAD).forEach(function (opcion) {
        raiz.classList.toggle("a11y-" + opcion, Boolean(preferencias[opcion]));
    });
    raiz.dataset.a11yTexto = preferencias.texto;
}

// Se aplica de inmediato (antes de DOMContentLoaded) para evitar un parpadeo
aplicarPreferenciasAccesibilidad(leerPreferenciasAccesibilidad());

// Ícono universal de accesibilidad
const ICONO_ACCESIBILIDAD =
    '<svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">' +
    '<circle cx="12" cy="3.6" r="2.2"/>' +
    '<path d="M3.5 7.3l.5-1.9c2.6.7 5.3 1.1 8 1.1s5.4-.4 8-1.1l.5 1.9c-2 .6-4.1 1-6.2 1.2v4.6l2.3 8.2-1.9.5-2.2-7.5h-1l-2.2 7.5-1.9-.5 2.3-8.2V8.5c-2.1-.2-4.2-.6-6.2-1.2z"/>' +
    '</svg>';

function crearMarcadoAccesibilidad() {
    const botonesOpcion = function (lista) {
        return lista.map(function (item) {
            return '<button type="button" class="a11y-opcion" data-a11y="' + item[0] + '" aria-pressed="false">' +
                '<span class="a11y-icono" aria-hidden="true">' + item[1] + '</span>' +
                '<span>' + OPCIONES_ACCESIBILIDAD[item[0]] + '</span></button>';
        }).join("");
    };

    return '' +
        '<div class="offcanvas offcanvas-end panel-accesibilidad" tabindex="-1" id="panel-accesibilidad" aria-labelledby="titulo-accesibilidad">' +
        '  <div class="offcanvas-header">' +
        '    <h2 class="offcanvas-title" id="titulo-accesibilidad">Accesibilidad</h2>' +
        '    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Cerrar panel de accesibilidad"></button>' +
        '  </div>' +
        '  <div class="offcanvas-body">' +
        '    <p class="a11y-descripcion">Ajusta la página a tus necesidades. Tus preferencias se guardan en este navegador y se aplican en todas las páginas.</p>' +

        '    <section class="a11y-grupo" aria-labelledby="a11y-titulo-texto">' +
        '      <h3 id="a11y-titulo-texto">Tamaño del texto</h3>' +
        '      <div class="a11y-tamano">' +
        '        <button type="button" data-a11y-tamano="-1" aria-label="Disminuir tamaño del texto">A−</button>' +
        '        <output id="a11y-tamano-valor" aria-live="polite">100%</output>' +
        '        <button type="button" data-a11y-tamano="1" aria-label="Aumentar tamaño del texto">A+</button>' +
        '      </div>' +
        '    </section>' +

        '    <section class="a11y-grupo" aria-labelledby="a11y-titulo-visual">' +
        '      <h3 id="a11y-titulo-visual">Visualización</h3>' +
        '      <div class="a11y-opciones">' +
        botonesOpcion([["contraste", "◐"], ["grises", "▦"], ["enlaces", "🔗"], ["cursor", "➚"]]) +
        '      </div>' +
        '    </section>' +

        '    <section class="a11y-grupo" aria-labelledby="a11y-titulo-lectura">' +
        '      <h3 id="a11y-titulo-lectura">Lectura</h3>' +
        '      <div class="a11y-opciones">' +
        botonesOpcion([["fuente", "Aa"], ["espaciado", "↔"], ["guia", "▭"], ["animaciones", "⏸"]]) +
        '      </div>' +
        '    </section>' +

        '    <section class="a11y-grupo a11y-grupo-voz" aria-labelledby="a11y-titulo-voz">' +
        '      <h3 id="a11y-titulo-voz">Lectura en voz alta</h3>' +
        '      <div class="a11y-opciones">' +
        '        <button type="button" class="a11y-accion" id="a11y-leer-pagina"><span class="a11y-icono" aria-hidden="true">🔊</span><span>Leer la página</span></button>' +
        '        <button type="button" class="a11y-opcion" id="a11y-leer-clic" aria-pressed="false"><span class="a11y-icono" aria-hidden="true">👆</span><span>Leer al hacer clic</span></button>' +
        '        <button type="button" class="a11y-accion" id="a11y-detener-voz"><span class="a11y-icono" aria-hidden="true">⏹</span><span>Detener lectura</span></button>' +
        '      </div>' +
        '    </section>' +

        '    <button type="button" class="a11y-restablecer" id="a11y-restablecer">Restablecer ajustes</button>' +
        '    <p class="a11y-nota">Consejo: usa la tecla Tab para moverte por la página y Esc para cerrar este panel.</p>' +
        '  </div>' +
        '</div>';
}

function iniciarAccesibilidad() {
    const cuerpo = document.body;
    let preferencias = leerPreferenciasAccesibilidad();

    // 1. Enlace para saltar al contenido principal (primer elemento al usar Tab)
    const principal = document.querySelector("main");
    if (principal) {
        if (!principal.id) principal.id = "contenido-principal";
        principal.tabIndex = -1;
        const saltar = document.createElement("a");
        saltar.className = "saltar-contenido";
        saltar.href = "#" + principal.id;
        saltar.textContent = "Saltar al contenido principal";
        cuerpo.prepend(saltar);
    }

    // Región invisible que anuncia los cambios a los lectores de pantalla
    const anuncio = document.createElement("div");
    anuncio.className = "visually-hidden";
    anuncio.setAttribute("aria-live", "polite");
    cuerpo.appendChild(anuncio);
    function anunciar(texto) {
        anuncio.textContent = "";
        setTimeout(function () { anuncio.textContent = texto; }, 50);
    }

    // Guía de lectura
    const guia = document.createElement("div");
    guia.className = "guia-lectura";
    guia.setAttribute("aria-hidden", "true");
    cuerpo.appendChild(guia);
    document.addEventListener("mousemove", function (evento) {
        if (document.documentElement.classList.contains("a11y-guia")) {
            guia.style.top = (evento.clientY - 9) + "px";
        }
    });

    // El panel usa el componente Offcanvas de Bootstrap
    if (typeof bootstrap === "undefined") return;

    // 2. Botón flotante (segundo elemento al usar Tab, después de "Saltar")
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "boton-accesibilidad";
    boton.setAttribute("aria-label", "Abrir opciones de accesibilidad");
    boton.setAttribute("aria-controls", "panel-accesibilidad");
    boton.setAttribute("aria-expanded", "false");
    boton.innerHTML = ICONO_ACCESIBILIDAD + '<span class="texto-boton-accesibilidad" aria-hidden="true">Accesibilidad</span>';
    const saltar = cuerpo.querySelector(".saltar-contenido");
    if (saltar) saltar.after(boton); else cuerpo.prepend(boton);

    // 3. Panel lateral: sin fondo oscuro para ver los cambios en vivo
    cuerpo.insertAdjacentHTML("beforeend", crearMarcadoAccesibilidad());
    const panel = document.getElementById("panel-accesibilidad");
    const instanciaPanel = new bootstrap.Offcanvas(panel, { backdrop: false, scroll: true });

    boton.addEventListener("click", function () { instanciaPanel.toggle(); });
    panel.addEventListener("shown.bs.offcanvas", function () {
        boton.setAttribute("aria-expanded", "true");
        boton.setAttribute("aria-label", "Cerrar opciones de accesibilidad");
    });
    panel.addEventListener("hidden.bs.offcanvas", function () {
        boton.setAttribute("aria-expanded", "false");
        boton.setAttribute("aria-label", "Abrir opciones de accesibilidad");
        boton.focus(); // El foco vuelve al botón que abrió el panel
    });

    // Refleja en el panel el estado actual de cada opción
    const valorTamano = document.getElementById("a11y-tamano-valor");
    function actualizarPanel() {
        panel.querySelectorAll(".a11y-opcion[data-a11y]").forEach(function (opcion) {
            opcion.setAttribute("aria-pressed", String(Boolean(preferencias[opcion.dataset.a11y])));
        });
        valorTamano.textContent = NIVELES_TEXTO[preferencias.texto] + "%";
        panel.querySelector('[data-a11y-tamano="-1"]').disabled = preferencias.texto === 0;
        panel.querySelector('[data-a11y-tamano="1"]').disabled = preferencias.texto === NIVELES_TEXTO.length - 1;
    }

    function guardarYAplicar() {
        guardarAlmacen(localStorage, CLAVE_ACCESIBILIDAD, preferencias);
        aplicarPreferenciasAccesibilidad(preferencias);
        actualizarPanel();
    }

    // Opciones que se activan / desactivan
    panel.querySelectorAll(".a11y-opcion[data-a11y]").forEach(function (opcion) {
        opcion.addEventListener("click", function () {
            const nombre = opcion.dataset.a11y;
            preferencias[nombre] = !preferencias[nombre];
            guardarYAplicar();
            anunciar(OPCIONES_ACCESIBILIDAD[nombre] + (preferencias[nombre] ? " activado" : " desactivado"));
        });
    });

    // Tamaño del texto
    panel.querySelectorAll("[data-a11y-tamano]").forEach(function (control) {
        control.addEventListener("click", function () {
            const nuevo = preferencias.texto + parseInt(control.dataset.a11yTamano, 10);
            preferencias.texto = Math.min(Math.max(nuevo, 0), NIVELES_TEXTO.length - 1);
            guardarYAplicar();
            anunciar("Tamaño del texto " + NIVELES_TEXTO[preferencias.texto] + " por ciento");
        });
    });

    // ---------- Lectura en voz alta (Web Speech API) ----------
    const voz = window.speechSynthesis;
    const botonLeerClic = document.getElementById("a11y-leer-clic");
    let leerAlClic = false;
    let elementoLeyendo = null;

    function quitarResaltado() {
        if (elementoLeyendo) elementoLeyendo.classList.remove("a11y-leyendo");
        elementoLeyendo = null;
    }

    function detenerVoz() {
        if (voz) voz.cancel();
        quitarResaltado();
    }

    // Lee una lista de elementos en orden, resaltando el que se está leyendo
    function leerElementos(elementos) {
        detenerVoz();
        const vozEspanol = voz.getVoices().find(function (v) { return v.lang === "es-CL"; }) ||
            voz.getVoices().find(function (v) { return v.lang.indexOf("es") === 0; });

        elementos.forEach(function (elemento) {
            const texto = (elemento.getAttribute("aria-label") || elemento.innerText || elemento.value || "").trim();
            if (texto === "") return;
            const frase = new SpeechSynthesisUtterance(texto);
            frase.lang = "es-CL";
            frase.rate = 0.95;
            if (vozEspanol) frase.voice = vozEspanol;
            frase.onstart = function () {
                quitarResaltado();
                elementoLeyendo = elemento;
                elemento.classList.add("a11y-leyendo");
            };
            frase.onend = function () {
                if (elementoLeyendo === elemento) quitarResaltado();
            };
            voz.speak(frase);
        });
    }

    if (!voz) {
        // El navegador no permite lectura en voz alta: se oculta esa sección
        panel.querySelector(".a11y-grupo-voz").hidden = true;
    } else {
        document.getElementById("a11y-leer-pagina").addEventListener("click", function () {
            if (!principal) return;
            // Toma los textos visibles, sin repetir los que están dentro de otro (ej: <p> dentro de <li>)
            const textos = Array.from(principal.querySelectorAll(SELECTOR_TEXTO_LEIBLE)).filter(function (elemento) {
                return elemento.offsetParent !== null && !elemento.parentElement.closest(SELECTOR_TEXTO_LEIBLE);
            });
            leerElementos(textos);
            anunciar("Leyendo la página");
        });

        document.getElementById("a11y-detener-voz").addEventListener("click", function () {
            detenerVoz();
            anunciar("Lectura detenida");
        });

        botonLeerClic.addEventListener("click", function () {
            leerAlClic = !leerAlClic;
            botonLeerClic.setAttribute("aria-pressed", String(leerAlClic));
            if (!leerAlClic) detenerVoz();
            anunciar("Leer al hacer clic " + (leerAlClic ? "activado" : "desactivado"));
        });

        // Con "Leer al hacer clic" activo se lee el texto donde se hace clic
        // y también los enlaces, botones y campos al llegar a ellos con Tab
        document.addEventListener("click", function (evento) {
            if (!leerAlClic || evento.target.closest("#panel-accesibilidad, .boton-accesibilidad")) return;
            const elemento = evento.target.closest(SELECTOR_TEXTO_LEIBLE + ", a, button");
            if (elemento) leerElementos([elemento]);
        });

        document.addEventListener("focusin", function (evento) {
            if (!leerAlClic || evento.target.closest("#panel-accesibilidad")) return;
            const elemento = evento.target.closest("a, button, input, select, textarea");
            if (!elemento) return;
            if (elemento.labels && elemento.labels.length > 0) {
                leerElementos([elemento.labels[0]]);
            } else {
                leerElementos([elemento]);
            }
        });

        // Al cambiar de página la lectura se detiene
        window.addEventListener("pagehide", detenerVoz);
    }

    // Restablecer todo
    document.getElementById("a11y-restablecer").addEventListener("click", function () {
        preferencias = { texto: 0 };
        leerAlClic = false;
        botonLeerClic.setAttribute("aria-pressed", "false");
        detenerVoz();
        guardarYAplicar();
        anunciar("Ajustes de accesibilidad restablecidos");
    });

    actualizarPanel();
}

document.addEventListener("DOMContentLoaded", iniciarAccesibilidad);
