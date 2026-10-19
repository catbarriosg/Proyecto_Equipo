package com.SmartHealth.ms_hospitales.controllers;

import com.SmartHealth.ms_hospitales.dtos.SucursalDTO;
import com.SmartHealth.ms_hospitales.services.HospitalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Vista pública de las sedes de la clínica. Los datos se administran con /api/hospitales.
 */
@RestController
@RequestMapping("/api/sucursales")
@Tag(name = "Sucursales", description = "Sedes de la clínica (información pública)")
public class SucursalController {

    private final HospitalService servicio;

    public SucursalController(HospitalService servicio) {
        this.servicio = servicio;
    }

    @GetMapping
    @Operation(summary = "Listar sucursales activas")
    public List<SucursalDTO> listar() {
        return servicio.obtenerTodos().stream().map(SucursalDTO::desde).toList();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener una sucursal por ID")
    public SucursalDTO obtener(@PathVariable Long id) {
        return SucursalDTO.desde(servicio.obtenerPorId(id));
    }
}
