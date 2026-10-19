package com.SmartHealth.ms_triaje.clients;

import com.SmartHealth.ms_triaje.config.FeignConfig;
import com.SmartHealth.ms_triaje.models.PersonalSaludDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * FeignClient para validar profesionales de salud en ms-triaje.
 * Se comunica con ms-personal para verificar que el personalId existe y está activo.
 */
@FeignClient(name = "ms-personal", configuration = FeignConfig.class)
public interface PersonalClient {

    @GetMapping("/api/personal/{id}")
    PersonalSaludDTO obtenerPersonalPorId(@PathVariable("id") Long id);
}
