package com.SmartHealth.ms_historial.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import io.swagger.v3.oas.annotations.media.Schema;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(
    name = "HistorialDTO",
    description = "Data Transfer Object para gestión de historiales clínicos"
)
public class HistorialDTO {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @Schema(description = "Identificador único del historial clínico", example = "1")
    private Long id;

    @NotBlank(message = "El diagnóstico es obligatorio")
    @Size(min = 3, max = 500, message = "El diagnóstico debe tener entre 3 y 500 caracteres")
    @Schema(description = "Diagnóstico clínico del paciente", example = "Hipertensión arterial estadio 2")
    private String diagnostico;

    @Size(max = 1000, message = "El tratamiento no puede superar 1000 caracteres")
    @Schema(description = "Plan de tratamiento recomendado", example = "Medicación antihipertensiva, cambios en estilo de vida")
    private String tratamiento;

    @NotNull(message = "El ID del paciente es obligatorio")
    @Schema(description = "Identificador del paciente asociado al historial", example = "1")
    private Long idPaciente;

    // Constructor adicional para creación
    public HistorialDTO(String diagnostico, String tratamiento, Long idPaciente) {
        this.diagnostico = diagnostico;
        this.tratamiento = tratamiento;
        this.idPaciente = idPaciente;
    }
}
