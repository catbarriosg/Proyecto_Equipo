package com.SmartHealth.ms_citas.clients;

import com.SmartHealth.ms_citas.dtos.PacienteDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "ms-pacientes")
public interface PacienteClient {

    @GetMapping("/api/pacientes/id/{id}")
    PacienteDTO obtenerPorId(@PathVariable("id") Long id);

    @GetMapping("/api/pacientes/rut/{rut}")
    PacienteDTO obtenerPorRut(@PathVariable("rut") String rut);
}
