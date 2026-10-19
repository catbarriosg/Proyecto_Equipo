package com.SmartHealth.ms_triaje.models;



import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "triajes")
public class Triaje {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El RUT del paciente es obligatorio")
    @Column(nullable = false)
    private String rutPaciente;

    @NotNull(message = "El ID del personal que realiza el triaje es obligatorio")
    @Min(value = 1, message = "El ID del personal debe ser válido")
    @Column(name = "personal_id", nullable = false)
    private Long personalId;

    @Column(nullable = false, updatable = false)
    private LocalDateTime fechaEvaluacion;

    @NotBlank(message = "La presión arterial es obligatoria (ej. 120/80)")
    private String presionArterial;

    @NotNull(message = "La temperatura es obligatoria")
    @DecimalMin(value = "30.0", message = "Temperatura anormalmente baja")
    @DecimalMax(value = "45.0", message = "Temperatura anormalmente alta")
    private Double temperatura;

    @NotNull(message = "La frecuencia cardíaca es obligatoria")
    private Integer frecuenciaCardiaca;

    @NotNull(message = "La saturación de oxígeno es obligatoria")
    @Min(value = 0)
    @Max(value = 100)
    private Integer saturacionOxigeno;

    @NotBlank(message = "Debe describir los síntomas del paciente")
    @Column(length = 500)
    private String sintomas;

    @NotBlank(message = "El nivel de urgencia es obligatorio")
    private String nivelUrgencia;

    /**
     * Puntuación automática del triaje (0-15).
     * Se calcula automáticamente basado en:
     * - Temperatura (anormal): +2
     * - Frecuencia cardíaca (anormal): +2
     * - Presión arterial (anormal): +2
     * - Saturación de oxígeno (< 95%): +4
     * - Síntomas críticos: +5
     *
     * Niveles:
     * - 0-2 puntos: AZUL (No urgente)
     * - 3-6 puntos: VERDE (Poco urgente)
     * - 7-11 puntos: AMARILLO (Urgente)
     * - 12+ puntos: ROJO (Muy urgente)
     */
    @Column(nullable = false)
    private Integer puntuacionTriaje = 0;

    @PrePersist
    protected void onCreate() {
        fechaEvaluacion = LocalDateTime.now();
    }
}