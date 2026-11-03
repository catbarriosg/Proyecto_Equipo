package com.SmartHealth.ms_personal.repositories;

import com.SmartHealth.ms_personal.models.Especialidad;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/** Acceso a la tabla "especialidades": búsquedas por slug o nombre y verificación de duplicados. */
public interface EspecialidadRepository extends JpaRepository<Especialidad, Long> {
    List<Especialidad> findByActivaTrueOrderByNombreAsc();
    Optional<Especialidad> findBySlug(String slug);
    Optional<Especialidad> findByNombreIgnoreCase(String nombre);
    boolean existsBySlug(String slug);
    boolean existsByNombreIgnoreCase(String nombre);
}
