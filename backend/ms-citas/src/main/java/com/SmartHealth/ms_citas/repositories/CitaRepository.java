package com.SmartHealth.ms_citas.repositories;

import com.SmartHealth.ms_citas.models.Cita;
import com.SmartHealth.ms_citas.models.EstadoCita;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

/** Consultas de la tabla "citas". Spring Data genera el SQL a partir del nombre de cada método. */
public interface CitaRepository extends JpaRepository<Cita, Long> {

    /** Busca por código de reserva sin distinguir mayúsculas (am-000001 = AM-000001). */
    Optional<Cita> findByCodigoIgnoreCase(String codigo);

    /** Todas las citas, de la más reciente a la más antigua (vista del administrador). */
    List<Cita> findAllByOrderByFechaDescHoraDesc();

    /** Citas de un paciente (vista "Mis horas médicas"). */
    List<Cita> findByPacienteIdOrderByFechaDescHoraDesc(Long pacienteId);

    /** Citas de un médico (vista "Mi agenda"). */
    List<Cita> findByMedicoIdOrderByFechaDescHoraDesc(Long medicoId);

    /** Citas de un médico en un rango de fechas y con ciertos estados: sirve para calcular las horas ocupadas. */
    List<Cita> findByMedicoIdAndFechaBetweenAndEstadoIn(Long medicoId, LocalDate desde, LocalDate hasta,
                                                        Collection<EstadoCita> estados);

    /** ¿El paciente ya tiene otra cita activa a esa misma hora? (IdNot excluye la cita que se está reprogramando) */
    boolean existsByPacienteIdAndFechaAndHoraAndEstadoInAndIdNot(Long pacienteId, LocalDate fecha, LocalTime hora,
                                                                 Collection<EstadoCita> estados, Long id);
}
