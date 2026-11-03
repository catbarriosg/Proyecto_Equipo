package com.SmartHealth.ms_citas.models;

/**
 * Ciclo de vida de una cita:
 * SOLICITADA / CONFIRMADA (activas) → ATENDIDA o CANCELADA (finales, ya no se pueden cambiar).
 */
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
