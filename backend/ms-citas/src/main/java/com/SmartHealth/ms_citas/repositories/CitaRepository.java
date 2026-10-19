package com.SmartHealth.ms_citas.repositories;

import com.SmartHealth.ms_citas.models.Cita;
import com.SmartHealth.ms_citas.models.EstadoCita;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface CitaRepository extends JpaRepository<Cita, Long> {

    Optional<Cita> findByCodigoIgnoreCase(String codigo);

    List<Cita> findAllByOrderByFechaDescHoraDesc();

    List<Cita> findByPacienteIdOrderByFechaDescHoraDesc(Long pacienteId);

    List<Cita> findByMedicoIdOrderByFechaDescHoraDesc(Long medicoId);

    List<Cita> findByMedicoIdAndFechaBetweenAndEstadoIn(Long medicoId, LocalDate desde, LocalDate hasta,
                                                        Collection<EstadoCita> estados);

    boolean existsByPacienteIdAndFechaAndHoraAndEstadoInAndIdNot(Long pacienteId, LocalDate fecha, LocalTime hora,
                                                                 Collection<EstadoCita> estados, Long id);
}
