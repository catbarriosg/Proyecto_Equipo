package com.SmartHealth.ms_triaje.config;

import org.springframework.context.annotation.Configuration;


/**
 * Configuración de los clientes Feign (llamadas HTTP a otros microservicios).
 * Este servicio no define tiempos de espera propios: usa los valores por defecto de OpenFeign.
 */
@Configuration
public class FeignConfig {
    // Configuración manejada por propiedades en application.properties
}
