package com.SmartHealth.ms_pacientes.services;

import com.SmartHealth.ms_pacientes.dtos.PacienteDTO;

import java.util.List;

/** Operaciones del servicio de pacientes. La implementación está en PacienteServiceImpl. */
public interface PacienteService {
    List<PacienteDTO> obtenerTodos(boolean incluirInactivos);
    PacienteDTO crear(PacienteDTO datos);
    PacienteDTO obtenerPorRut(String rut);
    PacienteDTO obtenerPorId(Long id);
    PacienteDTO actualizar(Long id, PacienteDTO datos);
    PacienteDTO cambiarEstado(Long id, boolean activo);
}
