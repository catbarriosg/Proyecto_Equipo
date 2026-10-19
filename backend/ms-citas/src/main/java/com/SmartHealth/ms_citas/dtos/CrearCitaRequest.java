package com.SmartHealth.ms_citas.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Reserva de una hora. Un paciente reserva para sí mismo; un médico o administrador indica el RUT del paciente.
 */
@Data
public class CrearCitaRequest {

    @NotNull(message = "Selecciona un médico.")
    private Long medicoId;

    @NotBlank(message = "Selecciona una fecha.")
    @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$", message = "La fecha debe tener el formato AAAA-MM-DD.")
    private String fecha;

    @NotBlank(message = "Selecciona una hora.")
    @Pattern(regexp = "^\\d{2}:\\d{2}$", message = "La hora debe tener el formato HH:mm.")
    private String hora;

    @Size(max = 300, message = "El motivo no puede superar 300 caracteres.")
    private String motivo;

    @Pattern(regexp = "^$|^[0-9]{7,8}-[0-9kK]$", message = "El RUT del paciente debe tener el formato 12345678-9.")
    private String rutPaciente;
}
