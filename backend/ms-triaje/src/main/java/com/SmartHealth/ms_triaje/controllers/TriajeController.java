package com.SmartHealth.ms_triaje.controllers;

import com.SmartHealth.ms_triaje.models.Triaje;
import com.SmartHealth.ms_triaje.dtos.TriajeDTO;
import com.SmartHealth.ms_triaje.services.TriajeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/triaje")
@Tag(name = "Triaje", description = "Sistema de evaluación de urgencia (triaje)")
public class TriajeController {

    @Autowired
    private TriajeService service;

    @GetMapping
    @Operation(summary = "Listar todos los triajes")
    public ResponseEntity<List<Triaje>> listarTodos() {
        return ResponseEntity.ok(service.obtenerTodos());
    }

    @PostMapping
    @Operation(summary = "Registrar nuevo triaje")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Triaje registrado"),
        @ApiResponse(responseCode = "400", description = "Validación fallida")
    })
    public ResponseEntity<Triaje> crear(@Valid @RequestBody TriajeDTO triajeDTO) {
        Triaje triaje = new Triaje();
        BeanUtils.copyProperties(triajeDTO, triaje, "id", "puntuacionTriaje");
        return ResponseEntity.status(HttpStatus.CREATED).body(service.registrarTriaje(triaje));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener triaje por ID")
    public ResponseEntity<Triaje> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.obtenerPorId(id));
    }

    @GetMapping("/paciente/{rut}")
    @Operation(summary = "Obtener triajes de un paciente por RUT")
    public ResponseEntity<List<Triaje>> buscarPorRut(@PathVariable String rut) {
        return ResponseEntity.ok(service.obtenerPorRut(rut));
    }

    @GetMapping("/prioridad/{nivel}")
    @Operation(summary = "Listar triajes por nivel de urgencia")
    public ResponseEntity<List<Triaje>> buscarPorPrioridad(@PathVariable String nivel) {
        return ResponseEntity.ok(service.obtenerPorNivelUrgencia(nivel));
    }
}
