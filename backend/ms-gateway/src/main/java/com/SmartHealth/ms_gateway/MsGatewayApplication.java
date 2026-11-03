package com.SmartHealth.ms_gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * Puerta de entrada única del backend (puerto 8080).
 * Recibe todas las peticiones /api/** del frontend, valida el JWT y las enruta al microservicio
 * correspondiente usando los nombres registrados en Eureka (rutas definidas en application.yml).
 */
@SpringBootApplication
@EnableDiscoveryClient
public class MsGatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(MsGatewayApplication.class, args);
    }
}