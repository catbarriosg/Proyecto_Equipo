package com.SmartHealth.ms_citas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * Microservicio de citas: la agenda de horas médicas de la clínica.
 * Calcula la disponibilidad, reserva, reprograma y cancela horas. Consulta a ms-personal (médicos)
 * y a ms-pacientes (fichas) mediante clientes Feign.
 */
@SpringBootApplication
@EnableFeignClients
public class MsCitasApplication {

    public static void main(String[] args) {
        SpringApplication.run(MsCitasApplication.class, args);
    }
}
