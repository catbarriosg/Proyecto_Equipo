package com.SmartHealth.ms_pacientes.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "pacientes")
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El RUT es obligatorio")
    @Pattern(regexp = "^[0-9]+-[0-9kK]{1}$", message = "El RUT debe tener un formato válido, ej: 12345678-9")
    @Column(unique = true, nullable = false)
    private String rut;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres")
    private String nombreCompleto;

    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "Debe ser un formato de correo válido (ej: usuario@correo.com)")
    private String correo;

    @NotNull(message = "La fecha de nacimiento es obligatoria")
    @Past(message = "La fecha de nacimiento no puede ser en el futuro")
    private LocalDate fechaNacimiento;

    // Fonasa, Isapre o Particular (opcional)
    @Size(max = 40, message = "La previsión no puede superar 40 caracteres")
    @Column(length = 40)
    private String prevision;

    @Pattern(regexp = "^$|^[+]?[0-9]{8,15}$", message = "El teléfono debe tener entre 8 y 15 dígitos")
    @Column(length = 20)
    private String telefono;

    @Column(name = "creado_en", updatable = false)
    private java.time.LocalDateTime creadoEn;

    @PrePersist
    protected void onCreate() {
        creadoEn = java.time.LocalDateTime.now();
    }

    // Campo para marcar si el paciente está activo o inactivo (soft delete). No es un delete real, así mantenemos el historial clínico aunque el paciente ya no esté activo.
    @Column(nullable = false)
    private Boolean activo = true;

    @Column(name = "id_historial_clinico")
    private Long idHistorialClinico;
}
