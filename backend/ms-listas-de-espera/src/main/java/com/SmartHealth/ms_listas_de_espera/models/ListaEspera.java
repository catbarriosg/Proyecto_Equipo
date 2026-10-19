package com.SmartHealth.ms_listas_de_espera.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "listas_espera")
public class ListaEspera {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "id_paciente")
    private Long idPaciente;

    @NotNull
    @Column(name = "id_procedimiento")
    private Long idProcedimiento;

    @NotBlank
    @Column(name = "nombre_procedimiento", length = 255)
    private String nombreProcedimiento;

    @NotNull
    @Column(name = "id_hospital")
    private Long idHospital;

    @NotBlank
    @Column(name = "nombre_hospital", length = 255)
    private String nombreHospital;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "prioridad", length = 50)
    private Prioridad prioridad;

    @NotBlank
    @Column(name = "estado", length = 50)
    private String estado = "PENDIENTE";

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @Column(name = "fecha_ingreso")
    private LocalDateTime fechaIngreso = LocalDateTime.now();

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @Column(name = "fecha_programada")
    private LocalDateTime fechaProgramada;

    @Column(name = "notas", length = 500)
    private String notas;

    @Column(name = "activo")
    private Boolean activo = true;
}
