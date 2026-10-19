package com.SmartHealth.ms_personal.controllers;

import com.SmartHealth.ms_personal.dtos.PersonalDTO;
import com.SmartHealth.ms_personal.services.IPersonalService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Disabled;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Pruebas de integración para PersonalController.
 * Cubre: endpoints REST, validaciones de entrada, respuestas HTTP.
 */
@WebMvcTest(PersonalController.class)
@DisplayName("PersonalController - Suite de Pruebas REST")
class PersonalControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private IPersonalService personalService;

    @Autowired
    private ObjectMapper objectMapper;

    private PersonalDTO personalDTO;

    @BeforeEach
    void setUp() {
        personalDTO = new PersonalDTO();
        personalDTO.setId(1L);
        personalDTO.setRut("12345678-9");
        personalDTO.setNombre("Juan Perez");
        personalDTO.setEmail("juan@hospital.cl");
        personalDTO.setTelefono("987654321");
        personalDTO.setRol("MEDICO");
        personalDTO.setDepartamento("Emergencia");
        personalDTO.setHospitalId(1L);
    }

    // ===== TESTS: GET /api/personal =====
    @Nested
    @DisplayName("GET /api/personal - Listar todo el personal")
    class ObtenerTodos {

        @Test
        @DisplayName("Retorna 200 OK con lista de personal")
        void testObtenerTodos_Success() throws Exception {
            // EJEMPLOS QUE HARÍAN FALLAR ESTE TEST:
            // .andExpect(jsonPath("$[0].nombre").value("Pedro Lopez"))  → nombre no coincide
            // .andExpect(jsonPath("$[0].id").value(99L))               → ID no coincide
            // .andExpect(status().isCreated())                          → esperaría 201 pero llega 200
            // verify(personalService, times(2)).obtenerTodos()          → se llama 1 vez, no 2
            // Arrange
            List<PersonalDTO> personalList = new ArrayList<>();
            personalList.add(personalDTO);
            when(personalService.obtenerTodos()).thenReturn(personalList);

            // Act & Assert
            mockMvc.perform(get("/api/personal/todos")
                    .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$[0].id").value(1L))
                    .andExpect(jsonPath("$[0].nombre").value("Juan Perez"));

            verify(personalService, times(1)).obtenerTodos();
        }

        @Test
        @DisplayName("Retorna 200 OK con lista vacía")
        void testObtenerTodos_Empty() throws Exception {
            // Arrange
            when(personalService.obtenerTodos()).thenReturn(new ArrayList<>());

            // Act & Assert
            mockMvc.perform(get("/api/personal/todos")
                    .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$").isArray())
                    .andExpect(jsonPath("$.length()").value(0));
        }
    }

    // ===== TESTS: GET /api/personal/{id} =====
    @Nested
    @DisplayName("GET /api/personal/{id} - Obtener por ID")
    class ObtenerPorId {

        @Test
        @DisplayName("Retorna 200 OK cuando personal existe")
        void testObtenerPorId_Success() throws Exception {
            // EJEMPLOS QUE HARÍAN FALLAR ESTE TEST:
            // .andExpect(jsonPath("$.nombre").value("Carlos Diaz"))  → nombre no coincide
            // mockMvc.perform(get("/api/personal/99")...)             → servicio mockeado para ID 1, no 99
            // .andExpect(status().isNotFound())                       → esperaría 404 pero llega 200
            // Arrange
            when(personalService.obtenerPorId(1L)).thenReturn(personalDTO);

            // Act & Assert
            mockMvc.perform(get("/api/personal/1")
                    .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(1L))
                    .andExpect(jsonPath("$.nombre").value("Juan Perez"));

            verify(personalService, times(1)).obtenerPorId(1L);
        }

        @Test
        @DisplayName("Retorna 404 cuando personal NO existe")
        void testObtenerPorId_NotFound() throws Exception {
            // EJEMPLOS QUE HARÍAN FALLAR ESTE TEST:
            // .andExpect(status().isOk())          → esperaría 200 pero llega 404
            // .andExpect(status().isCreated())     → esperaría 201 pero llega 404
            // when(...).thenReturn(personalDTO)    → si retorna objeto, el controller devuelve 200, no 404
            // Probar con IDs: 999L, 0L, -1L
            // Arrange
            when(personalService.obtenerPorId(999L))
                    .thenReturn(null);

            // Act & Assert
            mockMvc.perform(get("/api/personal/999")
                    .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isNotFound());

            verify(personalService, times(1)).obtenerPorId(999L);
        }
    }

    // ===== TESTS: GET /api/personal/rol/{rol} =====
    @Nested
    @DisplayName("GET /api/personal/rol/{rol} - Filtrar por rol")
    class ObtenerPorRol {

        @Test
        @DisplayName("Retorna 200 OK con personal del rol especificado")
        void testObtenerPorRol_Success() throws Exception {
            // EJEMPLOS QUE HARÍAN FALLAR ESTE TEST:
            // when(...obtenerPorRol("ENFERMERO"))  → mock para ENFERMERO, pero URL pide MEDICO → lista vacía
            // .andExpect(jsonPath("$[0].id").value(99L))  → ID no coincide con el del mock
            // mockMvc.perform(get("/api/personal/rol/ENFERMERO")...)  → mock es para MEDICO, retorna null
            // Roles validos a probar: MEDICO, ENFERMERO, ADMINISTRATIVO, TECNICO, OTRO
            // Arrange
            List<PersonalDTO> medicosList = new ArrayList<>();
            medicosList.add(personalDTO);
            when(personalService.obtenerPorRol("MEDICO")).thenReturn(medicosList);

            // Act & Assert
            mockMvc.perform(get("/api/personal/rol/MEDICO")
                    .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$[0].id").value(1L));

            verify(personalService, times(1)).obtenerPorRol("MEDICO");
        }

        @Test
        @DisplayName("Retorna 200 OK con lista vacía para rol inválido")
        void testObtenerPorRol_InvalidRol() throws Exception {
            // EJEMPLOS QUE HARÍAN FALLAR ESTE TEST:
            // .andExpect(jsonPath("$.length()").value(5))  → esperaría 5 elementos pero llega 0
            // .andExpect(status().isBadRequest())          → controller devuelve 200, no 400
            // Roles invalidos a probar: GERENTE, DIRECTOR, PRACTICANTE, AUXILIAR
            // Arrange
            when(personalService.obtenerPorRol("ROLE_FAKE"))
                    .thenReturn(new ArrayList<>());

            // Act & Assert
            mockMvc.perform(get("/api/personal/rol/ROLE_FAKE")
                    .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.length()").value(0));
        }
    }

    // ===== TESTS: POST /api/personal =====
    @Nested
    @DisplayName("POST /api/personal - Crear nuevo personal")
    class CrearPersonal {

        @Test
        @DisplayName("Retorna 201 CREATED cuando datos son validos")
        void testCrearPersonal_Success() throws Exception {
            // EJEMPLOS QUE HARÍAN FALLAR ESTE TEST:
            // .andExpect(status().isOk())                        → llega 201, no 200
            // .andExpect(jsonPath("$.rut").value("11111111-1")) → RUT no coincide con el mock
            // nuevoPersonal.setRut("INVALIDO")                  → @Valid rechaza el RUT → 400, no 201
            // nuevoPersonal.setEmail("sinArroba")               → @Valid rechaza el email → 400, no 201
            // RUT formato valido: 7-8 digitos + guion + digito o K (mayuscula o minuscula)
            // Telefono: 8-15 digitos o con codigo internacional (+56)
            // Roles validos: MEDICO, ENFERMERO, ADMINISTRATIVO, TECNICO, OTRO
            // Arrange
            PersonalDTO nuevoPersonal = new PersonalDTO();
            nuevoPersonal.setRut("98765432-1");
            nuevoPersonal.setNombre("Maria Garcia");
            nuevoPersonal.setEmail("maria@hospital.cl");
            nuevoPersonal.setTelefono("987654321");
            nuevoPersonal.setRol("ENFERMERO");
            nuevoPersonal.setDepartamento("Urgencia");
            nuevoPersonal.setHospitalId(1L);

            PersonalDTO respuesta = new PersonalDTO();
            respuesta.setId(2L);
            respuesta.setRut("98765432-1");
            respuesta.setNombre("Maria Garcia");
            respuesta.setEmail("maria@hospital.cl");
            respuesta.setTelefono("987654321");
            respuesta.setRol("ENFERMERO");
            respuesta.setDepartamento("Urgencia");
            respuesta.setHospitalId(1L);

            when(personalService.crearPersonal(any(PersonalDTO.class))).thenReturn(respuesta);

            // Act & Assert
            mockMvc.perform(post("/api/personal/crear")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(nuevoPersonal)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.id").value(2L))
                    .andExpect(jsonPath("$.rut").value("98765432-1"));

            verify(personalService, times(1)).crearPersonal(any(PersonalDTO.class));
        }

        @Test
        @DisplayName("Retorna 400 BAD REQUEST cuando datos son invalidos")
        void testCrearPersonal_InvalidData() throws Exception {
            // EJEMPLOS QUE HARÍAN FALLAR ESTE TEST:
            // incompleto.setRut("12345678-9") + setNombre("Juan") + ... (completar todos los campos)
            //   → @Valid pasa, controller llama al servicio y retorna 201, no 400
            // .andExpect(status().isOk())  → llega 400, no 200
            // Datos invalidos a probar: nombres nulos, RUT mal formato, email sin @, telefono < 8 digitos
            // Arrange
            PersonalDTO incompleto = new PersonalDTO();
            // Falta informacion requerida

            // Act & Assert
            mockMvc.perform(post("/api/personal/crear")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(incompleto)))
                    .andExpect(status().is4xxClientError());
        }
    }

    // ===== TESTS: PUT /api/personal/{id} =====
    @Nested
    @DisplayName("PUT /api/personal/{id} - Actualizar personal")
    class ActualizarPersonal {

        @Test
        @DisplayName("Retorna 200 OK cuando se actualiza correctamente")
        void testActualizarPersonal_Success() throws Exception {
            // EJEMPLOS QUE HARÍAN FALLAR ESTE TEST:
            // .andExpect(jsonPath("$.nombre").value("Otro Nombre"))  → nombre no coincide con el mock
            // mockMvc.perform(put("/api/personal/99")...)            → anyLong() lo aceptaría igual, pero
            //   si cambias a eq(1L) en el verify, falla porque se llamó con 99L
            // .andExpect(status().isCreated())                       → llega 200, no 201
            // Se pueden actualizar: nombre, email, telefono, especialidad, departamento, hospitalId
            // Arrange
            PersonalDTO actualizado = new PersonalDTO();
            actualizado.setRut("12345678-9");
            actualizado.setNombre("Juan Perez Actualizado");
            actualizado.setEmail("juan@hospital.cl");
            actualizado.setTelefono("987654321");
            actualizado.setRol("MEDICO");
            actualizado.setDepartamento("Emergencia");
            actualizado.setHospitalId(1L);

            when(personalService.actualizarPersonal(anyLong(), any(PersonalDTO.class)))
                    .thenReturn(actualizado);

            // Act & Assert
            mockMvc.perform(put("/api/personal/1")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(actualizado)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.nombre").value("Juan Perez Actualizado"));

            verify(personalService, times(1)).actualizarPersonal(anyLong(), any(PersonalDTO.class));
        }

        @Test
        @DisplayName("Retorna 404 cuando personal NO existe")
        void testActualizarPersonal_NotFound() throws Exception {
            // EJEMPLOS QUE HARÍAN FALLAR ESTE TEST:
            // .andExpect(status().isOk())           → el servicio lanza excepción → controller devuelve 500, no 200
            // .andExpect(status().isNotFound())     → controller devuelve 500 (catch genérico), no 404
            // when(...).thenReturn(personalDTO)     → si retorna objeto, llega 200, no 4xx
            // Probar actualizacion en IDs: 999L, 0L, -1L
            // Arrange
            PersonalDTO actualizado = new PersonalDTO();
            when(personalService.actualizarPersonal(999L, actualizado))
                    .thenThrow(new RuntimeException("Personal no encontrado"));

            // Act & Assert
            mockMvc.perform(put("/api/personal/999")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(actualizado)))
                    .andExpect(status().is4xxClientError());
        }
    }

    // ===== TESTS: DELETE /api/personal/{id} =====
    @Nested
    @DisplayName("DELETE /api/personal/{id} - Eliminar personal")
    class EliminarPersonal {

        @Test
        @DisplayName("Retorna 200 OK cuando se elimina")
        void testEliminarPersonal_Success() throws Exception {
            // EJEMPLOS QUE HARÍAN FALLAR ESTE TEST:
            // .andExpect(status().isNoContent())   → controller devuelve 200, no 204
            // mockMvc.perform(delete("/api/personal/99")...)  → verify espera ID 1, se llamó con 99
            // verify(personalService, times(2)).eliminarPersonal(1L)  → se llama 1 vez, no 2
            // Soft-delete: solo marca personal como inactivo (activo=false)
            // Arrange
            doNothing().when(personalService).eliminarPersonal(1L);

            // Act & Assert
            mockMvc.perform(delete("/api/personal/1")
                    .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk());

            verify(personalService, times(1)).eliminarPersonal(1L);
        }

        @Test
        @DisplayName("Retorna 500 cuando personal NO existe (excepción)")
        void testEliminarPersonal_NotFound() throws Exception {
            // EJEMPLOS QUE HARÍAN FALLAR ESTE TEST:
            // .andExpect(status().isOk())           → el servicio lanza excepción → llega 500, no 200
            // .andExpect(status().isNotFound())     → controller devuelve 500 (catch genérico), no 404
            // doNothing().when(...)                 → si no lanza excepción, llega 200, no 500
            // IDs que no existen: 999L, 0L, -1L
            // Arrange
            doThrow(new RuntimeException("Personal no encontrado"))
                    .when(personalService).eliminarPersonal(999L);

            // Act & Assert
            mockMvc.perform(delete("/api/personal/999")
                    .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isInternalServerError());
        }
    }

    // ===== TESTS: GET /api/personal/hospital/{hospitalId}/medicos =====
    @Nested
    @DisplayName("GET /api/personal/hospital/{hospitalId}/medicos - Médicos por hospital")
    class ObtenerMedicosPorHospital {

        @Test
        @DisplayName("Retorna 200 OK con medicos del hospital")
        void testObtenerMedicosPorHospital_Success() throws Exception {
            // EJEMPLOS QUE HARÍAN FALLAR ESTE TEST:
            // .andExpect(jsonPath("$[0].id").value(99L))           → ID no coincide con el del mock
            // mockMvc.perform(get("/api/personal/medicos/hospital/5")...)  → mock es para ID 1, retorna null
            // .andExpect(jsonPath("$.length()").value(3))          → lista tiene 1 elemento, no 3
            // HospitalIds validos a probar: 1L, 2L, 3L, etc.
            // Arrange
            List<PersonalDTO> medicosList = new ArrayList<>();
            medicosList.add(personalDTO);
            when(personalService.obtenerMedicosPorHospital(1L)).thenReturn(medicosList);

            // Act & Assert
            mockMvc.perform(get("/api/personal/medicos/hospital/1")
                    .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$[0].id").value(1L));

            verify(personalService, times(1)).obtenerMedicosPorHospital(1L);
        }

        @Test
        @DisplayName("Retorna 200 OK con lista vacía cuando hospital NO existe")
        void testObtenerMedicosPorHospital_InvalidHospital() throws Exception {
            // EJEMPLOS QUE HARÍAN FALLAR ESTE TEST:
            // .andExpect(jsonPath("$.length()").value(1))  → lista está vacía, esperaría 1
            // .andExpect(status().isNotFound())            → controller devuelve 200 con lista vacía, no 404
            // when(...).thenReturn(medicosList con datos)  → retornaría lista con elementos, length() sería > 0
            // HospitalIds invalidos: 999L, 0L, -1L
            // Arrange
            when(personalService.obtenerMedicosPorHospital(999L))
                    .thenReturn(new ArrayList<>());

            // Act & Assert
            mockMvc.perform(get("/api/personal/medicos/hospital/999")
                    .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.length()").value(0));
        }
    }
}

