package com.SmartHealth.ms_hospitales.controllers;

import com.SmartHealth.ms_hospitales.models.Hospital;
import com.SmartHealth.ms_hospitales.dtos.HospitalDTO;
import com.SmartHealth.ms_hospitales.services.HospitalService;
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
@RequestMapping("/api/hospitales")
@Tag(name = "Hospitales", description = "Gestión de hospitales en el sistema")
public class HospitalController {

    private static final Logger log = LoggerFactory.getLogger(HospitalController.class);

    @Autowired
    private HospitalService service;

    @GetMapping
    @Operation(summary = "Listar todos los hospitales activos")
    public ResponseEntity<List<Hospital>> listar() {
        log.info("[HospitalController] GET /api/hospitales - Listando todos los hospitales activos");
        return ResponseEntity.ok(service.obtenerTodos());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener hospital por ID")
    public ResponseEntity<Hospital> buscarPorId(@PathVariable Long id) {
        log.info("[HospitalController] GET /api/hospitales/{} - Buscando hospital", id);
        return ResponseEntity.ok(service.obtenerPorId(id));
    }

    @GetMapping("/region/{region}")
    @Operation(summary = "Buscar hospitales por región")
    public ResponseEntity<List<Hospital>> buscarPorRegion(@PathVariable String region) {
        log.info("[HospitalController] GET /api/hospitales/region/{} - Filtrando por región", region);
        return ResponseEntity.ok(service.obtenerPorRegion(region));
    }

    @GetMapping("/complejidad/{nivel}")
    @Operation(summary = "Buscar hospitales por nivel de complejidad")
    public ResponseEntity<List<Hospital>> buscarPorComplejidad(@PathVariable String nivel) {
        log.info("[HospitalController] GET /api/hospitales/complejidad/{} - Filtrando por complejidad", nivel);
        return ResponseEntity.ok(service.obtenerPorComplejidad(nivel));
    }

    @PostMapping
    @Operation(summary = "Crear nuevo hospital")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Hospital creado"),
        @ApiResponse(responseCode = "400", description = "Validación fallida")
    })
    public ResponseEntity<Hospital> crear(@Valid @RequestBody HospitalDTO hospitalDTO) {
        log.info("[HospitalController] POST /api/hospitales - Creando hospital: {}", hospitalDTO.getNombre());
        
        Hospital hospital = new Hospital();
        BeanUtils.copyProperties(hospitalDTO, hospital, "id");
        hospital.setActivo(hospitalDTO.getActivo() != null ? hospitalDTO.getActivo() : true);
        
        Hospital nuevo = service.guardarHospital(hospital);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar hospital existente")
    public ResponseEntity<Hospital> actualizar(@PathVariable Long id, @Valid @RequestBody Hospital hospital) {
        log.info("[HospitalController] PUT /api/hospitales/{} - Actualizando hospital", id);
        return ResponseEntity.ok(service.actualizarHospital(id, hospital));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Desactivar hospital (soft-delete)")
    public ResponseEntity<Map<String, String>> desactivar(@PathVariable Long id) {
        log.info("[HospitalController] DELETE /api/hospitales/{} - Desactivando hospital", id);
        Hospital h = service.desactivarHospital(id);
        Map<String, String> respuesta = new HashMap<>();
        respuesta.put("mensaje", "El hospital '" + h.getNombre() + "' (ID: " + h.getId() + ") ha sido desactivado exitosamente.");
        return ResponseEntity.ok(respuesta);
    }
}
