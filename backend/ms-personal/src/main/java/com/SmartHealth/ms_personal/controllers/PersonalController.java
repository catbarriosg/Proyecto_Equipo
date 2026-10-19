package com.SmartHealth.ms_personal.controllers;

import com.SmartHealth.ms_personal.dtos.PersonalDTO;
import com.SmartHealth.ms_personal.services.IPersonalService;
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
@RequestMapping("/api/personal")
@CrossOrigin(origins = "*")
public class PersonalController {

    private static final Logger logger = LoggerFactory.getLogger(PersonalController.class);

    @Autowired
    private IPersonalService personalService;

    @Operation(summary = "Crear nuevo personal en el sistema")
    @PostMapping("/crear")
    public ResponseEntity<?> crearPersonal(@Valid @RequestBody PersonalDTO personalDTO) {
        logger.info("Recibido POST /api/personal/crear para RUT: {}", personalDTO.getRut());
        try {
            PersonalDTO nuevoPersonal = personalService.crearPersonal(personalDTO);
            logger.info("Personal creado exitosamente");
            return new ResponseEntity<>(nuevoPersonal, HttpStatus.CREATED);
        } catch (Exception e) {
            logger.error("Error al crear personal", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al crear personal: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "Obtener personal por ID")
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        logger.info("Recibido GET /api/personal/{}", id);
        try {
            PersonalDTO personal = personalService.obtenerPorId(id);
            if (personal != null) {
                return new ResponseEntity<>(personal, HttpStatus.OK);
            } else {
                logger.warn("Personal no encontrado con ID: {}", id);
                Map<String, String> error = new HashMap<>();
                error.put("error", "Personal no encontrado");
                return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            logger.error("Error al obtener personal", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al obtener personal: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "Listar todo el personal")
    @GetMapping("/todos")
    public ResponseEntity<?> obtenerTodos() {
        logger.info("Recibido GET /api/personal/todos");
        try {
            List<PersonalDTO> personal = personalService.obtenerTodos();
            logger.info("Se retornaron {} registros de personal", personal.size());
            return new ResponseEntity<>(personal, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error al obtener todo el personal", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al obtener personal: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "Listar personal por hospital")
    @GetMapping("/hospital/{hospitalId}")
    public ResponseEntity<?> obtenerPorHospital(@PathVariable Long hospitalId) {
        logger.info("Recibido GET /api/personal/hospital/{}", hospitalId);
        try {
            List<PersonalDTO> personal = personalService.obtenerPorHospital(hospitalId);
            logger.info("Se retornaron {} registros para hospital ID: {}", personal.size(), hospitalId);
            return new ResponseEntity<>(personal, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error al obtener personal del hospital", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al obtener personal: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "Listar personal por rol")
    @GetMapping("/rol/{rol}")
    public ResponseEntity<?> obtenerPorRol(@PathVariable String rol) {
        logger.info("Recibido GET /api/personal/rol/{}", rol);
        try {
            List<PersonalDTO> personal = personalService.obtenerPorRol(rol);
            logger.info("Se retornaron {} registros con rol: {}", personal.size(), rol);
            return new ResponseEntity<>(personal, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error al obtener personal por rol", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "Listar personal por departamento")
    @GetMapping("/departamento/{departamento}")
    public ResponseEntity<?> obtenerPorDepartamento(@PathVariable String departamento) {
        logger.info("Recibido GET /api/personal/departamento/{}", departamento);
        try {
            List<PersonalDTO> personal = personalService.obtenerPorDepartamento(departamento);
            logger.info("Se retornaron {} registros del departamento: {}", personal.size(), departamento);
            return new ResponseEntity<>(personal, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error al obtener personal por departamento", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "Obtener personal por RUT")
    @GetMapping("/rut/{rut}")
    public ResponseEntity<?> obtenerPorRut(@PathVariable String rut) {
        logger.info("Recibido GET /api/personal/rut/{}", rut);
        try {
            PersonalDTO personal = personalService.obtenerPorRut(rut);
            if (personal != null) {
                return new ResponseEntity<>(personal, HttpStatus.OK);
            } else {
                logger.warn("Personal no encontrado con RUT: {}", rut);
                Map<String, String> error = new HashMap<>();
                error.put("error", "Personal no encontrado");
                return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            logger.error("Error al obtener personal por RUT", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "Obtener personal por email")
    @GetMapping("/email/{email}")
    public ResponseEntity<?> obtenerPorEmail(@PathVariable String email) {
        logger.info("Recibido GET /api/personal/email/{}", email);
        try {
            PersonalDTO personal = personalService.obtenerPorEmail(email);
            if (personal != null) {
                return new ResponseEntity<>(personal, HttpStatus.OK);
            } else {
                logger.warn("Personal no encontrado con email: {}", email);
                Map<String, String> error = new HashMap<>();
                error.put("error", "Personal no encontrado");
                return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            logger.error("Error al obtener personal por email", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "Listar médicos de un hospital")
    @GetMapping("/medicos/hospital/{hospitalId}")
    public ResponseEntity<?> obtenerMedicosPorHospital(@PathVariable Long hospitalId) {
        logger.info("Recibido GET médicos del hospital ID: {}", hospitalId);
        try {
            List<PersonalDTO> medicos = personalService.obtenerMedicosPorHospital(hospitalId);
            logger.info("Se retornaron {} médicos", medicos.size());
            return new ResponseEntity<>(medicos, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error al obtener médicos", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "Listar enfermeros de un hospital")
    @GetMapping("/enfermeros/hospital/{hospitalId}")
    public ResponseEntity<?> obtenerEnfermerosPorHospital(@PathVariable Long hospitalId) {
        logger.info("Recibido GET enfermeros del hospital ID: {}", hospitalId);
        try {
            List<PersonalDTO> enfermeros = personalService.obtenerEnfermerosPorHospital(hospitalId);
            logger.info("Se retornaron {} enfermeros", enfermeros.size());
            return new ResponseEntity<>(enfermeros, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error al obtener enfermeros", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "Listar personal por especialidad")
    @GetMapping("/especialidad/{especialidad}")
    public ResponseEntity<?> obtenerPorEspecialidad(@PathVariable String especialidad) {
        logger.info("Recibido GET personal con especialidad: {}", especialidad);
        try {
            List<PersonalDTO> personal = personalService.obtenerPorEspecialidad(especialidad);
            logger.info("Se retornaron {} registros", personal.size());
            return new ResponseEntity<>(personal, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error al obtener personal por especialidad", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "Actualizar personal existente")
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @Valid @RequestBody PersonalDTO personalDTO) {
        logger.info("Recibido PUT /api/personal/{}", id);
        try {
            PersonalDTO actualizado = personalService.actualizarPersonal(id, personalDTO);
            if (actualizado != null) {
                logger.info("Personal actualizado exitosamente");
                return new ResponseEntity<>(actualizado, HttpStatus.OK);
            } else {
                logger.warn("Personal no encontrado para actualizar con ID: {}", id);
                Map<String, String> error = new HashMap<>();
                error.put("error", "Personal no encontrado");
                return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            logger.error("Error al actualizar personal", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al actualizar: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "Eliminar personal (soft delete)")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        logger.info("Recibido DELETE /api/personal/{}", id);
        try {
            personalService.eliminarPersonal(id);
            logger.info("Personal eliminado exitosamente");
            Map<String, String> respuesta = new HashMap<>();
            respuesta.put("mensaje", "Personal eliminado exitosamente");
            return new ResponseEntity<>(respuesta, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error al eliminar personal", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al eliminar: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/contar/hospital/{hospitalId}")
    public ResponseEntity<?> contarPersonalPorHospital(@PathVariable Long hospitalId) {
        logger.info("Recibido GET contar personal en hospital ID: {}", hospitalId);
        try {
            Long count = personalService.contarPersonalPorHospital(hospitalId);
            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("hospitalId", hospitalId);
            respuesta.put("totalPersonal", count);
            return new ResponseEntity<>(respuesta, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error al contar personal", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
