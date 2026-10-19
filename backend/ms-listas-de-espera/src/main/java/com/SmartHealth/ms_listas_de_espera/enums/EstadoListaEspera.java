package com.SmartHealth.ms_listas_de_espera.enums;

public enum EstadoListaEspera {
    PENDIENTE("En espera de asignación"),
    ASIGNADO("Asignado a fecha específica"),
    COMPLETADO("Procedimiento completado"),
    CANCELADO("Solicitud cancelada");

    private final String descripcion;

    EstadoListaEspera(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getDescripcion() {
        return descripcion;
    }

    /**
     * Valida si un estado existe en el enum (case-insensitive)
     */
    public static boolean isValido(String estado) {
        if (estado == null || estado.trim().isEmpty()) {
            return false;
        }
        try {
            EstadoListaEspera.valueOf(estado.toUpperCase());
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    /**
     * Retorna los estados válidos como string
     */
    public static String getEstadosValidos() {
        StringBuilder sb = new StringBuilder();
        for (EstadoListaEspera estado : EstadoListaEspera.values()) {
            sb.append(estado.name()).append(", ");
        }
        return sb.substring(0, sb.length() - 2);
    }
}
