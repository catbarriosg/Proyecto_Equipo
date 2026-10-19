package com.SmartHealth.ms_camas.repositories;

import com.SmartHealth.ms_camas.models.Cama;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CamaRepository extends JpaRepository<Cama, Long> {

    Optional<Cama> findByCodigo(String codigo);

    List<Cama> findByActivaTrue();

    List<Cama> findByHospitalIdAndActivaTrue(Long hospitalId);

    List<Cama> findByEstadoAndActivaTrue(String estado);

    List<Cama> findByHospitalIdAndEstadoAndActivaTrue(Long hospitalId, String estado);

    List<Cama> findByTipoAndActivaTrue(String tipo);

    List<Cama> findByHospitalIdAndTipoAndEstadoAndActivaTrue(Long hospitalId, String tipo, String estado);

    // Cuenta camas disponibles por hospital (útil para triaje y reportes)
    @Query("SELECT COUNT(c) FROM Cama c WHERE c.hospitalId = :hospitalId AND c.estado = 'DISPONIBLE' AND c.activa = true")
    long contarDisponiblesPorHospital(@Param("hospitalId") Long hospitalId);

    boolean existsByCodigo(String codigo);
}
