package com.SmartHealth.ms_historial.services;

import com.SmartHealth.ms_historial.clients.PacienteClient;
import com.SmartHealth.ms_historial.dtos.HistorialDTO;
import com.SmartHealth.ms_historial.exceptions.ApiException;
import com.SmartHealth.ms_historial.models.HistorialClinico;
import com.SmartHealth.ms_historial.models.PacienteDTO;
import com.SmartHealth.ms_historial.repositories.HistorialRepository;
import com.SmartHealth.ms_historial.seguridad.Identidad;
import feign.FeignException;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class HistorialServiceImpl implements HistorialService {

    private static final Logger log = LoggerFactory.getLogger(HistorialServiceImpl.class);
    private static final Comparator<HistorialClinico> MAS_RECIENTE_PRIMERO =
            Comparator.comparing(HistorialClinico::getFecha, Comparator.nullsLast(Comparator.reverseOrder()))
                    .thenComparing(HistorialClinico::getId, Comparator.reverseOrder());

    private final HistorialRepository repository;
    private final PacienteClient pacienteClient;

    public HistorialServiceImpl(HistorialRepository repository, PacienteClient pacienteClient) {
        this.repository = repository;
        this.pacienteClient = pacienteClient;
    }

    @Override
    public List<HistorialDTO> obtenerTodos() {
        return repository.findAll().stream().sorted(MAS_RECIENTE_PRIMERO).map(this::convertirADTO).toList();
    }

    @Override
    public HistorialDTO obtenerPorId(Long id) {
        HistorialClinico historial = repository.findById(id)
                .orElseThrow(() -> ApiException.noEncontrado("No encontramos el historial con ID " + id + "."));
        verificarAcceso(historial.getIdPaciente());
        return convertirADTO(historial);
    }

    @Override
    public HistorialDTO guardar(HistorialDTO historialDTO) {
        log.info("[HistorialService] Guardando nuevo historial para paciente ID: {}", historialDTO.getIdPaciente());
        validarPacienteExiste(historialDTO.getIdPaciente());

        Identidad yo = Identidad.actual();
        HistorialClinico historial = convertirAEntidad(historialDTO);
        if (historial.getFecha() == null) {
            historial.setFecha(LocalDate.now());
        }
        // Si registra un médico, la atención queda a su nombre aunque el formulario no lo indique
        if (yo.esMedico() && historial.getIdMedico() == null) {
            historial.setIdMedico(yo.personalId());
        }
        HistorialClinico guardado = repository.save(historial);
        log.info("[HistorialService] Historial guardado exitosamente con ID: {}", guardado.getId());
        return convertirADTO(guardado);
    }

    /** Valida que el paciente existe y está activo en ms-pacientes. */
    private void validarPacienteExiste(Long idPaciente) {
        try {
            PacienteDTO paciente = pacienteClient.findById(idPaciente);
            if (paciente == null || !Boolean.TRUE.equals(paciente.getActivo())) {
                throw ApiException.solicitudInvalida("El paciente con ID " + idPaciente + " está inactivo.");
            }
        } catch (FeignException.NotFound e) {
            throw ApiException.solicitudInvalida("El paciente con ID " + idPaciente + " no existe.");
        }
    }

    /** Lista vacía si el paciente aún no tiene atenciones (no es un error). */
    @Override
    public List<HistorialDTO> obtenerPorPaciente(Long idPaciente) {
        verificarAcceso(idPaciente);
        return repository.findByIdPaciente(idPaciente).stream()
                .sorted(MAS_RECIENTE_PRIMERO)
                .map(this::convertirADTO)
                .toList();
    }

    @Override
    public void eliminar(Long id) {
        if (!repository.existsById(id)) {
            throw ApiException.noEncontrado("No se pudo eliminar: el historial con ID " + id + " no existe.");
        }
        repository.deleteById(id);
        log.info("[HistorialService] Historial eliminado exitosamente con ID: {}", id);
    }

    /** Un paciente solo puede ver su propio historial. */
    private static void verificarAcceso(Long idPaciente) {
        Identidad yo = Identidad.actual();
        if (yo.esPaciente() && !idPaciente.equals(yo.pacienteId())) {
            throw ApiException.prohibido("Solo puedes consultar tu propio historial de atenciones.");
        }
    }

    private HistorialDTO convertirADTO(HistorialClinico historial) {
        return new HistorialDTO(
                historial.getId(),
                historial.getDiagnostico(),
                historial.getTratamiento(),
                historial.getIdPaciente(),
                historial.getFecha(),
                historial.getMotivo(),
                historial.getEspecialidad(),
                historial.getIdMedico(),
                historial.getMedicoNombre(),
                historial.getIdCita()
        );
    }

    private HistorialClinico convertirAEntidad(HistorialDTO dto) {
        HistorialClinico historial = new HistorialClinico();
        historial.setDiagnostico(dto.getDiagnostico());
        historial.setTratamiento(dto.getTratamiento());
        historial.setIdPaciente(dto.getIdPaciente());
        historial.setFecha(dto.getFecha());
        historial.setMotivo(dto.getMotivo());
        historial.setEspecialidad(dto.getEspecialidad());
        historial.setIdMedico(dto.getIdMedico());
        historial.setMedicoNombre(dto.getMedicoNombre());
        historial.setIdCita(dto.getIdCita());
        return historial;
    }
}
