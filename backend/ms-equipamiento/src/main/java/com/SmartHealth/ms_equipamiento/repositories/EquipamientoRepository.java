package com.SmartHealth.ms_equipamiento.repositories;

import com.SmartHealth.ms_equipamiento.models.Equipamiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EquipamientoRepository extends JpaRepository<Equipamiento, Long> {

    Optional<Equipamiento> findByNumeroSerie(String numeroSerie);

    List<Equipamiento> findByActivoTrue();

    // Un método extra muy útil: buscar equipos que estén disponibles
    List<Equipamiento> findByEstadoAndActivoTrue(String estado);

    // Buscar equipamiento por hospital
    List<Equipamiento> findByHospitalUbicacionIdAndActivoTrue(Long hospitalId);
}