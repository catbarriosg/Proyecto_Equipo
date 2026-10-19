package com.SmartHealth.ms_listas_de_espera.dtos;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import io.swagger.v3.oas.annotations.media.Schema;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import com.SmartHealth.ms_listas_de_espera.models.Prioridad;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(
    name = "ListaEsperaDTO",
    description = "Data Transfer Object para gestión de listas de espera"
)
public class ListaEsperaDTO {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @Schema(description = "Identificador único del registro en lista de espera", example = "1")
    private Long id;

    @NotNull(message = "El ID del paciente es requerido")
    @Schema(description = "Identificador del paciente en lista de espera", example = "1")
    private Long idPaciente;

    @NotNull(message = "El ID del procedimiento es requerido")
    @Schema(description = "Identificador del procedimiento a realizar", example = "1")
    private Long idProcedimiento;

    @NotBlank(message = "El nombre del procedimiento es requerido")
    @Schema(description = "Nombre descriptivo del procedimiento", example = "Cirugía cardíaca")
    private String nombreProcedimiento;

    @NotNull(message = "El ID del hospital es requerido")
    @Schema(description = "Identificador del hospital donde se realizará el procedimiento", example = "1")
    private Long idHospital;

    @NotBlank(message = "El nombre del hospital es requerido")
    @Schema(description = "Nombre del hospital", example = "Hospital Regional de Santiago")
    private String nombreHospital;

    @NotNull(message = "La prioridad es requerida")
    @Schema(description = "Nivel de prioridad (BAJA, NORMAL, ALTA, URGENTE, CRITICA)", example = "ALTA")
    private Prioridad prioridad;

    @Schema(description = "Estado actual del registro en lista de espera", example = "En espera")
    private String estado;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @Schema(description = "Fecha y hora de ingreso a la lista de espera", example = "2025-01-15T10:30:00")
    private LocalDateTime fechaIngreso;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @Schema(description = "Fecha y hora programada para el procedimiento", example = "2025-02-15T10:30:00")
    private LocalDateTime fechaProgramada;

    @Size(max = 500, message = "Las notas no pueden exceder 500 caracteres")
    @Schema(description = "Notas adicionales sobre el caso", example = "Requiere evaluación preoperatoria")
    private String notas;

    @Schema(description = "Indica si el registro está activo", example = "true")
    private Boolean activo;
}
