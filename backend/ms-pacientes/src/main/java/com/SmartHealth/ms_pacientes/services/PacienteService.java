package com.SmartHealth.ms_pacientes.services;

import com.SmartHealth.ms_pacientes.models.Paciente;
import java.util.List;

public interface PacienteService {
    List<Paciente> obtenerTodos();
    Paciente guardarPaciente(Paciente paciente);
    Paciente obtenerPorRut(String rut);
    Paciente obtenerPorId(Long id);
    Paciente eliminarPaciente(Long id);
    Paciente actualizarPaciente(Long id, Paciente datosNuevos);
}