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
