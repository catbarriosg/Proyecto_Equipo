package com.SmartHealth.ms_personal.enums;

public enum RolPersonal {
    MEDICO("Médico"),
    ENFERMERO("Enfermero"),
    ADMINISTRATIVO("Personal Administrativo"),
    TECNICO("Técnico"),
    OTRO("Otro");

    private final String descripcion;

    RolPersonal(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getDescripcion() {
        return descripcion;
    }

    /**
     * Valida si un rol existe en el enum (case-insensitive)
     */
    public static boolean isValido(String rol) {
        if (rol == null || rol.trim().isEmpty()) {
            return false;
        }
        try {
            RolPersonal.valueOf(rol.toUpperCase());
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    /**
     * Retorna los roles válidos como string
     */
    public static String getRolesValidos() {
        StringBuilder sb = new StringBuilder();
        for (RolPersonal rol : RolPersonal.values()) {
            sb.append(rol.name()).append(", ");
        }
        return sb.substring(0, sb.length() - 2);
    }
}
