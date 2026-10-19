package com.SmartHealth.ms_listas_de_espera.models;

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

    public String getDescripcion() {
        return descripcion;
    }
}
