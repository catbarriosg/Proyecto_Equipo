package com.SmartHealth.ms_equipamiento.services;

import com.SmartHealth.ms_equipamiento.models.Equipamiento;
import java.util.List;

public interface EquipamientoService {
    List<Equipamiento> listarTodos();
    List<Equipamiento> listarTodosActivos();
    List<Equipamiento> listarPorEstado(String estado);
    List<Equipamiento> listarPorHospital(Long hospitalId);
    Equipamiento buscarPorNumeroSerie(String numeroSerie);
    Equipamiento guardarEquipamiento(Equipamiento equipamiento);
    Equipamiento actualizarEquipamiento(String numeroSerie, Equipamiento equipamiento);
    Equipamiento actualizarEstado(String numeroSerie, String nuevoEstado);
    void eliminarEquipamiento(String numeroSerie);
}