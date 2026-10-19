package com.SmartHealth.ms_pacientes.controllers;

import com.SmartHealth.ms_pacientes.models.Paciente;
import com.SmartHealth.ms_pacientes.dtos.PacienteDTO;
import com.SmartHealth.ms_pacientes.services.PacienteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/pacientes")
@Tag(name = "Pacientes", description = "Gestión de pacientes en el sistema")
public class PacienteController {

    @Autowired
    private PacienteService service;

    @GetMapping
    @Operation(summary = "Listar todos los pacientes activos")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de pacientes obtenida correctamente"),
        @ApiResponse(responseCode = "500", description = "Error del servidor")
    })
    public ResponseEntity<List<Paciente>> listar() {
        return ResponseEntity.ok(service.obtenerTodos());
    }

    @GetMapping("/{rut}")
    @Operation(summary = "Buscar paciente por RUT")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Paciente encontrado"),
        @ApiResponse(responseCode = "404", description = "Paciente no encontrado")
    })
    public ResponseEntity<Paciente> buscarPorRut(@PathVariable String rut) {
        return ResponseEntity.ok(service.obtenerPorRut(rut));
    }

    @GetMapping("/id/{id}")
    @Operation(summary = "Obtener paciente por ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Paciente encontrado"),
        @ApiResponse(responseCode = "404", description = "Paciente no encontrado")
    })
    public ResponseEntity<Paciente> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.obtenerPorId(id));
    }

    @PostMapping
    @Operation(summary = "Crear nuevo paciente")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Paciente creado exitosamente"),
        @ApiResponse(responseCode = "400", description = "Validación fallida"),
        @ApiResponse(responseCode = "409", description = "RUT ya existe")
    })
    public ResponseEntity<Paciente> crear(@Valid @RequestBody PacienteDTO pacienteDTO) {
        Paciente paciente = new Paciente();
        BeanUtils.copyProperties(pacienteDTO, paciente, "id");
        paciente.setActivo(pacienteDTO.getActivo() != null ? pacienteDTO.getActivo() : true);
        
        Paciente nuevoPaciente = service.guardarPaciente(paciente);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoPaciente);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar paciente (soft-delete)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Paciente eliminado"),
        @ApiResponse(responseCode = "404", description = "Paciente no encontrado")
    })
    public ResponseEntity<Map<String, String>> eliminar(@PathVariable Long id) {
        Paciente p = service.eliminarPaciente(id);
        Map<String, String> respuesta = new HashMap<>();
        respuesta.put("mensaje", "El paciente con id " + p.getId() + " y nombre " + p.getNombreCompleto()
                + " ha sido \"borrado\" exitosamente");
        return ResponseEntity.ok(respuesta);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar paciente")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Paciente actualizado"),
        @ApiResponse(responseCode = "400", description = "Validación fallida"),
        @ApiResponse(responseCode = "404", description = "Paciente no encontrado")
    })
    public ResponseEntity<Paciente> actualizar(@PathVariable Long id, @Valid @RequestBody Paciente paciente) {
        Paciente pacienteActualizado = service.actualizarPaciente(id, paciente);
        return ResponseEntity.ok(pacienteActualizado);
    }

}
