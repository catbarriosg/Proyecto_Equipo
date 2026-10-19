package com.SmartHealth.ms_personal.services;

import com.SmartHealth.ms_personal.dtos.PersonalDTO;

import java.util.List;

public interface IPersonalService {

    PersonalDTO crearPersonal(PersonalDTO personalDTO);

    PersonalDTO obtenerPorId(Long id);

    List<PersonalDTO> obtenerTodos();

    List<PersonalDTO> obtenerPorHospital(Long hospitalId);

    List<PersonalDTO> obtenerPorRol(String rol);

    List<PersonalDTO> obtenerPorDepartamento(String departamento);

    List<PersonalDTO> obtenerMedicosPorHospital(Long hospitalId);

    List<PersonalDTO> obtenerEnfermerosPorHospital(Long hospitalId);

    List<PersonalDTO> obtenerPorEspecialidad(String especialidad);

    PersonalDTO actualizarPersonal(Long id, PersonalDTO personalDTO);

    void eliminarPersonal(Long id);

    Long contarPersonalPorHospital(Long hospitalId);

    PersonalDTO obtenerPorRut(String rut);

    PersonalDTO obtenerPorEmail(String email);
}
