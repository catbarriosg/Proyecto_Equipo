package com.SmartHealth.ms_auth.dtos;

/** Respuesta de login y registro: el token que el frontend envía como "Authorization: Bearer ...". */
public record SesionDTO(String token, long expiraEnSegundos, UsuarioDTO usuario) {
}
