package com.SmartHealth.ms_personal.services;

import com.SmartHealth.ms_personal.clients.HospitalClient;
import com.SmartHealth.ms_personal.dtos.PersonalDTO;
import com.SmartHealth.ms_personal.models.HospitalDTO;
import com.SmartHealth.ms_personal.models.Personal;
import com.SmartHealth.ms_personal.repositories.PersonalRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import jakarta.validation.Validation;
import jakarta.validation.ConstraintViolation;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

/**
 * Pruebas unitarias para PersonalServiceImpl.
 * Cubre: métodos de búsqueda, validaciones, filtros y conversiones DTO.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("PersonalServiceImpl - Suite de Pruebas")
class PersonalServiceImplTest {

    @Mock
    private PersonalRepository personalRepository;

    @Mock
    private HospitalClient hospitalClient;

    @InjectMocks
    private PersonalServiceImpl personalService;

    private Personal personal;
    private PersonalDTO personalDTO;
    private HospitalDTO hospital;
    private Validator validator;

    @BeforeEach
    void setUp() {
        // Inicializar Validator de Jakarta Bean Validation
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();

        // Configurar datos de prueba
        hospital = new HospitalDTO();
        hospital.setId(1L);
        hospital.setNombre("Hospital Central");
        hospital.setActivo(true);

        personal = new Personal();
        personal.setId(1L);
        personal.setRut("12345678-9");
        personal.setNombre("Juan Perez");
        personal.setEmail("juan@hospital.cl");
        personal.setTelefono("987654321");
        personal.setRol("MEDICO");
        personal.setEspecialidad("Cardiologia");
        personal.setDepartamento("Emergencia");
        personal.setHospitalId(1L);
        personal.setActivo(true);

        personalDTO = new PersonalDTO();
        personalDTO.setId(1L);
        personalDTO.setRut("12345678-9");
        personalDTO.setNombre("Juan Perez");
    }

    // ===== TESTS: OBTENER POR ID =====
    @Nested
    @DisplayName("obtenerPorId - Búsqueda de personal por ID")
    class ObtenerPorId {

        @Test
        @DisplayName("Retorna personal cuando existe")
        void testObtenerPorId_Exitoso() {
            // Arrange
            when(personalRepository.findByIdAndActivoTrue(1L)).thenReturn(Optional.of(personal));

            // Act
            PersonalDTO resultado = personalService.obtenerPorId(1L);

            // Assert
            assertNotNull(resultado);
            assertEquals("12345678-9", resultado.getRut());
            assertEquals("Juan Perez", resultado.getNombre());
            verify(personalRepository, times(1)).findByIdAndActivoTrue(1L);
        }

        @Test
        @DisplayName("Retorna null cuando NO existe")
        void testObtenerPorId_NoEncontrado() {
            // Arrange
            when(personalRepository.findByIdAndActivoTrue(999L)).thenReturn(Optional.empty());

            // Act
            PersonalDTO resultado = personalService.obtenerPorId(999L);

            // Assert
            assertNull(resultado);
            verify(personalRepository, times(1)).findByIdAndActivoTrue(999L);
        }
    }

    // ===== TESTS: OBTENER TODOS ACTIVOS =====
    @Nested
    @DisplayName("obtenerTodos - Listado de personal activo")
    class ObtenerTodos {

        @Test
        @DisplayName("Retorna lista de personal activo")
        void testObtenerTodos_Exitoso() {
            // Arrange
            List<Personal> personalList = new ArrayList<>();
            personalList.add(personal);
            when(personalRepository.findByActivoTrue()).thenReturn(personalList);

            // Act
            List<PersonalDTO> resultado = personalService.obtenerTodos();

            // Assert
            assertNotNull(resultado);
            assertEquals(1, resultado.size());
            verify(personalRepository, times(1)).findByActivoTrue();
        }

        @Test
        @DisplayName("Retorna lista vacía cuando no hay personal")
        void testObtenerTodos_ListaVacia() {
            // Arrange
            when(personalRepository.findByActivoTrue()).thenReturn(new ArrayList<>());

            // Act
            List<PersonalDTO> resultado = personalService.obtenerTodos();

            // Assert
            assertNotNull(resultado);
            assertTrue(resultado.isEmpty());
            verify(personalRepository, times(1)).findByActivoTrue();
        }
    }

    // ===== TESTS: OBTENER POR ROL =====
    @Nested
    @DisplayName("obtenerPorRol - Filtro por rol")
    class ObtenerPorRol {

        @Test
        @DisplayName("Retorna personal cuando rol es válido")
        void testObtenerPorRol_RolValido() {
            // Arrange
            List<Personal> personalList = new ArrayList<>();
            personalList.add(personal);
            when(personalRepository.findByRolAndActivoTrue("MEDICO")).thenReturn(personalList);

            // Act
            List<PersonalDTO> resultado = personalService.obtenerPorRol("MEDICO");

            // Assert
            assertNotNull(resultado);
            assertEquals(1, resultado.size());
            verify(personalRepository, times(1)).findByRolAndActivoTrue("MEDICO");
        }

        @Test
        @DisplayName("Lanza excepción cuando rol es inválido")
        void testObtenerPorRol_RolInvalido() {
            // Act & Assert
            assertThrows(RuntimeException.class, () -> {
                personalService.obtenerPorRol("ROLE_INVALIDO");
            }, "Debe rechazar rol inválido");
        }

        @Test
        @DisplayName("Retorna lista vacía cuando no hay personal con ese rol")
        void testObtenerPorRol_RolValidoPeroVacio() {
            // Arrange
            when(personalRepository.findByRolAndActivoTrue("ADMINISTRATIVO")).thenReturn(new ArrayList<>());

            // Act
            List<PersonalDTO> resultado = personalService.obtenerPorRol("ADMINISTRATIVO");

            // Assert
            assertNotNull(resultado);
            assertTrue(resultado.isEmpty());
        }
    }

    // ===== TESTS: OBTENER POR ESPECIALIDAD =====
    @Nested
    @DisplayName("obtenerPorEspecialidad - Filtro por especialidad")
    class ObtenerPorEspecialidad {

        @Test
        @DisplayName("Retorna medicos cuando especialidad es valida")
        void testObtenerPorEspecialidad_Exitoso() {
            // Arrange
            personal.setEspecialidad("Cardiologia");
            List<Personal> personalList = new ArrayList<>();
            personalList.add(personal);
            when(personalRepository.findByEspecialidad("Cardiologia"))
                    .thenReturn(personalList);

            // Act
            List<PersonalDTO> resultado = personalService.obtenerPorEspecialidad("Cardiologia");

            // Assert
            assertNotNull(resultado);
            assertEquals(1, resultado.size());
            verify(personalRepository, times(1)).findByEspecialidad("Cardiologia");
        }

        @Test
        @DisplayName("Lanza excepción cuando especialidad es inválida")
        void testObtenerPorEspecialidad_EspecialidadInvalida() {
            // Act & Assert
            assertThrows(RuntimeException.class, () -> {
                personalService.obtenerPorEspecialidad("ESPECIALIDAD_INEXISTENTE");
            }, "Debe rechazar especialidad inválida");
        }
    }

    // ===== TESTS: OBTENER POR DEPARTAMENTO =====
    @Nested
    @DisplayName("obtenerPorDepartamento - Filtro por departamento")
    class ObtenerPorDepartamento {

        @Test
        @DisplayName("Retorna personal cuando departamento es válido")
        void testObtenerPorDepartamento_Exitoso() {
            // Arrange
            List<Personal> personalList = new ArrayList<>();
            personalList.add(personal);
            when(personalRepository.findByDepartamentoAndActivoTrue("Emergencia"))
                    .thenReturn(personalList);

            // Act
            List<PersonalDTO> resultado = personalService.obtenerPorDepartamento("Emergencia");

            // Assert
            assertNotNull(resultado);
            assertEquals(1, resultado.size());
            verify(personalRepository, times(1)).findByDepartamentoAndActivoTrue("Emergencia");
        }

        @Test
        @DisplayName("Lanza excepción cuando departamento es inválido")
        void testObtenerPorDepartamento_DepartamentoInvalido() {
            // Act & Assert
            assertThrows(RuntimeException.class, () -> {
                personalService.obtenerPorDepartamento("DEPARTAMENTO_FAKE");
            }, "Debe rechazar departamento inválido");
        }
    }

    // ===== TESTS: OBTENER MÉDICOS POR HOSPITAL =====
    @Nested
    @DisplayName("obtenerMedicosPorHospital - Filtro por hospital y rol")
    class ObtenerMedicosPorHospital {

        @Test
        @DisplayName("Retorna médicos cuando hospital existe")
        void testObtenerMedicosPorHospital_Exitoso() {
            // Arrange
            List<Personal> medicosList = new ArrayList<>();
            medicosList.add(personal);
            when(hospitalClient.obtenerHospitalPorId(1L)).thenReturn(hospital);
            when(personalRepository.findMedicosByHospital(1L))
                    .thenReturn(medicosList);

            // Act
            List<PersonalDTO> resultado = personalService.obtenerMedicosPorHospital(1L);

            // Assert
            assertNotNull(resultado);
            assertEquals(1, resultado.size());
            verify(hospitalClient, times(1)).obtenerHospitalPorId(1L);
            verify(personalRepository, times(1)).findMedicosByHospital(1L);
        }

        @Test
        @DisplayName("Lanza excepción cuando hospital NO existe")
        void testObtenerMedicosPorHospital_HospitalNoExiste() {
            // Arrange
            when(hospitalClient.obtenerHospitalPorId(999L)).thenReturn(null);

            // Act & Assert
            assertThrows(RuntimeException.class, () -> {
                personalService.obtenerMedicosPorHospital(999L);
            }, "Debe validar que el hospital existe");
        }

        @Test
        @DisplayName("Retorna lista vacía cuando no hay médicos en el hospital")
        void testObtenerMedicosPorHospital_ListaVacia() {
            // Arrange
            when(hospitalClient.obtenerHospitalPorId(1L)).thenReturn(hospital);
            when(personalRepository.findMedicosByHospital(1L))
                    .thenReturn(new ArrayList<>());

            // Act
            List<PersonalDTO> resultado = personalService.obtenerMedicosPorHospital(1L);

            // Assert
            assertNotNull(resultado);
            assertTrue(resultado.isEmpty());
        }
    }

    // ===== TESTS: CONTAR PERSONAL POR HOSPITAL =====
    @Nested
    @DisplayName("contarPersonalPorHospital - Estadísticas")
    class ContarPersonalPorHospital {

        @Test
        @DisplayName("Retorna contador cuando hospital existe")
        void testContarPersonalPorHospital_Exitoso() {
            // Arrange
            when(hospitalClient.obtenerHospitalPorId(1L)).thenReturn(hospital);
            when(personalRepository.countPersonalByHospital(1L)).thenReturn(5L);

            // Act
            Long resultado = personalService.contarPersonalPorHospital(1L);

            // Assert
            assertNotNull(resultado);
            assertEquals(5L, resultado);
            verify(hospitalClient, times(1)).obtenerHospitalPorId(1L);
        }

        @Test
        @DisplayName("Lanza excepción cuando hospital NO existe")
        void testContarPersonalPorHospital_HospitalNoExiste() {
            // Arrange
            when(hospitalClient.obtenerHospitalPorId(999L)).thenReturn(null);

            // Act & Assert
            assertThrows(RuntimeException.class, () -> {
                personalService.contarPersonalPorHospital(999L);
            });
        }
    }

    // ===== TESTS: CREAR PERSONAL =====
    @Nested
    @DisplayName("crearPersonal - Alta de nuevo personal")
    class CrearPersonal {

        @Test
        @DisplayName("Crea personal cuando datos son validos")
        void testCrearPersonal_Exitoso() {
            // Arrange
            PersonalDTO nuevoDTO = new PersonalDTO();
            nuevoDTO.setRut("98765432-1");
            nuevoDTO.setNombre("Maria Garcia");
            nuevoDTO.setEmail("maria@hospital.cl");
            nuevoDTO.setTelefono("111222333");
            nuevoDTO.setRol("ENFERMERO");
            nuevoDTO.setEspecialidad("Cuidados Intensivos");
            nuevoDTO.setDepartamento("UTI");
            nuevoDTO.setHospitalId(1L);

            Personal nuevoPersonal = new Personal();
            nuevoPersonal.setId(2L);
            nuevoPersonal.setRut("98765432-1");
            nuevoPersonal.setNombre("Maria Garcia");
            nuevoPersonal.setHospitalId(1L);

            when(personalRepository.save(any(Personal.class))).thenReturn(nuevoPersonal);

            // Act
            PersonalDTO resultado = personalService.crearPersonal(nuevoDTO);

            // Assert
            assertNotNull(resultado);
            assertEquals("98765432-1", resultado.getRut());
            verify(personalRepository, times(1)).save(any(Personal.class));
        }

        @Test
        @DisplayName("Crea personal sin validar hospital")
        void testCrearPersonal_SinValidarHospital() {
            // El servicio crearPersonal NO valida la existencia del hospital
            PersonalDTO nuevoDTO = new PersonalDTO();
            nuevoDTO.setRut("99999999-9");
            nuevoDTO.setNombre("Test Personal");
            nuevoDTO.setHospitalId(999L);

            Personal nuevoPersonal = new Personal();
            nuevoPersonal.setId(3L);
            nuevoPersonal.setRut("99999999-9");
            nuevoPersonal.setHospitalId(999L);

            when(personalRepository.save(any(Personal.class))).thenReturn(nuevoPersonal);

            // Act - No debe fallar aunque el hospital no exista
            PersonalDTO resultado = personalService.crearPersonal(nuevoDTO);

            // Assert
            assertNotNull(resultado);
            verify(personalRepository, times(1)).save(any(Personal.class));
            verify(hospitalClient, never()).obtenerHospitalPorId(any());
        }
    }

    // ===== TESTS: ACTUALIZAR PERSONAL =====
    @Nested
    @DisplayName("actualizarPersonal - Modificación de datos")
    class ActualizarPersonal {

        @Test
        @DisplayName("Actualiza personal cuando datos son validos")
        void testActualizarPersonal_Exitoso() {
            // Arrange
            PersonalDTO actualizarDTO = new PersonalDTO();
            actualizarDTO.setRut("12345678-9");
            actualizarDTO.setNombre("Juan Perez Actualizado");
            actualizarDTO.setHospitalId(1L);

            Personal personalActualizado = new Personal();
            personalActualizado.setId(1L);
            personalActualizado.setNombre("Juan Perez Actualizado");

            when(personalRepository.findByIdAndActivoTrue(1L)).thenReturn(Optional.of(personal));
            when(hospitalClient.obtenerHospitalPorId(1L)).thenReturn(hospital);
            when(personalRepository.save(any(Personal.class))).thenReturn(personalActualizado);

            // Act
            PersonalDTO resultado = personalService.actualizarPersonal(1L, actualizarDTO);

            // Assert
            assertNotNull(resultado);
            assertEquals("Juan Perez Actualizado", resultado.getNombre());
            verify(personalRepository, times(1)).findByIdAndActivoTrue(1L);
            verify(hospitalClient, times(1)).obtenerHospitalPorId(1L);
        }

        @Test
        @DisplayName("Falla cuando personal NO existe")
        void testActualizarPersonal_PersonalNoExiste() {
            // Arrange
            PersonalDTO actualizarDTO = new PersonalDTO();
            actualizarDTO.setHospitalId(1L);
            when(personalRepository.findByIdAndActivoTrue(999L)).thenReturn(Optional.empty());
            when(hospitalClient.obtenerHospitalPorId(1L)).thenReturn(hospital);

            // Act & Assert
            assertThrows(RuntimeException.class, () -> {
                personalService.actualizarPersonal(999L, actualizarDTO);
            });
        }
    }

    // ===== TESTS: ELIMINAR PERSONAL =====
    @Nested
    @DisplayName("eliminarPersonal - Eliminacion logica")
    class EliminarPersonal {

        @Test
        @DisplayName("Desactiva personal cuando existe (soft-delete)")
        void testEliminarPersonal_Exitoso() {
            // Arrange
            personal.setActivo(true);
            when(personalRepository.findByIdAndActivoTrue(1L)).thenReturn(Optional.of(personal));
            when(personalRepository.save(any(Personal.class))).thenReturn(personal);

            // Act
            personalService.eliminarPersonal(1L);

            // Assert
            verify(personalRepository, times(1)).findByIdAndActivoTrue(1L);
            verify(personalRepository, times(1)).save(any(Personal.class));
        }

        @Test
        @DisplayName("No hace nada cuando personal NO existe")
        void testEliminarPersonal_PersonalNoExiste() {
            // Arrange
            when(personalRepository.findByIdAndActivoTrue(999L)).thenReturn(Optional.empty());

            // Act - No debe fallar
            personalService.eliminarPersonal(999L);

            // Assert
            verify(personalRepository, times(1)).findByIdAndActivoTrue(999L);
            verify(personalRepository, never()).save(any(Personal.class));
        }
    }

    // ===== TESTS: VALIDACIONES JAKARTA BEAN VALIDATION =====
    @Nested
    @DisplayName("Validaciones Jakarta - Restricciones reales de entidad (Editar datos para cambiar validaciones)")
    class ValidacionesJakarta {

        @Test
        @DisplayName("VÁLIDO: Datos correctos pasan validación")
        void testDatosValidos_Pasan() {
            // Arrange - personal ya tiene datos válidos del setUp()
            
            // Act
            Set<ConstraintViolation<Personal>> violations = validator.validate(personal);

            // Assert
            assertTrue(violations.isEmpty(), 
                    "Datos válidos no deben tener violaciones. Violaciones: " + 
                    violations.stream().map(v -> v.getPropertyPath() + ": " + v.getMessage())
                            .toList());
        }

        @Test
        @DisplayName("INVÁLIDO: RUT nulo (obligatorio @NotBlank)")
        void testRutNulo_Invalido() {
            // Editar acá para cambiar test y ejecutar nuevas validaciones
            // Otros valores inválidos a probar: "", "12345678" (sin digito verificador)
            personal.setRut(null);

            Set<ConstraintViolation<Personal>> violations = validator.validate(personal);
            assertFalse(violations.isEmpty(), "RUT nulo debe causar violación");
        }

        @Test
        @DisplayName("INVÁLIDO: RUT con formato incorrecto (12345678-X NO válido)")
        void testRutFormatoIncorrecto_Invalido() {
            // Editar acá para cambiar test y ejecutar nuevas validaciones
            // Otros valores inválidos: "ABC-D", "12345678-", "1234567-9" (muy corto)
            personal.setRut("12345678-X");

            Set<ConstraintViolation<Personal>> violations = validator.validate(personal);
            assertFalse(violations.isEmpty(), "RUT inválido debe causar violación");
        }

        @Test
        @DisplayName("VÁLIDO: RUT con K mayúscula (12345678-K)")
        void testRutConKmayuscula_Valido() {
            // Editar acá para cambiar test y ejecutar nuevas validaciones
            // Otros valores válidos a probar: "19999999-K", "15555555-K", "23456789-K"
            personal.setRut("12345678-K");

            Set<ConstraintViolation<Personal>> violations = validator.validate(personal);
            assertTrue(violations.stream()
                    .filter(v -> v.getPropertyPath().toString().equals("rut"))
                    .toList().isEmpty(), "RUT K mayúscula debe ser válido");
        }

        @Test
        @DisplayName("VÁLIDO: RUT con K minúscula (98765432-k)")
        void testRutConKminuscula_Valido() {
            // Editar acá para cambiar test y ejecutar nuevas validaciones
            // Otros valores válidos: "11111111-k", "20000000-k", "25678901-k"
            personal.setRut("98765432-k");

            Set<ConstraintViolation<Personal>> violations = validator.validate(personal);
            assertTrue(violations.stream()
                    .filter(v -> v.getPropertyPath().toString().equals("rut"))
                    .toList().isEmpty(), "RUT K minúscula debe ser válido");
        }

        @Test
        @DisplayName("INVÁLIDO: Email sin @ (juanhospital.cl NO válido)")
        void testEmailSinArroba_Invalido() {
            // Editar acá para cambiar test y ejecutar nuevas validaciones
            // Otros valores inválidos: "user@", "@example.com", "user..name@email.com"
            personal.setEmail("juanhospital.cl");

            Set<ConstraintViolation<Personal>> violations = validator.validate(personal);
            assertFalse(violations.isEmpty(), "Email sin @ debe causar violación");
        }

        @Test
        @DisplayName("VÁLIDO: Email con caracteres especiales (juan.perez+hospital@domain.cl)")
        void testEmailConCaracteresEspeciales_Valido() {
            // Editar acá para cambiar test y ejecutar nuevas validaciones
            // Otros valores válidos: "user123@example.com", "name-surname@hospital.cl"
            personal.setEmail("juan.perez+hospital@domain.cl");

            Set<ConstraintViolation<Personal>> violations = validator.validate(personal);
            assertTrue(violations.stream()
                    .filter(v -> v.getPropertyPath().toString().equals("email"))
                    .toList().isEmpty(), "Email con caracteres especiales debe ser válido");
        }

        @Test
        @DisplayName("INVÁLIDO: Nombre nulo")
        void testNombreNulo_Invalido() {
            // Editar acá para cambiar test y ejecutar nuevas validaciones
            // Otros valores inválidos: "", "  ", "AB" (muy corto)
            personal.setNombre(null);

            Set<ConstraintViolation<Personal>> violations = validator.validate(personal);
            assertFalse(violations.isEmpty(), "Nombre nulo debe causar violación");
        }

        @Test
        @DisplayName("INVÁLIDO: Nombre menos de 3 caracteres (AB NO válido)")
        void testNombreMenor3Chars_Invalido() {
            // Editar acá para cambiar test y ejecutar nuevas validaciones
            // Otros valores inválidos: "", "A", "Jo", " " (espacios no cuentan)
            personal.setNombre("AB");

            Set<ConstraintViolation<Personal>> violations = validator.validate(personal);
            assertFalse(violations.isEmpty(), "Nombre < 3 caracteres debe causar violación");
        }

        @Test
        @DisplayName("VÁLIDO: Nombre con tildes y acentos (José María García López)")
        void testNombreConTildes_Valido() {
            // Editar acá para cambiar test y ejecutar nuevas validaciones
            // Otros valores válidos: "Juan Pablo Hernandez", "Maria Antonia Ramirez", "Luis Fernandez"
            personal.setNombre("José María García López");

            Set<ConstraintViolation<Personal>> violations = validator.validate(personal);
            assertTrue(violations.stream()
                    .filter(v -> v.getPropertyPath().toString().equals("nombre"))
                    .toList().isEmpty(), "Nombres con tildes deben ser válidos");
        }

        @Test
        @DisplayName("INVÁLIDO: Teléfono menos de 8 dígitos (1234567 NO válido)")
        void testTelefonoMenor8Digitos_Invalido() {
            // Editar acá para cambiar test y ejecutar nuevas validaciones
            // Otros valores inválidos: "123", "12345", "+56123" (muy corto)
            personal.setTelefono("123456789");

            Set<ConstraintViolation<Personal>> violations = validator.validate(personal);
            assertFalse(violations.isEmpty(), "Teléfono < 8 dígitos debe causar violación");
        }

        @Test
        @DisplayName("VÁLIDO: Teléfono con código internacional (+56987654321)")
        void testTelefonoConCodigo_Valido() {
            // Editar acá para cambiar test y ejecutar nuevas validaciones
            // Otros valores válidos: "912345678", "+1987654321", "987654321", "562123456789"
            personal.setTelefono("+56987654321");

            Set<ConstraintViolation<Personal>> violations = validator.validate(personal);
            assertTrue(violations.stream()
                    .filter(v -> v.getPropertyPath().toString().equals("telefono"))
                    .toList().isEmpty(), "Teléfono con código internacional debe ser válido");
        }

        @Test
        @DisplayName("INVÁLIDO: Rol inválido (GERENTE NO está permitido)")
        void testRolInvalido_Invalido() {
            // Roles válidos: MEDICO, ENFERMERO, ADMINISTRATIVO, TECNICO, OTRO
            // Editar acá para cambiar test y ejecutar nuevas validaciones
            // Otros valores inválidos: "DIRECTOR", "DIRECTOR_MEDICO", "PRACTICANTE", "AUXILIAR"
            personal.setRol("GERENTE");

            Set<ConstraintViolation<Personal>> violations = validator.validate(personal);
            assertFalse(violations.isEmpty(), "Rol inválido debe causar violación");
        }

        @Test
        @DisplayName("VÁLIDO: Todos los roles permitidos (MEDICO, ENFERMERO, ADMINISTRATIVO, TECNICO, OTRO)")
        void testRolesPermitidos_Validos() {
            // Editar acá para cambiar test y ejecutar nuevas validaciones
            // Roles válidos a probar: MEDICO, ENFERMERO, ADMINISTRATIVO, TECNICO, OTRO
            // Arrange - Prueba cada rol
            String[] rolesValidos = {"MEDICO", "ENFERMERO", "ADMINISTRATIVO", "TECNICO", "OTRO"};

            for (String rol : rolesValidos) {
                personal.setRol(rol);

                Set<ConstraintViolation<Personal>> violations = validator.validate(personal);
                assertTrue(violations.stream()
                        .filter(v -> v.getPropertyPath().toString().equals("rol"))
                        .toList().isEmpty(),
                        "Rol " + rol + " debe ser válido");
            }
        }

        @Test
        @DisplayName("INVÁLIDO: Nombre mayor a 100 caracteres")
        void testNombreMayor100Chars_Invalido() {
            // Editar acá para cambiar test y ejecutar nuevas validaciones
            // El nombre no puede exceder 100 caracteres (probar con 101 o mas)
            personal.setNombre("A".repeat(101));

            Set<ConstraintViolation<Personal>> violations = validator.validate(personal);
            assertFalse(violations.isEmpty(), "Nombre > 100 caracteres debe causar violación");
        }

        @Test
        @DisplayName("INVÁLIDO: Departamento nulo")
        void testDepartamentoNulo_Invalido() {
            // Editar acá para cambiar test y ejecutar nuevas validaciones
            // Otros valores inválidos: "", "   ", departamentos invalidos
            personal.setDepartamento("a");

            Set<ConstraintViolation<Personal>> violations = validator.validate(personal);
            assertFalse(violations.isEmpty(), "Departamento nulo debe causar violación");
        }

        @Test
        @DisplayName("VÁLIDO: Especialidad nula (opcional para no-médicos)")
        void testEspecialidadNula_Valido() {
            // Editar acá para cambiar test y ejecutar nuevas validaciones
            // Otros valores válidos: "", "Pediatria", "Ginecologia", "Cirujia"
            personal.setEspecialidad(null);

            Set<ConstraintViolation<Personal>> violations = validator.validate(personal);
            assertTrue(violations.stream()
                    .filter(v -> v.getPropertyPath().toString().equals("especialidad"))
                    .toList().isEmpty(), "Especialidad nula debe ser válida");
        }

        @Test
        @DisplayName("INVÁLIDO: HospitalId nulo")
        void testHospitalIdNulo_Invalido() {
            // Editar acá para cambiar test y ejecutar nuevas validaciones
            // El ID del hospital es obligatorio (no puede ser nulo)
            personal.setHospitalId(null);

            Set<ConstraintViolation<Personal>> violations = validator.validate(personal);
            assertFalse(violations.isEmpty(), "HospitalId nulo debe causar violación");
        }

        @Test
        @DisplayName("INVÁLIDO: HospitalId = 0 (debe ser >= 1)")
        void testHospitalIdCero_Invalido() {
            // Editar acá para cambiar test y ejecutar nuevas validaciones
            // Otros valores inválidos: -1L, -100L, cualquier numero menor a 1
            personal.setHospitalId(0L);

            Set<ConstraintViolation<Personal>> violations = validator.validate(personal);
            assertFalse(violations.isEmpty(), "HospitalId = 0 debe causar violación");
        }

        @Test
        @DisplayName("INVÁLIDO: HospitalId negativo")
        void testHospitalIdNegativo_Invalido() {
            // Editar acá para cambiar test y ejecutar nuevas validaciones
            // Otros valores inválidos: -5L, -999L, cualquier numero negativo
            personal.setHospitalId(-1L);

            Set<ConstraintViolation<Personal>> violations = validator.validate(personal);
            assertFalse(violations.isEmpty(), "HospitalId negativo debe causar violación");
        }
    }
}
