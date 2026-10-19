package com.SmartHealth.ms_auth.clients;

import com.SmartHealth.ms_auth.dtos.PacienteDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "ms-pacientes")
public interface PacienteClient {

    @PostMapping("/api/pacientes")
    PacienteDTO crear(@RequestBody PacienteDTO paciente);

    @GetMapping("/api/pacientes/rut/{rut}")
    PacienteDTO buscarPorRut(@PathVariable("rut") String rut);
}
