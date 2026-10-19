package com.SmartHealth.ms_hospitales.services;

import com.SmartHealth.ms_hospitales.models.Hospital;
import com.SmartHealth.ms_hospitales.repositories.HospitalRepository;
import com.SmartHealth.ms_hospitales.enums.RegionChile;
import com.SmartHealth.ms_hospitales.exceptions.ApiException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HospitalServiceImpl implements HospitalService {

    private static final Logger log = LoggerFactory.getLogger(HospitalServiceImpl.class);

    @Autowired
    private HospitalRepository repository;

    @Override
    public List<Hospital> obtenerTodos() {
        log.debug("[HospitalService] Consultando todos los hospitales activos");
        List<Hospital> hospitales = repository.findByActivoTrue();
        log.info("[HospitalService] Se encontraron {} hospitales activos", hospitales.size());
        return hospitales;
    }

    @Override
    public Hospital obtenerPorId(Long id) {
        log.debug("[HospitalService] Buscando hospital con ID: {}", id);
        Hospital hospital = repository.findById(id)
                .orElseThrow(() -> {
                    log.warn("[HospitalService] Hospital con ID {} no encontrado", id);
                    return ApiException.noEncontrado("No encontramos la sucursal con ID " + id + ".");
                });
        log.info("[HospitalService] Hospital encontrado: {}", hospital.getNombre());
        return hospital;
    }

    @Override
    public List<Hospital> obtenerPorRegion(String region) {
        log.debug("[HospitalService] Validando región: {}", region);
        
        // Validar si la región existe
        if (!RegionChile.isValida(region)) {
            String regionesValidas = RegionChile.getRegionesValidas();
            String mensaje = "Región inválida: '" + region + "'. Regiones válidas: " + regionesValidas;
            log.warn("[HospitalService] {}", mensaje);
            throw ApiException.solicitudInvalida(mensaje);
        }
        
        log.debug("[HospitalService] Buscando hospitales en región: {}", region);
        List<Hospital> hospitales = repository.findByRegionAndActivoTrue(region);
        log.info("[HospitalService] {} hospitales encontrados en región '{}'", hospitales.size(), region);
        return hospitales;
    }

    @Override
    public List<Hospital> obtenerPorComplejidad(String nivelComplejidad) {
        log.debug("[HospitalService] Validando nivel de complejidad: {}", nivelComplejidad);
        
        // Validar si el nivel es válido
        if (!nivelComplejidad.matches("^(BAJA|MEDIANA|ALTA)$")) {
            String mensaje = "Nivel de complejidad inválido: '" + nivelComplejidad + "'. Niveles válidos: BAJA, MEDIANA, ALTA";
            log.warn("[HospitalService] {}", mensaje);
            throw ApiException.solicitudInvalida(mensaje);
        }
        
        log.debug("[HospitalService] Buscando hospitales con complejidad: {}", nivelComplejidad);
        List<Hospital> hospitales = repository.findByNivelComplejidadAndActivoTrue(nivelComplejidad.toUpperCase());
        log.info("[HospitalService] {} hospitales encontrados con complejidad '{}'", hospitales.size(), nivelComplejidad);
        return hospitales;
    }

    @Override
    public Hospital guardarHospital(Hospital hospital) {
        log.debug("[HospitalService] Intentando registrar hospital: {}", hospital.getNombre());

        if (repository.existsByTelefono(hospital.getTelefono())) {
            log.warn("[HospitalService] Ya existe un hospital con el teléfono: {}", hospital.getTelefono());
            throw ApiException.conflicto("Ya existe una sucursal registrada con ese número de teléfono.");
        }
        if (repository.existsByCorreoInstitucional(hospital.getCorreoInstitucional())) {
            log.warn("[HospitalService] Ya existe un hospital con el correo: {}", hospital.getCorreoInstitucional());
            throw ApiException.conflicto("Ya existe una sucursal registrada con ese correo institucional.");
        }

        Hospital guardado = repository.save(hospital);
        log.info("[HospitalService] Hospital '{}' registrado con ID: {}", guardado.getNombre(), guardado.getId());
        return guardado;
    }

    @Override
    public Hospital actualizarHospital(Long id, Hospital datosNuevos) {
        log.debug("[HospitalService] Actualizando hospital con ID: {}", id);
        return repository.findById(id).map(h -> {
            h.setNombre(datosNuevos.getNombre());
            h.setDireccion(datosNuevos.getDireccion());
            h.setRegion(datosNuevos.getRegion());
            h.setComuna(datosNuevos.getComuna());
            h.setTelefono(datosNuevos.getTelefono());
            h.setCorreoInstitucional(datosNuevos.getCorreoInstitucional());
            h.setNivelComplejidad(datosNuevos.getNivelComplejidad());
            h.setCapacidadTotalCamas(datosNuevos.getCapacidadTotalCamas());
            h.setHorario(datosNuevos.getHorario());
            h.setImagenUrl(datosNuevos.getImagenUrl());
            h.setDescripcionImagen(datosNuevos.getDescripcionImagen());
            Hospital actualizado = repository.save(h);
            log.info("[HospitalService] Hospital ID {} actualizado correctamente", id);
            return actualizado;
        }).orElseThrow(() -> {
            log.error("[HospitalService] No se pudo actualizar: hospital con ID {} no existe", id);
            return ApiException.noEncontrado("No encontramos la sucursal con ID " + id + ".");
        });
    }

    @Override
    public Hospital desactivarHospital(Long id) {
        log.debug("[HospitalService] Desactivando hospital con ID: {}", id);
        Hospital hospital = repository.findById(id)
                .orElseThrow(() -> {
                    log.warn("[HospitalService] No se puede desactivar: hospital con ID {} no existe", id);
                    return ApiException.noEncontrado("No encontramos la sucursal con ID " + id + ".");
                });
        hospital.setActivo(false);
        Hospital desactivado = repository.save(hospital);
        log.info("[HospitalService] Hospital '{}' (ID: {}) desactivado del sistema", hospital.getNombre(), id);
        return desactivado;
    }
}
