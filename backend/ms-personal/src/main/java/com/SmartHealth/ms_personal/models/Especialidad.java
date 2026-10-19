package com.SmartHealth.ms_personal.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

/** Especialidad que ofrece la clínica (se muestra en la página "Especialidades" y al agendar). */
@Data
@Entity
@Table(name = "especialidades")
public class Especialidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Debe coincidir con el campo "especialidad" de los médicos, por ejemplo "Medicina General"
    @NotBlank(message = "El nombre de la especialidad es obligatorio")
    @Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
    @Column(nullable = false, unique = true, length = 100)
    private String nombre;

    // Identificador para URLs, por ejemplo "medicina-general"
    @NotBlank(message = "El identificador es obligatorio")
    @Pattern(regexp = "^[a-z0-9]+(-[a-z0-9]+)*$", message = "El identificador solo admite minúsculas, números y guiones")
    @Column(nullable = false, unique = true, length = 100)
    private String slug;

    @Size(max = 500, message = "La descripción no puede exceder 500 caracteres")
    @Column(length = 500)
    private String descripcion;

    @Size(max = 10, message = "El ícono no puede exceder 10 caracteres")
    @Column(length = 10)
    private String icono;

    @Column(nullable = false)
    private Boolean activa = true;
}
