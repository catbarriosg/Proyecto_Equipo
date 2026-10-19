package com.SmartHealth.ms_citas.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Clock;
import java.time.ZoneId;

@Configuration
@OpenAPIDefinition(
    info = @Info(title = "API de citas - Clínica Agenda Médica", version = "1.0"),
    servers = @Server(url = "http://localhost:8080", description = "Gateway"),
    security = @SecurityRequirement(name = "bearerAuth")
)
@SecurityScheme(name = "bearerAuth", type = SecuritySchemeType.HTTP, scheme = "bearer", bearerFormat = "JWT")
public class CitasConfig {

    /** Reloj con la zona horaria de la clínica, para que "hoy" no dependa de la zona del servidor. */
    @Bean
    public Clock reloj(@Value("${clinica.zona-horaria:America/Santiago}") String zona) {
        return Clock.system(ZoneId.of(zona));
    }
}
