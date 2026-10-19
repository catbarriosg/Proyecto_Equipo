package com.SmartHealth.ms_camas.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "camas")
public class Cama {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El código de cama es obligatorio")
    @Pattern(regexp = "^[A-Z0-9\\-]{3,20}$", message = "El código debe ser alfanumérico en mayúsculas (ej: UCI-01, HAB-203)")
    @Column(unique = true, nullable = false)
    private String codigo;

    // Tipo de cama: BASICA, UCI, UTI, PEDIATRICA, MATERNIDAD, URGENCIA
    @NotBlank(message = "El tipo de cama es obligatorio")
    @Pattern(regexp = "^(BASICA|UCI|UTI|PEDIATRICA|MATERNIDAD|URGENCIA)$",
            message = "El tipo debe ser: BASICA, UCI, UTI, PEDIATRICA, MATERNIDAD o URGENCIA")
    private String tipo;

    // Estado: DISPONIBLE, OCUPADA, MANTENCION, RESERVADA
    @NotBlank(message = "El estado de la cama es obligatorio")
    @Pattern(regexp = "^(DISPONIBLE|OCUPADA|MANTENCION|RESERVADA)$",
            message = "El estado debe ser: DISPONIBLE, OCUPADA, MANTENCION o RESERVADA")
    private String estado;

    // Piso o sector dentro del hospital (opcional pero útil)
    @Size(max = 50, message = "El sector no puede superar 50 caracteres")
    private String sector;

    // ID del hospital al que pertenece esta cama (FK lógica, sin @ManyToOne cross-service)
    @NotNull(message = "El ID del hospital es obligatorio")
    @Min(value = 1, message = "El ID del hospital debe ser mayor a 0")
    @Column(nullable = false)
    private Long hospitalId;

    // RUT del paciente actualmente en la cama (null si está disponible)
    private String rutPacienteActual;

    @Column(name = "creado_en", updatable = false)
    private LocalDateTime creadoEn;

    @Column(name = "actualizado_en")
    private LocalDateTime actualizadoEn;

    @Column(nullable = false)
    private Boolean activa = true;

    @PrePersist
    protected void onCreate() {
        creadoEn = LocalDateTime.now();
        actualizadoEn = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        actualizadoEn = LocalDateTime.now();
    }
}
