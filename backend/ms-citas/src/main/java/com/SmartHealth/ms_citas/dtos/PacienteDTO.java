package com.SmartHealth.ms_citas.dtos;

import lombok.Data;

/** Datos del paciente que entrega ms-pacientes. */
@Data
public class PacienteDTO {
    private Long id;
    private String rut;
    private String nombreCompleto;
    private String correo;
    private Boolean activo;
}
