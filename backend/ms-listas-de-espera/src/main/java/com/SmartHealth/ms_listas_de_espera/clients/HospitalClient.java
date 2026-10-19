package com.SmartHealth.ms_listas_de_espera.clients;

import com.SmartHealth.ms_listas_de_espera.config.FeignConfig;
import com.SmartHealth.ms_listas_de_espera.models.HospitalDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "ms-hospitales", configuration = FeignConfig.class)
public interface HospitalClient {
    
    @GetMapping("/api/hospitales/{id}")
    HospitalDTO findById(@PathVariable("id") Long id);
}
