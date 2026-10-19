package com.SmartHealth.ms_citas.clients;

import com.SmartHealth.ms_citas.dtos.MedicoDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "ms-personal")
public interface MedicoClient {

    @GetMapping("/api/medicos/{id}")
    MedicoDTO obtenerPorId(@PathVariable("id") Long id);
}
