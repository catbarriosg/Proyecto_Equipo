package com.SmartHealth.ms_citas.exceptions;

import org.springframework.http.HttpStatus;

/**
 * Error de negocio con su código HTTP. El {@link GlobalExceptionHandler} lo transforma
 * en la respuesta de error común de la API: {timestamp, status, error, mensaje}.
 */
public class ApiException extends RuntimeException {

    private final HttpStatus estado;
    private final String codigo;

    /**
     * @param estado  código HTTP que se devolverá (404, 400, 409...)
     * @param codigo  identificador corto del error que lee el frontend (NO_ENCONTRADO, CONFLICTO...)
     * @param mensaje texto pensado para mostrarse directamente al usuario
     */
    public ApiException(HttpStatus estado, String codigo, String mensaje) {
        super(mensaje);
        this.estado = estado;
        this.codigo = codigo;
    }

    // Métodos de fábrica para los errores más comunes: así el servicio escribe ApiException.conflicto("...")
    /** 404: el recurso no existe (o el usuario no tiene acceso a él). */
    public static ApiException noEncontrado(String mensaje) {
        return new ApiException(HttpStatus.NOT_FOUND, "NO_ENCONTRADO", mensaje);
    }

    /** 400: los datos enviados no cumplen una regla de negocio. */
    public static ApiException solicitudInvalida(String mensaje) {
        return new ApiException(HttpStatus.BAD_REQUEST, "SOLICITUD_INVALIDA", mensaje);
    }

    /** 409: choca con otro registro (RUT o correo repetido, horario ya tomado). */
    public static ApiException conflicto(String mensaje) {
        return new ApiException(HttpStatus.CONFLICT, "CONFLICTO", mensaje);
    }

    /** 401: falta iniciar sesión o las credenciales son incorrectas. */
    public static ApiException noAutorizado(String mensaje) {
        return new ApiException(HttpStatus.UNAUTHORIZED, "NO_AUTORIZADO", mensaje);
    }

    /** 403: hay sesión, pero el usuario no tiene permiso para esta acción. */
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
