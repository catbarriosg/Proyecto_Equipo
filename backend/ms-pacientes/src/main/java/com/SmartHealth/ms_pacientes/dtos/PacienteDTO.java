package com.SmartHealth.ms_pacientes.dtos;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import io.swagger.v3.oas.annotations.media.Schema;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(
    name = "PacienteDTO",
    description = "Data Transfer Object para gestión de pacientes en el sistema"
)
public class PacienteDTO {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @Schema(description = "Identificador único del paciente", example = "1")
    private Long id;

    @NotBlank(message = "El RUT es obligatorio")
    @Pattern(regexp = "^[0-9]+-[0-9kK]{1}$", message = "El RUT debe tener un formato válido")
    @Schema(description = "RUT del paciente en formato XX.XXX.XXX-X", example = "12345678-9")
    private String rut;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres")
    @Schema(description = "Nombre completo del paciente", example = "Juan Pérez García")
    private String nombreCompleto;

    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "Debe ser un formato de correo válido")
    @Schema(description = "Correo electrónico del paciente", example = "juan.perez@example.com")
    private String correo;

    @NotNull(message = "La fecha de nacimiento es obligatoria")
    @Past(message = "La fecha de nacimiento no puede ser en el futuro")
    @Schema(description = "Fecha de nacimiento del paciente", example = "1990-05-15")
    private LocalDate fechaNacimiento;

    /**
     * ID del historial clínico en ms-historial.
     * Puede ser null si el paciente aún no tiene historial.
     */
    @Schema(description = "Identificador del historial clínico del paciente", example = "1")
    private Long idHistorialClinico;

    @Schema(description = "Indica si el paciente está activo en el sistema", example = "true")
    private Boolean activo;
}
