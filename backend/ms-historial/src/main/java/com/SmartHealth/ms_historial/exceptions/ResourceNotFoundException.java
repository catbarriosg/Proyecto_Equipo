package com.SmartHealth.ms_historial.exceptions;

/** Excepción para recursos que no existen; el GlobalExceptionHandler la responde con estado 404. */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
