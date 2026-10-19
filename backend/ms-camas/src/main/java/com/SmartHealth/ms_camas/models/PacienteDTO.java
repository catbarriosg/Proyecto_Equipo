package com.SmartHealth.ms_camas.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para representar datos del paciente desde ms-pacientes.
 * Solo incluye los campos necesarios para validación en ms-camas.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class PacienteDTO {
    private Long id;
    private String nombreCompleto;
    private String rut;
    private String email;
    private Boolean activo;
}
