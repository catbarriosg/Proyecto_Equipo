package com.SmartHealth.ms_camas.enums;

/** Tipos de cama válidos, con su nombre para mostrar. */
public enum TipoCama {
    BASICA("Básica"),
    UCI("UCI"),
    UTI("UTI"),
    PEDIATRICA("Pediátrica"),
    MATERNIDAD("Maternidad"),
    URGENCIA("Urgencia");

    private final String nombre;

    TipoCama(String nombre) {
        this.nombre = nombre;
    }

    /** Nombre del tipo para mostrar. */
    public String getNombre() {
        return nombre;
    }

    /** true si el texto corresponde a un tipo del enum (sin distinguir mayúsculas). */
    public static boolean isValido(String tipo) {
        if (tipo == null || tipo.trim().isEmpty()) {
            return false;
        }
        try {
            TipoCama.valueOf(tipo.toUpperCase());
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    /** Tipos válidos separados por comas, para el mensaje de error. */
    public static String getTiposValidos() {
        StringBuilder sb = new StringBuilder();
        TipoCama[] valores = TipoCama.values();
        for (int i = 0; i < valores.length; i++) {
            sb.append(valores[i].name());
            if (i < valores.length - 1) {
                sb.append(", ");
            }
        }
        return sb.toString();
    }
}
