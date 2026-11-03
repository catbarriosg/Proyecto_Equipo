package com.SmartHealth.ms_personal.services;

import com.SmartHealth.ms_personal.dtos.PersonalDTO;
import com.SmartHealth.ms_personal.models.Personal;
import com.SmartHealth.ms_personal.repositories.PersonalRepository;
import com.SmartHealth.ms_personal.clients.HospitalClient;
import com.SmartHealth.ms_personal.enums.RolPersonal;
import com.SmartHealth.ms_personal.enums.EspecialidadMedica;
import com.SmartHealth.ms_personal.enums.DepartamentoPersonal;
import com.SmartHealth.ms_personal.exceptions.ResourceNotFoundException;
import com.SmartHealth.ms_personal.models.HospitalDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/** Lógica de negocio del personal de la clínica. */
@Service
public class PersonalServiceImpl implements IPersonalService {

    private static final Logger logger = LoggerFactory.getLogger(PersonalServiceImpl.class);

    @Autowired
    private PersonalRepository personalRepository;

    @Autowired
    private HospitalClient hospitalClient;

    /** Copia los datos del DTO a una entidad nueva y la guarda (RUT y correo repetidos los rechaza la base de datos). */
    @Override
    public PersonalDTO crearPersonal(PersonalDTO personalDTO) {
        logger.info("Creando nuevo personal con RUT: {}", personalDTO.getRut());
        try {
            Personal personal = new Personal();
            personal.setNombre(personalDTO.getNombre());
            personal.setRut(personalDTO.getRut());
            personal.setEmail(personalDTO.getEmail());
            personal.setTelefono(personalDTO.getTelefono());
            personal.setRol(personalDTO.getRol());
            personal.setEspecialidad(personalDTO.getEspecialidad());
            personal.setNumeroColegiatura(personalDTO.getNumeroColegiatura());
            personal.setDepartamento(personalDTO.getDepartamento());
            personal.setHospitalId(personalDTO.getHospitalId());
            personal.setDescripcion(personalDTO.getDescripcion());
            personal.setImagenUrl(personalDTO.getImagenUrl());

            Personal guardado = personalRepository.save(personal);
            logger.info("Personal creado exitosamente con ID: {}", guardado.getId());
            return convertToDTO(guardado);
        } catch (Exception e) {
            logger.error("Error al crear personal con RUT: {}", personalDTO.getRut(), e);
            throw e;
        }
    }

    /** Profesional activo por ID, o null si no existe (el controlador responde 404). */
    @Override
    public PersonalDTO obtenerPorId(Long id) {
        logger.info("Obteniendo personal con ID: {}", id);
        try {
            Optional<Personal> personal = personalRepository.findByIdAndActivoTrue(id);
            if (personal.isPresent()) {
                logger.info("Personal encontrado con ID: {}", id);
                return convertToDTO(personal.get());
            } else {
                logger.warn("Personal no encontrado con ID: {}", id);
                return null;
            }
        } catch (Exception e) {
            logger.error("Error al obtener personal con ID: {}", id, e);
            throw e;
        }
    }

    /** Todo el personal activo. */
    @Override
    public List<PersonalDTO> obtenerTodos() {
        logger.info("Obteniendo todo el personal");
        try {
            List<Personal> personal = personalRepository.findByActivoTrue();
            logger.info("Se recuperaron {} registros de personal", personal.size());
            return personal.stream().map(this::convertToDTO).collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error al obtener todo el personal", e);
            throw e;
        }
    }

    /** Personal activo de una sede. */
    @Override
    public List<PersonalDTO> obtenerPorHospital(Long hospitalId) {
        logger.info("Obteniendo personal del hospital ID: {}", hospitalId);
        try {
            List<Personal> personal = personalRepository.findByHospitalIdAndActivoTrue(hospitalId);
            logger.info("Se recuperaron {} registros para hospital ID: {}", personal.size(), hospitalId);
            return personal.stream().map(this::convertToDTO).collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error al obtener personal del hospital ID: {}", hospitalId, e);
            throw e;
        }
    }

