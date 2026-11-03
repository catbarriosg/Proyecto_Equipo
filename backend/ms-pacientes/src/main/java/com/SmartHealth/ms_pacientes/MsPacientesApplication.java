package com.SmartHealth.ms_pacientes;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * Microservicio de pacientes: guarda las fichas de los pacientes de la clínica (RUT, datos de contacto,
 * previsión). Lo usan el frontend, ms-auth (registro), ms-citas y ms-historial.
 */
@SpringBootApplication
@EnableFeignClients
public class MsPacientesApplication {

	public static void main(String[] args) {
		SpringApplication.run(MsPacientesApplication.class, args);
	}

}
