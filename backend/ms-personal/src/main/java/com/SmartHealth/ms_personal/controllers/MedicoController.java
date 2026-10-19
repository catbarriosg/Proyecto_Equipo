package com.SmartHealth.ms_personal.controllers;

import com.SmartHealth.ms_personal.dtos.MedicoDTO;
import com.SmartHealth.ms_personal.exceptions.ApiException;
import com.SmartHealth.ms_personal.models.Especialidad;
import com.SmartHealth.ms_personal.models.Personal;
import com.SmartHealth.ms_personal.repositories.EspecialidadRepository;
import com.SmartHealth.ms_personal.repositories.PersonalRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Vista pública de los médicos de la clínica (página "Nuestros médicos" y selector al agendar).
 */
@RestController
@RequestMapping("/api/medicos")
@Tag(name = "Médicos", description = "Médicos de la clínica (información pública)")
public class MedicoController {

    private static final String ROL_MEDICO = "MEDICO";

    private final PersonalRepository personalRepository;
    private final EspecialidadRepository especialidadRepository;

    public MedicoController(PersonalRepository personalRepository, EspecialidadRepository especialidadRepository) {
        this.personalRepository = personalRepository;
        this.especialidadRepository = especialidadRepository;
    }

    @GetMapping
    @Operation(summary = "Listar médicos activos, opcionalmente por especialidad (nombre o identificador) y sucursal")
    public List<MedicoDTO> listar(@RequestParam(required = false) String especialidad,
                                  @RequestParam(required = false) Long sucursalId) {
        String nombreEspecialidad = especialidad == null || especialidad.isBlank()
                ? null
                : resolverEspecialidad(especialidad);
        Map<String, String> slugs = slugsPorNombre();

        return personalRepository.findByRolAndActivoTrue(ROL_MEDICO).stream()
                .filter(medico -> nombreEspecialidad == null || nombreEspecialidad.equalsIgnoreCase(medico.getEspecialidad()))
                .filter(medico -> sucursalId == null || sucursalId.equals(medico.getHospitalId()))
                .sorted(Comparator.comparing(Personal::getNombre))
                .map(medico -> aDTO(medico, slugs))
                .toList();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener un médico activo por ID")
    public MedicoDTO obtener(@PathVariable Long id) {
        Personal medico = personalRepository.findByIdAndActivoTrue(id)
                .filter(encontrado -> ROL_MEDICO.equals(encontrado.getRol()))
                .orElseThrow(() -> ApiException.noEncontrado("No encontramos al médico solicitado."));
        return aDTO(medico, slugsPorNombre());
    }

    /** Acepta "medicina-general" o "Medicina General" y devuelve el nombre registrado. */
    private String resolverEspecialidad(String valor) {
        return especialidadRepository.findBySlug(valor.trim().toLowerCase())
                .or(() -> especialidadRepository.findByNombreIgnoreCase(valor.trim()))
                .map(Especialidad::getNombre)
                .orElse(valor.trim());
    }

    private Map<String, String> slugsPorNombre() {
        return especialidadRepository.findAll().stream()
                .collect(Collectors.toMap(e -> e.getNombre().toLowerCase(), Especialidad::getSlug, (a, b) -> a));
    }

    private static MedicoDTO aDTO(Personal medico, Map<String, String> slugs) {
        String especialidad = medico.getEspecialidad();
        String slug = especialidad == null ? null : slugs.get(especialidad.toLowerCase());
        return new MedicoDTO(medico.getId(), medico.getNombre(), especialidad, slug, medico.getDescripcion(),
                medico.getImagenUrl(), medico.getHospitalId(), medico.getActivo());
    }
}
