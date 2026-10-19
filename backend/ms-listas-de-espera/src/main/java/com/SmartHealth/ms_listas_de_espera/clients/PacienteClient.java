package com.SmartHealth.ms_listas_de_espera.clients;

import com.SmartHealth.ms_listas_de_espera.config.FeignConfig;
import com.SmartHealth.ms_listas_de_espera.models.PacienteDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "ms-pacientes", configuration = FeignConfig.class)
public interface PacienteClient {
    
    @GetMapping("/api/pacientes/id/{id}")
    PacienteDTO findById(@PathVariable("id") Long id);
}
