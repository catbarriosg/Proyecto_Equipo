package com.SmartHealth.ms_camas.services;

import com.SmartHealth.ms_camas.models.Cama;

import java.util.List;
import java.util.Map;

public interface CamaService {
    List<Cama> obtenerTodas();
    Cama obtenerPorId(Long id);
    Cama obtenerPorCodigo(String codigo);
    List<Cama> obtenerPorHospital(Long hospitalId);
    List<Cama> obtenerDisponiblesPorHospital(Long hospitalId);
    List<Cama> obtenerPorEstado(String estado);
    List<Cama> obtenerPorTipo(String tipo);
    Map<String, Object> obtenerResumenHospital(Long hospitalId);
    Cama guardarCama(Cama cama);
    Cama actualizarEstado(Long id, String nuevoEstado, String rutPaciente);
    Cama actualizarCama(Long id, Cama cama);
    Cama desactivarCama(Long id);
}
