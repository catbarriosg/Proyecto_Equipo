package com.SmartHealth.ms_triaje.clients;

import com.SmartHealth.ms_triaje.config.FeignConfig;
import com.SmartHealth.ms_triaje.dtos.PacienteDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * FeignClient para validar pacientes en ms-triaje.
 */
@FeignClient(name = "ms-pacientes", configuration = FeignConfig.class)
public interface PacienteClient {

    /** Busca un paciente por RUT para validar que exista y esté activo. */
    @GetMapping("/api/pacientes/{rut}")
    PacienteDTO obtenerPacientePorRut(@PathVariable("rut") String rut);
}
