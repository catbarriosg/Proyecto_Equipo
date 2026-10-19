package com.SmartHealth.ms_historial.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

/** Registro de una atención médica del paciente. */
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

    // Indicaciones o tratamiento entregado al paciente
    @Column(length = 1000)
    private String tratamiento;

    @NotNull(message = "El id del paciente es obligatorio")
    private Long idPaciente;

    // Fecha de la atención
    private LocalDate fecha;

    @Column(length = 300)
    private String motivo;

    @Column(length = 100)
    private String especialidad;

    private Long idMedico;

    @Column(length = 120)
    private String medicoNombre;

    // Cita de ms-citas que originó esta atención (opcional)
    private Long idCita;
}
