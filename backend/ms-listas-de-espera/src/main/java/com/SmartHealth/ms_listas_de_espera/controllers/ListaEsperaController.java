package com.SmartHealth.ms_listas_de_espera.controllers;

import com.SmartHealth.ms_listas_de_espera.dtos.ListaEsperaDTO;
import com.SmartHealth.ms_listas_de_espera.services.IListaEsperaService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/listas-espera")
@CrossOrigin(origins = "*")
public class ListaEsperaController {

    private static final Logger logger = LoggerFactory.getLogger(ListaEsperaController.class);

    @Autowired
    private IListaEsperaService listaEsperaService;

    @Operation(summary = "Crear nueva lista de espera para un paciente")
    @PostMapping("/crear")
    public ResponseEntity<?> crearListaEspera(@Valid @RequestBody ListaEsperaDTO listaEsperaDTO) {
        logger.info("Recibido POST /api/listas-espera/crear para paciente ID: {}", listaEsperaDTO.getIdPaciente());
        try {
            ListaEsperaDTO nuevaLista = listaEsperaService.crearListaEspera(listaEsperaDTO);
            logger.info("Lista de espera creada exitosamente");
            return new ResponseEntity<>(nuevaLista, HttpStatus.CREATED);
        } catch (Exception e) {
            logger.error("Error al crear lista de espera", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al crear lista de espera: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "Obtener lista de espera por ID")
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        logger.info("Recibido GET /api/listas-espera/{}", id);
        try {
            ListaEsperaDTO lista = listaEsperaService.obtenerPorId(id);
            if (lista != null) {
                return new ResponseEntity<>(lista, HttpStatus.OK);
            } else {
                logger.warn("Lista de espera no encontrada con ID: {}", id);
                Map<String, String> error = new HashMap<>();
                error.put("error", "Lista de espera no encontrada");
                return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            logger.error("Error al obtener lista de espera", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al obtener lista de espera: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "Listar todas las listas de espera")
    @GetMapping("/todas")
    public ResponseEntity<?> obtenerTodas() {
        logger.info("Recibido GET /api/listas-espera/todas");
        try {
            List<ListaEsperaDTO> listas = listaEsperaService.obtenerTodas();
            logger.info("Se retornaron {} listas de espera", listas.size());
            return new ResponseEntity<>(listas, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error al obtener todas las listas", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al obtener listas: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "Listar listas de espera de un paciente")
    @GetMapping("/paciente/{idPaciente}")
    public ResponseEntity<?> obtenerPorPaciente(@PathVariable Long idPaciente) {
        logger.info("Recibido GET /api/listas-espera/paciente/{}", idPaciente);
        try {
            List<ListaEsperaDTO> listas = listaEsperaService.obtenerPorPaciente(idPaciente);
            logger.info("Se retornaron {} listas para paciente ID: {}", listas.size(), idPaciente);
            return new ResponseEntity<>(listas, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error al obtener listas del paciente", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al obtener listas: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "Listar listas de espera de un hospital")
    @GetMapping("/hospital/{idHospital}")
    public ResponseEntity<?> obtenerPorHospital(@PathVariable Long idHospital) {
        logger.info("Recibido GET /api/listas-espera/hospital/{}", idHospital);
        try {
            List<ListaEsperaDTO> listas = listaEsperaService.obtenerPorHospital(idHospital);
            logger.info("Se retornaron {} listas para hospital ID: {}", listas.size(), idHospital);
            return new ResponseEntity<>(listas, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error al obtener listas del hospital", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al obtener listas: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "Listar listas de espera por estado")
    @GetMapping("/estado/{estado}")
    public ResponseEntity<?> obtenerPorEstado(@PathVariable String estado) {
        logger.info("Recibido GET /api/listas-espera/estado/{}", estado);
        try {
            List<ListaEsperaDTO> listas = listaEsperaService.obtenerPorEstado(estado);
            logger.info("Se retornaron {} listas con estado: {}", listas.size(), estado);
            return new ResponseEntity<>(listas, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error al obtener listas por estado", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al obtener listas: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "Listar listas de espera ordenadas por prioridad")
    @GetMapping("/ordenadas")
    public ResponseEntity<?> obtenerOrdenadas() {
        logger.info("Recibido GET /api/listas-espera/ordenadas");
        try {
            List<ListaEsperaDTO> listas = listaEsperaService.obtenerListasOrdenadas();
            logger.info("Se retornaron {} listas ordenadas", listas.size());
            return new ResponseEntity<>(listas, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error al obtener listas ordenadas", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al obtener listas: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "Actualizar lista de espera existente")
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @Valid @RequestBody ListaEsperaDTO listaEsperaDTO) {
        logger.info("Recibido PUT /api/listas-espera/{}", id);
        try {
            ListaEsperaDTO actualizada = listaEsperaService.actualizarListaEspera(id, listaEsperaDTO);
            if (actualizada != null) {
                logger.info("Lista de espera actualizada exitosamente");
                return new ResponseEntity<>(actualizada, HttpStatus.OK);
            } else {
                logger.warn("Lista de espera no encontrada para actualizar con ID: {}", id);
                Map<String, String> error = new HashMap<>();
                error.put("error", "Lista de espera no encontrada");
                return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            logger.error("Error al actualizar lista de espera", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al actualizar: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "Cambiar estado de lista de espera")
    @PutMapping("/{id}/estado/{nuevoEstado}")
    public ResponseEntity<?> cambiarEstado(@PathVariable Long id, @PathVariable String nuevoEstado) {
        logger.info("Recibido PUT /api/listas-espera/{}/estado/{}", id, nuevoEstado);
        try {
            ListaEsperaDTO actualizada = listaEsperaService.cambiarEstado(id, nuevoEstado);
            if (actualizada != null) {
                logger.info("Estado de lista de espera cambiado exitosamente");
                return new ResponseEntity<>(actualizada, HttpStatus.OK);
            } else {
                logger.warn("Lista de espera no encontrada para cambiar estado con ID: {}", id);
                Map<String, String> error = new HashMap<>();
                error.put("error", "Lista de espera no encontrada");
                return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            logger.error("Error al cambiar estado", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al cambiar estado: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "Eliminar lista de espera (soft delete)")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        logger.info("Recibido DELETE /api/listas-espera/{}", id);
        try {
            listaEsperaService.eliminarListaEspera(id);
            logger.info("Lista de espera eliminada exitosamente");
            Map<String, String> respuesta = new HashMap<>();
            respuesta.put("mensaje", "Lista de espera eliminada exitosamente");
            return new ResponseEntity<>(respuesta, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error al eliminar lista de espera", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al eliminar: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/contar-pendientes/hospital/{idHospital}")
    public ResponseEntity<?> contarPendientesPorHospital(@PathVariable Long idHospital) {
        logger.info("Recibido GET contar pendientes para hospital ID: {}", idHospital);
        try {
            Long count = listaEsperaService.contarPendientesPorHospital(idHospital);
            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("idHospital", idHospital);
            respuesta.put("pendientes", count);
            return new ResponseEntity<>(respuesta, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error al contar pendientes", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/contar-pendientes/paciente/{idPaciente}")
    public ResponseEntity<?> contarPendientesPorPaciente(@PathVariable Long idPaciente) {
        logger.info("Recibido GET contar pendientes para paciente ID: {}", idPaciente);
        try {
            Long count = listaEsperaService.contarPendientesPorPaciente(idPaciente);
            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("idPaciente", idPaciente);
            respuesta.put("pendientes", count);
            return new ResponseEntity<>(respuesta, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error al contar pendientes", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
