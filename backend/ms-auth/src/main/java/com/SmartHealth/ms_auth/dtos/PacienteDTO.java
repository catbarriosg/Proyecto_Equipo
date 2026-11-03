package com.SmartHealth.ms_auth.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/** Paciente tal como lo recibe y devuelve ms-pacientes. */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PacienteDTO {
    // Lombok (@Data) genera getters, setters, equals, hashCode y toString
    private Long id;
    private String rut;
    private String nombreCompleto;
    private String correo;
    private LocalDate fechaNacimiento;
    private String prevision;
    private String telefono;
    private Boolean activo;
}
