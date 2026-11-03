package com.SmartHealth.ms_personal.enums;

/** Especialidades médicas válidas para filtrar al personal, con su nombre para mostrar. */
public enum EspecialidadMedica {
    CARDIOLOGIA("Cardiología"),
    NEUROLOGIA("Neurología"),
    CIRUGIA("Cirugía"),
    PEDIATRIA("Pediatría"),
    PSIQUIATRIA("Psiquiatría"),
    DERMATOLOGIA("Dermatología"),
    OFTALMOLOGIA("Oftalmología"),
    OTORRINOLARINGOLOGIA("Otorrinolaringología"),
    NEUMOLOGIA("Neumología"),
    GASTROENTEROLOGIA("Gastroenterología"),
    UROLOGIA("Urología"),
    GINECOLOGIA("Ginecología"),
    ONCOLOGIA("Oncología"),
    REUMATOLOGIA("Reumatología"),
    ENDOCRINOLOGIA("Endocrinología"),
    TRAUMATOLOGIA("Traumatología"),
    ANESTESIOLOGIA("Anestesiología"),
    RADIOLOGIA("Radiología"),
    MEDICINA_GENERAL("Medicina General"),
    MEDICINA_INTERNA("Medicina Interna");

    private final String nombre;

    EspecialidadMedica(String nombre) {
        this.nombre = nombre;
    }

    /** Nombre de la especialidad para mostrar. */
    public String getNombre() {
        return nombre;
    }

    /** true si el texto corresponde a una especialidad del enum. */
    public static boolean isValida(String especialidad) {
        if (especialidad == null || especialidad.trim().isEmpty()) {
            return false;
        }
        try {
            EspecialidadMedica.valueOf(especialidad.toUpperCase().replace(" ", "_"));
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    /** Lista de especialidades separada por comas, para el mensaje de error. */
    public static String getEspecialidadesValidas() {
        StringBuilder sb = new StringBuilder();
        EspecialidadMedica[] valores = EspecialidadMedica.values();
        for (int i = 0; i < valores.length; i++) {
            sb.append(valores[i].nombre);
            if (i < valores.length - 1) {
                sb.append(", ");
            }
        }
        return sb.toString();
    }
}
