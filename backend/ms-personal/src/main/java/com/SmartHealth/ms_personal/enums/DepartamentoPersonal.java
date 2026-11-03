package com.SmartHealth.ms_personal.enums;

/** Departamentos válidos para el personal, con su nombre para mostrar. */
public enum DepartamentoPersonal {
    EMERGENCIA("Emergencia"),
    CIRUGIA("Cirugía"),
    PEDIATRIA("Pediatría"),
    OBSTETRICIA("Obstetricia"),
    UNIDAD_CUIDADOS_INTENSIVOS("Unidad de Cuidados Intensivos"),
    RADIOLOGIA("Radiología"),
    LABORATORIO("Laboratorio"),
    FARMACIA("Farmacia"),
    ADMINISTRACION("Administración"),
    RECURSOS_HUMANOS("Recursos Humanos"),
    CONTABILIDAD("Contabilidad"),
    MANTENIMIENTO("Mantenimiento"),
    SERVICIOS_GENERALES("Servicios Generales"),
    PSICOLOGIA("Psicología"),
    KINESIOLOGIA("Kinesiología"),
    NUTRICION("Nutrición");

    private final String nombre;

    DepartamentoPersonal(String nombre) {
        this.nombre = nombre;
    }

    /** Nombre del departamento para mostrar. */
    public String getNombre() {
        return nombre;
    }

    /** true si el texto corresponde a un departamento del enum (sin distinguir mayúsculas; los espacios se leen como "_"). */
    public static boolean isValido(String departamento) {
        if (departamento == null || departamento.trim().isEmpty()) {
            return false;
        }
        try {
            DepartamentoPersonal.valueOf(departamento.toUpperCase().replace(" ", "_"));
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    /** Lista de departamentos separada por comas, para el mensaje de error. */
    public static String getDepartamentosValidos() {
        StringBuilder sb = new StringBuilder();
        DepartamentoPersonal[] valores = DepartamentoPersonal.values();
        for (int i = 0; i < valores.length; i++) {
            sb.append(valores[i].nombre);
            if (i < valores.length - 1) {
                sb.append(", ");
            }
        }
        return sb.toString();
    }
}
