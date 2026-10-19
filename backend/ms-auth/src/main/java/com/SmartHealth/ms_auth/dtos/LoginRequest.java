package com.SmartHealth.ms_auth.dtos;

import com.SmartHealth.ms_auth.models.Rol;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "Ingresa tu correo electrónico.")
    @Email(message = "Ingresa un correo electrónico válido.")
    private String correo;

    @NotBlank(message = "Ingresa tu contraseña.")
    private String contrasena;

    /** Portal desde el que se ingresa (paciente, médico o administración). Es opcional. */
    private Rol rol;
}
