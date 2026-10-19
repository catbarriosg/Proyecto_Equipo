package com.SmartHealth.ms_personal.enums;

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

    public String getNombre() {
        return nombre;
    }

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
