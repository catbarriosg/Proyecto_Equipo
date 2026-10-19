package com.SmartHealth.ms_personal.dtos;

/**
 * Médico tal como se muestra al público: sin RUT, correo ni teléfono personal.
 * "sucursalId" corresponde al hospitalId del registro de personal.
 */
public record MedicoDTO(
        Long id,
        String nombre,
        String especialidad,
        String especialidadSlug,
        String descripcion,
        String imagenUrl,
        Long sucursalId,
        Boolean activo
) {
}
