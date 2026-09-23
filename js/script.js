// Espera a que la página termine de cargar
document.addEventListener("DOMContentLoaded", function () {

    // FORMULARIO AGENDAR HORA MÉDICA


    const formulario = document.getElementById("formulario-agenda");

    if (formulario) {

        formulario.addEventListener("submit", function (evento) {

            evento.preventDefault();

            const especialidad = document.getElementById("especialidad").value;
            const medico = document.getElementById("medico").value;
            const fecha = document.getElementById("fecha").value;
            const hora = document.getElementById("hora").value;


            if (especialidad === "") {
                Swal.fire({
                    title: "Faltan datos",
                    text: "Debes seleccionar una especialidad médica.",
                    icon: "error",
                    confirmButtonText: "Entendido"
                });
                return;
            }


            if (medico === "") {
                Swal.fire({
                    title: "Faltan datos",
                    text: "Debes seleccionar un médico.",
                    icon: "error",
                    confirmButtonText: "Entendido"
                });
                return;
            }


            if (fecha === "") {
                Swal.fire({
                    title: "Faltan datos",
                    text: "Debes seleccionar una fecha.",
                    icon: "error",
                    confirmButtonText: "Entendido"
                });
                return;
            }


            if (hora === "") {
                Swal.fire({
                    title: "Faltan datos",
                    text: "Debes seleccionar una hora.",
                    icon: "error",
                    confirmButtonText: "Entendido"
                });
                return;
            }


            // Obtiene el nombre visible de la especialidad
            const especialidadTexto =
                document.getElementById("especialidad").options[
                    document.getElementById("especialidad").selectedIndex
                ].text;


            // Obtiene el nombre visible del médico
            const medicoTexto =
                document.getElementById("medico").options[
                    document.getElementById("medico").selectedIndex
                ].text;


            // Genera un ID para la reserva
            const idReserva = "AM-" + Date.now();

            // Muestra la confirmación
            Swal.fire({
                title: "¡Hora agendada!",
                icon: "success",
                html: `
                    <strong>ID Reserva:</strong> ${idReserva}<br><br>
                    <strong>Especialidad:</strong> ${especialidadTexto}<br>
                    <strong>Médico:</strong> ${medicoTexto}<br>
                    <strong>Fecha:</strong> ${fecha}<br>
                    <strong>Hora:</strong> ${hora}
                `,
                confirmButtonText: "Aceptar"
            });


            formulario.reset();
        });
    }
    // ==========================================
    // 2. DESPLIEGUE VISUAL (Mostrar calendario)
    // ==========================================
    const selectEspecialidad = document.getElementById("especialidad");
    const selectMedico = document.getElementById("medico");
    const contenedorFechaHora = document.getElementById("contenedor-fecha-hora");

    function verificarDespliegue() {
        if (selectEspecialidad && selectMedico && contenedorFechaHora) {
            if (selectEspecialidad.value !== "" && selectMedico.value !== "") {
                // Mostrar contenedor
                contenedorFechaHora.style.display = "block";

                // Actualizar textos de la tarjeta azul
                document.getElementById("tarjeta-nombre-medico").textContent = selectMedico.options[selectMedico.selectedIndex].text;
                document.getElementById("tarjeta-especialidad").textContent = selectEspecialidad.options[selectEspecialidad.selectedIndex].text;
            } else {
                contenedorFechaHora.style.display = "none";
            }
        }
    }

    if (selectEspecialidad && selectMedico) {
        selectEspecialidad.addEventListener("change", verificarDespliegue);
        selectMedico.addEventListener("change", verificarDespliegue);
    }

    // ==========================================
    // 3. SELECCION DE HORA Y DIA (Click en los botones)
    // ==========================================
    const botonesHora = document.querySelectorAll(".btn-hora");
    const inputHoraOculto = document.getElementById("hora");

    botonesHora.forEach(boton => {
        boton.addEventListener("click", function () {
            // Quitar estilo de seleccionado a todos y ponerselo al actual
            botonesHora.forEach(b => b.classList.remove("seleccionada"));
            this.classList.add("seleccionada");

            // Guardar en el input invisible
            if (inputHoraOculto) inputHoraOculto.value = this.getAttribute("data-hora");
        });
    });

    const diasSemana = document.querySelectorAll(".dia-box");
    const tituloFechaSeleccionada = document.querySelector(".titulo-fecha-seleccionada");
    const inputFechaOculto = document.getElementById("fecha");

    diasSemana.forEach(dia => {
        dia.addEventListener("click", function () {
            // Cambiar el d├¡a activo visualmente
            diasSemana.forEach(d => d.classList.remove("activo"));
            this.classList.add("activo");

            // Actualizar el t├¡tulo de la tarjeta y el input oculto
            if (tituloFechaSeleccionada) tituloFechaSeleccionada.textContent = this.getAttribute("data-texto");
            if (inputFechaOculto) inputFechaOculto.value = this.getAttribute("data-fecha");

            // Si el paciente cambia de dia, reseteamos la hora elegida
            botonesHora.forEach(b => b.classList.remove("seleccionada"));
            if (inputHoraOculto) inputHoraOculto.value = "";
        });
    });

    // ==========================================
    // 4. NAVEGADOR DE SEMANAS Y DiAS DINAMICOS
    // ==========================================
    const btnAnterior = document.getElementById('btn-semana-anterior');
    const btnSiguiente = document.getElementById('btn-semana-siguiente');
    const textoSemana = document.getElementById('texto-rango-semana');
    const cuadrosDias = document.querySelectorAll(".dia-box");

    // Validamos que existan en el HTML actual antes de ejecutar
    if (btnAnterior && btnSiguiente && textoSemana && cuadrosDias.length > 0) {
        const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        const nombresDiasCortos = ["D", "L", "M", "Mi", "J", "V", "S"];
        const nombresDiasLargos = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

        const fechaHoy = new Date();
        fechaHoy.setHours(0, 0, 0, 0);

        let fechaInicio = new Date();
        fechaInicio.setHours(0, 0, 0, 0);

        function actualizarTexto() {
            let fechaFin = new Date(fechaInicio);
            fechaFin.setDate(fechaInicio.getDate() + 6);

            let diaInicio = fechaInicio.getDate();
            let mesInicio = meses[fechaInicio.getMonth()];
            let diaFin = fechaFin.getDate();
            let mesFin = meses[fechaFin.getMonth()];

            // Cambia el rango de fechas arriba de las flechas
            if (mesInicio !== mesFin) {
                textoSemana.textContent = `${diaInicio} de ${mesInicio} al ${diaFin} de ${mesFin}`;
            } else {
                textoSemana.textContent = `${diaInicio} al ${diaFin} de ${mesInicio}`;
            }

            actualizarCuadrosDias();
            comprobarBotonAnterior();
        }

        function actualizarCuadrosDias() {
            // Cambia los n├║meros y letras de los cuadritos din├ímicamente
            cuadrosDias.forEach((cuadro, index) => {
                let fechaCuadro = new Date(fechaInicio);
                fechaCuadro.setDate(fechaInicio.getDate() + index);

                let numeroDia = fechaCuadro.getDate();
                let indexDiaSemana = fechaCuadro.getDay();
                let nombreCorto = nombresDiasCortos[indexDiaSemana];
                let nombreLargo = nombresDiasLargos[indexDiaSemana];
                let nombreMes = meses[fechaCuadro.getMonth()];

                let anioAttr = fechaCuadro.getFullYear();
                let mesAttr = String(fechaCuadro.getMonth() + 1).padStart(2, '0');
                let diaAttr = String(fechaCuadro.getDate()).padStart(2, '0');
                let fechaFormateada = `${anioAttr}-${mesAttr}-${diaAttr}`;

                let textoLargo = `${nombreLargo} ${numeroDia} de ${nombreMes}`;

                const elementoNombre = cuadro.querySelector('.dia-nombre');
                const elementoNumero = cuadro.querySelector('.dia-numero');

                if (elementoNombre) elementoNombre.textContent = nombreCorto;
                if (elementoNumero) elementoNumero.textContent = numeroDia;

                cuadro.setAttribute('data-fecha', fechaFormateada);
                cuadro.setAttribute('data-texto', textoLargo);

                // Si este cuadro es el activo, actualizamos el t├¡tulo de abajo y el input
                if (cuadro.classList.contains('activo')) {
                    if (tituloFechaSeleccionada) tituloFechaSeleccionada.textContent = textoLargo;
                    if (inputFechaOculto) inputFechaOculto.value = fechaFormateada;
                }
            });
        }

        function comprobarBotonAnterior() {
            // Bloquea la flecha izquierda si estamos en la semana actual
            if (fechaInicio <= fechaHoy) {
                btnAnterior.disabled = true;
                btnAnterior.style.opacity = '0.5';
                btnAnterior.style.cursor = 'not-allowed';
            } else {
                btnAnterior.disabled = false;
                btnAnterior.style.opacity = '1';
                btnAnterior.style.cursor = 'pointer';
            }
        }

        btnSiguiente.addEventListener('click', function () {
            fechaInicio.setDate(fechaInicio.getDate() + 7);
            actualizarTexto();
        });

        btnAnterior.addEventListener('click', function () {
            if (!btnAnterior.disabled) {
                fechaInicio.setDate(fechaInicio.getDate() - 7);
                actualizarTexto();
            }
        });

        // Ejecutar inmediatamente al abrir la p├ígina
        actualizarTexto();
    }

    // FORMULARIO REGISTRO DE PACIENTE

    const formularioRegistro =
        document.getElementById("formulario-registro");

    if (formularioRegistro) {

        formularioRegistro.addEventListener("submit", function (evento) {

            evento.preventDefault();


            // Obtener datos del formulario
            const nombre =
                document.getElementById("nombre").value.trim();

            const apellido =
                document.getElementById("apellido").value.trim();

            const rut =
                document.getElementById("rut").value.trim();

            const fechaNacimiento =
                document.getElementById("fecha-nacimiento").value;

            const correo =
                document.getElementById("correo").value.trim();

            const tipoTelefono =
                document.getElementById("tipo-telefono").value;

            const telefono =
                document.getElementById("telefono").value.trim();

            const direccion =
                document.getElementById("direccion").value.trim();

            const contrasena =
                document.getElementById("contrasena").value;

            const confirmarContrasena =
                document.getElementById("confirmar-contrasena").value;


            // VALIDAR NOMBRE

            if (nombre === "") {

                Swal.fire({
                    title: "Faltan datos",
                    text: "Por favor, ingresa tu nombre.",
                    icon: "error",
                    confirmButtonText: "Entendido"
                });

                return;
            }


            // Solo permite letras, espacios y tildes
            const formatoNombre =
                /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;


            if (!formatoNombre.test(nombre)) {

                Swal.fire({
                    title: "Nombre no válido",
                    text: "El nombre solo puede contener letras y espacios.",
                    icon: "error",
                    confirmButtonText: "Entendido"
                });

                return;
            }


            if (nombre.length < 3) {

                Swal.fire({
                    title: "Nombre no válido",
                    text: "El nombre debe tener al menos 3 caracteres.",
                    icon: "error",
                    confirmButtonText: "Entendido"
                });

                return;
            }

            // VALIDAR APELLIDO


            if (apellido === "") {

                Swal.fire({
                    title: "Faltan datos",
                    text: "Por favor, ingresa tu apellido.",
                    icon: "error",
                    confirmButtonText: "Entendido"
                });

                return;
            }


            if (!formatoNombre.test(apellido)) {

                Swal.fire({
                    title: "Apellido no válido",
                    text: "El apellido solo puede contener letras y espacios.",
                    icon: "error",
                    confirmButtonText: "Entendido"
                });

                return;
            }


            if (apellido.length < 3) {

                Swal.fire({
                    title: "Apellido no válido",
                    text: "El apellido debe tener al menos 3 caracteres.",
                    icon: "error",
                    confirmButtonText: "Entendido"
                });

                return;
            }

            // VALIDAR RUT

            if (rut === "") {

                Swal.fire({
                    title: "Faltan datos",
                    text: "Por favor, ingresa tu RUT.",
                    icon: "error",
                    confirmButtonText: "Entendido"
                });

                return;
            }


            // Solo valida el formato.
            const formatoRut =
                /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/;


            if (!formatoRut.test(rut)) {

                Swal.fire({
                    title: "RUT no válido",
                    text: "Ingresa tu RUT con el formato 12.345.678-9.",
                    icon: "error",
                    confirmButtonText: "Entendido"
                });

                return;
            }



            // VALIDAR FECHA DE NACIMIENTO

            if (fechaNacimiento === "") {

                Swal.fire({
                    title: "Faltan datos",
                    text: "Por favor, ingresa tu fecha de nacimiento.",
                    icon: "error",
                    confirmButtonText: "Entendido"
                });

                return;
            }

            // VALIDAR CORREO
            if (correo === "") {
                Swal.fire({
                    title: "Faltan datos",
                    text: "Por favor, ingresa tu correo electrónico.",
                    icon: "error",
                    confirmButtonText: "Entendido"
                });

                return;
            }


            const formatoCorreo =
                /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;


            if (!formatoCorreo.test(correo)) {

                Swal.fire({
                    title: "Correo no válido",
                    text: "Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.",
                    icon: "error",
                    confirmButtonText: "Entendido"
                });

                return;
            }


            // VALIDAR TELÉFONO

            if (telefono === "") {

                Swal.fire({
                    title: "Faltan datos",
                    text: "Por favor, ingresa tu número de teléfono.",
                    icon: "error",
                    confirmButtonText: "Entendido"
                });

                return;
            }

            const formatoNumeroTelefono = /^\d{8}$/;

            if (!formatoNumeroTelefono.test(telefono)) {

                Swal.fire({
                    title: "Teléfono no válido",
                    text: "Ingresa exactamente 8 números después del prefijo +56.",
                    icon: "error",
                    confirmButtonText: "Entendido"
                });

                return;
            }


            // VALIDAR DIRECCIÓN

            if (direccion === "") {

                Swal.fire({
                    title: "Faltan datos",
                    text: "Por favor, ingresa tu dirección.",
                    icon: "error",
                    confirmButtonText: "Entendido"
                });

                return;
            }

            // VALIDAR CONTRASEÑA


            if (contrasena === "") {

                Swal.fire({
                    title: "Faltan datos",
                    text: "Por favor, crea una contraseña.",
                    icon: "error",
                    confirmButtonText: "Entendido"
                });

                return;
            }


            if (contrasena.length < 8) {

                Swal.fire({
                    title: "Contraseña no válida",
                    text: "La contraseña debe tener al menos 8 caracteres.",
                    icon: "error",
                    confirmButtonText: "Entendido"
                });

                return;
            }

            // CONFIRMAR CONTRASEÑA

            if (confirmarContrasena === "") {

                Swal.fire({
                    title: "Faltan datos",
                    text: "Por favor, confirma tu contraseña.",
                    icon: "error",
                    confirmButtonText: "Entendido"
                });

                return;
            }


            if (contrasena !== confirmarContrasena) {

                Swal.fire({
                    title: "Contraseñas diferentes",
                    text: "Las contraseñas no coinciden.",
                    icon: "warning",
                    confirmButtonText: "Entendido"
                });

                return;
            }

            // REGISTRO EXITOSO

            Swal.fire({
                title: "¡Registro exitoso!",
                text: "Tu cuenta ha sido creada correctamente.",
                icon: "success",
                confirmButtonText: "Continuar"
            });


            formularioRegistro.reset();

        });
    }
    // Cambiar prefijo según el tipo de teléfono
    const tipoTelefono = document.getElementById("tipo-telefono");
    const prefijoTelefono = document.getElementById("prefijo-telefono");

    if (tipoTelefono && prefijoTelefono) {

        tipoTelefono.addEventListener("change", function () {

            if (tipoTelefono.value === "celular") {
                prefijoTelefono.textContent = "+56 9";
            } else {
                prefijoTelefono.textContent = "+56 2";
            }

        });
    }

    // FORMULARIO DE INICIO DE SESIÓN-LOGIN
    const formularioLogin = document.getElementById("formulario-login");

    if (formularioLogin) {
        formularioLogin.addEventListener("submit", function (evento) {
            evento.preventDefault();

            const correo = document.getElementById("correo").value.trim();
            const contrasena = document.getElementById("contrasena").value;

            // Validar correo obligatorio
            if (correo === "") {
                Swal.fire({
                    icon: "warning",
                    title: "Correo requerido",
                    text: "Por favor, ingresa tu correo electrónico."
                });
                return;
            }

            // Validar máximo 100 caracteres
            if (correo.length > 100) {
                Swal.fire({
                    icon: "warning",
                    title: "Correo demasiado largo",
                    text: "El correo electrónico no puede superar los 100 caracteres."
                });
                return;
            }

            // Validar dominios permitidos
            const formatoCorreo = /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
            if (!formatoCorreo.test(correo)) {
                Swal.fire({
                    icon: "warning",
                    title: "Correo no válido",
                    text: "Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com."
                });
                return;
            }

            // Validar contraseña obligatoria
            if (contrasena === "") {
                Swal.fire({
                    icon: "warning",
                    title: "Contraseña requerida",
                    text: "Por favor, ingresa tu contraseña."
                });
                return;
            }

            // Validar contraseña entre 4 y 10 caracteres
            if (contrasena.length < 4 || contrasena.length > 10) {
                Swal.fire({
                    icon: "warning",
                    title: "Contraseña no válida",
                    text: "La contraseña debe tener entre 4 y 10 caracteres."
                });
                return;
            }

            // Inicio de sesión simulado
            Swal.fire({
                icon: "success",
                title: "Inicio de sesión exitoso",
                text: "Bienvenido a Clínica Agenda Médica."
            });
        });
    }
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
    const formatoCorreo = /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;

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

