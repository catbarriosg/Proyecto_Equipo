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

@RestController
@RequestMapping("/api/camas")
@Tag(name = "Camas", description = "Gestión de camas hospitalarias")
public class CamaController {

    private static final Logger log = LoggerFactory.getLogger(CamaController.class);

    @Autowired
    private CamaService service;

    @GetMapping
    @Operation(summary = "Listar todas las camas activas")
    public ResponseEntity<List<Cama>> listar() {
        log.info("[CamaController] GET /api/camas - Listando todas las camas activas");
        return ResponseEntity.ok(service.obtenerTodas());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener cama por ID")
    public ResponseEntity<Cama> buscarPorId(@PathVariable Long id) {
        log.info("[CamaController] GET /api/camas/{} - Buscando cama por ID", id);
        return ResponseEntity.ok(service.obtenerPorId(id));
    }

    @GetMapping("/codigo/{codigo}")
    @Operation(summary = "Buscar cama por código")
    public ResponseEntity<Cama> buscarPorCodigo(@PathVariable String codigo) {
        log.info("[CamaController] GET /api/camas/codigo/{} - Buscando cama por código", codigo);
        return ResponseEntity.ok(service.obtenerPorCodigo(codigo));
    }

    @GetMapping("/hospital/{hospitalId}")
    @Operation(summary = "Listar camas por hospital")
    public ResponseEntity<List<Cama>> listarPorHospital(@PathVariable Long hospitalId) {
        log.info("[CamaController] GET /api/camas/hospital/{} - Listando camas por hospital", hospitalId);
        return ResponseEntity.ok(service.obtenerPorHospital(hospitalId));
    }

    @GetMapping("/hospital/{hospitalId}/disponibles")
    @Operation(summary = "Listar camas disponibles del hospital")
    public ResponseEntity<List<Cama>> listarDisponiblesPorHospital(@PathVariable Long hospitalId) {
        log.info("[CamaController] GET /api/camas/hospital/{}/disponibles - Camas disponibles", hospitalId);
        return ResponseEntity.ok(service.obtenerDisponiblesPorHospital(hospitalId));
    }

    @GetMapping("/hospital/{hospitalId}/resumen")
    @Operation(summary = "Obtener resumen de ocupación del hospital")
    public ResponseEntity<Map<String, Object>> resumenHospital(@PathVariable Long hospitalId) {
        log.info("[CamaController] GET /api/camas/hospital/{}/resumen - Resumen de ocupación", hospitalId);
        return ResponseEntity.ok(service.obtenerResumenHospital(hospitalId));
    }

    @GetMapping("/estado/{estado}")
    @Operation(summary = "Listar camas por estado")
    public ResponseEntity<List<Cama>> listarPorEstado(@PathVariable String estado) {
        log.info("[CamaController] GET /api/camas/estado/{} - Filtrando por estado", estado);
        return ResponseEntity.ok(service.obtenerPorEstado(estado));
    }

    @GetMapping("/tipo/{tipo}")
    @Operation(summary = "Listar camas por tipo")
    public ResponseEntity<List<Cama>> listarPorTipo(@PathVariable String tipo) {
        log.info("[CamaController] GET /api/camas/tipo/{} - Filtrando por tipo", tipo);
        return ResponseEntity.ok(service.obtenerPorTipo(tipo));
    }

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

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar cama existente")
    public ResponseEntity<Cama> actualizar(@PathVariable Long id, @Valid @RequestBody Cama cama) {
        log.info("[CamaController] PUT /api/camas/{} - Actualizando cama", id);
        return ResponseEntity.ok(service.actualizarCama(id, cama));
    }

    @PatchMapping("/{id}/estado")
    @Operation(summary = "Cambiar estado de cama")
    public ResponseEntity<Cama> cambiarEstado(
            @PathVariable Long id,
            @RequestParam String estado,
            @RequestParam(required = false) String rutPaciente) {
        log.info("[CamaController] PATCH /api/camas/{}/estado → {}", id, estado);
        return ResponseEntity.ok(service.actualizarEstado(id, estado, rutPaciente));
    }

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
