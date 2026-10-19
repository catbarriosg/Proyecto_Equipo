package com.SmartHealth.ms_insumos.dtos;

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
    name = "InsumoDTO",
    description = "Data Transfer Object para gestión de insumos y inventario"
)
public class InsumoDTO {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @Schema(description = "Identificador único del insumo", example = "1")
    private Long id;

    @NotBlank(message = "El código del insumo no puede estar vacío")
    @Schema(description = "Código único del insumo", example = "INS-001")
    private String codigo;

    @NotBlank(message = "El nombre del insumo es obligatorio")
    @Schema(description = "Nombre descriptivo del insumo", example = "Guantes de nitrilo azules")
    private String nombre;

    @NotBlank(message = "Debes especificar el tipo de insumo")
    @Schema(description = "Tipo o categoría del insumo", example = "Equipamiento de protección")
    private String tipo;

    @NotNull(message = "El stock inicial no puede ser nulo")
    @Min(value = 0, message = "El stock no puede ser negativo")
    @Schema(description = "Cantidad actual en inventario", example = "500")
    private Integer stock;

    @Schema(description = "Indica si el insumo está activo en el inventario", example = "true")
    private Boolean activo;
}
