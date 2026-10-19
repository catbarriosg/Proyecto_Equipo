package com.SmartHealth.ms_historial.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Entity
@Table(name = "historial_clinico")

public class HistorialClinico {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "El diagnóstico es obligatorio")
    @Size(min = 3, message = "El diagnóstico debe tener al menos 3 caracteres")
    private String diagnostico;

    private String tratamiento;

    @NotNull(message = "El id del paciente es obligatorio")
    private Long idPaciente;
}
