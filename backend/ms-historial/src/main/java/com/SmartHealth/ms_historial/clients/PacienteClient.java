package com.SmartHealth.ms_historial.clients;

import com.SmartHealth.ms_historial.config.FeignConfig;
import com.SmartHealth.ms_historial.dtos.PacienteDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/** Cliente Feign hacia ms-pacientes: verifica que el paciente exista antes de registrar una atención. */
@FeignClient(name = "ms-pacientes", configuration = FeignConfig.class)
public interface PacienteClient {
    
    @GetMapping("/api/pacientes/id/{id}")
    PacienteDTO findById(@PathVariable("id") Long id);
}
