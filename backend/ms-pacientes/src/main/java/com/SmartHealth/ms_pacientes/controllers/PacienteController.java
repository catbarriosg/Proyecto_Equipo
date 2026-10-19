package com.SmartHealth.ms_pacientes.controllers;

import com.SmartHealth.ms_pacientes.dtos.PacienteDTO;
import com.SmartHealth.ms_pacientes.exceptions.ApiException;
import com.SmartHealth.ms_pacientes.services.PacienteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/pacientes")
@Tag(name = "Pacientes", description = "Gestión de pacientes en el sistema")
public class PacienteController {

    @Autowired
    private PacienteService service;

    @GetMapping
    @Operation(summary = "Listar pacientes (con incluirInactivos=true también muestra los desactivados)")
    public List<PacienteDTO> listar(@RequestParam(defaultValue = "false") boolean incluirInactivos) {
        return service.obtenerTodos(incluirInactivos);
    }

    @GetMapping("/rut/{rut}")
    @Operation(summary = "Buscar paciente por RUT")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Paciente encontrado"),
        @ApiResponse(responseCode = "404", description = "Paciente no encontrado")
    })
    public PacienteDTO buscarPorRut(@PathVariable String rut) {
        return service.obtenerPorRut(rut);
    }

    @GetMapping("/{rut}")
    @Operation(summary = "Buscar paciente por RUT (ruta anterior, usada por ms-camas y ms-triaje)")
    public PacienteDTO buscarPorRutAnterior(@PathVariable String rut) {
        return service.obtenerPorRut(rut);
    }

    @GetMapping("/id/{id}")
    @Operation(summary = "Obtener paciente por ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Paciente encontrado"),
        @ApiResponse(responseCode = "404", description = "Paciente no encontrado")
    })
    public PacienteDTO obtenerPorId(@PathVariable Long id) {
        return service.obtenerPorId(id);
    }

    @PostMapping
    @Operation(summary = "Crear nuevo paciente")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Paciente creado exitosamente"),
        @ApiResponse(responseCode = "400", description = "Validación fallida"),
        @ApiResponse(responseCode = "409", description = "RUT ya existe")
    })
    public ResponseEntity<PacienteDTO> crear(@Valid @RequestBody PacienteDTO pacienteDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(pacienteDTO));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar datos del paciente (el RUT no se modifica)")
    public PacienteDTO actualizar(@PathVariable Long id, @Valid @RequestBody PacienteDTO datos) {
        return service.actualizar(id, datos);
    }

    @PatchMapping("/{id}/estado")
    @Operation(summary = "Activar o desactivar un paciente")
    public PacienteDTO cambiarEstado(@PathVariable Long id, @RequestBody Map<String, Boolean> cuerpo) {
        Boolean activo = cuerpo.get("activo");
        if (activo == null) {
            throw ApiException.solicitudInvalida("Indica si el paciente queda activo (activo: true o false).");
        }
        return service.cambiarEstado(id, activo);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Desactivar paciente (soft-delete: se conserva su historial)")
    public Map<String, String> eliminar(@PathVariable Long id) {
        PacienteDTO paciente = service.cambiarEstado(id, false);
        return Map.of("mensaje", "El paciente " + paciente.getNombreCompleto() + " quedó desactivado.");
    }
}
