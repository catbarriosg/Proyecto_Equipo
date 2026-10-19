package com.SmartHealth.ms_camas.config;

import feign.Response;
import feign.codec.ErrorDecoder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuración para Feign clients.
 * Incluye ErrorDecoder personalizado para manejar respuestas de error HTTP.
 * Timeouts configurados vía application.properties.
 */
@Configuration
public class FeignConfig {

    /**
     * ErrorDecoder personalizado que convierte respuestas HTTP de error en excepciones.
     * Esto asegura que cuando ms-pacientes retorna 404, Feign lance una excepción
     * en lugar de retornar null o fallar silenciosamente.
     */
    @Bean
    public ErrorDecoder errorDecoder() {
        return (methodKey, response) -> {
            if (response.status() == 404) {
                String errorMessage = String.format(
                    "Recurso no encontrado [%s]. Status: %d",
                    methodKey,
                    response.status()
                );
                return new RuntimeException(errorMessage);
            }
            if (response.status() >= 400 && response.status() < 500) {
                String errorMessage = String.format(
                    "Error cliente [%s]. Status: %d",
                    methodKey,
                    response.status()
                );
                return new RuntimeException(errorMessage);
            }
            if (response.status() >= 500) {
                String errorMessage = String.format(
                    "Error servidor [%s]. Status: %d",
                    methodKey,
                    response.status()
                );
                return new RuntimeException(errorMessage);
            }
            return new RuntimeException("Error desconocido [" + methodKey + "]");
        };
    }
}
