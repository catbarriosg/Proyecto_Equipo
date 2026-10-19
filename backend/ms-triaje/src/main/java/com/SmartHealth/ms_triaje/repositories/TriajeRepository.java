package com.SmartHealth.ms_triaje.repositories;


import com.SmartHealth.ms_triaje.models.Triaje;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TriajeRepository extends JpaRepository<Triaje, Long> {
    List<Triaje> findByRutPacienteOrderByFechaEvaluacionDesc(String rutPaciente);
    List<Triaje> findByNivelUrgencia(String nivelUrgencia);
}