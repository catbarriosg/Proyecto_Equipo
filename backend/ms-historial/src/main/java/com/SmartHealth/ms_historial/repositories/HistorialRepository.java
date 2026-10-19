package com.SmartHealth.ms_historial.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.SmartHealth.ms_historial.models.HistorialClinico;
import java.util.List;

public interface HistorialRepository extends JpaRepository<HistorialClinico, Long>  {
       List<HistorialClinico> findByIdPaciente(Long idPaciente);
}
