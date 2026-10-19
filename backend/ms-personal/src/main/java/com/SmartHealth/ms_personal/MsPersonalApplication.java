package com.SmartHealth.ms_personal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class MsPersonalApplication {

	public static void main(String[] args) {
		SpringApplication.run(MsPersonalApplication.class, args);
	}

}
