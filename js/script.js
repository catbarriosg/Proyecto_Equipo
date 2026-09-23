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
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!formatoCorreo.test(correo)) {

                Swal.fire({
                    title: "Correo no válido",
                    text: "Ingresa un correo electrónico válido. Ejemplo: usuario@correo.cl",
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

    // FORMULARIO DE INICIO DE SESIÓN

    const formularioLogin =
        document.getElementById("formulario-login");

    if (formularioLogin) {

        formularioLogin.addEventListener("submit", function (evento) {

            evento.preventDefault();


            const correo =
                document.getElementById("correo").value.trim();

            const contrasena =
                document.getElementById("contrasena").value;


            if (correo === "") {

                Swal.fire({
                    title: "Faltan datos",
                    text: "Por favor, ingresa tu correo electrónico.",
                    icon: "error",
                    confirmButtonText: "Entendido"
                });

                return;
            }


            // Valida el formato del correo
            const formatoCorreo =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!formatoCorreo.test(correo)) {

                Swal.fire({
                    title: "Correo no válido",
                    text: "Ingresa un correo electrónico válido. Ejemplo: usuario@correo.cl",
                    icon: "error",
                    confirmButtonText: "Entendido"
                });

                return;
            }


            if (contrasena === "") {

                Swal.fire({
                    title: "Faltan datos",
                    text: "Por favor, ingresa tu contraseña.",
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


            Swal.fire({
                title: "¡Inicio de sesión exitoso!",
                text: "Bienvenido a Clínica Agenda Médica.",
                icon: "success",
                confirmButtonText: "Continuar"
            });

        });
    }
});