    /** Personal por rol; primero valida que el rol exista en RolPersonal. */
    @Override
    public List<PersonalDTO> obtenerPorRol(String rol) {
        logger.info("Obteniendo personal con rol: {}", rol);
        try {
            logger.debug("Validando rol: {}", rol);
            if (!RolPersonal.isValido(rol)) {
                String rolesValidos = RolPersonal.getRolesValidos();
                String mensaje = "Rol inválido: '" + rol + "'. Roles válidos: " + rolesValidos;
                logger.warn("[PersonalService] {}", mensaje);
                throw new RuntimeException(mensaje);
            }
            
            List<Personal> personal = personalRepository.findByRolAndActivoTrue(rol);
            logger.info("Se recuperaron {} registros con rol: {}", personal.size(), rol);
            return personal.stream().map(this::convertToDTO).collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error al obtener personal por rol: {}", rol, e);
            throw e;
        }
    }

    /** Personal por departamento; primero valida que exista en DepartamentoPersonal. */
    @Override
    public List<PersonalDTO> obtenerPorDepartamento(String departamento) {
        logger.info("Obteniendo personal del departamento: {}", departamento);
        try {
            if (!DepartamentoPersonal.isValido(departamento)) {
                String departamentosValidos = DepartamentoPersonal.getDepartamentosValidos();
                String mensaje = "Departamento inválido: '" + departamento + "'. Departamentos válidos: " + departamentosValidos;
                logger.warn("[PersonalService] {}", mensaje);
                throw new RuntimeException(mensaje);
            }
            List<Personal> personal = personalRepository.findByDepartamentoAndActivoTrue(departamento);
            logger.info("Se recuperaron {} registros del departamento: {}", personal.size(), departamento);
            return personal.stream().map(this::convertToDTO).collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error al obtener personal del departamento: {}", departamento, e);
            throw e;
        }
    }

    /** Médicos de una sede, validando antes la sede con ms-hospitales. */
    @Override
    public List<PersonalDTO> obtenerMedicosPorHospital(Long hospitalId) {
        logger.info("Obteniendo médicos del hospital ID: {}", hospitalId);
        try {
            logger.debug("Validando existencia del hospital ID: {}", hospitalId);
            HospitalDTO hospital = hospitalClient.obtenerHospitalPorId(hospitalId);
            if (hospital == null) {
                String mensaje = "El hospital con ID " + hospitalId + " no existe en el sistema";
                logger.warn("[PersonalService] {}", mensaje);
                throw new RuntimeException(mensaje);
            }
            logger.debug("Hospital validado: {}", hospital.getNombre());
            List<Personal> personal = personalRepository.findMedicosByHospital(hospitalId);
            logger.info("Se recuperaron {} médicos para hospital ID: {}", personal.size(), hospitalId);
            return personal.stream().map(this::convertToDTO).collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error al obtener médicos del hospital ID: {}", hospitalId, e);
            throw e;
        }
    }

    /** Enfermeros de una sede, validando antes la sede con ms-hospitales. */
    @Override
    public List<PersonalDTO> obtenerEnfermerosPorHospital(Long hospitalId) {
        logger.info("Obteniendo enfermeros del hospital ID: {}", hospitalId);
        try {
            logger.debug("Validando existencia del hospital ID: {}", hospitalId);
            HospitalDTO hospital = hospitalClient.obtenerHospitalPorId(hospitalId);
            if (hospital == null) {
                String mensaje = "El hospital con ID " + hospitalId + " no existe en el sistema";
                logger.warn("[PersonalService] {}", mensaje);
                throw new RuntimeException(mensaje);
            }
            logger.debug("Hospital validado: {}", hospital.getNombre());
            List<Personal> personal = personalRepository.findEnfermerosByHospital(hospitalId);
            logger.info("Se recuperaron {} enfermeros para hospital ID: {}", personal.size(), hospitalId);
            return personal.stream().map(this::convertToDTO).collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error al obtener enfermeros del hospital ID: {}", hospitalId, e);
            throw e;
        }
    }

