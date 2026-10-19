package com.SmartHealth.ms_historial.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(
    name = "HistorialDTO",
    description = "Data Transfer Object para gestión de historiales clínicos"
)
public class HistorialDTO {

    @Schema(description = "Identificador único del historial clínico", example = "1", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;

    @NotBlank(message = "El diagnóstico es obligatorio")
    @Size(min = 3, max = 500, message = "El diagnóstico debe tener entre 3 y 500 caracteres")
    @Schema(description = "Diagnóstico clínico del paciente", example = "Hipertensión arterial estadio 2")
    private String diagnostico;

    @Size(max = 1000, message = "El tratamiento no puede superar 1000 caracteres")
    @Schema(description = "Indicaciones o tratamiento recomendado", example = "Medicación antihipertensiva, cambios en estilo de vida")
    private String tratamiento;

    @NotNull(message = "El ID del paciente es obligatorio")
    @Schema(description = "Identificador del paciente asociado al historial", example = "1")
    private Long idPaciente;

    @PastOrPresent(message = "La fecha de la atención no puede ser futura")
    @Schema(description = "Fecha de la atención (si no se indica, se usa la fecha de hoy)", example = "2026-08-15")
    private LocalDate fecha;

    @Size(max = 300, message = "El motivo no puede superar 300 caracteres")
    @Schema(description = "Motivo de la consulta", example = "Control médico general")
    private String motivo;

    @Size(max = 100, message = "La especialidad no puede superar 100 caracteres")
    @Schema(description = "Especialidad de la atención", example = "Medicina General")
    private String especialidad;

    @Schema(description = "Identificador del médico (ms-personal)", example = "1")
    private Long idMedico;

    @Size(max = 120, message = "El nombre del médico no puede superar 120 caracteres")
    @Schema(description = "Nombre del médico que atendió", example = "Dr. Juan Pérez")
    private String medicoNombre;

    @Schema(description = "Cita que originó la atención (ms-citas)", example = "12")
    private Long idCita;
}
