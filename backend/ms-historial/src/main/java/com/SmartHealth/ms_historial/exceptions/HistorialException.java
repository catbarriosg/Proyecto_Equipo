package com.SmartHealth.ms_historial.exceptions;

import java.time.LocalDateTime;
import java.util.HashMap;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.http.HttpStatus; 

import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@ControllerAdvice
public class HistorialException {

    private static final Logger log = LoggerFactory.getLogger(HistorialException.class);

    // 1. Manejar cuando un historial no existe (404)
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> manejarNoEncontrado(ResourceNotFoundException ex) {
        log.warn("[HistorialException] Recurso no encontrado: {}", ex.getMessage());
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("timestamp", LocalDateTime.now());
        respuesta.put("estado", "RECURSO_NO_ENCONTRADO");
        respuesta.put("codigo", "HISTORIAL-404");
        respuesta.put("mensaje", ex.getMessage());
        respuesta.put("tipo", "Not Found");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(respuesta);
    }

    // 2. Manejar errores de validación (400)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> manejarValidaciones(MethodArgumentNotValidException ex) {
        log.warn("[HistorialException] Error de validación en request");
        Map<String, String> errores = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> 
            errores.put(error.getField(), error.getDefaultMessage())
        );

        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("timestamp", LocalDateTime.now());
        respuesta.put("estado", "VALIDACION_FALLIDA");
        respuesta.put("mensaje", "Los datos enviados no son válidos");
        respuesta.put("detalles", errores);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(respuesta);
    }

    // 3. Manejar RuntimeException (errores de lógica de negocio)
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> manejarRuntimeException(RuntimeException ex) {
        log.error("[HistorialException] RuntimeException: {}", ex.getMessage());
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("timestamp", LocalDateTime.now());
        respuesta.put("estado", "ERROR_VALIDACION");
        respuesta.put("tipo", "Business Logic Error");
        respuesta.put("mensaje", ex.getMessage());
        respuesta.put("detalles", "Error al procesar la solicitud de historial");
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(respuesta);
    }

    // 4. Manejar cualquier otra excepción (500)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> manejarErrorGeneral(Exception ex) {
        log.error("[HistorialException] Error interno no clasificado: ", ex);
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("timestamp", LocalDateTime.now());
        respuesta.put("estado", "ERROR_INTERNO");
        respuesta.put("tipo", "Internal Server Error");
        respuesta.put("mensaje", "Ocurrió un error inesperado en el servidor de historiales");
        respuesta.put("detalles", ex.getClass().getSimpleName() + ": " + ex.getMessage());
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(respuesta);
    }
}
