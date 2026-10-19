package com.SmartHealth.ms_camas.enums;

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

    public String getNombre() {
        return nombre;
    }

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
