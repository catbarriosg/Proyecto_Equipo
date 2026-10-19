package com.SmartHealth.ms_auth.dtos;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

/** Datos del formulario "Crear cuenta" del paciente. */
@Data
public class RegistroRequest {

    @NotBlank(message = "El RUT es obligatorio.")
    @Pattern(regexp = "^[0-9]{7,8}-[0-9kK]$", message = "El RUT debe tener el formato 12345678-9.")
    private String rut;

    @NotBlank(message = "El nombre es obligatorio.")
    @Size(min = 2, max = 50, message = "El nombre debe tener entre 2 y 50 caracteres.")
    private String nombre;

    @NotBlank(message = "El apellido es obligatorio.")
    @Size(min = 2, max = 50, message = "El apellido debe tener entre 2 y 50 caracteres.")
    private String apellido;

    @NotBlank(message = "El correo es obligatorio.")
    @Email(message = "Ingresa un correo electrónico válido.")
    private String correo;

    @NotNull(message = "La fecha de nacimiento es obligatoria.")
    @Past(message = "La fecha de nacimiento debe ser anterior a hoy.")
    private LocalDate fechaNacimiento;

    @Size(max = 40, message = "La previsión no puede superar 40 caracteres.")
    private String prevision;

    @Pattern(regexp = "^$|^[+]?[0-9]{8,15}$", message = "El teléfono debe tener entre 8 y 15 dígitos.")
    private String telefono;

    @NotBlank(message = "La contraseña es obligatoria.")
    @Size(min = 8, max = 64, message = "La contraseña debe tener entre 8 y 64 caracteres.")
    private String contrasena;
}
