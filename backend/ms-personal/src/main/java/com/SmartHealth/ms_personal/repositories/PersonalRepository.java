package com.SmartHealth.ms_personal.repositories;

import com.SmartHealth.ms_personal.models.Personal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PersonalRepository extends JpaRepository<Personal, Long> {

    Optional<Personal> findByRutAndActivoTrue(String rut);

    Optional<Personal> findByEmailAndActivoTrue(String email);

    List<Personal> findByHospitalIdAndActivoTrue(Long hospitalId);

    List<Personal> findByRolAndActivoTrue(String rol);

    List<Personal> findByDepartamentoAndActivoTrue(String departamento);

    List<Personal> findByActivoTrue();

    @Query("SELECT p FROM Personal p WHERE p.hospitalId = :hospitalId AND p.rol = 'MEDICO' AND p.activo = true")
    List<Personal> findMedicosByHospital(@Param("hospitalId") Long hospitalId);

    @Query("SELECT p FROM Personal p WHERE p.hospitalId = :hospitalId AND p.rol = 'ENFERMERO' AND p.activo = true")
    List<Personal> findEnfermerosByHospital(@Param("hospitalId") Long hospitalId);

    @Query("SELECT p FROM Personal p WHERE p.especialidad = :especialidad AND p.activo = true")
    List<Personal> findByEspecialidad(@Param("especialidad") String especialidad);

    @Query("SELECT COUNT(p) FROM Personal p WHERE p.hospitalId = :hospitalId AND p.activo = true")
    Long countPersonalByHospital(@Param("hospitalId") Long hospitalId);

    Optional<Personal> findByIdAndActivoTrue(Long id);
}
