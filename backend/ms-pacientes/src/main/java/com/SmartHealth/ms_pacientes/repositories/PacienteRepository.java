package com.SmartHealth.ms_pacientes.repositories;

import com.SmartHealth.ms_pacientes.models.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;


public interface PacienteRepository extends JpaRepository<Paciente, Long> {
    Optional<Paciente> findByRut(String rut); 
    List<Paciente> findByActivoTrue();
}
