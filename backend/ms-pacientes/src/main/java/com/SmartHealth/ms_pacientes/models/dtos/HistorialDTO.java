package com.SmartHealth.ms_pacientes.models.dtos;

import lombok.Data;

@Data
public class HistorialDTO {
    private Long id;
    private Long idPaciente;
    private String diagnostico;
    private String tratamiento;
}
