package com.SmartHealth.ms_insumos.clients;

import com.SmartHealth.ms_insumos.config.FeignConfig;
import com.SmartHealth.ms_insumos.dtos.HospitalDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "ms-hospitales", configuration = FeignConfig.class)
public interface HospitalClient {
    
    @GetMapping("/api/hospitales/{id}")
    HospitalDTO obtenerPorId(@PathVariable Long id);
}
