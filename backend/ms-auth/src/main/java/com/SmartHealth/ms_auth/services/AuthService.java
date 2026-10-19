package com.SmartHealth.ms_auth.services;

import com.SmartHealth.ms_auth.clients.PacienteClient;
import com.SmartHealth.ms_auth.dtos.*;
import com.SmartHealth.ms_auth.exceptions.ApiException;
import com.SmartHealth.ms_auth.models.Rol;
import com.SmartHealth.ms_auth.models.Usuario;
import com.SmartHealth.ms_auth.repositories.UsuarioRepository;
import feign.FeignException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);
    private static final String CREDENCIALES_INVALIDAS = "Correo o contraseña incorrectos.";

    private final UsuarioRepository repositorio;
    private final PasswordEncoder cifrador;
    private final JwtService jwtService;
    private final PacienteClient pacienteClient;

    public AuthService(UsuarioRepository repositorio, PasswordEncoder cifrador, JwtService jwtService,
                       PacienteClient pacienteClient) {
        this.repositorio = repositorio;
        this.cifrador = cifrador;
        this.jwtService = jwtService;
        this.pacienteClient = pacienteClient;
    }

    public SesionDTO iniciarSesion(LoginRequest datos) {
        Usuario usuario = repositorio.findByCorreo(normalizar(datos.getCorreo()))
                .orElseThrow(() -> ApiException.noAutorizado(CREDENCIALES_INVALIDAS));

        if (!cifrador.matches(datos.getContrasena(), usuario.getContrasenaHash())) {
            throw ApiException.noAutorizado(CREDENCIALES_INVALIDAS);
        }
        if (!Boolean.TRUE.equals(usuario.getActivo())) {
            throw ApiException.prohibido("Tu cuenta está desactivada. Comunícate con la clínica.");
        }
        if (datos.getRol() != null && datos.getRol() != usuario.getRol()) {
            throw ApiException.prohibido(usuario.getRol() == Rol.PACIENTE
                    ? "Esta cuenta es de paciente. Ingresa desde el acceso de pacientes."
                    : "Estas credenciales no corresponden a este acceso.");
        }

        log.info("[AuthService] Inicio de sesión de {} ({})", usuario.getCorreo(), usuario.getRol());
        return crearSesion(usuario);
    }

    /**
     * Registra un paciente: crea su ficha en ms-pacientes y luego la cuenta que la referencia.
     * Si la clínica ya había registrado al paciente con el mismo RUT y correo, se le vincula la cuenta.
     */
    public SesionDTO registrarPaciente(RegistroRequest datos) {
        String correo = normalizar(datos.getCorreo());
        if (repositorio.existsByCorreo(correo)) {
            throw ApiException.conflicto("Este correo ya está registrado. Inicia sesión o usa otro correo.");
        }

        String rut = datos.getRut().trim().toUpperCase();
        String nombreCompleto = datos.getNombre().trim() + " " + datos.getApellido().trim();
        PacienteDTO paciente = new PacienteDTO(null, rut, nombreCompleto, correo, datos.getFechaNacimiento(),
                vacioANulo(datos.getPrevision()), vacioANulo(datos.getTelefono()), true);

        PacienteDTO guardado;
        try {
            guardado = pacienteClient.crear(paciente);
        } catch (FeignException.Conflict e) {
            guardado = vincularPacienteExistente(rut, correo);
        }

        Usuario usuario = new Usuario();
        usuario.setCorreo(correo);
        usuario.setContrasenaHash(cifrador.encode(datos.getContrasena()));
        usuario.setRol(Rol.PACIENTE);
        usuario.setNombre(nombreCompleto);
        usuario.setPacienteId(guardado.getId());
        Usuario creado = repositorio.save(usuario);

        log.info("[AuthService] Paciente registrado: {} (paciente ID {})", correo, guardado.getId());
        return crearSesion(creado);
    }

    private PacienteDTO vincularPacienteExistente(String rut, String correo) {
        PacienteDTO existente = pacienteClient.buscarPorRut(rut);
        boolean mismoCorreo = existente.getCorreo() != null && existente.getCorreo().equalsIgnoreCase(correo);
        if (!mismoCorreo || repositorio.existsByPacienteId(existente.getId())) {
            throw ApiException.conflicto("Ya existe un paciente registrado con ese RUT. "
                    + "Si es tuyo, inicia sesión o comunícate con la clínica.");
        }
        return existente;
    }

    public UsuarioDTO obtener(Long id) {
        return repositorio.findById(id)
                .map(UsuarioDTO::desde)
                .orElseThrow(() -> ApiException.noEncontrado("No encontramos la cuenta solicitada."));
    }

    public List<UsuarioDTO> listar() {
        return repositorio.findAll().stream().map(UsuarioDTO::desde).toList();
    }

    /** Usado por el administrador para dar acceso a un médico u otro administrador. */
    public UsuarioDTO crearCuenta(CrearUsuarioRequest datos) {
        String correo = normalizar(datos.getCorreo());
        if (repositorio.existsByCorreo(correo)) {
            throw ApiException.conflicto("Ya existe una cuenta con ese correo.");
        }
        if (datos.getRol() == Rol.MEDICO && datos.getPersonalId() == null) {
            throw ApiException.solicitudInvalida("Una cuenta de médico debe estar asociada a un profesional.");
        }
        if (datos.getRol() == Rol.PACIENTE && datos.getPacienteId() == null) {
            throw ApiException.solicitudInvalida("Una cuenta de paciente debe estar asociada a un paciente.");
        }
        if (datos.getPersonalId() != null && repositorio.existsByPersonalId(datos.getPersonalId())) {
            throw ApiException.conflicto("Ese profesional ya tiene una cuenta.");
        }

        Usuario usuario = new Usuario();
        usuario.setCorreo(correo);
        usuario.setContrasenaHash(cifrador.encode(datos.getContrasena()));
        usuario.setRol(datos.getRol());
        usuario.setNombre(datos.getNombre().trim());
        usuario.setPacienteId(datos.getPacienteId());
        usuario.setPersonalId(datos.getPersonalId());
        return UsuarioDTO.desde(repositorio.save(usuario));
    }

    public UsuarioDTO cambiarEstado(Long id, boolean activo) {
        Usuario usuario = repositorio.findById(id)
                .orElseThrow(() -> ApiException.noEncontrado("No encontramos la cuenta solicitada."));
        usuario.setActivo(activo);
        return UsuarioDTO.desde(repositorio.save(usuario));
    }

    private SesionDTO crearSesion(Usuario usuario) {
        return new SesionDTO(jwtService.generarToken(usuario), jwtService.segundosDeVigencia(),
                UsuarioDTO.desde(usuario));
    }

    private static String normalizar(String correo) {
        return correo == null ? null : correo.trim().toLowerCase();
    }

    private static String vacioANulo(String valor) {
        return valor == null || valor.isBlank() ? null : valor.trim();
    }
}
