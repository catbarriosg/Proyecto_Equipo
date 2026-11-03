package com.SmartHealth.ms_camas.controllers;

import com.SmartHealth.ms_camas.models.Cama;
import com.SmartHealth.ms_camas.dtos.CamaDTO;
import com.SmartHealth.ms_camas.services.CamaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/** Endpoints REST de camas (/api/camas). El gateway los deja solo para el administrador. */
@RestController
@RequestMapping("/api/camas")
@Tag(name = "Camas", description = "Gestión de camas hospitalarias")
public class CamaController {

    private static final Logger log = LoggerFactory.getLogger(CamaController.class);

    @Autowired
    private CamaService service;

    /** GET /api/camas — camas activas. */
    @GetMapping
    @Operation(summary = "Listar todas las camas activas")
    public ResponseEntity<List<Cama>> listar() {
        log.info("[CamaController] GET /api/camas - Listando todas las camas activas");
        return ResponseEntity.ok(service.obtenerTodas());
    }

    /** GET /api/camas/{id} — una cama por ID. */
    @GetMapping("/{id}")
    @Operation(summary = "Obtener cama por ID")
    public ResponseEntity<Cama> buscarPorId(@PathVariable Long id) {
        log.info("[CamaController] GET /api/camas/{} - Buscando cama por ID", id);
        return ResponseEntity.ok(service.obtenerPorId(id));
    }

    /** GET /api/camas/codigo/{codigo} — una cama por su código (ej. UCI-001). */
    @GetMapping("/codigo/{codigo}")
    @Operation(summary = "Buscar cama por código")
    public ResponseEntity<Cama> buscarPorCodigo(@PathVariable String codigo) {
        log.info("[CamaController] GET /api/camas/codigo/{} - Buscando cama por código", codigo);
        return ResponseEntity.ok(service.obtenerPorCodigo(codigo));
    }

    /** GET /api/camas/hospital/{hospitalId} — camas de una sede. */
    @GetMapping("/hospital/{hospitalId}")
    @Operation(summary = "Listar camas por hospital")
    public ResponseEntity<List<Cama>> listarPorHospital(@PathVariable Long hospitalId) {
        log.info("[CamaController] GET /api/camas/hospital/{} - Listando camas por hospital", hospitalId);
        return ResponseEntity.ok(service.obtenerPorHospital(hospitalId));
    }

    /** GET /api/camas/hospital/{hospitalId}/disponibles — camas libres de una sede. */
    @GetMapping("/hospital/{hospitalId}/disponibles")
    @Operation(summary = "Listar camas disponibles del hospital")
    public ResponseEntity<List<Cama>> listarDisponiblesPorHospital(@PathVariable Long hospitalId) {
        log.info("[CamaController] GET /api/camas/hospital/{}/disponibles - Camas disponibles", hospitalId);
        return ResponseEntity.ok(service.obtenerDisponiblesPorHospital(hospitalId));
    }

    /** GET /api/camas/hospital/{hospitalId}/resumen — totales por estado y porcentaje de ocupación. */
    @GetMapping("/hospital/{hospitalId}/resumen")
    @Operation(summary = "Obtener resumen de ocupación del hospital")
    public ResponseEntity<Map<String, Object>> resumenHospital(@PathVariable Long hospitalId) {
        log.info("[CamaController] GET /api/camas/hospital/{}/resumen - Resumen de ocupación", hospitalId);
        return ResponseEntity.ok(service.obtenerResumenHospital(hospitalId));
    }

    /** GET /api/camas/estado/{estado} — camas por estado (DISPONIBLE, OCUPADA, MANTENCION, RESERVADA). */
    @GetMapping("/estado/{estado}")
    @Operation(summary = "Listar camas por estado")
    public ResponseEntity<List<Cama>> listarPorEstado(@PathVariable String estado) {
        log.info("[CamaController] GET /api/camas/estado/{} - Filtrando por estado", estado);
        return ResponseEntity.ok(service.obtenerPorEstado(estado));
    }

    /** GET /api/camas/tipo/{tipo} — camas por tipo (BASICA, UCI, UTI...). */
    @GetMapping("/tipo/{tipo}")
    @Operation(summary = "Listar camas por tipo")
    public ResponseEntity<List<Cama>> listarPorTipo(@PathVariable String tipo) {
        log.info("[CamaController] GET /api/camas/tipo/{} - Filtrando por tipo", tipo);
        return ResponseEntity.ok(service.obtenerPorTipo(tipo));
    }

    /** POST /api/camas — registra una cama copiando los datos del DTO a la entidad. */
    @PostMapping
    @Operation(summary = "Crear nueva cama")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Cama creada"),
        @ApiResponse(responseCode = "400", description = "Validación fallida")
    })
    public ResponseEntity<Cama> crear(@Valid @RequestBody CamaDTO camaDTO) {
        log.info("[CamaController] POST /api/camas - Registrando cama: {}", camaDTO.getCodigo());
        
        Cama cama = new Cama();
        BeanUtils.copyProperties(camaDTO, cama, "id");
        cama.setActiva(camaDTO.getActiva() != null ? camaDTO.getActiva() : true);
        
        Cama nueva = service.guardarCama(cama);
        return ResponseEntity.status(HttpStatus.CREATED).body(nueva);
    }

    /** PUT /api/camas/{id} — actualiza los datos de una cama. */
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar cama existente")
    public ResponseEntity<Cama> actualizar(@PathVariable Long id, @Valid @RequestBody Cama cama) {
        log.info("[CamaController] PUT /api/camas/{} - Actualizando cama", id);
        return ResponseEntity.ok(service.actualizarCama(id, cama));
    }

    /** PATCH /api/camas/{id}/estado?estado=&rutPaciente= — cambia el estado; para OCUPADA exige el RUT del paciente. */
    @PatchMapping("/{id}/estado")
    @Operation(summary = "Cambiar estado de cama")
    public ResponseEntity<Cama> cambiarEstado(
            @PathVariable Long id,
            @RequestParam String estado,
            @RequestParam(required = false) String rutPaciente) {
        log.info("[CamaController] PATCH /api/camas/{}/estado → {}", id, estado);
        return ResponseEntity.ok(service.actualizarEstado(id, estado, rutPaciente));
    }

    /** DELETE /api/camas/{id} — desactiva la cama (soft delete). */
    @DeleteMapping("/{id}")
    @Operation(summary = "Desactivar cama (soft-delete)")
    public ResponseEntity<Map<String, String>> desactivar(@PathVariable Long id) {
        log.info("[CamaController] DELETE /api/camas/{} - Desactivando cama", id);
        Cama c = service.desactivarCama(id);
        Map<String, String> respuesta = new HashMap<>();
        respuesta.put("mensaje", "La cama '" + c.getCodigo() + "' (ID: " + c.getId() + ") ha sido desactivada exitosamente.");
        return ResponseEntity.ok(respuesta);
    }
}
