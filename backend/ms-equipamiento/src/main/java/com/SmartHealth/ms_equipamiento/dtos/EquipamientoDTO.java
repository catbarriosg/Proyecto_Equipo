package com.SmartHealth.ms_equipamiento.dtos;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import io.swagger.v3.oas.annotations.media.Schema;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(
    name = "EquipamientoDTO",
    description = "Data Transfer Object para gestión de equipamiento médico"
)
public class EquipamientoDTO {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @Schema(description = "Identificador único del equipamiento", example = "1")
    private Long id;

    @NotBlank(message = "El número de serie no puede estar vacío")
    @Schema(description = "Número de serie único del equipo", example = "SN-2025-001")
    private String numeroSerie;

    @NotBlank(message = "El nombre del equipo es obligatorio")
    @Schema(description = "Nombre descriptivo del equipamiento", example = "Monitor cardíaco")
    private String nombre;

    @NotBlank(message = "Debes especificar la marca o modelo")
    @Schema(description = "Marca y modelo del equipamiento", example = "Philips IntelliVue")
    private String marca;

    @NotBlank(message = "El estado actual es obligatorio")
    @Schema(description = "Estado actual del equipo (OPERATIVO, MANTENCION, FUERA_SERVICIO)", example = "OPERATIVO")
    private String estado;

    @Schema(description = "Identificador del hospital donde está ubicado", example = "1")
    private Long hospitalUbicacionId;

    @Schema(description = "Indica si el equipamiento está activo", example = "true")
    private Boolean activo;
}
