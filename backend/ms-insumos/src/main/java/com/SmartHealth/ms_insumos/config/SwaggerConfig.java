package com.SmartHealth.ms_insumos.config;


import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
    servers = {
        @Server(url = "http://localhost:8080/ms-insumos", description = "Servidor Gateway (Correcto)")
    }
)
public class SwaggerConfig {
}