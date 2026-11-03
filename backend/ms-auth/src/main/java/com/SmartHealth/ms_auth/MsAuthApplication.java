package com.SmartHealth.ms_auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * Microservicio de autenticación de la clínica.
 * Administra las cuentas (paciente, médico, administrador), cifra las contraseñas con BCrypt y emite los
 * tokens JWT que luego valida el gateway. @EnableFeignClients permite llamar a ms-pacientes al registrar pacientes.
 */
@SpringBootApplication
@EnableFeignClients
public class MsAuthApplication {

    public static void main(String[] args) {
        SpringApplication.run(MsAuthApplication.class, args);
    }
}
