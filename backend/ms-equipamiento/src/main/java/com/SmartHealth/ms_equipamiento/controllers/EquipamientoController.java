package com.SmartHealth.ms_equipamiento.controllers;

import com.SmartHealth.ms_equipamiento.models.Equipamiento;
import com.SmartHealth.ms_equipamiento.services.EquipamientoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;

import java.util.List;

/** Endpoints REST de equipamiento (/api/equipamiento). Los equipos se identifican por su número de serie. */
@RestController
@RequestMapping("/api/equipamiento")
public class EquipamientoController {

    @Autowired
    private EquipamientoService equipamientoService;

    /** GET /api/equipamiento/todas — todos los equipos, incluidos los dados de baja. */
    @Operation(summary = "Listar TODOS los equipamientos de manera integral (incluyendo inactivos)")
    @GetMapping("/todas")
    public ResponseEntity<List<Equipamiento>> listarTodos() {
        return ResponseEntity.ok(equipamientoService.listarTodos());
    }

    /** GET /api/equipamiento?estado= — equipos activos, opcionalmente filtrados por estado. */
    @Operation(summary = "Listar equipamiento (activo o filtrado por estado)")
    @GetMapping
    public ResponseEntity<List<Equipamiento>> listarEquipos(
            @RequestParam(required = false) String estado) {
        if (estado != null) {
            return ResponseEntity.ok(equipamientoService.listarPorEstado(estado));
        }
        return ResponseEntity.ok(equipamientoService.listarTodosActivos());
    }

    /** GET /api/equipamiento/hospital/{hospitalId} — equipos de una sede. */
    @Operation(summary = "Listar equipamiento por hospital")
    @GetMapping("/hospital/{hospitalId}")
    public ResponseEntity<List<Equipamiento>> listarPorHospital(@PathVariable Long hospitalId) {
        return ResponseEntity.ok(equipamientoService.listarPorHospital(hospitalId));
    }

    /** GET /api/equipamiento/{numeroSerie} — un equipo por su número de serie. */
    @Operation(summary = "Obtener equipamiento por número de serie")
    @GetMapping("/{numeroSerie}")
    public ResponseEntity<Equipamiento> obtenerPorNumeroSerie(@PathVariable String numeroSerie) {
        return ResponseEntity.ok(equipamientoService.buscarPorNumeroSerie(numeroSerie));
    }

    /** POST /api/equipamiento — registra un equipo nuevo. */
    @Operation(summary = "Crear nuevo equipamiento")
    @PostMapping
    public ResponseEntity<Equipamiento> crearEquipo(@Valid @RequestBody Equipamiento equipamiento) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(equipamientoService.guardarEquipamiento(equipamiento));
    }

    /** PUT /api/equipamiento/{numeroSerie} — actualiza los datos de un equipo. */
    @Operation(summary = "Actualizar equipamiento existente")
    @PutMapping("/{numeroSerie}")
    public ResponseEntity<Equipamiento> actualizar(@PathVariable String numeroSerie, @Valid @RequestBody Equipamiento equipamiento) {
        return ResponseEntity.ok(equipamientoService.actualizarEquipamiento(numeroSerie, equipamiento));
    }

    /** PATCH /api/equipamiento/{numeroSerie}/estado?nuevoEstado= — cambia el estado del equipo. */
    @Operation(summary = "Cambiar estado del equipamiento")
    @PatchMapping("/{numeroSerie}/estado")
    public ResponseEntity<Equipamiento> actualizarEstado(
            @PathVariable String numeroSerie,
            @RequestParam String nuevoEstado) {
        return ResponseEntity.ok(equipamientoService.actualizarEstado(numeroSerie, nuevoEstado));
    }

    /** DELETE /api/equipamiento/{numeroSerie} — da de baja el equipo (soft delete). */
    @Operation(summary = "Eliminar equipamiento (soft delete)")
    @DeleteMapping("/{numeroSerie}")
    public ResponseEntity<String> eliminarEquipo(@PathVariable String numeroSerie) {
        equipamientoService.eliminarEquipamiento(numeroSerie);
        return ResponseEntity.ok("Equipo eliminado correctamente (Soft Delete)");
    }
}