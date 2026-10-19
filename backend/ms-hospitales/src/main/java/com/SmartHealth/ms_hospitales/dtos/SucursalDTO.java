package com.SmartHealth.ms_hospitales.dtos;

import com.SmartHealth.ms_hospitales.models.Hospital;

import java.util.Arrays;
import java.util.List;

/** Sucursal de la clínica tal como se muestra en la página pública "Sucursales". */
public record SucursalDTO(
        Long id,
        String nombre,
        String direccion,
        String comuna,
        String region,
        String telefono,
        String correo,
        List<String> horario,
        String imagenUrl,
        String descripcionImagen
) {
    public static SucursalDTO desde(Hospital hospital) {
        List<String> horario = hospital.getHorario() == null || hospital.getHorario().isBlank()
                ? List.of()
                : Arrays.stream(hospital.getHorario().split("\\R")).map(String::trim).filter(l -> !l.isEmpty()).toList();
        return new SucursalDTO(hospital.getId(), hospital.getNombre(), hospital.getDireccion(), hospital.getComuna(),
                hospital.getRegion(), hospital.getTelefono(), hospital.getCorreoInstitucional(), horario,
                hospital.getImagenUrl(), hospital.getDescripcionImagen());
    }
}
