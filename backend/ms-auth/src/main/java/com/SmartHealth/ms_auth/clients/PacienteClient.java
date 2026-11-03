package com.SmartHealth.ms_auth.clients;

import com.SmartHealth.ms_auth.dtos.PacienteDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

/**
 * Cliente Feign hacia ms-pacientes. Spring genera la implementación: cada método es una llamada HTTP
 * al servicio registrado en Eureka con el nombre "ms-pacientes".
 */
@FeignClient(name = "ms-pacientes")
public interface PacienteClient {

    /** Crea la ficha del paciente durante el registro (responde 409 si el RUT ya existe). */
    @PostMapping("/api/pacientes")
    PacienteDTO crear(@RequestBody PacienteDTO paciente);

    /** Busca una ficha existente por RUT para vincularle la cuenta nueva. */
    @GetMapping("/api/pacientes/rut/{rut}")
    PacienteDTO buscarPorRut(@PathVariable("rut") String rut);
}
