package com.SmartHealth.ms_pacientes.services;

import com.SmartHealth.ms_pacientes.clients.HistorialClient;
import com.SmartHealth.ms_pacientes.models.Paciente;
import com.SmartHealth.ms_pacientes.models.dtos.HistorialDTO;
import com.SmartHealth.ms_pacientes.repositories.PacienteRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PacienteServiceImpl implements PacienteService {

    private static final Logger logger = LoggerFactory.getLogger(PacienteServiceImpl.class);

    @Autowired
    private PacienteRepository repository;
    
    @Autowired
    private HistorialClient historialClient;

    private void cargarHistorialClinico(Paciente paciente) {
        try {
            logger.info("Intentando cargar historial para paciente ID: {}", paciente.getId());
            List<HistorialDTO> historiales = historialClient.obtenerPorIdPaciente(paciente.getId());
            logger.info("Respuesta del Feign Client: {} registros encontrados", historiales.size());
            if (!historiales.isEmpty()) {
                Long idHistorial = historiales.get(0).getId();
                paciente.setIdHistorialClinico(idHistorial);
                logger.info("Historial cargado: ID={}", idHistorial);
            } else {
                logger.warn("No hay historiales para paciente ID: {}", paciente.getId());
            }
        } catch (Exception e) {
            logger.error("Error al cargar historial para paciente ID {}: {}", paciente.getId(), e.getMessage(), e);
        }
    }

    @Override
    public List<Paciente> obtenerTodos() {
        List<Paciente> pacientes = repository.findByActivoTrue();
        pacientes.forEach(this::cargarHistorialClinico);
        return pacientes;
    }

    @Override
    public Paciente guardarPaciente(Paciente paciente) {
        return repository.save(paciente);
    }

    @Override
    public Paciente obtenerPorRut(String rut) {
        Paciente paciente = repository.findByRut(rut)
                .orElseThrow(() -> new RuntimeException("Paciente con RUT " + rut + " no encontrado en el sistema."));
        cargarHistorialClinico(paciente);
        return paciente;
    }

    @Override
    public Paciente obtenerPorId(Long id) {
        Paciente paciente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paciente con ID " + id + " no encontrado."));
        cargarHistorialClinico(paciente);
        return paciente;
    }

    @Override
    public Paciente eliminarPaciente(Long id) {
        Paciente paciente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("No se puede eliminar: Paciente con ID " + id + " no existe."));

        paciente.setActivo(false);
        return repository.save(paciente); 
    }

    @Override
    public Paciente actualizarPaciente(Long id, Paciente datosNuevos) {
        return repository.findById(id).map(p -> {
            p.setNombreCompleto(datosNuevos.getNombreCompleto());
            p.setCorreo(datosNuevos.getCorreo());
            p.setIdHistorialClinico(datosNuevos.getIdHistorialClinico());
            return repository.save(p);
        }).orElseThrow(() -> new RuntimeException("Paciente no encontrado para actualizar"));
    }
}