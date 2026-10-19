package com.SmartHealth.ms_historial.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Manejador global de excepciones para ms-historial
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Maneja RuntimeExceptions lanzadas durante la validación de pacientes
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(
            RuntimeException ex,
            WebRequest request) {
        
        Map<String, Object> body = new HashMap<>();
        
        // Si es error de validación de paciente
        if (ex.getMessage() != null && ex.getMessage().contains("Error al validar paciente")) {
            body.put("mensaje", ex.getMessage());
            body.put("timestamp", LocalDateTime.now());
            body.put("estado", "VALIDACION_FALLIDA");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
        }
        
        // Error genérico
        body.put("mensaje", "Ocurrió un error inesperado en el servidor de historiales.");
        body.put("timestamp", LocalDateTime.now());
        body.put("estado", "ERROR_INTERNO");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }

    /**
     * Maneja excepciones de validación (BindException, MethodArgumentNotValidException)
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(
            Exception ex,
            WebRequest request) {
        
        Map<String, Object> body = new HashMap<>();
        body.put("mensaje", ex.getMessage() != null ? ex.getMessage() : "Error no especificado");
        body.put("timestamp", LocalDateTime.now());
        body.put("estado", "ERROR");
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
}
