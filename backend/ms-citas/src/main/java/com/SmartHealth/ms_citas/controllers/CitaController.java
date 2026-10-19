package com.SmartHealth.ms_citas.controllers;

import com.SmartHealth.ms_citas.dtos.*;
import com.SmartHealth.ms_citas.models.EstadoCita;
import com.SmartHealth.ms_citas.services.CitaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/citas")
@Tag(name = "Citas", description = "Agenda de horas médicas: reservar, consultar, reprogramar y cancelar")
public class CitaController {

    private final CitaService servicio;

    public CitaController(CitaService servicio) {
        this.servicio = servicio;
    }

    @GetMapping
    @Operation(summary = "Listar citas (paciente: las suyas; médico: su agenda; administrador: todas)")
    public List<CitaDTO> listar(@RequestParam(required = false) EstadoCita estado) {
        return servicio.listar(estado);
    }

    @GetMapping("/disponibilidad")
    @Operation(summary = "Horas libres de un médico entre dos fechas (público)")
    public List<DiaDisponibleDTO> disponibilidad(
            @RequestParam Long medicoId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta,
            @RequestParam(required = false) Long excluirCitaId) {
        return servicio.disponibilidad(medicoId, desde, hasta, excluirCitaId);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener una cita por ID")
    public CitaDTO obtener(@PathVariable Long id) {
        return servicio.obtener(id);
    }

    @GetMapping("/codigo/{codigo}")
    @Operation(summary = "Buscar una cita por su código de reserva (AM-000001)")
    public CitaDTO obtenerPorCodigo(@PathVariable String codigo) {
        return servicio.obtenerPorCodigo(codigo);
    }

    @PostMapping
    @Operation(summary = "Agendar una hora")
    public ResponseEntity<CitaDTO> crear(@Valid @RequestBody CrearCitaRequest datos) {
        return ResponseEntity.status(HttpStatus.CREATED).body(servicio.crear(datos));
    }

    @PutMapping("/{id}/reprogramar")
    @Operation(summary = "Cambiar la fecha y hora de una cita")
    public CitaDTO reprogramar(@PathVariable Long id, @Valid @RequestBody ReprogramarCitaRequest datos) {
        return servicio.reprogramar(id, datos);
    }

    @PatchMapping("/{id}/cancelar")
    @Operation(summary = "Cancelar una cita")
    public CitaDTO cancelar(@PathVariable Long id) {
        return servicio.cancelar(id);
    }

    @PatchMapping("/{id}/estado")
    @Operation(summary = "Cambiar el estado de una cita (médico o administrador)")
    public CitaDTO cambiarEstado(@PathVariable Long id, @Valid @RequestBody CambiarEstadoRequest datos) {
        return servicio.cambiarEstado(id, datos.getEstado());
    }
}
