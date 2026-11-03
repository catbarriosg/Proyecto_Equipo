package com.SmartHealth.ms_auth.models;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * Cuenta para iniciar sesión. Los datos personales viven en ms-pacientes (pacientes) o en ms-personal (médicos);
 * aquí solo se guarda el vínculo con esos registros.
 */
@Data
@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 120)
    private String correo;

    // Hash BCrypt: la contraseña nunca se guarda en texto plano
    @Column(name = "contrasena_hash", nullable = false)
    private String contrasenaHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Rol rol;

    @Column(nullable = false, length = 120)
    private String nombre;

    // Vínculos con las fichas de otros microservicios (solo se guarda el ID, no hay relación de base de datos)
    @Column(name = "paciente_id")
    private Long pacienteId;

    @Column(name = "personal_id")
    private Long personalId;

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(name = "creado_en", updatable = false)
    private LocalDateTime creadoEn;

    /** Antes de insertar (@PrePersist): registra la fecha de creación y guarda el correo en minúsculas. */
    @PrePersist
    protected void alCrear() {
        creadoEn = LocalDateTime.now();
        correo = correo.trim().toLowerCase();
    }
}
