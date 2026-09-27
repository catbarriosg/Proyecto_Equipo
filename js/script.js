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
    { titulo: "Buscar hora", ruta: "paginas/buscar-hora.html", claves: "disponibilidad horas disponibles" },
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
