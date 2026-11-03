package com.SmartHealth.ms_insumos.config;


import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

/**
 * Documentación OpenAPI/Swagger del servicio. Se indica el gateway como servidor para que las pruebas
 * desde Swagger UI (http://localhost:8080/swagger-ui.html) pasen por él, igual que el frontend.
 */
@Configuration
@OpenAPIDefinition(
    servers = {
        @Server(url = "http://localhost:8080", description = "Gateway")
    }
)
public class SwaggerConfig {
}