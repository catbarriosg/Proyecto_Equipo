package com.SmartHealth.ms_equipamiento;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class MsEquipamientoApplication {

	public static void main(String[] args) {
		SpringApplication.run(MsEquipamientoApplication.class, args);
	}

}
