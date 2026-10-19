package com.SmartHealth.ms_personal.exceptions;

import org.springframework.http.HttpStatus;

/**
 * Error de negocio con su código HTTP. El {@link GlobalExceptionHandler} lo transforma
 * en la respuesta de error común de la API: {timestamp, status, error, mensaje}.
 */
public class ApiException extends RuntimeException {

    private final HttpStatus estado;
    private final String codigo;

    public ApiException(HttpStatus estado, String codigo, String mensaje) {
        super(mensaje);
        this.estado = estado;
        this.codigo = codigo;
    }

    public static ApiException noEncontrado(String mensaje) {
        return new ApiException(HttpStatus.NOT_FOUND, "NO_ENCONTRADO", mensaje);
    }

    public static ApiException solicitudInvalida(String mensaje) {
        return new ApiException(HttpStatus.BAD_REQUEST, "SOLICITUD_INVALIDA", mensaje);
    }

    public static ApiException conflicto(String mensaje) {
        return new ApiException(HttpStatus.CONFLICT, "CONFLICTO", mensaje);
    }

    public static ApiException noAutorizado(String mensaje) {
        return new ApiException(HttpStatus.UNAUTHORIZED, "NO_AUTORIZADO", mensaje);
    }

    public static ApiException prohibido(String mensaje) {
        return new ApiException(HttpStatus.FORBIDDEN, "ACCESO_DENEGADO", mensaje);
    }

    public HttpStatus getEstado() {
        return estado;
    }

    public String getCodigo() {
        return codigo;
    }
}
