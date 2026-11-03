package com.SmartHealth.ms_camas.clients;

import com.SmartHealth.ms_camas.config.FeignConfig;
import com.SmartHealth.ms_camas.dtos.PacienteDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * FeignClient para comunicarse con ms-pacientes a través de Eureka.
 * Utilizado para validar que los RUTs asignados a camas corresponden a pacientes reales.
 */
@FeignClient(name = "ms-pacientes", configuration = FeignConfig.class)
public interface PacienteClient {

    /** Busca un paciente por RUT (al asignar una cama ocupada). */
    @GetMapping("/api/pacientes/{rut}")
    PacienteDTO obtenerPacientePorRut(@PathVariable("rut") String rut);

    /** Busca un paciente por su ID. */
    @GetMapping("/api/pacientes/id/{id}")
    PacienteDTO obtenerPacientePorId(@PathVariable("id") Long id);
}
