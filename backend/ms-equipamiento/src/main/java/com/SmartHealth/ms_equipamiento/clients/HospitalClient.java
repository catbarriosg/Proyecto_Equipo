package com.SmartHealth.ms_equipamiento.clients;

import com.SmartHealth.ms_equipamiento.config.FeignConfig;
import com.SmartHealth.ms_equipamiento.models.HospitalDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/** Cliente Feign hacia ms-hospitales: valida la sede donde se ubica un equipo. */
@FeignClient(name = "ms-hospitales", configuration = FeignConfig.class)
public interface HospitalClient {
    
    @GetMapping("/api/hospitales/{id}")
    HospitalDTO findById(@PathVariable("id") Long id);
}
