package com.SmartHealth.ms_historial.clients;

import com.SmartHealth.ms_historial.config.FeignConfig;
import com.SmartHealth.ms_historial.models.PacienteDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "ms-pacientes", configuration = FeignConfig.class)
public interface PacienteClient {
    
    @GetMapping("/api/pacientes/id/{id}")
    PacienteDTO findById(@PathVariable("id") Long id);
}
