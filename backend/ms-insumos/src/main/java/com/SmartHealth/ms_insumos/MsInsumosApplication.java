package com.SmartHealth.ms_insumos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * Microservicio de insumos (servicio interno, sin vista en el frontend de la clínica).
 * Lleva el inventario de insumos médicos de cada sede.
 */
@SpringBootApplication
@EnableFeignClients
public class MsInsumosApplication {

	public static void main(String[] args) {
		SpringApplication.run(MsInsumosApplication.class, args);
	}

}