    /** Personal por especialidad; primero valida que exista en EspecialidadMedica. */
    @Override
    public List<PersonalDTO> obtenerPorEspecialidad(String especialidad) {
        logger.info("Obteniendo personal con especialidad: {}", especialidad);
        try {
            if (!EspecialidadMedica.isValida(especialidad)) {
                String especialidadesValidas = EspecialidadMedica.getEspecialidadesValidas();
                String mensaje = "Especialidad inválida: '" + especialidad + "'. Especialidades válidas: " + especialidadesValidas;
                logger.warn("[PersonalService] {}", mensaje);
                throw new RuntimeException(mensaje);
            }
            List<Personal> personal = personalRepository.findByEspecialidad(especialidad);
            logger.info("Se recuperaron {} registros con especialidad: {}", personal.size(), especialidad);
            return personal.stream().map(this::convertToDTO).collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error al obtener personal por especialidad: {}", especialidad, e);
            throw e;
        }
    }

    /** Actualiza un profesional: valida la sede con ms-hospitales y luego copia los datos editables (el RUT no cambia). */
    @Override
    public PersonalDTO actualizarPersonal(Long id, PersonalDTO personalDTO) {
        logger.info("Actualizando personal con ID: {}", id);
        try {
            logger.debug("Validando existencia del hospital ID: {}", personalDTO.getHospitalId());
            HospitalDTO hospital = hospitalClient.obtenerHospitalPorId(personalDTO.getHospitalId());
            if (hospital == null) {
                String mensaje = "El hospital con ID " + personalDTO.getHospitalId() + " no existe en el sistema";
                logger.warn("[PersonalService] {}", mensaje);
                throw new RuntimeException(mensaje);
            }
            logger.debug("Hospital validado: {}", hospital.getNombre());
            
            Optional<Personal> existente = personalRepository.findByIdAndActivoTrue(id);
            if (existente.isPresent()) {
                Personal personal = existente.get();
                personal.setNombre(personalDTO.getNombre());
                personal.setEmail(personalDTO.getEmail());
                personal.setTelefono(personalDTO.getTelefono());
                personal.setRol(personalDTO.getRol());
                personal.setEspecialidad(personalDTO.getEspecialidad());
                personal.setNumeroColegiatura(personalDTO.getNumeroColegiatura());
                personal.setDepartamento(personalDTO.getDepartamento());
                personal.setHospitalId(personalDTO.getHospitalId());
                personal.setDescripcion(personalDTO.getDescripcion());
                personal.setImagenUrl(personalDTO.getImagenUrl());

                Personal actualizado = personalRepository.save(personal);
                logger.info("Personal actualizado exitosamente con ID: {}", id);
                return convertToDTO(actualizado);
            } else {
                String mensaje = "Personal con ID " + id + " no encontrado";
                logger.warn("[PersonalService] {}", mensaje);
                throw new ResourceNotFoundException(mensaje);
            }
        } catch (Exception e) {
            logger.error("Error al actualizar personal con ID: {}", id, e);
            throw e;
        }
    }

    /** Soft delete: marca al profesional como inactivo en lugar de borrarlo. */
    @Override
    public void eliminarPersonal(Long id) {
        logger.info("Eliminando personal con ID: {}", id);
        try {
            Optional<Personal> existente = personalRepository.findByIdAndActivoTrue(id);
            if (existente.isPresent()) {
                Personal personal = existente.get();
                personal.setActivo(false);
                personalRepository.save(personal);
                logger.info("Personal eliminado (soft-delete) con ID: {}", id);
            } else {
                logger.warn("Personal no encontrado para eliminar con ID: {}", id);
            }
        } catch (Exception e) {
            logger.error("Error al eliminar personal con ID: {}", id, e);
            throw e;
        }
    }

