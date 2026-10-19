package com.SmartHealth.ms_auth.dtos;

import com.SmartHealth.ms_auth.models.Rol;
import jakarta.validation.constraints.*;
import lombok.Data;

/** Cuenta creada por un administrador, por ejemplo para un médico nuevo. */
@Data
public class CrearUsuarioRequest {

    @NotBlank(message = "El correo es obligatorio.")
    @Email(message = "Ingresa un correo electrónico válido.")
    private String correo;

    @NotBlank(message = "La contraseña es obligatoria.")
    @Size(min = 8, max = 64, message = "La contraseña debe tener entre 8 y 64 caracteres.")
    private String contrasena;

    @NotNull(message = "El rol es obligatorio.")
    private Rol rol;

    @NotBlank(message = "El nombre es obligatorio.")
    @Size(max = 120, message = "El nombre no puede superar 120 caracteres.")
    private String nombre;

    private Long pacienteId;

    private Long personalId;
}
