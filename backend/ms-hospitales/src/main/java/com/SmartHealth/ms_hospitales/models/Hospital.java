package com.SmartHealth.ms_hospitales.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "hospitales")
public class Hospital {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre del hospital es obligatorio")
    @Size(min = 3, max = 150, message = "El nombre debe tener entre 3 y 150 caracteres")
    @Column(nullable = false)
    private String nombre;

    @NotBlank(message = "La dirección es obligatoria")
    @Size(min = 5, max = 200, message = "La dirección debe tener entre 5 y 200 caracteres")
    @Column(nullable = false)
    private String direccion;

    @NotBlank(message = "La región es obligatoria")
    private String region;

    @NotBlank(message = "La comuna es obligatoria")
    private String comuna;

    @NotBlank(message = "El teléfono es obligatorio")
    @Pattern(regexp = "^[+]?[0-9]{8,15}$", message = "El teléfono debe tener un formato válido (ej: +56912345678)")
    @Column(unique = true, nullable = false)
    private String telefono;

    @NotBlank(message = "El correo institucional es obligatorio")
    @Email(message = "Debe ser un formato de correo válido (ej: contacto@hospital.cl)")
    @Column(unique = true, nullable = false)
    private String correoInstitucional;

    // Nivel de complejidad: BAJA, MEDIANA, ALTA (referencial)
    @NotBlank(message = "El nivel de complejidad es obligatorio")
    @Pattern(regexp = "^(BAJA|MEDIANA|ALTA)$", message = "La complejidad debe ser: BAJA, MEDIANA o ALTA")
    private String nivelComplejidad;

    @Min(value = 0, message = "La capacidad total de camas no puede ser negativa")
    private int capacidadTotalCamas;

    @Column(name = "creado_en", updatable = false)
    private LocalDateTime creadoEn;

    @Column(nullable = false)
    private Boolean activo = true;

    @PrePersist
    protected void onCreate() {
        creadoEn = LocalDateTime.now();
    }
}
