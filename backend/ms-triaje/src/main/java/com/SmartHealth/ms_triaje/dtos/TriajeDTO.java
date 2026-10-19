package com.SmartHealth.ms_triaje.dtos;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import io.swagger.v3.oas.annotations.media.Schema;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(
    name = "TriajeDTO",
    description = "Data Transfer Object para evaluación de triaje de pacientes"
)
public class TriajeDTO {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @Schema(description = "Identificador único del registro de triaje", example = "1")
    private Long id;

    @NotBlank(message = "El RUT del paciente es obligatorio")
    @Schema(description = "RUT del paciente en formato XX.XXX.XXX-X", example = "12345678-9")
    private String rutPaciente;

    @NotNull(message = "El ID del personal es obligatorio")
    @Min(value = 1, message = "El ID del personal debe ser válido")
    @Schema(description = "ID del personal que realiza el triaje", example = "1")
    private Long personalId;

    @Schema(description = "Fecha y hora de la evaluación de triaje", example = "2025-01-15T10:30:00")
    private LocalDateTime fechaEvaluacion;

    @NotBlank(message = "La presión arterial es obligatoria")
    @Schema(description = "Presión arterial del paciente", example = "120/80")
    private String presionArterial;

    @NotNull(message = "La temperatura es obligatoria")
    @DecimalMin(value = "30.0", message = "Temperatura anormalmente baja")
    @DecimalMax(value = "45.0", message = "Temperatura anormalmente alta")
    @Schema(description = "Temperatura corporal en grados Celsius", example = "37.5")
    private Double temperatura;

    @NotNull(message = "La frecuencia cardíaca es obligatoria")
    @Schema(description = "Frecuencia cardíaca en latidos por minuto", example = "72")
    private Integer frecuenciaCardiaca;

    @NotNull(message = "La saturación de oxígeno es obligatoria")
    @Min(value = 0, message = "La saturación no puede ser menor a 0")
    @Max(value = 100, message = "La saturación no puede ser mayor a 100")
    @Schema(description = "Saturación de oxígeno en porcentaje", example = "98")
    private Integer saturacionOxigeno;

    @NotBlank(message = "Debe describir los síntomas del paciente")
    @Size(max = 500, message = "Los síntomas no pueden exceder 500 caracteres")
    @Schema(description = "Descripción de los síntomas del paciente", example = "Dolor de cabeza, fiebre")
    private String sintomas;

    @NotBlank(message = "El nivel de urgencia es obligatorio")
    @Schema(description = "Nivel de urgencia de la evaluación", example = "URGENTE")
    private String nivelUrgencia;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @Schema(description = "Puntuación del triaje calculada automáticamente (0-15)", example = "8")
    private Integer puntuacionTriaje;
}
