package com.SmartHealth.ms_historial.controllers;

import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.Operation;

import com.SmartHealth.ms_historial.dtos.HistorialDTO;
import com.SmartHealth.ms_historial.models.HistorialClinico;
import com.SmartHealth.ms_historial.services.HistorialService;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/historial") 

public class HistorialController {

    private static final Logger log = LoggerFactory.getLogger(HistorialController.class);

    @Autowired
    private HistorialService service;

    @Operation(summary = "Listar todos los historiales clínicos")
    @GetMapping
    public ResponseEntity<List<HistorialDTO>> obtenerTodos() {
        log.info("[HistorialController] GET /api/historial - Obteniendo todos los historiales");
        return ResponseEntity.ok(service.obtenerTodos());
    }

    @Operation(summary = "Obtener historial clínico por ID")
    @GetMapping("/{id}")
    public ResponseEntity<HistorialDTO> obtenerPorId(@PathVariable Long id) {
        log.info("[HistorialController] GET /api/historial/{} - Buscando historial por ID", id);
        return ResponseEntity.ok(service.obtenerPorId(id));
    }

    @Operation(summary = "Crear nuevo registro en historial clínico")
    @PostMapping
    public ResponseEntity<HistorialDTO> crear(@Valid @RequestBody HistorialDTO historialDTO) {
        log.info("[HistorialController] POST /api/historial - Creando nuevo historial para paciente {}", historialDTO.getIdPaciente());
        HistorialDTO nuevoHistorial = service.guardar(historialDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoHistorial);
    }

    @Operation(summary = "Listar historial clínico de un paciente")
    @GetMapping("/paciente/{idPaciente}")
    public ResponseEntity<List<HistorialDTO>> obtenerPorPaciente(@PathVariable Long idPaciente) {
        log.info("[HistorialController] GET /api/historial/paciente/{} - Listando historiales del paciente", idPaciente);
        return ResponseEntity.ok(service.obtenerPorPaciente(idPaciente));
    }

    @Operation(summary = "Eliminar registro de historial clínico")
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> eliminar(@PathVariable Long id) {
        log.info("[HistorialController] DELETE /api/historial/{} - Eliminando historial", id);
        service.eliminar(id);
        
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("timestamp", LocalDateTime.now());
        respuesta.put("estado", "ELIMINADO_EXITOSAMENTE");
        respuesta.put("mensaje", "Historial clínico con ID " + id + " ha sido eliminado correctamente");
        respuesta.put("idEliminado", id);
        
        return ResponseEntity.ok(respuesta);
    }

}
