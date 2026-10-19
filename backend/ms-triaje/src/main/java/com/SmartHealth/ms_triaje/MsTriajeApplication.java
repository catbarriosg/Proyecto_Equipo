package com.SmartHealth.ms_triaje;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class MsTriajeApplication {

	public static void main(String[] args) {
		SpringApplication.run(MsTriajeApplication.class, args);
	}

}
