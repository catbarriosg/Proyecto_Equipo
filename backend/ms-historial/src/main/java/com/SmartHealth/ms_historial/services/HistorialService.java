package com.SmartHealth.ms_historial.services;

import com.SmartHealth.ms_historial.dtos.HistorialDTO;
import com.SmartHealth.ms_historial.models.HistorialClinico;
import java.util.List;

public interface HistorialService {

    List<HistorialDTO> obtenerTodos();

    HistorialDTO obtenerPorId(Long id);

    HistorialDTO guardar(HistorialDTO historialDTO);

    List<HistorialDTO> obtenerPorPaciente(Long idPaciente);

    void eliminar(Long id);

}
