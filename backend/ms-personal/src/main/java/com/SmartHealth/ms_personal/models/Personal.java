package com.SmartHealth.ms_personal.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "personal")
public class Personal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres")
    @Column(nullable = false)
    private String nombre;

    @NotBlank(message = "El RUT es obligatorio")
    @Pattern(regexp = "^[0-9]+-[0-9kK]{1}$", message = "El RUT debe tener un formato válido")
    @Column(unique = true, nullable = false)
    private String rut;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "Debe ser un formato de correo válido")
    @Column(unique = true, nullable = false)
    private String email;

    @NotBlank(message = "El teléfono es obligatorio")
    @Pattern(regexp = "^[+]?[0-9]{8,15}$", message = "El teléfono debe tener un formato válido")
    private String telefono;

    // Rol: MEDICO, ENFERMERO, ADMINISTRATIVO, TECNICO, OTRO
    @NotBlank(message = "El rol es obligatorio")
    @Pattern(regexp = "^(MEDICO|ENFERMERO|ADMINISTRATIVO|TECNICO|OTRO)$",
            message = "El rol debe ser: MEDICO, ENFERMERO, ADMINISTRATIVO, TECNICO u OTRO")
    @Column(nullable = false)
    private String rol;

    // Especialidad (solo para médicos, puede ser null)
    @Size(max = 100, message = "La especialidad no puede exceder 100 caracteres")
    private String especialidad;

    // Número de colegiatura (solo para médicos, puede ser null)
    @Size(max = 50, message = "El número de colegiatura no puede exceder 50 caracteres")
    @Column(unique = true)
    private String numeroColegiatura;

    // Departamento o área donde trabaja
    @NotBlank(message = "El departamento es obligatorio")
    @Size(max = 100, message = "El departamento no puede exceder 100 caracteres")
    private String departamento;

    // ID del hospital donde trabaja (FK lógica sin @ManyToOne cross-service)
    @NotNull(message = "El ID del hospital es obligatorio")
    @Min(value = 1, message = "El ID del hospital debe ser mayor a 0")
    @Column(nullable = false)
    private Long hospitalId;

    // Presentación del profesional que se muestra en la página "Nuestros médicos"
    @Size(max = 500, message = "La descripción no puede exceder 500 caracteres")
    @Column(length = 500)
    private String descripcion;

    // Ruta de la foto o ilustración del profesional (por ejemplo /logo-mujer.png)
    @Size(max = 255, message = "La ruta de la imagen no puede exceder 255 caracteres")
    @Column(name = "imagen_url")
    private String imagenUrl;

    @Column(name = "fecha_ingreso", updatable = false)
    private LocalDateTime fechaIngreso;

    @Column(name = "activo")
    private Boolean activo = true;

    @PrePersist
    protected void onCreate() {
        fechaIngreso = LocalDateTime.now();
    }
}
