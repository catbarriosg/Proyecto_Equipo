package com.SmartHealth.ms_listas_de_espera.repositories;

import com.SmartHealth.ms_listas_de_espera.models.ListaEspera;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ListaEsperaRepository extends JpaRepository<ListaEspera, Long> {

    List<ListaEspera> findByIdPacienteAndActivoTrue(Long idPaciente);

    List<ListaEspera> findByIdHospitalAndActivoTrue(Long idHospital);

    List<ListaEspera> findByEstadoAndActivoTrue(String estado);

    List<ListaEspera> findByIdPacienteAndEstadoAndActivoTrue(Long idPaciente, String estado);

    @Query("SELECT l FROM ListaEspera l WHERE l.activo = true ORDER BY l.prioridad DESC, l.fechaIngreso ASC")
    List<ListaEspera> findAllActivoOrderedByPriority();

    @Query("SELECT l FROM ListaEspera l WHERE l.idHospital = :idHospital AND l.activo = true ORDER BY l.prioridad DESC, l.fechaIngreso ASC")
    List<ListaEspera> findByIdHospitalOrderedByPriority(@Param("idHospital") Long idHospital);

    @Query("SELECT COUNT(l) FROM ListaEspera l WHERE l.idHospital = :idHospital AND l.estado = 'PENDIENTE' AND l.activo = true")
    Long countPendientesInHospital(@Param("idHospital") Long idHospital);

    @Query("SELECT COUNT(l) FROM ListaEspera l WHERE l.idPaciente = :idPaciente AND l.estado = 'PENDIENTE' AND l.activo = true")
    Long countPendientesPaciente(@Param("idPaciente") Long idPaciente);

    Optional<ListaEspera> findByIdAndActivoTrue(Long id);

    List<ListaEspera> findByActivoTrue();
}
