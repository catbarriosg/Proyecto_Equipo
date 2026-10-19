package com.SmartHealth.ms_hospitales.repositories;

import com.SmartHealth.ms_hospitales.models.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HospitalRepository extends JpaRepository<Hospital, Long> {
    List<Hospital> findByActivoTrue();
    List<Hospital> findByRegionAndActivoTrue(String region);
    List<Hospital> findByNivelComplejidadAndActivoTrue(String nivelComplejidad);
    boolean existsByTelefono(String telefono);
    boolean existsByCorreoInstitucional(String correo);
}
