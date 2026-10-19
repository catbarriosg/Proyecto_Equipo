package com.SmartHealth.ms_pacientes.seguridad;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * Usuario que hace la petición, según las cabeceras que agrega el gateway después de validar el JWT.
 * Si no hay cabecera de rol, la llamada viene de otro microservicio (Feign) dentro de la red interna.
 */
public record Identidad(Long usuarioId, String rol, Long pacienteId, Long personalId, String correo) {

    public static final String PACIENTE = "PACIENTE";
    public static final String MEDICO = "MEDICO";
    public static final String ADMINISTRADOR = "ADMINISTRADOR";

    public static Identidad actual() {
        HttpServletRequest peticion =
                ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
        return new Identidad(
                numero(peticion.getHeader("X-Usuario-Id")),
                peticion.getHeader("X-Usuario-Rol"),
                numero(peticion.getHeader("X-Paciente-Id")),
                numero(peticion.getHeader("X-Personal-Id")),
                peticion.getHeader("X-Usuario-Correo"));
    }

    private static Long numero(String valor) {
        try {
            return valor == null || valor.isBlank() ? null : Long.valueOf(valor);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    public boolean esInterna() {
        return rol == null;
    }

    public boolean esAdministrador() {
        return ADMINISTRADOR.equals(rol);
    }

    public boolean esMedico() {
        return MEDICO.equals(rol);
    }

    public boolean esPaciente() {
        return PACIENTE.equals(rol);
    }
}
