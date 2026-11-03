package com.SmartHealth.ms_camas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * Microservicio de camas (servicio interno, sin vista en el frontend de la clínica).
 * Administra las camas de cada sede y su ocupación; valida sedes y pacientes con Feign.
 */
@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class MsCamasApplication {
    public static void main(String[] args) {
        SpringApplication.run(MsCamasApplication.class, args);
    }
}
