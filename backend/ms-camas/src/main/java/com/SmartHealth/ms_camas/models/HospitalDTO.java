package com.SmartHealth.ms_camas.models;

import lombok.Data;

/**
 * DTO que representa la respuesta de ms-hospitales cuando consultamos
 * un hospital por ID mediante el FeignClient. Solo mapeamos los campos
 * que necesitamos en este microservicio.
 */
@Data
public class HospitalDTO {
    private Long id;
    private String nombre;
    private String region;
    private String comuna;
    private String nivelComplejidad;
    private int capacidadTotalCamas;
    private Boolean activo;
}
