// Espera a que la página termine de cargar
document.addEventListener("DOMContentLoaded", function () {

    const formulario = document.getElementById("formulario-agenda");
    formulario.addEventListener("submit", function (evento) {

        evento.preventDefault();

        console.log("Formulario enviado correctamente");

    });
});