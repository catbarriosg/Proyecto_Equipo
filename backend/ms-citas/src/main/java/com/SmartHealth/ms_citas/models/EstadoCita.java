package com.SmartHealth.ms_citas.models;

public enum EstadoCita {
    SOLICITADA,
    CONFIRMADA,
    CANCELADA,
    ATENDIDA;

    /** Una cita activa ocupa su horario y todavía se puede gestionar. */
    public boolean estaActiva() {
        return this == SOLICITADA || this == CONFIRMADA;
    }
}
