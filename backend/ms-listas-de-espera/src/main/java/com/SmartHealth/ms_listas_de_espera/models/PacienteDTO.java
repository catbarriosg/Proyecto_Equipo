package com.SmartHealth.ms_listas_de_espera.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PacienteDTO {
    private Long id;
    private String rut;
    private String nombreCompleto;
    private String correo;
    private String telefono;
}
