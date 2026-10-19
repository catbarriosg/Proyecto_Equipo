package com.SmartHealth.ms_insumos.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMin;
import lombok.Data;
import com.SmartHealth.ms_insumos.dtos.HospitalDTO;
import java.time.LocalDate;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "insumos")
public class Insumo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El código del insumo no puede estar vacío")
    @Column(unique = true, nullable = false)
    private String codigo;

    @NotBlank(message = "El nombre del insumo es obligatorio")
    @Column(nullable = false)
    private String nombre;

    @NotBlank(message = "Debes especificar el tipo de insumo (ej. Medicamento, Quirúrgico)")
    private String tipo;

    @NotNull(message = "El stock actual no puede ser nulo")
    @Min(value = 0, message = "El stock no puede ser negativo")
    private Integer cantidadDisponible;

    @NotNull(message = "La cantidad mínima es obligatoria")
    @Min(value = 1, message = "Cantidad mínima debe ser al menos 1")
    @Column(name = "cantidad_minima")
    private Integer cantidadMinima;

    @Column(name = "precio_unitario")
    @DecimalMin(value = "0.0", inclusive = false, message = "El precio debe ser mayor a 0")
    private BigDecimal precioUnitario;

    @Column(name = "fecha_vencimiento")
    private LocalDate fechaVencimiento;

    @Column(name = "hospital_ubicacion_id")
    private Long hospitalUbicacionId;

    @Transient
    private HospitalDTO hospitalData;

    // Soft delete: Para no perder el registro histórico si se "elimina"
    @Column(name = "activo")
    private Boolean activo = true;

    @Transient
    public boolean estaBajoStock() {
        return cantidadDisponible < cantidadMinima;
    }

    @Transient
    public boolean estaProximoAVencer() {
        if (fechaVencimiento == null) return false;
        LocalDate proximoMes = LocalDate.now().plusDays(30);
        return LocalDate.now().isBefore(fechaVencimiento) && 
               proximoMes.isAfter(fechaVencimiento);
    }

    @Transient
    public boolean estaVencido() {
        if (fechaVencimiento == null) return false;
        return LocalDate.now().isAfter(fechaVencimiento);
    }

    @Transient
    public BigDecimal valorInventario() {
        if (precioUnitario == null) return BigDecimal.ZERO;
        return precioUnitario.multiply(BigDecimal.valueOf(cantidadDisponible));
    }
}
