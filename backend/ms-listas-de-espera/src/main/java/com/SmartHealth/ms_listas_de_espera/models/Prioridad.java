package com.SmartHealth.ms_listas_de_espera.models;

/** Niveles de prioridad de una lista de espera, de menor (BAJA) a mayor (CRITICA). */
public enum Prioridad {
    BAJA("Baja"),
    NORMAL("Normal"),
    MEDIA("Media"),
    ALTA("Alta"),
    URGENTE("Urgente"),
    CRITICA("Crítica");

    private final String descripcion;

    Prioridad(String descripcion) {
        this.descripcion = descripcion;
    }

    /** Descripción de la prioridad para mostrar. */
    public String getDescripcion() {
        return descripcion;
    }
}
