package com.SmartHealth.ms_citas.models;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * Hora médica agendada. Se guardan el nombre del paciente y del médico al momento de reservar
 * para no depender de otros servicios al listar.
 */
@Data
@Entity
@Table(name = "citas", indexes = {
        @Index(name = "idx_citas_paciente", columnList = "paciente_id"),
        @Index(name = "idx_citas_medico_fecha", columnList = "medico_id, fecha")
})
public class Cita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Código que ve el paciente, por ejemplo AM-000042
    @Column(unique = true, length = 20)
    private String codigo;

    @Column(name = "paciente_id", nullable = false)
    private Long pacienteId;

    @Column(name = "paciente_nombre", nullable = false, length = 120)
    private String pacienteNombre;

    @Column(name = "paciente_rut", length = 12)
    private String pacienteRut;

    @Column(name = "paciente_correo", length = 120)
    private String pacienteCorreo;

    @Column(name = "medico_id", nullable = false)
    private Long medicoId;

    @Column(name = "medico_nombre", nullable = false, length = 120)
    private String medicoNombre;

    @Column(nullable = false, length = 100)
    private String especialidad;

    @Column(name = "sucursal_id")
    private Long sucursalId;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(nullable = false)
    private LocalTime hora;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EstadoCita estado;

    @Column(length = 300)
    private String motivo;

    /**
     * "medicoId|fecha|hora" mientras la cita está activa y NULL cuando se cancela.
     * La restricción única impide que dos personas reserven el mismo horario al mismo tiempo.
     */
    @Column(unique = true, length = 40)
    private String franja;

    @Column(name = "creado_por_usuario_id")
    private Long creadoPorUsuarioId;

    @Column(name = "rol_creador", length = 20)
    private String rolCreador;

    @Column(name = "creado_en", updatable = false)
    private LocalDateTime creadoEn;

    @Column(name = "actualizado_en")
    private LocalDateTime actualizadoEn;

    @PrePersist
    protected void alCrear() {
        creadoEn = LocalDateTime.now();
        actualizadoEn = creadoEn;
    }

    @PreUpdate
    protected void alActualizar() {
        actualizadoEn = LocalDateTime.now();
    }

    /** Recalcula la franja según el estado: solo las citas activas bloquean el horario. */
    public void actualizarFranja() {
        franja = estado != null && estado.estaActiva() ? medicoId + "|" + fecha + "|" + hora : null;
    }
}
