package com.SmartHealth.ms_historial;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * Microservicio de historial clínico: registra las atenciones médicas de cada paciente
 * (diagnóstico, tratamiento, médico y especialidad). Valida los pacientes contra ms-pacientes.
 */
@SpringBootApplication
@EnableFeignClients
public class MsHistorialApplication {

	public static void main(String[] args) {
		SpringApplication.run(MsHistorialApplication.class, args);
	}

}
