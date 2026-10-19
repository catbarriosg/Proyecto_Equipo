package com.SmartHealth.ms_pacientes.clients;

import com.SmartHealth.ms_pacientes.config.FeignConfig;
import com.SmartHealth.ms_pacientes.models.dtos.HistorialDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "ms-historial", configuration = FeignConfig.class)
public interface HistorialClient {
    
    @GetMapping("/api/historial/paciente/{idPaciente}")
    List<HistorialDTO> obtenerPorIdPaciente(@PathVariable Long idPaciente);
}
