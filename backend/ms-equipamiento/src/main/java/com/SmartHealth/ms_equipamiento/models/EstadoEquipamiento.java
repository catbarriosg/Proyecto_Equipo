package com.SmartHealth.ms_equipamiento.models;

/**
 * Estados válidos para el equipamiento hospitalario.
 */
public enum EstadoEquipamiento {
    DISPONIBLE("Disponible para usar"),
    MANTENCION("En mantenimiento"),
    FUERA_SERVICIO("Fuera de servicio"),
    DESCARTADO("Descartado - No en uso");

    private final String descripcion;

    EstadoEquipamiento(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getDescripcion() {
        return descripcion;
    }

    /**
     * Verifica si un estado string es válido
     */
    public static boolean isValido(String estado) {
        if (estado == null) return false;
        try {
            EstadoEquipamiento.valueOf(estado.toUpperCase());
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    /**
     * Obtiene todos los estados válidos como string separados por coma
     */
    public static String getEstadosValidos() {
        StringBuilder sb = new StringBuilder();
        for (EstadoEquipamiento estado : EstadoEquipamiento.values()) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(estado.name());
        }
        return sb.toString();
    }
}
