package com.SmartHealth.ms_pacientes;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class MsPacientesApplication {

	public static void main(String[] args) {
		SpringApplication.run(MsPacientesApplication.class, args);
	}

}
