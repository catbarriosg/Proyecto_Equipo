package com.SmartHealth.ms_insumos.controllers;

import com.SmartHealth.ms_insumos.models.Insumo;
import com.SmartHealth.ms_insumos.services.InsumoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;

import java.util.List;

@RestController
@RequestMapping("/api/insumos")
public class InsumoController {

    @Autowired
    private InsumoService insumoService;

    @Operation(summary = "Listar todos los insumos activos")
    @GetMapping
    public ResponseEntity<List<Insumo>> listarInsumos() {
        return ResponseEntity.ok(insumoService.listarTodosActivos());
    }

    @Operation(summary = "Obtener insumo por código")
    @GetMapping("/{codigo}")
    public ResponseEntity<Insumo> obtenerPorCodigo(@PathVariable String codigo) {
        return ResponseEntity.ok(insumoService.buscarPorCodigo(codigo));
    }

    @Operation(summary = "Crear nuevo insumo")
    @PostMapping
    public ResponseEntity<Insumo> crearInsumo(@Valid @RequestBody Insumo insumo) {
        Insumo nuevoInsumo = insumoService.guardarInsumo(insumo);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoInsumo);
    }

    @Operation(summary = "Eliminar insumo (soft delete)")
    @DeleteMapping("/{codigo}")
    public ResponseEntity<String> eliminarInsumo(@PathVariable String codigo) {
        insumoService.eliminarInsumo(codigo);
        return ResponseEntity.ok("Insumo eliminado correctamente");
    }
}