// Espera a que la página termine de cargar
document.addEventListener("DOMContentLoaded", function () {
    
//formulario agendar hora médica

    const formulario = document.getElementById("formulario-agenda");
    if (!formulario) return; // Evita errores en las páginas que no tienen este formulario

    formulario.addEventListener("submit", function (evento) {

        evento.preventDefault();

        const especialidad = document.getElementById("especialidad").value;
        const medico = document.getElementById("medico").value;
        const fecha = document.getElementById("fecha").value;
        const hora = document.getElementById("hora").value;

        if (especialidad === "") {
            document.getElementById("texto-modal").textContent =
                "Debes seleccionar una especialidad médica.";

            document.getElementById("modal-mensaje").style.display = "flex";
            return;
        }

        if (medico === "") {
            document.getElementById("texto-modal").textContent =
                "Debes seleccionar un médico.";

            document.getElementById("modal-mensaje").style.display = "flex";
            return;
        }

        if (fecha === "") {
            document.getElementById("texto-modal").textContent =
                "Debes seleccionar una fecha.";

            document.getElementById("modal-mensaje").style.display = "flex";
            return;
        }

        if (hora === "") {
            document.getElementById("texto-modal").textContent =
                "Debes seleccionar una hora.";

            document.getElementById("modal-mensaje").style.display = "flex";
            return;
        }

        // Mensaje cuando todos los campos están completos
        // Genera un ID único para la reserva
        const idReserva = "AM-" + Date.now();

        // Obtiene el texto seleccionado en cada campo
        const especialidadTexto =
            document.getElementById("especialidad").options[
                document.getElementById("especialidad").selectedIndex
            ].text;

        const medicoTexto =
            document.getElementById("medico").options[
                document.getElementById("medico").selectedIndex
            ].text;

        // Muestra el mensaje principal
        document.getElementById("texto-modal").textContent =
            "¡Hora médica agendada correctamente!";

        // Muestra los datos de la reserva
        document.getElementById("datos-reserva").innerHTML = `
            <p><strong>ID de reserva:</strong> ${idReserva}</p>
            <p><strong>Especialidad:</strong> ${especialidadTexto}</p>
            <p><strong>Médico:</strong> ${medicoTexto}</p>
            <p><strong>Fecha:</strong> ${fecha}</p>
            <p><strong>Hora:</strong> ${hora}</p>
            <p>Guarda este comprobante para tu atención.</p>
        `;

        // Muestra la ventana emergente
        document.getElementById("modal-mensaje").style.display = "flex";

    });

    // Permite cerrar la ventana emergente
    document.getElementById("cerrar-modal").addEventListener("click", function () {
        document.getElementById("modal-mensaje").style.display = "none";
    });

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
    const formatoCorreo = /^[\w.+-]+@[\w-]+\.[\w.-]+$/;

    if (valor === "") {
        mostrarErrorCampo(campo, "El correo es obligatorio.");
        return false;
    }
    if (!formatoCorreo.test(valor)) {
        mostrarErrorCampo(campo, "Ingresa un correo válido, por ejemplo: nombre@correo.cl");
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


// Inicia las funciones del integrante 3 cuando la página termina de cargar
document.addEventListener("DOMContentLoaded", function () {
    validarContacto();
});
