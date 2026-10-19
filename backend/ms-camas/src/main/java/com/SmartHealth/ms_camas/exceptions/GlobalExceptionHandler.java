package com.SmartHealth.ms_camas.exceptions;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // 1. Errores de validación (@NotBlank, @Pattern, @Min, etc.)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, Object> respuesta = new HashMap<>();
        Map<String, String> errores = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(error -> errores.put(error.getField(), error.getDefaultMessage()));
        
        respuesta.put("timestamp", LocalDateTime.now());
        respuesta.put("estado", "VALIDACION_FALLIDA");
        respuesta.put("mensaje", "Los datos enviados no cumplen con los requisitos");
        respuesta.put("detalles", errores);
        
        log.warn("[GlobalExceptionHandler] Error de validación: {}", errores);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(respuesta);
    }

    // 2. Errores de negocio: hospital no existe, cama no encontrada, etc.
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeExceptions(RuntimeException ex) {
        Map<String, Object> respuesta = new HashMap<>();
        String mensaje = ex.getMessage();
        
        respuesta.put("timestamp", LocalDateTime.now());
        respuesta.put("mensaje", mensaje);
        
        // Determinar si es error de validación de recursos o error interno
        if (mensaje != null && mensaje.contains("hospital")) {
            respuesta.put("estado", "HOSPITAL_INVALIDO");
            respuesta.put("tipo", "Validación de Hospital");
            if (mensaje.contains("no existe") || mensaje.contains("no encontrado")) {
                respuesta.put("detalles", "El hospital referenciado no existe en el sistema o no está activo");
                respuesta.put("sugerencia", "Verifique que el hospitalId sea válido y que el hospital esté activo");
                log.warn("[GlobalExceptionHandler] Hospital inválido: {}", mensaje);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(respuesta);
            }
        } else if (mensaje != null && mensaje.contains("Cama")) {
            respuesta.put("estado", "CAMA_NO_ENCONTRADA");
            respuesta.put("tipo", "Recurso no existe");
            log.warn("[GlobalExceptionHandler] Cama no encontrada: {}", mensaje);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(respuesta);
        } else if (mensaje != null && mensaje.contains("código")) {
            respuesta.put("estado", "CODIGO_DUPLICADO");
            respuesta.put("tipo", "Validación de integridad");
            log.warn("[GlobalExceptionHandler] Código duplicado: {}", mensaje);
            return ResponseEntity.status(HttpStatus.CONFLICT).body(respuesta);
        }
        
        respuesta.put("estado", "ERROR_INTERNO");
        respuesta.put("tipo", "Error interno del servidor");
        log.error("[GlobalExceptionHandler] RuntimeException no clasificada: {}", mensaje);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(respuesta);
    }

    // 3. Violación de restricción única (código de cama duplicado en BD)
    @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleDuplicateEntry(
            org.springframework.dao.DataIntegrityViolationException ex) {
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("timestamp", LocalDateTime.now());
        respuesta.put("estado", "CODIGO_DUPLICADO");
        respuesta.put("tipo", "Conflicto de datos");
        respuesta.put("mensaje", "El código de cama ya se encuentra registrado en el sistema");
        respuesta.put("detalles", "No pueden existir dos camas con el mismo código");
        respuesta.put("sugerencia", "Use un código único para la nueva cama");
        
        log.error("[GlobalExceptionHandler] DataIntegrityViolation: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(respuesta);
    }
}
