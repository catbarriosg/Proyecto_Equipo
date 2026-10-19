package com.SmartHealth.ms_equipamiento.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.DecimalMin;
import lombok.Data;
import java.time.LocalDate;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "equipamiento")
public class Equipamiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El número de serie no puede estar vacío")
    @Column(unique = true, nullable = false)
    private String numeroSerie;

    @NotBlank(message = "El nombre del equipo es obligatorio (ej. Máquina de Rayos X)")
    @Column(nullable = false)
    private String nombre;

    @NotBlank(message = "Debes especificar la marca o modelo")
    private String marca;

    @NotBlank(message = "El estado actual es obligatorio (ej. Disponible, En Uso, Mantenimiento)")
    private String estado;

    // ID del hospital donde está ubicado
    private Long hospitalUbicacionId;

    @Column(name = "fecha_adquisicion")
    private LocalDate fechaAdquisicion;

    @Column(name = "proximo_mantenimiento")
    private LocalDate proximoMantenimiento;

    @Column(name = "costo_unitario")
    @DecimalMin(value = "0.0", inclusive = false, message = "El costo debe ser mayor a 0")
    private BigDecimal costoUnitario;

    @Column(name = "vida_util_meses")
    private Integer vidaUtilMeses; // Cuántos meses de vida útil tiene el equipo

    // Soft delete
    private Boolean activo = true;

    @Transient
    public boolean necesitaMantenimiento() {
        if (proximoMantenimiento == null) return false;
        return LocalDate.now().isAfter(proximoMantenimiento);
    }

    @Transient
    public boolean proximoAFinDeVidaUtil() {
        if (fechaAdquisicion == null || vidaUtilMeses == null) return false;
        LocalDate finVidaUtil = fechaAdquisicion.plusMonths(vidaUtilMeses);
        LocalDate proximosDosMeses = LocalDate.now().plusMonths(2);
        return LocalDate.now().isAfter(finVidaUtil.minusMonths(2)) && 
               LocalDate.now().isBefore(finVidaUtil);
    }
}