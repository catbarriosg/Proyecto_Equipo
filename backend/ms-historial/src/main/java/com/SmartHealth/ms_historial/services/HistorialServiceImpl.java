package com.SmartHealth.ms_historial.services;

import com.SmartHealth.ms_historial.clients.PacienteClient;
import com.SmartHealth.ms_historial.dtos.HistorialDTO;
import com.SmartHealth.ms_historial.exceptions.ResourceNotFoundException;
import com.SmartHealth.ms_historial.models.HistorialClinico;
import com.SmartHealth.ms_historial.models.PacienteDTO;
import com.SmartHealth.ms_historial.repositories.HistorialRepository;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class HistorialServiceImpl implements HistorialService {

    private static final Logger log = LoggerFactory.getLogger(HistorialServiceImpl.class);
    private final HistorialRepository repository;
    private final PacienteClient pacienteClient;

    public HistorialServiceImpl(HistorialRepository repository, PacienteClient pacienteClient) {
        this.repository = repository;
        this.pacienteClient = pacienteClient;
    }

    @Override
    public List<HistorialDTO> obtenerTodos() {
        log.info("[HistorialService] Obteniendo todos los historiales");
        try {
            List<HistorialClinico> lista = repository.findAll();
            if (lista.isEmpty()) {
                log.warn("[HistorialService] No hay historiales registrados");
                throw new ResourceNotFoundException("Aún no tenemos historiales clínicos registrados. ¡La base de datos está limpia!");
            }
            log.info("[HistorialService] Historiales encontrados: {}", lista.size());
            return lista.stream().map(this::convertirADTO).collect(Collectors.toList());
        } catch (Exception e) {
            log.error("[HistorialService] Error al obtener historiales: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Override
    public HistorialDTO obtenerPorId(Long id) {
        log.info("[HistorialService] Buscando historial por ID: {}", id);
        try {
            HistorialClinico historial = repository.findById(id)
                    .orElseThrow(() -> {
                        log.warn("[HistorialService] Historial no encontrado para ID: {}", id);
                        return new ResourceNotFoundException("No encontramos el historial con ID: " + id);
                    });
            log.info("[HistorialService] Historial encontrado para ID: {}", id);
            return convertirADTO(historial);
        } catch (Exception e) {
            log.error("[HistorialService] Error al buscar historial por ID {}: {}", id, e.getMessage(), e);
            throw e;
        }
    }

    @Override
    public HistorialDTO guardar(HistorialDTO historialDTO) {
        log.info("[HistorialService] Guardando nuevo historial para paciente ID: {}", historialDTO.getIdPaciente());
        try {
            // Validar que el paciente existe antes de crear el historial
            validarPacienteExiste(historialDTO.getIdPaciente());
            
            HistorialClinico historial = convertirAEntidad(historialDTO);
            HistorialClinico guardado = repository.save(historial);
            log.info("[HistorialService] Historial guardado exitosamente con ID: {}", guardado.getId());
            return convertirADTO(guardado);
        } catch (Exception e) {
            log.error("[HistorialService] Error al guardar historial: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Valida que el paciente existe en ms-pacientes.
     * Lanza RuntimeException si el paciente no existe o está inactivo.
     */
    private void validarPacienteExiste(Long idPaciente) {
        try {
            log.info("[HistorialService] Validando existencia de paciente ID: {}", idPaciente);
            PacienteDTO paciente = pacienteClient.findById(idPaciente);
            if (paciente == null || !paciente.getActivo()) {
                throw new RuntimeException("Paciente con ID " + idPaciente + " no encontrado o inactivo");
            }
            log.info("[HistorialService] Paciente validado: {}", paciente.getRut());
        } catch (Exception e) {
            throw new RuntimeException("Error al validar paciente con ID " + idPaciente + ": " + e.getMessage());
        }
    }

    @Override
    public List<HistorialDTO> obtenerPorPaciente(Long idPaciente) {
        log.info("[HistorialService] Obteniendo historiales para paciente ID: {}", idPaciente);
        try {
            List<HistorialClinico> lista = repository.findByIdPaciente(idPaciente);
            if (lista.isEmpty()) {
                log.warn("[HistorialService] No hay historiales para paciente ID: {}", idPaciente);
                throw new ResourceNotFoundException("No encontramos ningún historial para el paciente con ID: " + idPaciente + ". Verifique el número e intente de nuevo.");
            }
            log.info("[HistorialService] Historiales encontrados para paciente ID {}: {}", idPaciente, lista.size());
            return lista.stream().map(this::convertirADTO).collect(Collectors.toList());
        } catch (Exception e) {
            log.error("[HistorialService] Error al obtener historiales para paciente {}: {}", idPaciente, e.getMessage(), e);
            throw e;
        }
    }

    @Override
    public void eliminar(Long id) {
        log.info("[HistorialService] Eliminando historial con ID: {}", id);
        try {
            if (!repository.existsById(id)) {
                log.warn("[HistorialService] Intento de eliminar historial inexistente con ID: {}", id);
                throw new ResourceNotFoundException("No se pudo eliminar: El historial con ID " + id + " no existe en nuestros registros.");
            }
            repository.deleteById(id);
            log.info("[HistorialService] Historial eliminado exitosamente con ID: {}", id);
        } catch (Exception e) {
            log.error("[HistorialService] Error al eliminar historial {}: {}", id, e.getMessage(), e);
            throw e;
        }
    }

    // Método auxiliar: Convertir entidad a DTO
    private HistorialDTO convertirADTO(HistorialClinico historial) {
        return new HistorialDTO(
                historial.getId(),
                historial.getDiagnostico(),
                historial.getTratamiento(),
                historial.getIdPaciente()
        );
    }

    // Método auxiliar: Convertir DTO a entidad
    private HistorialClinico convertirAEntidad(HistorialDTO dto) {
        HistorialClinico historial = new HistorialClinico();
        historial.setDiagnostico(dto.getDiagnostico());
        historial.setTratamiento(dto.getTratamiento());
        historial.setIdPaciente(dto.getIdPaciente());
        return historial;
    }

}