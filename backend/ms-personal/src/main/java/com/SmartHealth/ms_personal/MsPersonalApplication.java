package com.SmartHealth.ms_personal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * Microservicio de personal: profesionales de la clínica (médicos y otros funcionarios) y el catálogo
 * de especialidades. Expone además la vista pública de médicos (/api/medicos) que usan el frontend y ms-citas.
 */
@SpringBootApplication
@EnableFeignClients
public class MsPersonalApplication {

	public static void main(String[] args) {
		SpringApplication.run(MsPersonalApplication.class, args);
	}

}
