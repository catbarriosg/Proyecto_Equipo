package com.SmartHealth.ms_citas.dtos;

import com.SmartHealth.ms_citas.models.Cita;

/**
 * Cita tal como la recibe el frontend. La fecha va como "yyyy-MM-dd" y la hora como "HH:mm".
 * "gestionable" indica si todavía se puede modificar o cancelar (cita activa con más de 24 horas de anticipación).
 */
public record CitaDTO(
        Long id,
        String codigo,
        Long pacienteId,
        String pacienteNombre,
        String pacienteRut,
        String pacienteCorreo,
        Long medicoId,
        String medicoNombre,
        String especialidad,
        Long sucursalId,
        String fecha,
        String hora,
        String estado,
        String motivo,
        boolean gestionable,
        String creadoEn
) {
    public static CitaDTO desde(Cita cita, boolean gestionable) {
        return new CitaDTO(
                cita.getId(),
                cita.getCodigo(),
                cita.getPacienteId(),
                cita.getPacienteNombre(),
                cita.getPacienteRut(),
                cita.getPacienteCorreo(),
                cita.getMedicoId(),
                cita.getMedicoNombre(),
                cita.getEspecialidad(),
                cita.getSucursalId(),
                cita.getFecha().toString(),
                cita.getHora().toString().substring(0, 5),
                cita.getEstado().name(),
                cita.getMotivo(),
                gestionable,
                cita.getCreadoEn() == null ? null : cita.getCreadoEn().toString()
        );
    }
}