    /** Cuenta el personal activo de una sede, validando antes que exista. */
    @Override
    public Long contarPersonalPorHospital(Long hospitalId) {
        logger.info("Contando personal en hospital ID: {}", hospitalId);
        try {
            logger.debug("Validando existencia del hospital ID: {}", hospitalId);
            HospitalDTO hospital = hospitalClient.obtenerHospitalPorId(hospitalId);
            if (hospital == null) {
                String mensaje = "El hospital con ID " + hospitalId + " no existe en el sistema";
                logger.warn("[PersonalService] {}", mensaje);
                throw new RuntimeException(mensaje);
            }
            logger.debug("Hospital validado: {}", hospital.getNombre());
            Long count = personalRepository.countPersonalByHospital(hospitalId);
            logger.info("Hospital ID: {} tiene {} registros de personal", hospitalId, count);
            return count;
        } catch (Exception e) {
            logger.error("Error al contar personal en hospital ID: {}", hospitalId, e);
            throw e;
        }
    }

    /** Profesional activo por RUT, o null si no existe. */
    @Override
    public PersonalDTO obtenerPorRut(String rut) {
        logger.info("Obteniendo personal con RUT: {}", rut);
        try {
            Optional<Personal> personal = personalRepository.findByRutAndActivoTrue(rut);
            if (personal.isPresent()) {
                logger.info("Personal encontrado con RUT: {}", rut);
                return convertToDTO(personal.get());
            } else {
                logger.warn("Personal no encontrado con RUT: {}", rut);
                return null;
            }
        } catch (Exception e) {
            logger.error("Error al obtener personal por RUT: {}", rut, e);
            throw e;
        }
    }

    /** Profesional activo por correo, o null si no existe. */
    @Override
    public PersonalDTO obtenerPorEmail(String email) {
        logger.info("Obteniendo personal con email: {}", email);
        try {
            Optional<Personal> personal = personalRepository.findByEmailAndActivoTrue(email);
            if (personal.isPresent()) {
                logger.info("Personal encontrado con email: {}", email);
                return convertToDTO(personal.get());
            } else {
                logger.warn("Personal no encontrado con email: {}", email);
                return null;
            }
        } catch (Exception e) {
            logger.error("Error al obtener personal por email: {}", email, e);
            throw e;
        }
    }

    /** Todo el personal, también los desactivados (panel de administración). */
    @Override
    public List<PersonalDTO> obtenerTodosIncluyendoInactivos() {
        logger.info("Obteniendo todo el personal, incluidos los inactivos");
        return personalRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    /** Activa o desactiva un profesional; 404 si no existe. */
    @Override
    public PersonalDTO cambiarEstado(Long id, boolean activo) {
        logger.info("Cambiando estado del personal ID {} a activo={}", id, activo);
        Personal personal = personalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Personal con ID " + id + " no encontrado"));
        personal.setActivo(activo);
        return convertToDTO(personalRepository.save(personal));
    }

    /** Entidad → DTO. */
    private PersonalDTO convertToDTO(Personal personal) {
        PersonalDTO dto = new PersonalDTO();
        dto.setId(personal.getId());
        dto.setNombre(personal.getNombre());
        dto.setRut(personal.getRut());
        dto.setEmail(personal.getEmail());
        dto.setTelefono(personal.getTelefono());
        dto.setRol(personal.getRol());
        dto.setEspecialidad(personal.getEspecialidad());
        dto.setNumeroColegiatura(personal.getNumeroColegiatura());
        dto.setDepartamento(personal.getDepartamento());
        dto.setHospitalId(personal.getHospitalId());
        dto.setDescripcion(personal.getDescripcion());
        dto.setImagenUrl(personal.getImagenUrl());
        dto.setFechaIngreso(personal.getFechaIngreso());
        dto.setActivo(personal.getActivo());
        return dto;
    }
}
