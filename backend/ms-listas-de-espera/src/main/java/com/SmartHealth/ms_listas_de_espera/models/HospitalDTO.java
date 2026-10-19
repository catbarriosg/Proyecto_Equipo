package com.SmartHealth.ms_listas_de_espera.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HospitalDTO {
    private Long id;
    private String nombre;
    private String direccion;
    private String region;
    private String telefono;
    private String correoInstitucional;
    private String nivelComplejidad;
    private Integer capacidadTotalCamas;
    private Boolean activo;
}
