package com.SmartHealth.ms_hospitales.enums;

public enum RegionChile {
    ARICA_Y_PARINACOTA("Arica y Parinacota"),
    TARAPACA("Tarapacá"),
    ANTOFAGASTA("Antofagasta"),
    ATACAMA("Atacama"),
    COQUIMBO("Coquimbo"),
    VALPARAISO("Valparaíso"),
    METROPOLITANA_DE_SANTIAGO("Metropolitana de Santiago"),
    LIBERTADOR_GENERAL_BERNARDO_OHIGGINS("Libertador General Bernardo O'Higgins"),
    MAULE("Maule"),
    BIOBIO("Bío Bío"),
    ARAUCANIA("La Araucanía"),
    LOS_RIOS("Los Ríos"),
    LOS_LAGOS("Los Lagos"),
    AYSEN("Aysén del General Carlos Ibáñez del Campo"),
    MAGALLANES("Magallanes y de la Antártica Chilena");

    private final String nombreCompleto;

    RegionChile(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }

    public String getNombreCompleto() {
        return nombreCompleto;
    }

    /**
     * Valida si una región existe en el enum (case-insensitive)
     */
    public static boolean isValida(String region) {
        if (region == null || region.trim().isEmpty()) {
            return false;
        }
        try {
            RegionChile.valueOf(region.toUpperCase().replace(" ", "_").replace("Á", "A").replace("'", ""));
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    /**
     * Retorna las regiones válidas como string
     */
    public static String getRegionesValidas() {
        StringBuilder sb = new StringBuilder();
        for (RegionChile region : RegionChile.values()) {
            sb.append(region.nombreCompleto).append(", ");
        }
        return sb.substring(0, sb.length() - 2);
    }

    /**
     * Busca una región por nombre (ignorando case y caracteres especiales)
     */
    public static RegionChile findByNombre(String nombre) {
        if (nombre == null) return null;
        String normalized = nombre.toUpperCase().replace(" ", "_").replace("Á", "A").replace("'", "");
        try {
            return RegionChile.valueOf(normalized);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
