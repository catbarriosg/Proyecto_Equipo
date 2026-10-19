package com.SmartHealth.ms_triaje.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1. Atrapa los errores de las validaciones (@NotBlank, @Pattern, @Email etc.)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errores = new HashMap<>();

        ex.getBindingResult().getFieldErrors()
                .forEach(error -> errores.put(error.getField(), error.getDefaultMessage()));

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errores);
    }

    // 2. Atrapa el error que lanzamos cuando no encontramos un RUT en el Service
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeExceptions(RuntimeException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("mensaje", ex.getMessage());

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    // 3. Rut duplicado o violación de restricciones de la base de datos
    @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleDuplicateEntry(
            org.springframework.dao.DataIntegrityViolationException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "Conflicto de datos");
        error.put("mensaje", "El RUT o un dato único ya se encuentra registrado en el sistema.");
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }
}