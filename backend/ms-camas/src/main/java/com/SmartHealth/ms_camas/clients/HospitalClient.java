package com.SmartHealth.ms_camas.clients;

import com.SmartHealth.ms_camas.config.FeignConfig;
import com.SmartHealth.ms_camas.models.HospitalDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * FeignClient para comunicarse con ms-hospitales a través de Eureka.
 */
@FeignClient(name = "ms-hospitales", configuration = FeignConfig.class)
public interface HospitalClient {

    @GetMapping("/api/hospitales/{id}")
    HospitalDTO obtenerHospitalPorId(@PathVariable("id") Long id);
}
