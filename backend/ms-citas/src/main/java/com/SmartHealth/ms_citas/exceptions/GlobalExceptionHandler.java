package com.SmartHealth.ms_citas.exceptions;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import feign.FeignException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Formato único de errores para que el frontend siempre pueda leer "mensaje":
 * { "timestamp": "...", "status": 400, "error": "VALIDACION_FALLIDA", "mensaje": "...", "errores": { campo: mensaje } }
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    private static final ObjectMapper MAPPER = new ObjectMapper();

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<Map<String, Object>> manejarApi(ApiException ex) {
        return respuesta(ex.getEstado(), ex.getCodigo(), ex.getMessage(), null);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> manejarValidacion(MethodArgumentNotValidException ex) {
        Map<String, String> errores = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(error -> errores.putIfAbsent(error.getField(), error.getDefaultMessage()));
        String mensaje = errores.isEmpty() ? "Los datos enviados no son válidos." : errores.values().iterator().next();
        return respuesta(HttpStatus.BAD_REQUEST, "VALIDACION_FALLIDA", mensaje, errores);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> manejarCuerpoInvalido(HttpMessageNotReadableException ex) {
        return respuesta(HttpStatus.BAD_REQUEST, "SOLICITUD_INVALIDA",
                "El cuerpo de la solicitud no tiene un formato válido.", null);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Map<String, Object>> manejarParametroInvalido(MethodArgumentTypeMismatchException ex) {
        return respuesta(HttpStatus.BAD_REQUEST, "SOLICITUD_INVALIDA",
                "El parámetro '" + ex.getName() + "' no tiene un valor válido.", null);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> manejarDuplicado(DataIntegrityViolationException ex) {
        log.warn("Violación de integridad: {}", ex.getMostSpecificCause().getMessage());
        return respuesta(HttpStatus.CONFLICT, "CONFLICTO",
                "Ya existe un registro con esos datos.", null);
    }

    /** Los errores 4xx de otro microservicio se reenvían tal cual; los demás se informan como servicio no disponible. */
    @ExceptionHandler(FeignException.class)
    public ResponseEntity<Map<String, Object>> manejarFeign(FeignException ex) {
        if (ex.status() >= 400 && ex.status() < 500) {
            String mensaje = "La solicitud fue rechazada por otro servicio.";
            String codigo = "SOLICITUD_INVALIDA";
            try {
                JsonNode cuerpo = MAPPER.readTree(ex.contentUTF8());
                if (cuerpo.hasNonNull("mensaje")) mensaje = cuerpo.get("mensaje").asText();
                if (cuerpo.hasNonNull("error")) codigo = cuerpo.get("error").asText();
            } catch (Exception ignorado) {
                // El cuerpo no era JSON; se usa el mensaje genérico
            }
            return respuesta(HttpStatus.valueOf(ex.status()), codigo, mensaje, null);
        }
        log.error("Falló la comunicación con otro servicio: {}", ex.getMessage());
        return respuesta(HttpStatus.SERVICE_UNAVAILABLE, "SERVICIO_NO_DISPONIBLE",
                "Un servicio de la clínica no está disponible en este momento. Intenta nuevamente.", null);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> manejarGeneral(Exception ex) {
        log.error("Error inesperado", ex);
        return respuesta(HttpStatus.INTERNAL_SERVER_ERROR, "ERROR_INTERNO",
                "Ocurrió un error inesperado. Intenta nuevamente.", null);
    }

    private ResponseEntity<Map<String, Object>> respuesta(HttpStatus estado, String codigo, String mensaje,
                                                          Map<String, String> errores) {
        Map<String, Object> cuerpo = new LinkedHashMap<>();
        cuerpo.put("timestamp", LocalDateTime.now().toString());
        cuerpo.put("status", estado.value());
        cuerpo.put("error", codigo);
        cuerpo.put("mensaje", mensaje);
        if (errores != null && !errores.isEmpty()) {
            cuerpo.put("errores", errores);
        }
        return ResponseEntity.status(estado).body(cuerpo);
    }
}
