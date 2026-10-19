package com.SmartHealth.ms_citas.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class ReprogramarCitaRequest {

    @NotBlank(message = "Selecciona una fecha.")
    @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$", message = "La fecha debe tener el formato AAAA-MM-DD.")
    private String fecha;

    @NotBlank(message = "Selecciona una hora.")
    @Pattern(regexp = "^\\d{2}:\\d{2}$", message = "La hora debe tener el formato HH:mm.")
    private String hora;
}
