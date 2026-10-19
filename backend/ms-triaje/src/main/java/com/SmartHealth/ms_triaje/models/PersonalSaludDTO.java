package com.SmartHealth.ms_triaje.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO que representa la respuesta de ms-personal cuando consultamos
 * un profesional de salud por ID. Solo mapeamos los campos que necesitamos.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PersonalSaludDTO {
    private Long id;
    private String rut;
    private String nombreCompleto;
    private String correo;
    private String telefono;
    private String especialidad;
    private String rol;
    private Boolean activo;
}
