package com.SmartHealth.ms_citas.dtos;

import com.SmartHealth.ms_citas.models.EstadoCita;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CambiarEstadoRequest {

    @NotNull(message = "Indica el nuevo estado de la cita.")
    private EstadoCita estado;
}
