package com.SmartHealth.ms_listas_de_espera.config;

import org.springframework.context.annotation.Configuration;

/**
 * Configuración de los clientes Feign (llamadas HTTP a otros microservicios).
 * Los tiempos de espera se definen en application.properties (feign.client.config.default.*).
 */
@Configuration
public class FeignConfig {
    // Configuración manejada por propiedades en application.properties
}
