package com.SmartHealth.ms_camas.dtos;

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
    name = "CamaDTO",
    description = "Data Transfer Object para gestión de camas hospitalarias"
)
public class CamaDTO {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @Schema(description = "Identificador único de la cama", example = "1")
    private Long id;

    @NotBlank(message = "El código de cama es obligatorio")
    @Pattern(regexp = "^[A-Z0-9\\-]{3,20}$", message = "El código debe ser alfanumérico en mayúsculas")
    @Schema(description = "Código único de la cama", example = "UCI-001")
    private String codigo;

    @NotBlank(message = "El tipo de cama es obligatorio")
    @Pattern(regexp = "^(BASICA|UCI|UTI|PEDIATRICA|MATERNIDAD|URGENCIA)$",
            message = "El tipo debe ser: BASICA, UCI, UTI, PEDIATRICA, MATERNIDAD o URGENCIA")
    @Schema(description = "Tipo de cama hospitalaria", example = "UCI")
    private String tipo;

    @NotBlank(message = "El estado de la cama es obligatorio")
    @Pattern(regexp = "^(DISPONIBLE|OCUPADA|MANTENCION|RESERVADA)$",
            message = "El estado debe ser: DISPONIBLE, OCUPADA, MANTENCION o RESERVADA")
    @Schema(description = "Estado actual de la cama", example = "DISPONIBLE")
    private String estado;

    @Size(max = 50, message = "El sector no puede superar 50 caracteres")
    @Schema(description = "Sector o piso donde está ubicada la cama", example = "Piso 3")
    private String sector;

    @NotNull(message = "El ID del hospital es obligatorio")
    @Min(value = 1, message = "El ID del hospital debe ser mayor a 0")
    @Schema(description = "Identificador del hospital al que pertenece la cama", example = "1")
    private Long hospitalId;

    @Schema(description = "RUT del paciente actualmente en la cama", example = "12345678-9")
    private String rutPacienteActual;

    @Schema(description = "Fecha y hora de creación del registro", example = "2025-01-15T10:30:00")
    private LocalDateTime creadoEn;

    @Schema(description = "Fecha y hora de la última actualización", example = "2025-01-15T14:30:00")
    private LocalDateTime actualizadoEn;

    @Schema(description = "Indica si la cama está activa en el sistema", example = "true")
    private Boolean activa;
}
