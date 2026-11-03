package com.SmartHealth.ms_pacientes.models.dtos;

import lombok.Data;

/** Resumen del historial que devuelve ms-historial (solo se usan los campos necesarios). */
@Data
public class HistorialDTO {
    private Long id;
    private Long idPaciente;
    private String diagnostico;
    private String tratamiento;
}
