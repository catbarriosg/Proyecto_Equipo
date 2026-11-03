package com.SmartHealth.ms_discovery_server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

/**
 * Servidor de descubrimiento Eureka (puerto 8761).
 * Cada microservicio se registra aquí con su nombre (ms-citas, ms-pacientes...), y el gateway y los
 * clientes Feign lo consultan para saber en qué dirección está cada servicio, sin escribir IPs fijas.
 */
@SpringBootApplication
@EnableEurekaServer
public class MsDiscoveryServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(MsDiscoveryServerApplication.class, args);
	}

}
