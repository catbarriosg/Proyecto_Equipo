package com.SmartHealth.ms_listas_de_espera;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * Microservicio de listas de espera (servicio interno, sin vista en el frontend de la clínica).
 * Registra pacientes en espera de un procedimiento en una sede, con prioridad y estado.
 */
@SpringBootApplication
@EnableFeignClients
public class MsListasDeEsperaApplication {

	public static void main(String[] args) {
		SpringApplication.run(MsListasDeEsperaApplication.class, args);
	}

}
