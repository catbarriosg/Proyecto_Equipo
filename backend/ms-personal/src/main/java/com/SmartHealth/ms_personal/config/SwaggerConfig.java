package com.SmartHealth.ms_personal.config;


import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
    servers = {
        @Server(url = "http://localhost:8080/ms-personal", description = "Servidor Gateway (Correcto)")
    }
)
public class SwaggerConfig {
}