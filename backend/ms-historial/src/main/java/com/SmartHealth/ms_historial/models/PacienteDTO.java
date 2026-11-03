package com.SmartHealth.ms_historial.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Datos del paciente que devuelve ms-pacientes (se usa para validar que exista y esté activo). */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PacienteDTO {
    private Long id;
    private String rut;
    private String nombreCompleto;
    private String correo;
    private String telefono;
    private Boolean activo;
}
