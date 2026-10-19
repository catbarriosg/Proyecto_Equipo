package com.SmartHealth.ms_listas_de_espera;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class MsListasDeEsperaApplication {

	public static void main(String[] args) {
		SpringApplication.run(MsListasDeEsperaApplication.class, args);
	}

}
