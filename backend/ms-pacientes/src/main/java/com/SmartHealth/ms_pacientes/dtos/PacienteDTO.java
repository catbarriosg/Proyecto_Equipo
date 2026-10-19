package com.SmartHealth.ms_pacientes.dtos;

import com.SmartHealth.ms_pacientes.models.Paciente;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(
    name = "PacienteDTO",
    description = "Data Transfer Object para gestión de pacientes en el sistema"
)
public class PacienteDTO {

    @Schema(description = "Identificador único del paciente", example = "1", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;

    @NotBlank(message = "El RUT es obligatorio")
    @Pattern(regexp = "^[0-9]{7,8}-[0-9kK]$", message = "El RUT debe tener el formato 12345678-9")
    @Schema(description = "RUT del paciente sin puntos y con guion", example = "12345678-5")
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

    @Size(max = 40, message = "La previsión no puede superar 40 caracteres")
    @Schema(description = "Previsión de salud", example = "Fonasa")
    private String prevision;

    @Pattern(regexp = "^$|^[+]?[0-9]{8,15}$", message = "El teléfono debe tener entre 8 y 15 dígitos")
    @Schema(description = "Teléfono de contacto", example = "+56912345678")
    private String telefono;

    /**
     * ID del historial clínico en ms-historial.
     * Puede ser null si el paciente aún no tiene historial.
     */
    @Schema(description = "Identificador del historial clínico del paciente", example = "1")
    private Long idHistorialClinico;

    @Schema(description = "Indica si el paciente está activo en el sistema", example = "true")
    private Boolean activo;

    public static PacienteDTO desde(Paciente paciente) {
        return new PacienteDTO(paciente.getId(), paciente.getRut(), paciente.getNombreCompleto(), paciente.getCorreo(),
                paciente.getFechaNacimiento(), paciente.getPrevision(), paciente.getTelefono(),
                paciente.getIdHistorialClinico(), paciente.getActivo());
    }
}
