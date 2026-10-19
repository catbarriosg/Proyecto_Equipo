package com.SmartHealth.ms_citas.dtos;

import lombok.Data;

/** Datos del médico que entrega ms-personal (/api/medicos). */
@Data
public class MedicoDTO {
    private Long id;
    private String nombre;
    private String especialidad;
    private Long sucursalId;
    private Boolean activo;
}
