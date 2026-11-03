package com.SmartHealth.ms_listas_de_espera.clients;

import com.SmartHealth.ms_listas_de_espera.config.FeignConfig;
import com.SmartHealth.ms_listas_de_espera.dtos.HospitalDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/** Cliente Feign hacia ms-hospitales: valida la sede de la lista de espera. */
@FeignClient(name = "ms-hospitales", configuration = FeignConfig.class)
public interface HospitalClient {
    
    @GetMapping("/api/hospitales/{id}")
    HospitalDTO findById(@PathVariable("id") Long id);
}
