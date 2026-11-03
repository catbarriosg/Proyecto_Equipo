package com.SmartHealth.ms_equipamiento;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * Microservicio de equipamiento médico (servicio interno, sin vista en el frontend de la clínica).
 * Registra los equipos de cada sede, su estado y sus fechas de mantenimiento.
 */
@SpringBootApplication
@EnableFeignClients
public class MsEquipamientoApplication {

	public static void main(String[] args) {
		SpringApplication.run(MsEquipamientoApplication.class, args);
	}

}
