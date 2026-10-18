
import { useEffect, useState } from "react";
import "./Accesibilidad.css";

const OPCIONES_INICIALES = {
    contraste: false,
    animaciones: false,
    grises: false,
    textoGrande: false,
    espaciado: false,
    fuente: false,
    enlaces: false,
    guia: false,
};

function Accesibilidad() {
    const [abierto, setAbierto] = useState(false);
    const [panelAmplio, setPanelAmplio] = useState(false);
    const [opciones, setOpciones] = useState(OPCIONES_INICIALES);
    const [modoContraste, setModoContraste] = useState("normal");
    const [perfilesAbiertos, setPerfilesAbiertos] = useState(false);
    const [perfilActivo, setPerfilActivo] = useState("");
    const [escuchando, setEscuchando] = useState(false);

    // Aplicar las opciones visuales a la página.
    useEffect(() => {
        const clases = {
            contraste: "accesibilidad-contraste",
            animaciones: "accesibilidad-animaciones",
            grises: "accesibilidad-grises",
            textoGrande: "accesibilidad-texto-grande",
            espaciado: "accesibilidad-espaciado",
            fuente: "accesibilidad-fuente",
            enlaces: "accesibilidad-enlaces",
        };

        Object.entries(clases).forEach(([opcion, clase]) => {
            document.body.classList.toggle(clase, opciones[opcion]);
        });

        document.body.classList.toggle(
            "accesibilidad-oscuro",
            modoContraste === "oscuro"
        );

        document.body.classList.toggle(
            "accesibilidad-alto-contraste",
            modoContraste === "alto"
        );
        document.body.classList.remove("accesibilidad-invertido");

        return () => {
            Object.values(clases).forEach((clase) => {
                document.body.classList.remove(clase);
            });

            document.body.classList.remove(
                "accesibilidad-oscuro",
                "accesibilidad-alto-contraste",
                "accesibilidad-invertido"
            );
        };
    }, [opciones, modoContraste]);

    // Detener la lectura cuando se desmonte el componente.
    useEffect(() => {
        return () => {
            if ("speechSynthesis" in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    // Cerrar el panel con Escape.
    useEffect(() => {
        function manejarTecla(evento) {
            if (evento.key === "Escape") {
                setAbierto(false);
                setPerfilesAbiertos(false);
            }
        }

        window.addEventListener("keydown", manejarTecla);
        return () => window.removeEventListener("keydown", manejarTecla);
    }, []);

    // Mover la guía de lectura.
    useEffect(() => {
        if (!opciones.guia) return;

        function moverGuia(evento) {
            const guia = document.getElementById("guia-lectura");

            if (guia) {
                guia.style.top = `${evento.clientY}px`;
            }
        }

        window.addEventListener("pointermove", moverGuia);
        return () => window.removeEventListener("pointermove", moverGuia);
    }, [opciones.guia]);

    function alternar(opcion) {
        setOpciones((actuales) => ({
            ...actuales,
            [opcion]: !actuales[opcion],
        }));

        // Si el usuario cambia manualmente una opción,
        // dejamos de considerar activo el perfil automático.
        setPerfilActivo("");
    }


    function cambiarContraste() {
        setModoContraste((actual) => {
            if (actual === "normal") return "oscuro";
            if (actual === "oscuro") return "alto";
            return "normal";
        });

        setPerfilActivo("");
    }


    function leerPagina() {
        if (!("speechSynthesis" in window)) {
            alert("Tu navegador no admite lectura en voz alta.");
            return;
        }

        window.speechSynthesis.cancel();

        const contenido =
            document.querySelector("main")?.innerText ||
            document.body.innerText;

        if (!contenido.trim()) {
            alert("No se encontró contenido para leer.");
            return;
        }

        const lectura = new SpeechSynthesisUtterance(contenido);
        lectura.lang = "es-CL";
        lectura.rate = 0.9;

        window.speechSynthesis.speak(lectura);
    }

    function detenerLectura() {
        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
        }
    }

    // Navegación por voz: requiere compatibilidad del navegador
    // y autorización para usar el micrófono.
    function iniciarNavegacionVoz() {
        const Reconocimiento =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!Reconocimiento) {
            alert(
                "Tu navegador no admite navegación por voz. " +
                "Prueba con una versión compatible de Chrome o Edge."
            );
            return;
        }

        const reconocimiento = new Reconocimiento();
        reconocimiento.lang = "es-CL";
        reconocimiento.continuous = false;
        reconocimiento.interimResults = false;

        reconocimiento.onstart = () => setEscuchando(true);

        reconocimiento.onend = () => setEscuchando(false);

        reconocimiento.onerror = () => {
            setEscuchando(false);
            alert(
                "No se pudo reconocer la voz. Revisa el permiso del micrófono."
            );
        };

        reconocimiento.onresult = (evento) => {
            const instruccion = evento.results[0][0].transcript
                .toLowerCase()
                .trim();

            const enlaces = [...document.querySelectorAll("a[href]")];

            const enlaceEncontrado = enlaces.find((enlace) => {
                const texto = enlace.innerText.toLowerCase().trim();

                return (
                    texto &&
                    instruccion.includes(texto)
                );
            });

            if (instruccion.includes("inicio")) {
                window.location.href = "/";
            } else if (instruccion.includes("contacto")) {
                window.location.href = "/contacto";
            } else if (instruccion.includes("médicos") ||
                instruccion.includes("medicos")) {
                window.location.href = "/medicos";
            } else if (instruccion.includes("especialidades")) {
                window.location.href = "/especialidades";
            } else if (instruccion.includes("volver")) {
                window.history.back();
            } else if (instruccion.includes("bajar") ||
                instruccion.includes("más abajo")) {
                window.scrollBy({ top: window.innerHeight * 0.7, behavior: "smooth" });
            } else if (instruccion.includes("subir") ||
                instruccion.includes("arriba")) {
                window.scrollBy({ top: -window.innerHeight * 0.7, behavior: "smooth" });
            } else if (enlaceEncontrado) {
                enlaceEncontrado.click();
            } else {
                alert(
                    `No reconocí la instrucción: "${instruccion}". ` +
                    "Prueba diciendo: inicio, contacto, médicos, subir o bajar."
                );
            }
        };

        try {
            reconocimiento.start();
        } catch {
            setEscuchando(false);
            alert("El reconocimiento de voz ya está iniciado.");
        }
    }

    function detenerNavegacionVoz() {
        // El reconocimiento termina después de escuchar una instrucción.
        // Si sigue escuchando, el navegador permite cancelarlo mediante
        // el evento de voz que inicia cada vez el usuario.
        setEscuchando(false);
    }

    function aplicarPerfil(perfil) {
        setOpciones(OPCIONES_INICIALES);
        setModoContraste("normal");

        if (perfil === "vision") {
            setOpciones((actuales) => ({
                ...actuales,
                textoGrande: true,
                contraste: true,
                enlaces: true,
            }));
        }

        if (perfil === "lectura") {
            setOpciones((actuales) => ({
                ...actuales,
                textoGrande: true,
                espaciado: true,
                fuente: true,
            }));
        }

        if (perfil === "movilidad") {
            setOpciones((actuales) => ({
                ...actuales,
                enlaces: true,
            }));
        }

        if (perfil === "sensibilidad") {
            setOpciones((actuales) => ({
                ...actuales,
                animaciones: true,
            }));
        }

        setPerfilActivo(perfil);
        setPerfilesAbiertos(false);
    }

    function restablecer() {
        detenerLectura();
        setOpciones(OPCIONES_INICIALES);
        setModoContraste("normal");
        setPanelAmplio(false);
        setPerfilActivo("");
        setPerfilesAbiertos(false);
    }

    function tarjeta(nombre, icono, accion, activa = false) {
        return (
            <button
                key={nombre}
                type="button"
                className={`tarjeta-accesibilidad ${activa ? "activa" : ""}`}
                onClick={accion}
                aria-pressed={activa}
            >
                <span className="icono-tarjeta" aria-hidden="true">
                    {icono}
                </span>
                <span>{nombre}</span>
            </button>
        );
    }

    return (
        <>
            <button
                type="button"
                className="boton-accesibilidad"
                onClick={() => setAbierto((actual) => !actual)}
                aria-label="Abrir opciones de accesibilidad"
                aria-expanded={abierto}
                aria-controls="panel-accesibilidad"
                title="Accesibilidad"
            >
                <svg viewBox="0 0 64 64" aria-hidden="true">
                    <circle cx="32" cy="10" r="5" />
                    <path d="M12 19 Q32 13 52 19 L48 25 L36 23 L36 36 L44 53 L39 56 L30 41 L25 56 L20 53 L28 35 L28 23 L16 25 Z" />
                </svg>
            </button>

            {abierto && (
                <section
                    id="panel-accesibilidad"
                    className={`panel-accesibilidad ${panelAmplio ? "panel-accesibilidad-ampliado" : ""
                        }`}
                    aria-label="Menú de accesibilidad"
                >
                    <header className="cabecera-accesibilidad">
                        <h2>Menú de accesibilidad</h2>

                        <button
                            type="button"
                            onClick={() => setAbierto(false)}
                            aria-label="Cerrar menú"
                        >
                            ✕
                        </button>
                    </header>

                    <div className="contenido-accesibilidad">
                        <button
                            type="button"
                            className="fila-accesibilidad"
                            onClick={() => setPerfilesAbiertos((actual) => !actual)}
                            aria-expanded={perfilesAbiertos}
                        >
                            <span aria-hidden="true">♿</span>
                            <span>Perfiles de accesibilidad</span>
                            <span>{perfilesAbiertos ? "⌄" : "›"}</span>
                        </button>

                        {perfilesAbiertos && (
                            <div className="submenu-accesibilidad">
                                <button type="button" onClick={() => aplicarPerfil("vision")}>
                                    Baja visión
                                </button>
                                <button type="button" onClick={() => aplicarPerfil("lectura")}>
                                    Lectura y dislexia
                                </button>
                                <button type="button" onClick={() => aplicarPerfil("movilidad")}>
                                    Movilidad reducida
                                </button>
                                <button type="button" onClick={() => aplicarPerfil("sensibilidad")}>
                                    Sensibilidad a animaciones
                                </button>
                                <button type="button" onClick={() => aplicarPerfil("general")}>
                                    Uso general
                                </button>
                            </div>
                        )}

                        {perfilActivo && (
                            <p className="descripcion-accesibilidad" role="status">
                                Perfil activo: {perfilActivo}
                            </p>
                        )}

                        <button
                            type="button"
                            className="fila-accesibilidad"
                            onClick={() => setPanelAmplio((actual) => !actual)}
                            aria-pressed={panelAmplio}
                        >
                            <span aria-hidden="true">XL</span>
                            <span>Panel ampliado</span>
                            <span>{panelAmplio ? "✓" : "○"}</span>
                        </button>

                        <div className="rejilla-accesibilidad">
                            {tarjeta(
                                "Contraste inteligente",
                                "◐",
                                () => alternar("contraste"),
                                opciones.contraste
                            )}

                            {tarjeta(
                                "Detener animaciones",
                                "◌",
                                () => alternar("animaciones"),
                                opciones.animaciones
                            )}

                            {tarjeta("Lectura de pantalla", "≋", leerPagina)}

                            {tarjeta(
                                escuchando ? "Escuchando..." : "Navegación por voz",
                                "♬",
                                iniciarNavegacionVoz,
                                escuchando
                            )}

                            {tarjeta(
                                `Contraste + (${modoContraste === "normal" ? "Normal" : modoContraste === "oscuro" ? "Oscuro" : "Invertido"})`,
                                "◐",
                                cambiarContraste,
                                modoContraste !== "normal"
                            )}

                            {tarjeta(
                                "Resaltar enlaces",
                                "↔",
                                () => alternar("enlaces"),
                                opciones.enlaces
                            )}

                            {tarjeta(
                                "Texto más grande",
                                "Tт",
                                () => alternar("textoGrande"),
                                opciones.textoGrande
                            )}

                            {tarjeta(
                                "Espaciado de texto",
                                "↔",
                                () => alternar("espaciado"),
                                opciones.espaciado
                            )}

                            {tarjeta(
                                "Ocultar colores",
                                "▧",
                                () => alternar("grises"),
                                opciones.grises
                            )}

                            {tarjeta(
                                "Fuente fácil de leer",
                                "Df",
                                () => alternar("fuente"),
                                opciones.fuente
                            )}

                            {tarjeta(
                                "Guía de lectura",
                                "➤",
                                () => alternar("guia"),
                                opciones.guia
                            )}

                            {tarjeta("Detener lectura", "■", detenerLectura)}
                        </div>

                        <button
                            type="button"
                            className="restablecer-accesibilidad"
                            onClick={restablecer}
                        >
                            Restablecer opciones
                        </button>
                    </div>
                </section>
            )}

            {opciones.guia && (
                <div id="guia-lectura" aria-hidden="true" />
            )}
        </>
    );
}

export default Accesibilidad;
