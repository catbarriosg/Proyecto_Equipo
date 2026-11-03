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

/**
 * Endpoints REST de la agenda (/api/citas). La identidad del usuario la obtiene el servicio desde
 * las cabeceras que agrega el gateway, por eso los métodos no reciben el usuario como parámetro.
 */
@RestController
@RequestMapping("/api/citas")
@Tag(name = "Citas", description = "Agenda de horas médicas: reservar, consultar, reprogramar y cancelar")
public class CitaController {

    private final CitaService servicio;

    public CitaController(CitaService servicio) {
        this.servicio = servicio;
    }

    /** GET /api/citas?estado= — citas visibles para el usuario conectado, con filtro opcional por estado. */
    @GetMapping
    @Operation(summary = "Listar citas (paciente: las suyas; médico: su agenda; administrador: todas)")
    public List<CitaDTO> listar(@RequestParam(required = false) EstadoCita estado) {
        return servicio.listar(estado);
    }

    /** GET /api/citas/disponibilidad?medicoId=&desde=&hasta= — días y horas libres de un médico (ruta pública). */
    @GetMapping("/disponibilidad")
    @Operation(summary = "Horas libres de un médico entre dos fechas (público)")
    public List<DiaDisponibleDTO> disponibilidad(
            @RequestParam Long medicoId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta,
            @RequestParam(required = false) Long excluirCitaId) {
        return servicio.disponibilidad(medicoId, desde, hasta, excluirCitaId);
    }

    /** GET /api/citas/{id} — detalle de una cita. */
    @GetMapping("/{id}")
    @Operation(summary = "Obtener una cita por ID")
    public CitaDTO obtener(@PathVariable Long id) {
        return servicio.obtener(id);
    }

    /** GET /api/citas/codigo/{codigo} — busca la reserva por su código; lo usan las páginas de modificar y cancelar. */
    @GetMapping("/codigo/{codigo}")
    @Operation(summary = "Buscar una cita por su código de reserva (AM-000001)")
    public CitaDTO obtenerPorCodigo(@PathVariable String codigo) {
        return servicio.obtenerPorCodigo(codigo);
    }

    /** POST /api/citas — agenda una hora nueva y responde 201 con la cita creada. */
    @PostMapping
    @Operation(summary = "Agendar una hora")
    public ResponseEntity<CitaDTO> crear(@Valid @RequestBody CrearCitaRequest datos) {
        return ResponseEntity.status(HttpStatus.CREATED).body(servicio.crear(datos));
    }

    /** PUT /api/citas/{id}/reprogramar — cambia la fecha y la hora de una cita activa. */
    @PutMapping("/{id}/reprogramar")
    @Operation(summary = "Cambiar la fecha y hora de una cita")
    public CitaDTO reprogramar(@PathVariable Long id, @Valid @RequestBody ReprogramarCitaRequest datos) {
        return servicio.reprogramar(id, datos);
    }

    /** PATCH /api/citas/{id}/cancelar — cancela la cita y libera el horario. */
    @PatchMapping("/{id}/cancelar")
    @Operation(summary = "Cancelar una cita")
    public CitaDTO cancelar(@PathVariable Long id) {
        return servicio.cancelar(id);
    }

    /** PATCH /api/citas/{id}/estado — el médico o el administrador confirman, marcan atendida o cancelan una cita. */
    @PatchMapping("/{id}/estado")
    @Operation(summary = "Cambiar el estado de una cita (médico o administrador)")
    public CitaDTO cambiarEstado(@PathVariable Long id, @Valid @RequestBody CambiarEstadoRequest datos) {
        return servicio.cambiarEstado(id, datos.getEstado());
    }
}
