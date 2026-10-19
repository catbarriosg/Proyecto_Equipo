package com.SmartHealth.ms_citas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class MsCitasApplication {

    public static void main(String[] args) {
        SpringApplication.run(MsCitasApplication.class, args);
    }
}
