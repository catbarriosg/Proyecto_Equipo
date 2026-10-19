package com.SmartHealth.ms_hospitales.services;

import com.SmartHealth.ms_hospitales.models.Hospital;

import java.util.List;

public interface HospitalService {
    List<Hospital> obtenerTodos();
    Hospital obtenerPorId(Long id);
    List<Hospital> obtenerPorRegion(String region);
    List<Hospital> obtenerPorComplejidad(String nivelComplejidad);
    Hospital guardarHospital(Hospital hospital);
    Hospital actualizarHospital(Long id, Hospital hospital);
    Hospital desactivarHospital(Long id);
}
