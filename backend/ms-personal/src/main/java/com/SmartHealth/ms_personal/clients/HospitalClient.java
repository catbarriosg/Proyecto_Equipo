package com.SmartHealth.ms_personal.clients;

import com.SmartHealth.ms_personal.config.FeignConfig;
import com.SmartHealth.ms_personal.models.HospitalDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * FeignClient para validar hospitales en ms-personal.
 */
@FeignClient(name = "ms-hospitales", configuration = FeignConfig.class)
public interface HospitalClient {

    @GetMapping("/api/hospitales/{id}")
    HospitalDTO obtenerHospitalPorId(@PathVariable("id") Long id);
}
