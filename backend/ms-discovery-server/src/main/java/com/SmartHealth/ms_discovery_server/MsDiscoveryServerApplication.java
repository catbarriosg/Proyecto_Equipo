package com.SmartHealth.ms_discovery_server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class MsDiscoveryServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(MsDiscoveryServerApplication.class, args);
	}

}
