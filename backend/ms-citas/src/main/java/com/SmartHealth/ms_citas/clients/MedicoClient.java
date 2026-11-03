package com.SmartHealth.ms_citas.clients;

import com.SmartHealth.ms_citas.dtos.MedicoDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/** Cliente Feign hacia ms-personal: obtiene los datos del médico antes de reservar o consultar su agenda. */
@FeignClient(name = "ms-personal")
public interface MedicoClient {

    @GetMapping("/api/medicos/{id}")
    MedicoDTO obtenerPorId(@PathVariable("id") Long id);
}
