package com.SmartHealth.ms_insumos.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Datos de la sede que devuelve ms-hospitales; el campo "direccion" se recibe como "ubicacion". */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HospitalDTO {
    
    private Long id;
    
    private String nombre;
    
    @JsonProperty("direccion")
    private String ubicacion;
    
    private String telefono;
    private Boolean activo;
}
