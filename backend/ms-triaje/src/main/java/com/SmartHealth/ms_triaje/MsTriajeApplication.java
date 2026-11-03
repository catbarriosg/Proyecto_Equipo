package com.SmartHealth.ms_triaje;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * Microservicio de triaje (servicio interno, sin vista en el frontend de la clínica).
 * Registra evaluaciones de urgencia y calcula automáticamente la puntuación y el nivel (AZUL a ROJO).
 */
@SpringBootApplication
@EnableFeignClients
public class MsTriajeApplication {

	public static void main(String[] args) {
		SpringApplication.run(MsTriajeApplication.class, args);
	}

}
