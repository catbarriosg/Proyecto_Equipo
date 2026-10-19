package com.SmartHealth.ms_personal.exceptions;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        logger.warn("Validacion fallida: {} errores detectados", ex.getBindingResult().getErrorCount());
        
        Map<String, Object> response = new HashMap<>();
        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
            logger.debug("Error de validacion en campo '{}': {}", fieldName, errorMessage);
        });

        response.put("estado", "error");
        response.put("mensaje", "Errores de validacion");
        response.put("errores", errors);

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeExceptions(RuntimeException ex) {
        logger.error("RuntimeException capturada: {}", ex.getMessage(), ex);
        
        Map<String, String> response = new HashMap<>();
        response.put("estado", "error");
        response.put("mensaje", "Error interno del servidor");
        response.put("detalles", ex.getMessage());

        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgumentException(IllegalArgumentException ex) {
        logger.error("Argumento invalido: {}", ex.getMessage());
        
        Map<String, String> response = new HashMap<>();
        response.put("estado", "error");
        response.put("mensaje", "Argumento invalido");
        response.put("detalles", ex.getMessage());

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGenericException(Exception ex) {
        logger.error("Excepcion no manejada: {}", ex.getMessage(), ex);
        
        Map<String, String> response = new HashMap<>();
        response.put("estado", "error");
        response.put("mensaje", "Error inesperado en el servidor");
        response.put("detalles", ex.getMessage());

        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
