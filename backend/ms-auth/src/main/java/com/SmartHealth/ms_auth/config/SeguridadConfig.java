package com.SmartHealth.ms_auth.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/** Configuración de seguridad del servicio. */
@Configuration
public class SeguridadConfig {

    /**
     * Cifrador de contraseñas BCrypt disponible para inyectar en otras clases.
     * BCrypt agrega una "sal" aleatoria, así dos contraseñas iguales producen hashes distintos.
     */
    @Bean
    public PasswordEncoder cifradorContrasenas() {
        return new BCryptPasswordEncoder();
    }
}
