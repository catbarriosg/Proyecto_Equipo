package com.SmartHealth.ms_auth.dtos;

import com.SmartHealth.ms_auth.models.Usuario;

/** Datos públicos de la cuenta (sin el hash de la contraseña). */
public record UsuarioDTO(Long id, String correo, String nombre, String rol, Long pacienteId, Long personalId,
                         Boolean activo) {

    public static UsuarioDTO desde(Usuario usuario) {
        return new UsuarioDTO(usuario.getId(), usuario.getCorreo(), usuario.getNombre(),
                usuario.getRol().name(), usuario.getPacienteId(), usuario.getPersonalId(), usuario.getActivo());
    }
}
