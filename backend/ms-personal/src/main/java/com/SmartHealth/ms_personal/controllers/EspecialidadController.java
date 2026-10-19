package com.SmartHealth.ms_personal.controllers;

import com.SmartHealth.ms_personal.exceptions.ApiException;
import com.SmartHealth.ms_personal.models.Especialidad;
import com.SmartHealth.ms_personal.repositories.EspecialidadRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/especialidades")
@Tag(name = "Especialidades", description = "Especialidades médicas que ofrece la clínica")
public class EspecialidadController {

    private final EspecialidadRepository repositorio;

    public EspecialidadController(EspecialidadRepository repositorio) {
        this.repositorio = repositorio;
    }

    @GetMapping
    @Operation(summary = "Listar especialidades activas (público)")
    public List<Especialidad> listar() {
        return repositorio.findByActivaTrueOrderByNombreAsc();
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Obtener una especialidad por su identificador, por ejemplo medicina-general (público)")
    public Especialidad obtener(@PathVariable String slug) {
        return repositorio.findBySlug(slug)
                .orElseThrow(() -> ApiException.noEncontrado("No encontramos la especialidad solicitada."));
    }

    @PostMapping
    @Operation(summary = "Crear una especialidad (administrador)")
    public ResponseEntity<Especialidad> crear(@Valid @RequestBody Especialidad especialidad) {
        if (repositorio.existsBySlug(especialidad.getSlug())
                || repositorio.existsByNombreIgnoreCase(especialidad.getNombre())) {
            throw ApiException.conflicto("Ya existe una especialidad con ese nombre.");
        }
        especialidad.setId(null);
        especialidad.setActiva(especialidad.getActiva() == null || especialidad.getActiva());
        return ResponseEntity.status(HttpStatus.CREATED).body(repositorio.save(especialidad));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar una especialidad (administrador)")
    public Especialidad actualizar(@PathVariable Long id, @Valid @RequestBody Especialidad datos) {
        Especialidad especialidad = repositorio.findById(id)
                .orElseThrow(() -> ApiException.noEncontrado("No encontramos la especialidad solicitada."));
        especialidad.setNombre(datos.getNombre());
        especialidad.setSlug(datos.getSlug());
        especialidad.setDescripcion(datos.getDescripcion());
        especialidad.setIcono(datos.getIcono());
        if (datos.getActiva() != null) especialidad.setActiva(datos.getActiva());
        return repositorio.save(especialidad);
    }
}
