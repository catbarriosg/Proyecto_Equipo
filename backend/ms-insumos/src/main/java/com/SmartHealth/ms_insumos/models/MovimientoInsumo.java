package com.SmartHealth.ms_insumos.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * ✅ NUEVA ENTIDAD - Auditoría de Movimientos de Insumos
 * 
 * Registra TODAS las transacciones de entrada/salida de insumos
 * Permite hacer trazabilidad completa del inventario
 */
@Data
@Entity
@Table(name = "movimientos_insumo")
public class MovimientoInsumo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "El ID del insumo es obligatorio")
    @Column(name = "insumo_id", nullable = false)
    private Long insumoId;

    @NotNull(message = "La cantidad antes del movimiento es obligatoria")
    @Min(value = 0, message = "La cantidad no puede ser negativa")
    @Column(name = "cantidad_antes")
    private Integer cantidadAntes;

    @NotNull(message = "La cantidad después del movimiento es obligatoria")
    @Min(value = 0, message = "La cantidad no puede ser negativa")
    @Column(name = "cantidad_despues")
    private Integer cantidadDespues;

    @NotBlank(message = "El tipo de movimiento es obligatorio")
    @Column(name = "tipo_movimiento", nullable = false)
    private String tipoMovimiento; // ENTRADA, SALIDA, AJUSTE, VENCIMIENTO

    @Column(name = "fecha_movimiento", nullable = false, updatable = false)
    private LocalDateTime fechaMovimiento = LocalDateTime.now();

    @Column(name = "razon", length = 500)
    private String razon; // Ej: "Compra a proveedor X", "Uso en quirófano 3", "Vencimiento", "Ajuste de inventario"

    @Column(name = "usuario_responsable")
    private String usuarioResponsable; // Quién hizo el movimiento

    @Column(name = "hospital_id")
    private Long hospitalId; // Hospital donde ocurrió el movimiento

    // Calcular diferencia
    @Transient
    public Integer calcularDiferencia() {
        return cantidadDespues - cantidadAntes;
    }

    // Validar integridad
    @Transient
    public boolean esValido() {
        if (tipoMovimiento == null) return false;
        
        switch (tipoMovimiento.toUpperCase()) {
            case "ENTRADA":
                return cantidadDespues >= cantidadAntes; // Debe aumentar
            case "SALIDA":
                return cantidadDespues <= cantidadAntes; // Debe disminuir
            case "AJUSTE":
            case "VENCIMIENTO":
                return true; // Puede ir en ambas direcciones
            default:
                return false;
        }
    }
}
