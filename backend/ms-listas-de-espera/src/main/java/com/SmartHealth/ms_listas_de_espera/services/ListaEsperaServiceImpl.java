package com.SmartHealth.ms_listas_de_espera.services;

import com.SmartHealth.ms_listas_de_espera.clients.HospitalClient;
import com.SmartHealth.ms_listas_de_espera.clients.PacienteClient;
import com.SmartHealth.ms_listas_de_espera.dtos.ListaEsperaDTO;
import com.SmartHealth.ms_listas_de_espera.exceptions.ResourceNotFoundException;
import com.SmartHealth.ms_listas_de_espera.enums.EstadoListaEspera;
import com.SmartHealth.ms_listas_de_espera.models.HospitalDTO;
import com.SmartHealth.ms_listas_de_espera.models.ListaEspera;
import com.SmartHealth.ms_listas_de_espera.models.PacienteDTO;
import com.SmartHealth.ms_listas_de_espera.repositories.ListaEsperaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ListaEsperaServiceImpl implements IListaEsperaService {

    private static final Logger logger = LoggerFactory.getLogger(ListaEsperaServiceImpl.class);

    @Autowired
    private ListaEsperaRepository listaEsperaRepository;
    
    @Autowired
    private PacienteClient pacienteClient;
    
    @Autowired
    private HospitalClient hospitalClient;

    @Override
    public ListaEsperaDTO crearListaEspera(ListaEsperaDTO listaEsperaDTO) {
        logger.info("Creando nueva lista de espera para paciente ID: {} y hospital ID: {}", 
            listaEsperaDTO.getIdPaciente(), listaEsperaDTO.getIdHospital());
        try {
            logger.info("Validando paciente ID: {}", listaEsperaDTO.getIdPaciente());
            PacienteDTO paciente = pacienteClient.findById(listaEsperaDTO.getIdPaciente());
            if (paciente == null) {
                logger.error("Paciente no encontrado ID: {}", listaEsperaDTO.getIdPaciente());
                throw new ResourceNotFoundException("Paciente con ID " + listaEsperaDTO.getIdPaciente() + " no existe");
            }
            logger.info("Paciente validado: {}", paciente.getRut());
            
            logger.info("Validando hospital ID: {}", listaEsperaDTO.getIdHospital());
            HospitalDTO hospital = hospitalClient.findById(listaEsperaDTO.getIdHospital());
            if (hospital == null) {
                logger.error("Hospital no encontrado ID: {}", listaEsperaDTO.getIdHospital());
                throw new ResourceNotFoundException("Hospital con ID " + listaEsperaDTO.getIdHospital() + " no existe");
            }
            logger.info("Hospital validado: {}", hospital.getNombre());
            
            ListaEspera listaEspera = new ListaEspera();
            listaEspera.setIdPaciente(listaEsperaDTO.getIdPaciente());
            listaEspera.setIdProcedimiento(listaEsperaDTO.getIdProcedimiento());
            listaEspera.setNombreProcedimiento(listaEsperaDTO.getNombreProcedimiento());
            listaEspera.setIdHospital(listaEsperaDTO.getIdHospital());
            listaEspera.setNombreHospital(listaEsperaDTO.getNombreHospital());
            listaEspera.setPrioridad(listaEsperaDTO.getPrioridad());
            listaEspera.setEstado(listaEsperaDTO.getEstado());
            listaEspera.setFechaProgramada(listaEsperaDTO.getFechaProgramada());
            listaEspera.setNotas(listaEsperaDTO.getNotas());
            listaEspera.setActivo(listaEsperaDTO.getActivo());

            ListaEspera guardada = listaEsperaRepository.save(listaEspera);
            logger.info("Lista de espera creada exitosamente con ID: {}", guardada.getId());

            return convertToDTO(guardada);
        } catch (Exception e) {
            logger.error("Error al crear lista de espera para paciente ID: {}", listaEsperaDTO.getIdPaciente(), e);
            throw e;
        }
    }

    @Override
    public ListaEsperaDTO obtenerPorId(Long id) {
        logger.info("Obteniendo lista de espera con ID: {}", id);
        try {
            Optional<ListaEspera> listaEspera = listaEsperaRepository.findByIdAndActivoTrue(id);
            if (listaEspera.isPresent()) {
                logger.info("Lista de espera encontrada con ID: {}", id);
                return convertToDTO(listaEspera.get());
            } else {
                logger.warn("Lista de espera no encontrada con ID: {}", id);
                return null;
            }
        } catch (Exception e) {
            logger.error("Error al obtener lista de espera con ID: {}", id, e);
            throw e;
        }
    }

    @Override
    public List<ListaEsperaDTO> obtenerTodas() {
        logger.info("Obteniendo todas las listas de espera");
        try {
            List<ListaEspera> listas = listaEsperaRepository.findByActivoTrue();
            logger.info("Se recuperaron {} listas de espera", listas.size());
            return listas.stream().map(this::convertToDTO).collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error al obtener todas las listas de espera", e);
            throw e;
        }
    }

    @Override
    public List<ListaEsperaDTO> obtenerPorPaciente(Long idPaciente) {
        logger.info("Obteniendo listas de espera del paciente ID: {}", idPaciente);
        try {
            logger.debug("Validando existencia del paciente ID: {}", idPaciente);
            PacienteDTO paciente = pacienteClient.findById(idPaciente);
            if (paciente == null) {
                String mensaje = "Paciente con ID " + idPaciente + " no encontrado en el sistema";
                logger.warn("[ListaEsperaService] {}", mensaje);
                throw new ResourceNotFoundException(mensaje);
            }
            logger.debug("Paciente validado: {}", paciente.getRut());
            
            List<ListaEspera> listas = listaEsperaRepository.findByIdPacienteAndActivoTrue(idPaciente);
            logger.info("Se recuperaron {} listas para paciente ID: {}", listas.size(), idPaciente);
            return listas.stream().map(this::convertToDTO).collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error al obtener listas de paciente ID: {}", idPaciente, e);
            throw e;
        }
    }

    @Override
    public List<ListaEsperaDTO> obtenerPorHospital(Long idHospital) {
        logger.info("Obteniendo listas de espera del hospital ID: {}", idHospital);
        try {
            logger.debug("Validando existencia del hospital ID: {}", idHospital);
            HospitalDTO hospital = hospitalClient.findById(idHospital);
            if (hospital == null) {
                String mensaje = "Hospital con ID " + idHospital + " no encontrado en el sistema";
                logger.warn("[ListaEsperaService] {}", mensaje);
                throw new ResourceNotFoundException(mensaje);
            }
            logger.debug("Hospital validado: {}", hospital.getNombre());
            
            List<ListaEspera> listas = listaEsperaRepository.findByIdHospitalOrderedByPriority(idHospital);
            logger.info("Se recuperaron {} listas para hospital ID: {}", listas.size(), idHospital);
            return listas.stream().map(this::convertToDTO).collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error al obtener listas de hospital ID: {}", idHospital, e);
            throw e;
        }
    }

    @Override
    public List<ListaEsperaDTO> obtenerPorEstado(String estado) {
        logger.info("Obteniendo listas de espera con estado: {}", estado);
        try {
            logger.debug("Validando estado: {}", estado);
            if (!EstadoListaEspera.isValido(estado)) {
                String estadosValidos = EstadoListaEspera.getEstadosValidos();
                String mensaje = "Estado inválido: '" + estado + "'. Estados válidos: " + estadosValidos;
                logger.warn("[ListaEsperaService] {}", mensaje);
                throw new RuntimeException(mensaje);
            }
            
            List<ListaEspera> listas = listaEsperaRepository.findByEstadoAndActivoTrue(estado);
            logger.info("Se recuperaron {} listas con estado: {}", listas.size(), estado);
            return listas.stream().map(this::convertToDTO).collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error al obtener listas con estado: {}", estado, e);
            throw e;
        }
    }

    @Override
    public ListaEsperaDTO actualizarListaEspera(Long id, ListaEsperaDTO listaEsperaDTO) {
        logger.info("Actualizando lista de espera con ID: {}", id);
        try {
            Optional<ListaEspera> existente = listaEsperaRepository.findByIdAndActivoTrue(id);
            if (existente.isPresent()) {
                ListaEspera listaEspera = existente.get();
                listaEspera.setNombreProcedimiento(listaEsperaDTO.getNombreProcedimiento());
                listaEspera.setPrioridad(listaEsperaDTO.getPrioridad());
                listaEspera.setFechaProgramada(listaEsperaDTO.getFechaProgramada());
                listaEspera.setNotas(listaEsperaDTO.getNotas());

                ListaEspera actualizada = listaEsperaRepository.save(listaEspera);
                logger.info("Lista de espera actualizada exitosamente con ID: {}", id);
                return convertToDTO(actualizada);
            } else {
                logger.warn("Lista de espera no encontrada para actualizar con ID: {}", id);
                return null;
            }
        } catch (Exception e) {
            logger.error("Error al actualizar lista de espera con ID: {}", id, e);
            throw e;
        }
    }

    @Override
    public void eliminarListaEspera(Long id) {
        logger.info("Eliminando lista de espera con ID: {}", id);
        try {
            Optional<ListaEspera> existente = listaEsperaRepository.findByIdAndActivoTrue(id);
            if (existente.isPresent()) {
                ListaEspera listaEspera = existente.get();
                listaEspera.setActivo(false);
                listaEsperaRepository.save(listaEspera);
                logger.info("Lista de espera eliminada (soft-delete) con ID: {}", id);
            } else {
                logger.warn("Lista de espera no encontrada para eliminar con ID: {}", id);
            }
        } catch (Exception e) {
            logger.error("Error al eliminar lista de espera con ID: {}", id, e);
            throw e;
        }
    }

    @Override
    public Long contarPendientesPorHospital(Long idHospital) {
        logger.info("Contando registros pendientes en hospital ID: {}", idHospital);
        try {
            logger.debug("Validando existencia del hospital ID: {}", idHospital);
            HospitalDTO hospital = hospitalClient.findById(idHospital);
            if (hospital == null) {
                String mensaje = "Hospital con ID " + idHospital + " no encontrado en el sistema";
                logger.warn("[ListaEsperaService] {}", mensaje);
                throw new ResourceNotFoundException(mensaje);
            }
            logger.debug("Hospital validado: {}", hospital.getNombre());
            
            Long count = listaEsperaRepository.countPendientesInHospital(idHospital);
            logger.info("Hospital ID: {} tiene {} registros pendientes", idHospital, count);
            return count;
        } catch (Exception e) {
            logger.error("Error al contar pendientes en hospital ID: {}", idHospital, e);
            throw e;
        }
    }

    @Override
    public Long contarPendientesPorPaciente(Long idPaciente) {
        logger.info("Contando registros pendientes para paciente ID: {}", idPaciente);
        try {
            logger.debug("Validando existencia del paciente ID: {}", idPaciente);
            PacienteDTO paciente = pacienteClient.findById(idPaciente);
            if (paciente == null) {
                String mensaje = "Paciente con ID " + idPaciente + " no encontrado en el sistema";
                logger.warn("[ListaEsperaService] {}", mensaje);
                throw new ResourceNotFoundException(mensaje);
            }
            logger.debug("Paciente validado: {}", paciente.getRut());
            
            Long count = listaEsperaRepository.countPendientesPaciente(idPaciente);
            logger.info("Paciente ID: {} tiene {} registros pendientes", idPaciente, count);
            return count;
        } catch (Exception e) {
            logger.error("Error al contar pendientes para paciente ID: {}", idPaciente, e);
            throw e;
        }
    }

    @Override
    public ListaEsperaDTO cambiarEstado(Long id, String nuevoEstado) {
        logger.info("Cambiando estado a '{}' para lista de espera ID: {}", nuevoEstado, id);
        try {
            logger.debug("Validando nuevo estado: {}", nuevoEstado);
            if (!EstadoListaEspera.isValido(nuevoEstado)) {
                String estadosValidos = EstadoListaEspera.getEstadosValidos();
                String mensaje = "Estado inválido: '" + nuevoEstado + "'. Estados válidos: " + estadosValidos;
                logger.warn("[ListaEsperaService] {}", mensaje);
                throw new RuntimeException(mensaje);
            }
            
            Optional<ListaEspera> existente = listaEsperaRepository.findByIdAndActivoTrue(id);
            if (existente.isPresent()) {
                ListaEspera listaEspera = existente.get();
                String estadoAnterior = listaEspera.getEstado();
                listaEspera.setEstado(nuevoEstado);

                ListaEspera actualizada = listaEsperaRepository.save(listaEspera);
                logger.info("Estado actualizado de '{}' a '{}' para lista ID: {}", estadoAnterior, nuevoEstado, id);
                return convertToDTO(actualizada);
            } else {
                logger.warn("Lista de espera no encontrada para cambiar estado con ID: {}", id);
                return null;
            }
        } catch (Exception e) {
            logger.error("Error al cambiar estado para lista de espera ID: {}", id, e);
            throw e;
        }
    }

    @Override
    public List<ListaEsperaDTO> obtenerListasOrdenadas() {
        logger.info("Obteniendo listas de espera ordenadas por prioridad");
        try {
            List<ListaEspera> listas = listaEsperaRepository.findAllActivoOrderedByPriority();
            logger.info("Se recuperaron {} listas ordenadas", listas.size());
            return listas.stream().map(this::convertToDTO).collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error al obtener listas ordenadas", e);
            throw e;
        }
    }

    private ListaEsperaDTO convertToDTO(ListaEspera listaEspera) {
        ListaEsperaDTO dto = new ListaEsperaDTO();
        dto.setId(listaEspera.getId());
        dto.setIdPaciente(listaEspera.getIdPaciente());
        dto.setIdProcedimiento(listaEspera.getIdProcedimiento());
        dto.setNombreProcedimiento(listaEspera.getNombreProcedimiento());
        dto.setIdHospital(listaEspera.getIdHospital());
        dto.setNombreHospital(listaEspera.getNombreHospital());
        dto.setPrioridad(listaEspera.getPrioridad());
        dto.setEstado(listaEspera.getEstado());
        dto.setFechaIngreso(listaEspera.getFechaIngreso());
        dto.setFechaProgramada(listaEspera.getFechaProgramada());
        dto.setNotas(listaEspera.getNotas());
        dto.setActivo(listaEspera.getActivo());
        return dto;
    }
}
