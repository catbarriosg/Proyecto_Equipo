package com.SmartHealth.ms_triaje.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para recibir información de pacientes desde ms-pacientes.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PacienteDTO {
    private Long id;
    private String rut;
    private String nombreCompleto;
    private String correo;
    private Boolean activo;
}
