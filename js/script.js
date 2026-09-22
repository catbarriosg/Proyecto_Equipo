// Espera a que la página termine de cargar
document.addEventListener("DOMContentLoaded", function () {

    // Formulario agendar hora médica
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

            // Obtiene el nombre visible de la especialidad y médico
            const especialidadTexto =
                document.getElementById("especialidad").options[
                    document.getElementById("especialidad").selectedIndex
                ].text;

            const medicoTexto =
                document.getElementById("medico").options[
                    document.getElementById("medico").selectedIndex
                ].text;

            const idReserva = "AM-" + Date.now();

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
    // Formulario de registro de paciente
    const formularioRegistro = document.getElementById("formulario-registro");

    if (formularioRegistro) {

        formularioRegistro.addEventListener("submit", function (evento) {

            evento.preventDefault();

            const nombre = document.getElementById("nombre").value.trim();
            const apellido = document.getElementById("apellido").value.trim();
            const rut = document.getElementById("rut").value.trim();
            const fechaNacimiento = document.getElementById("fecha-nacimiento").value;
            const correo = document.getElementById("correo").value.trim();
            const telefono = document.getElementById("telefono").value.trim();
            const direccion = document.getElementById("direccion").value.trim();
            const contrasena = document.getElementById("contrasena").value;
            const confirmarContrasena = document.getElementById("confirmar-contrasena").value;

            if (nombre === "") {
                Swal.fire({
                    title: "Faltan datos",
                    text: "Por favor, ingresa tu nombre.",
                    icon: "error",
                    confirmButtonText: "Entendido"
                });
                return;
            }

            if (apellido === "") {
                Swal.fire({
                    title: "Faltan datos",
                    text: "Por favor, ingresa tu apellido.",
                    icon: "error",
                    confirmButtonText: "Entendido"
                });
                return;
            }

            if (rut === "") {
                Swal.fire({
                    title: "Faltan datos",
                    text: "Por favor, ingresa tu RUT.",
                    icon: "error",
                    confirmButtonText: "Entendido"
                });
                return;
            }

            if (fechaNacimiento === "") {
                Swal.fire({
                    title: "Faltan datos",
                    text: "Por favor, ingresa tu fecha de nacimiento.",
                    icon: "error",
                    confirmButtonText: "Entendido"
                });
                return;
            }

            if (correo === "") {
                Swal.fire({
                    title: "Faltan datos",
                    text: "Por favor, ingresa tu correo electrónico.",
                    icon: "error",
                    confirmButtonText: "Entendido"
                });
                return;
            }

            if (telefono === "") {
                Swal.fire({
                    title: "Faltan datos",
                    text: "Por favor, ingresa tu teléfono.",
                    icon: "error",
                    confirmButtonText: "Entendido"
                });
                return;
            }

            if (direccion === "") {
                Swal.fire({
                    title: "Faltan datos",
                    text: "Por favor, ingresa tu dirección.",
                    icon: "error",
                    confirmButtonText: "Entendido"
                });
                return;
            }

            if (contrasena === "") {
                Swal.fire({
                    title: "Faltan datos",
                    text: "Por favor, crea una contraseña.",
                    icon: "error",
                    confirmButtonText: "Entendido"
                });
                return;
            }

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

            Swal.fire({
                title: "¡Registro exitoso!",
                text: "Tu cuenta ha sido creada correctamente.",
                icon: "success",
                confirmButtonText: "Continuar"
            });

            formularioRegistro.reset();


        });
    }
    // Formulario de inicio de sesión
    const formularioLogin = document.getElementById("formulario-login");

    if (formularioLogin) {

        formularioLogin.addEventListener("submit", function (evento) {

            evento.preventDefault();

            const correo = document.getElementById("correo").value.trim();
            const contrasena = document.getElementById("contrasena").value;

            if (correo === "") {
                Swal.fire({
                    title: "Faltan datos",
                    text: "Por favor, ingresa tu correo electrónico.",
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

            Swal.fire({
                title: "¡Inicio de sesión exitoso!",
                text: "Bienvenido a Clínica Agenda Médica.",
                icon: "success",
                confirmButtonText: "Continuar"
            });

        });
    }
});