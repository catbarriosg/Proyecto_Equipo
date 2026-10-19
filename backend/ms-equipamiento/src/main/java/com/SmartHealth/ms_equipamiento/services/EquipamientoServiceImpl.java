package com.SmartHealth.ms_equipamiento.services;

import com.SmartHealth.ms_equipamiento.clients.HospitalClient;
import com.SmartHealth.ms_equipamiento.dtos.EquipamientoDTO;
import com.SmartHealth.ms_equipamiento.exceptions.ResourceNotFoundException;
import com.SmartHealth.ms_equipamiento.models.Equipamiento;
import com.SmartHealth.ms_equipamiento.models.HospitalDTO;
import com.SmartHealth.ms_equipamiento.repositories.EquipamientoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EquipamientoServiceImpl implements EquipamientoService {

    private static final Logger logger = LoggerFactory.getLogger(EquipamientoServiceImpl.class);

    @Autowired
    private EquipamientoRepository equipamientoRepository;
    
    @Autowired
    private HospitalClient hospitalClient;

    @Override
    public List<Equipamiento> listarTodos() {
        logger.info("Listando TODOS los equipamientos (incluyendo inactivos)");
        return equipamientoRepository.findAll();
    }

    @Override
    public List<Equipamiento> listarTodosActivos() {
        return equipamientoRepository.findByActivoTrue();
    }

    @Override
    public List<Equipamiento> listarPorEstado(String estado) {
        logger.info("Listando equipamiento por estado: {}", estado);
        
        // Validar que el estado es válido
        if (!com.SmartHealth.ms_equipamiento.models.EstadoEquipamiento.isValido(estado)) {
            logger.warn("Estado inválido solicitado: {}", estado);
            String estadosValidos = com.SmartHealth.ms_equipamiento.models.EstadoEquipamiento.getEstadosValidos();
            throw new RuntimeException("Estado inválido: '" + estado + "'. Estados válidos: " + estadosValidos);
        }
        
        return equipamientoRepository.findByEstadoAndActivoTrue(estado);
    }

    @Override
    public List<Equipamiento> listarPorHospital(Long hospitalId) {
        logger.info("Listando equipamiento por hospital ID: {}", hospitalId);
        
        // Validar que el hospital existe
        validarHospitalExiste(hospitalId);
        
        return equipamientoRepository.findByHospitalUbicacionIdAndActivoTrue(hospitalId);
    }

    @Override
    public Equipamiento buscarPorNumeroSerie(String numeroSerie) {
        return equipamientoRepository.findByNumeroSerie(numeroSerie)
                .orElseThrow(() -> new RuntimeException("Equipo con número de serie " + numeroSerie + " no encontrado"));
    }

    @Override
    public Equipamiento guardarEquipamiento(Equipamiento equipamiento) {
        logger.info("Guardando equipamiento con número de serie: {}", equipamiento.getNumeroSerie());
        try {
            if (equipamientoRepository.findByNumeroSerie(equipamiento.getNumeroSerie()).isPresent()) {
                throw new RuntimeException("Ya existe un equipo registrado con el número de serie: " + equipamiento.getNumeroSerie());
            }
            
            logger.info("Validando hospital ID: {}", equipamiento.getHospitalUbicacionId());
            HospitalDTO hospital = hospitalClient.findById(equipamiento.getHospitalUbicacionId());
            if (hospital == null) {
                logger.error("Hospital no encontrado ID: {}", equipamiento.getHospitalUbicacionId());
                throw new ResourceNotFoundException("Hospital con ID " + equipamiento.getHospitalUbicacionId() + " no existe");
            }
            logger.info("Hospital validado: {}", hospital.getNombre());
            
            return equipamientoRepository.save(equipamiento);
        } catch (Exception e) {
            logger.error("Error al guardar equipamiento con número de serie: {}", equipamiento.getNumeroSerie(), e);
            throw e;
        }
    }

    @Override
    public Equipamiento actualizarEquipamiento(String numeroSerie, Equipamiento equipamientoActualizado) {
        Equipamiento equipo = buscarPorNumeroSerie(numeroSerie);
        logger.info("Actualizando equipamiento con número de serie: {}", numeroSerie);
        
        if (!numeroSerie.equals(equipamientoActualizado.getNumeroSerie())) {
            if (equipamientoRepository.findByNumeroSerie(equipamientoActualizado.getNumeroSerie()).isPresent()) {
                throw new RuntimeException("Ya existe un equipo registrado con el número de serie: " + equipamientoActualizado.getNumeroSerie());
            }
        }
        
        // Validar hospital SIEMPRE (no puede ser nulo)
        if (equipamientoActualizado.getHospitalUbicacionId() == null) {
            logger.warn("Intento de actualizar equipamiento sin hospitalUbicacionId");
            throw new RuntimeException("El hospital (hospitalUbicacionId) es obligatorio");
        }
        
        HospitalDTO hospital = hospitalClient.findById(equipamientoActualizado.getHospitalUbicacionId());
        if (hospital == null || Boolean.FALSE.equals(hospital.getActivo())) {
            logger.error("Hospital no encontrado o inactivo ID: {}", equipamientoActualizado.getHospitalUbicacionId());
            throw new RuntimeException("El hospital con ID " + equipamientoActualizado.getHospitalUbicacionId() + " no existe o no está activo");
        }
        logger.info("Hospital validado: {}", hospital.getNombre());
        
        // Copiar todas las propiedades excepto el id (mantener la identidad original)
        BeanUtils.copyProperties(equipamientoActualizado, equipo, "id");
        
        return equipamientoRepository.save(equipo);
    }

    @Override
    public Equipamiento actualizarEstado(String numeroSerie, String nuevoEstado) {
        Equipamiento equipo = buscarPorNumeroSerie(numeroSerie);
        equipo.setEstado(nuevoEstado);
        return equipamientoRepository.save(equipo);
    }

    @Override
    public void eliminarEquipamiento(String numeroSerie) {
        Equipamiento equipo = buscarPorNumeroSerie(numeroSerie);
        equipo.setActivo(false);
        equipamientoRepository.save(equipo);
    }

    /**
     * Valida que el hospital con el ID especificado exista y esté activo.
     * Se comunica con ms-hospitales vía Feign.
     *
     * @param hospitalId ID del hospital a validar
     * @throws RuntimeException si no existe o no está activo
     */
    private void validarHospitalExiste(Long hospitalId) {
        try {
            logger.debug("Validando existencia de hospital ID: {}", hospitalId);
            HospitalDTO hospital = hospitalClient.findById(hospitalId);
            if (hospital == null || Boolean.FALSE.equals(hospital.getActivo())) {
                logger.warn("Hospital ID {} no activo o no encontrado", hospitalId);
                throw new RuntimeException("El hospital con ID " + hospitalId + " no existe o no está activo.");
            }
            logger.info("Hospital ID {} validado: {}", hospitalId, hospital.getNombre());
        } catch (RuntimeException ex) {
            throw ex;
        } catch (Exception ex) {
            logger.error("Error al consultar ms-hospitales para ID {}: {}", hospitalId, ex.getMessage());
            throw new RuntimeException("No se pudo verificar el hospital con ID " + hospitalId +
                    ". Asegúrese de que ms-hospitales esté disponible.");
        }
    }
}