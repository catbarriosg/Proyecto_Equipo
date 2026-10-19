package com.SmartHealth.ms_insumos.services;

import com.SmartHealth.ms_insumos.clients.HospitalClient;
import com.SmartHealth.ms_insumos.dtos.HospitalDTO;
import com.SmartHealth.ms_insumos.models.Insumo;
import com.SmartHealth.ms_insumos.repositories.InsumoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InsumoServiceImpl implements InsumoService {

    private static final Logger logger = LoggerFactory.getLogger(InsumoServiceImpl.class);

    @Autowired
    private InsumoRepository insumoRepository;

    @Autowired
    private HospitalClient hospitalClient;

    private void cargarHospital(Insumo insumo) {
        if (insumo == null || insumo.getHospitalUbicacionId() == null) {
            return;
        }
        try {
            logger.info("Intentando cargar datos del hospital para insumo ID: {}", insumo.getId());
            HospitalDTO hospital = hospitalClient.obtenerPorId(insumo.getHospitalUbicacionId());
            logger.info("Hospital cargado: ID={}, Nombre={}", hospital.getId(), hospital.getNombre());
            insumo.setHospitalData(hospital);
        } catch (Exception e) {
            logger.warn("No se pudo cargar el hospital ID {} para insumo: {}", insumo.getHospitalUbicacionId(), e.getMessage());
        }
    }

    @Override
    public List<Insumo> listarTodosActivos() {
        List<Insumo> insumos = insumoRepository.findByActivoTrue();
        insumos.forEach(this::cargarHospital);
        return insumos;
    }

    @Override
    public Insumo buscarPorCodigo(String codigo) {
        // Retorna el insumo si existe, si no, lanza un error controlado
        Insumo insumo = insumoRepository.findByCodigo(codigo)
                .orElseThrow(() -> new RuntimeException("Insumo con código " + codigo + " no encontrado"));
        cargarHospital(insumo);
        return insumo;
    }

    @Override
    public Insumo guardarInsumo(Insumo insumo) {
        // Aquí validamos si el código ya existe antes de guardar
        if (insumoRepository.findByCodigo(insumo.getCodigo()).isPresent()) {
            throw new RuntimeException("Ya existe un insumo con el código: " + insumo.getCodigo());
        }
        Insumo guardado = insumoRepository.save(insumo);
        cargarHospital(guardado);
        return guardado;
    }

    @Override
    public void eliminarInsumo(String codigo) {
        Insumo insumo = buscarPorCodigo(codigo);
        insumo.setActivo(false); // Aplicamos el soft delete
        insumoRepository.save(insumo);
    }
}