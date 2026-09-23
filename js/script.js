// Espera a que la página termine de cargar una sola vez
document.addEventListener("DOMContentLoaded", function () {
    
    // ==========================================
    // 1. LÓGICA DEL FORMULARIO Y VALIDACIONES
    // ==========================================
    const formulario = document.getElementById("formulario-agenda");

    if (formulario) {
        formulario.addEventListener("submit", function (evento) {
            evento.preventDefault();

            const especialidad = document.getElementById("especialidad").value;
            const medico = document.getElementById("medico").value;
            const fecha = document.getElementById("fecha").value;
            const hora = document.getElementById("hora").value;

            // Validaciones
            if (especialidad === "") {
                mostrarModalError("Debes seleccionar una especialidad médica.");
                return;
            }
            if (medico === "") {
                mostrarModalError("Debes seleccionar un médico.");
                return;
            }
            if (fecha === "") {
                mostrarModalError("Debes seleccionar una fecha haciendo clic en un día del calendario.");
                return;
            }
            if (hora === "") {
                mostrarModalError("Debes seleccionar una hora disponible.");
                return;
            }

            // Mensaje de éxito si pasa todas las validaciones
            const idReserva = "AM-" + Date.now();
            const selectEspecialidad = document.getElementById("especialidad");
            const selectMedico = document.getElementById("medico");
            
            const especialidadTexto = selectEspecialidad.options[selectEspecialidad.selectedIndex].text;
            const medicoTexto = selectMedico.options[selectMedico.selectedIndex].text;

            document.getElementById("texto-modal").textContent = "¡Hora médica agendada correctamente!";
            
            const datosReserva = document.getElementById("datos-reserva");
            if (datosReserva) {
                datosReserva.innerHTML = `
                    <p><strong>ID de reserva:</strong> ${idReserva}</p>
                    <p><strong>Especialidad:</strong> ${especialidadTexto}</p>
                    <p><strong>Médico:</strong> ${medicoTexto}</p>
                    <p><strong>Fecha:</strong> ${fecha}</p>
                    <p><strong>Hora:</strong> ${hora}</p>
                    <p>Guarda este comprobante para tu atención.</p>
                `;
            }
            
            document.getElementById("modal-mensaje").style.display = "flex";

            // Mostrar el botón de descarga solo cuando hay éxito
            const btnDescargar = document.getElementById("btn-descargar");
            if (btnDescargar) btnDescargar.style.display = "inline-block";
        });
    }

    function mostrarModalError(mensaje) {
        const textoModal = document.getElementById("texto-modal");
        const modalMensaje = document.getElementById("modal-mensaje");
        const datosReserva = document.getElementById("datos-reserva");
        const btnDescargar = document.getElementById("btn-descargar");
        
        if (textoModal && modalMensaje) {
            textoModal.textContent = mensaje;
            if (datosReserva) datosReserva.innerHTML = ""; // Limpia datos de reserva si es un error
            if (btnDescargar) btnDescargar.style.display = "none"; // Oculta el botón de descarga en errores
            modalMensaje.style.display = "flex";
        }
    }

    const btnCerrarModal = document.getElementById("cerrar-modal");
    if (btnCerrarModal) {
        btnCerrarModal.addEventListener("click", function () {
            const modalMensaje = document.getElementById("modal-mensaje");
            if(modalMensaje) modalMensaje.style.display = "none";
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
    // 3. SELECCIÓN DE HORA Y DÍA (Click en los botones)
    // ==========================================
    const botonesHora = document.querySelectorAll(".btn-hora");
    const inputHoraOculto = document.getElementById("hora");

    botonesHora.forEach(boton => {
        boton.addEventListener("click", function() {
            // Quitar estilo de seleccionado a todos y ponérselo al actual
            botonesHora.forEach(b => b.classList.remove("seleccionada"));
            this.classList.add("seleccionada");
            
            // Guardar en el input invisible
            if(inputHoraOculto) inputHoraOculto.value = this.getAttribute("data-hora");
        });
    });

    const diasSemana = document.querySelectorAll(".dia-box");
    const tituloFechaSeleccionada = document.querySelector(".titulo-fecha-seleccionada");
    const inputFechaOculto = document.getElementById("fecha");

    diasSemana.forEach(dia => {
        dia.addEventListener("click", function() {
            // Cambiar el día activo visualmente
            diasSemana.forEach(d => d.classList.remove("activo"));
            this.classList.add("activo");
            
            // Actualizar el título de la tarjeta y el input oculto
            if(tituloFechaSeleccionada) tituloFechaSeleccionada.textContent = this.getAttribute("data-texto");
            if(inputFechaOculto) inputFechaOculto.value = this.getAttribute("data-fecha");
            
            // Si el paciente cambia de día, reseteamos la hora elegida
            botonesHora.forEach(b => b.classList.remove("seleccionada"));
            if(inputHoraOculto) inputHoraOculto.value = "";
        });
    });

    // ==========================================
    // 4. NAVEGADOR DE SEMANAS Y DÍAS DINÁMICOS
    // ==========================================
    const btnAnterior = document.getElementById('btn-semana-anterior');
    const btnSiguiente = document.getElementById('btn-semana-siguiente');
    const textoSemana = document.getElementById('texto-rango-semana');
    const cuadrosDias = document.querySelectorAll(".dia-box");

    // Validamos que existan en el HTML actual antes de ejecutar
    if (btnAnterior && btnSiguiente && textoSemana && cuadrosDias.length > 0) {
        const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        const nombresDiasCortos = ["D", "L", "M", "Mié", "J", "V", "S"];
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
            // Cambia los números y letras de los cuadritos dinámicamente
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

                // Si este cuadro es el activo, actualizamos el título de abajo y el input
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

        btnSiguiente.addEventListener('click', function() {
            fechaInicio.setDate(fechaInicio.getDate() + 7);
            actualizarTexto();
        });

        btnAnterior.addEventListener('click', function() {
            if (!btnAnterior.disabled) {
                fechaInicio.setDate(fechaInicio.getDate() - 7);
                actualizarTexto();
            }
        });

        // Ejecutar inmediatamente al abrir la página
        actualizarTexto();
    }

    // ==========================================
    // 5. LÓGICA DE CANCELAR HORA
    // ==========================================
    const formBuscarReserva = document.getElementById("formulario-buscar-reserva");
    const contenedorResultado = document.getElementById("resultado-reserva");
    const modalConfirmacion = document.getElementById("modal-confirmacion-cancelar");
    const modalExitoCancelacion = document.getElementById("modal-exito-cancelacion");

    if (formBuscarReserva) {
        // 1. Simular la búsqueda de la reserva
        formBuscarReserva.addEventListener("submit", function(evento) {
            evento.preventDefault();
            const codigoInput = document.getElementById("codigo-reserva").value;
            
            // Inyectamos el código que el usuario escribió en la tarjeta y la mostramos
            const codigoDisplay = document.getElementById("reserva-codigo-display");
            if (codigoDisplay) codigoDisplay.textContent = codigoInput;
            
            if (contenedorResultado) contenedorResultado.style.display = "block";
        });

        // 2. Desplegar ventana de confirmación (¿Estás seguro?)
        const btnIniciarCancelacion = document.getElementById("btn-iniciar-cancelacion");
        if (btnIniciarCancelacion) {
            btnIniciarCancelacion.addEventListener("click", function() {
                if (modalConfirmacion) modalConfirmacion.style.display = "flex";
            });
        }

        // 3. Acción: "No, mantener hora" (Se arrepiente y cierra la alerta)
        const btnNoVolver = document.getElementById("btn-no-volver");
        if (btnNoVolver) {
            btnNoVolver.addEventListener("click", function() {
                if (modalConfirmacion) modalConfirmacion.style.display = "none";
            });
        }

        // 4. Acción: "Sí, cancelar hora" (Confirma la eliminación)
        const btnSiCancelar = document.getElementById("btn-si-cancelar");
        if (btnSiCancelar) {
            btnSiCancelar.addEventListener("click", function() {
                // Ocultamos la alerta de seguridad
                if (modalConfirmacion) modalConfirmacion.style.display = "none";
                
                // Ocultamos la tarjeta porque la cita ya no existe
                if (contenedorResultado) contenedorResultado.style.display = "none";
                
                // Limpiamos el input del buscador
                formBuscarReserva.reset();

                // Mostramos el éxito de la operación
                if (modalExitoCancelacion) modalExitoCancelacion.style.display = "flex";
            });
        }

        // 5. Cerrar el mensaje de éxito para volver a dejar la pantalla limpia
        const btnCerrarExitoCancelacion = document.getElementById("btn-cerrar-exito-cancelacion");
        if (btnCerrarExitoCancelacion) {
            btnCerrarExitoCancelacion.addEventListener("click", function() {
                if (modalExitoCancelacion) modalExitoCancelacion.style.display = "none";
            });
        }
    }

    // ==========================================
    // 6. LÓGICA DE BUSCAR HORA (Filtros)
    // ==========================================
    const formBuscarFiltro = document.getElementById("formulario-filtros-buscar");
    const resultadosBusqueda = document.getElementById("resultados-busqueda");
    const modalRedireccion = document.getElementById("modal-redireccion-agendar");
    const botonesSeleccionarHora = document.querySelectorAll(".btn-seleccionar-hora");

    if (formBuscarFiltro) {
        formBuscarFiltro.addEventListener("submit", function(evento) {
            evento.preventDefault();
            // Simula la carga de resultados mostrando las tarjetas ocultas
            if (resultadosBusqueda) resultadosBusqueda.style.display = "block";
        });

        // Al hacer clic en seleccionar, muestra el aviso de redirección
        botonesSeleccionarHora.forEach(boton => {
            boton.addEventListener("click", function() {
                if (modalRedireccion) modalRedireccion.style.display = "flex";
            });
        });
    }

    // ==========================================
    // 7. LÓGICA DE MODIFICAR HORA
    // ==========================================
    const formBuscarModificar = document.getElementById("formulario-buscar-modificar");
    const contenedorModificacion = document.getElementById("contenedor-modificacion");
    const formNuevaFecha = document.getElementById("formulario-nueva-fecha");
    const modalExitoModificar = document.getElementById("modal-exito-modificar");
    const btnCerrarModificar = document.getElementById("btn-cerrar-modificar");
    const inputNuevaFecha = document.getElementById("nueva-fecha");

    if (formBuscarModificar) {
        // Bloquear fechas pasadas en el input de nueva fecha
        if (inputNuevaFecha) {
            const hoy = new Date();
            const anio = hoy.getFullYear();
            const mes = String(hoy.getMonth() + 1).padStart(2, '0');
            const dia = String(hoy.getDate()).padStart(2, '0');
            inputNuevaFecha.min = `${anio}-${mes}-${dia}`;
        }

        // 1. Mostrar la reserva actual al buscar
        formBuscarModificar.addEventListener("submit", function(evento) {
            evento.preventDefault();
            if (contenedorModificacion) contenedorModificacion.style.display = "block";
        });

        // 2. Confirmar la modificación
        if (formNuevaFecha) {
            formNuevaFecha.addEventListener("submit", function(evento) {
                evento.preventDefault();
                // Ocultar panel y limpiar inputs
                contenedorModificacion.style.display = "none";
                formBuscarModificar.reset();
                formNuevaFecha.reset();
                // Mostrar éxito
                if (modalExitoModificar) modalExitoModificar.style.display = "flex";
            });
        }

        // 3. Cerrar modal
        if (btnCerrarModificar) {
            btnCerrarModificar.addEventListener("click", function() {
                if (modalExitoModificar) modalExitoModificar.style.display = "none";
            });
        }
    }
});