package com.SmartHealth.ms_hospitales.dtos;

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
    name = "HospitalDTO",
    description = "Data Transfer Object para gestión de hospitales"
)
public class HospitalDTO {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @Schema(description = "Identificador único del hospital", example = "1")
    private Long id;

    @NotBlank(message = "El nombre del hospital es obligatorio")
    @Size(min = 3, max = 150, message = "El nombre debe tener entre 3 y 150 caracteres")
    @Schema(description = "Nombre del hospital", example = "Hospital Regional de Santiago")
    private String nombre;

    @NotBlank(message = "La dirección es obligatoria")
    @Size(min = 5, max = 200, message = "La dirección debe tener entre 5 y 200 caracteres")
    @Schema(description = "Dirección física del hospital", example = "Av. Libertador Bernardo O'Higgins 250")
    private String direccion;

    @NotBlank(message = "La región es obligatoria")
    @Schema(description = "Región donde se ubica el hospital", example = "Metropolitana de Santiago")
    private String region;

    @NotBlank(message = "La comuna es obligatoria")
    @Schema(description = "Comuna donde se ubica el hospital", example = "Santiago Centro")
    private String comuna;

    @NotBlank(message = "El teléfono es obligatorio")
    @Pattern(regexp = "^[+]?[0-9]{8,15}$", message = "El teléfono debe tener un formato válido")
    @Schema(description = "Teléfono de contacto del hospital", example = "+56227891234")
    private String telefono;

    @NotBlank(message = "El correo institucional es obligatorio")
    @Email(message = "Debe ser un formato de correo válido")
    @Schema(description = "Correo electrónico institucional", example = "contacto@hospital.cl")
    private String correoInstitucional;

    @NotBlank(message = "El nivel de complejidad es obligatorio")
    @Pattern(regexp = "^(BAJA|MEDIANA|ALTA)$", message = "La complejidad debe ser: BAJA, MEDIANA o ALTA")
    @Schema(description = "Nivel de complejidad del hospital", example = "ALTA")
    private String nivelComplejidad;

    @Min(value = 0, message = "La capacidad total de camas no puede ser negativa")
    @Schema(description = "Capacidad total de camas del hospital", example = "500")
    private int capacidadTotalCamas;

    @Size(max = 500, message = "El horario no puede superar 500 caracteres")
    @Schema(description = "Horario de atención, una línea por tramo", example = "Lunes a viernes: 08:00 a 20:00")
    private String horario;

    @Size(max = 255, message = "La ruta de la imagen no puede superar 255 caracteres")
    @Schema(description = "Ruta de la imagen de la sucursal", example = "/fachada-clinica.png")
    private String imagenUrl;

    @Size(max = 150, message = "La descripción de la imagen no puede superar 150 caracteres")
    @Schema(description = "Texto alternativo de la imagen", example = "Fachada de la sucursal Santiago Centro")
    private String descripcionImagen;

    @Schema(description = "Fecha y hora de creación del registro", example = "2025-01-15T10:30:00")
    private LocalDateTime creadoEn;

    @Schema(description = "Indica si el hospital está activo en el sistema", example = "true")
    private Boolean activo;
}
