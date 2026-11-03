package com.SmartHealth.ms_hospitales;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * Microservicio de hospitales. En la clínica cada "hospital" representa una sucursal (sede):
 * se administra con /api/hospitales y se muestra al público con /api/sucursales.
 */
@SpringBootApplication
@EnableDiscoveryClient
public class MsHospitalesApplication {
    public static void main(String[] args) {
        SpringApplication.run(MsHospitalesApplication.class, args);
    }
}
