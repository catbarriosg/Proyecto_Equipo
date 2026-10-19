package com.SmartHealth.ms_personal.dtos;

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
    name = "PersonalDTO",
    description = "Data Transfer Object para gestión de personal hospitalario"
)
public class PersonalDTO {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @Schema(description = "Identificador único del personal", example = "1")
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres")
    @Schema(description = "Nombre completo del personal hospitalario", example = "Dr. Juan Pérez")
    private String nombre;

    @NotBlank(message = "El RUT es obligatorio")
    @Pattern(regexp = "^[0-9]+-[0-9kK]{1}$", message = "El RUT debe tener un formato válido")
    @Schema(description = "RUT del personal en formato XX.XXX.XXX-X", example = "12345678-9")
    private String rut;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "Debe ser un formato de correo válido")
    @Schema(description = "Correo electrónico del personal", example = "juan.perez@hospital.cl")
    private String email;

    @NotBlank(message = "El teléfono es obligatorio")
    @Pattern(regexp = "^[+]?[0-9]{8,15}$", message = "El teléfono debe tener un formato válido")
    @Schema(description = "Teléfono de contacto del personal", example = "+56991234567")
    private String telefono;

    @NotBlank(message = "El rol es obligatorio")
    @Pattern(regexp = "^(MEDICO|ENFERMERO|ADMINISTRATIVO|TECNICO|OTRO)$",
            message = "El rol debe ser: MEDICO, ENFERMERO, ADMINISTRATIVO, TECNICO u OTRO")
    @Schema(description = "Rol del personal en el hospital", example = "MEDICO")
    private String rol;

    @Size(max = 100, message = "La especialidad no puede exceder 100 caracteres")
    @Schema(description = "Especialidad médica si aplica", example = "Cardiología")
    private String especialidad;

    @Size(max = 50, message = "El número de colegiatura no puede exceder 50 caracteres")
    @Schema(description = "Número de colegiatura profesional", example = "Colegio-12345")
    private String numeroColegiatura;

    @NotBlank(message = "El departamento es obligatorio")
    @Size(max = 100, message = "El departamento no puede exceder 100 caracteres")
    @Schema(description = "Departamento donde trabaja", example = "Urgencias")
    private String departamento;

    @NotNull(message = "El ID del hospital es obligatorio")
    @Min(value = 1, message = "El ID del hospital debe ser mayor a 0")
    @Schema(description = "Identificador del hospital donde trabaja", example = "1")
    private Long hospitalId;

    @Size(max = 500, message = "La descripción no puede exceder 500 caracteres")
    @Schema(description = "Presentación del profesional para la página de médicos")
    private String descripcion;

    @Size(max = 255, message = "La ruta de la imagen no puede exceder 255 caracteres")
    @Schema(description = "Ruta de la foto del profesional", example = "/logo-hombre.png")
    private String imagenUrl;

    @Schema(description = "Fecha y hora de ingreso del personal", example = "2020-01-15T10:30:00")
    private LocalDateTime fechaIngreso;

    @Schema(description = "Indica si el personal está activo", example = "true")
    private Boolean activo;
}
