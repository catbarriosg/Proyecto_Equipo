package com.SmartHealth.ms_equipamiento.exceptions;

import org.jspecify.annotations.NonNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1. Atrapa los errores de las validaciones (@NotBlank, etc.)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errores = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(error -> errores.put(error.getField(), error.getDefaultMessage()));
        
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("timestamp", LocalDateTime.now());
        respuesta.put("estado", "VALIDACION_FALLIDA");
        respuesta.put("mensaje", "Los datos enviados no cumplen con los requisitos");
        respuesta.put("detalles", errores);
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(respuesta);
    }

    // 1b. Atrapa errores de JSON malformado (comas trailing, comillas faltantes, etc.)
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> handleJsonParseException(HttpMessageNotReadableException ex) {
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("timestamp", LocalDateTime.now());
        respuesta.put("estado", "JSON_INVALIDO");
        respuesta.put("tipo", "Error en parsing de JSON");
        respuesta.put("mensaje", "El JSON enviado es inválido o tiene formato incorrecto");
        respuesta.put("detalles", "Verifique: comas trailing, comillas faltantes, caracteres especiales escapados, tipos de datos correctos");
        respuesta.put("sugerencia", "Revise el body del request con un validador JSON (https://jsonlint.com)");
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(respuesta);
    }

    // 2. Atrapa el error que lanzamos cuando no encontramos un equipo o hospital inválido
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeExceptions(@NonNull RuntimeException ex) {
        Map<String, Object> respuesta = new HashMap<>();
        String mensaje = ex.getMessage();
        
        respuesta.put("timestamp", LocalDateTime.now());
        respuesta.put("mensaje", mensaje);
        
        if (mensaje != null && mensaje.contains("hospital")) {
            respuesta.put("estado", "HOSPITAL_INVALIDO");
            respuesta.put("tipo", "Validación de Hospital");
            if (mensaje.contains("no existe") || mensaje.contains("no encontrado")) {
                respuesta.put("detalles", "El hospital referenciado no existe en el sistema o no está activo");
                respuesta.put("sugerencia", "Verifique que el hospitalUbicacionId sea válido y que el hospital esté activo");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(respuesta);
            }
        } else if (mensaje != null && mensaje.contains("serie")) {
            respuesta.put("estado", "EQUIPO_NO_ENCONTRADO");
            respuesta.put("tipo", "Recurso no existe");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(respuesta);
        }
        
        respuesta.put("estado", "ERROR_INTERNO");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(respuesta);
    }

    // 3. Número de serie duplicado o violación de restricciones de la base de datos
    @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleDuplicateEntry(
            org.springframework.dao.DataIntegrityViolationException ex) {
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("timestamp", LocalDateTime.now());
        respuesta.put("estado", "NUMERO_SERIE_DUPLICADO");
        respuesta.put("tipo", "Conflicto de datos");
        respuesta.put("mensaje", "El número de serie del equipo ya se encuentra registrado en el sistema.");
        respuesta.put("detalles", "No pueden existir dos equipos con el mismo número de serie");
        respuesta.put("sugerencia", "Use un número de serie único para el nuevo equipo");
        
        return ResponseEntity.status(HttpStatus.CONFLICT).body(respuesta);
    }
}