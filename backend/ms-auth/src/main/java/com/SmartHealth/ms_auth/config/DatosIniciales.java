package com.SmartHealth.ms_auth.config;

import com.SmartHealth.ms_auth.models.Rol;
import com.SmartHealth.ms_auth.models.Usuario;
import com.SmartHealth.ms_auth.repositories.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Cuentas de demostración. Se crean una sola vez al iniciar el servicio (las contraseñas se cifran con BCrypt).
 * Los IDs de paciente y personal corresponden a los datos de init-scripts/01-smarthealth-init.sql.
 */
@Component
public class DatosIniciales implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatosIniciales.class);

    private final UsuarioRepository repositorio;
    private final PasswordEncoder cifrador;

    public DatosIniciales(UsuarioRepository repositorio, PasswordEncoder cifrador) {
        this.repositorio = repositorio;
        this.cifrador = cifrador;
    }

    @Override
    public void run(String... args) {
        crearSiNoExiste("admin@clinica.cl", "Admin123!", Rol.ADMINISTRADOR, "Administración Clínica", null, null);
        crearSiNoExiste("dr.juan@clinica.cl", "Medico123!", Rol.MEDICO, "Dr. Juan Pérez", null, 1L);
        crearSiNoExiste("dra.maria@clinica.cl", "Medico123!", Rol.MEDICO, "Dra. María González", null, 2L);
        crearSiNoExiste("ana.perez@gmail.com", "Paciente123!", Rol.PACIENTE, "Ana Pérez", 1L, null);
    }

    private void crearSiNoExiste(String correo, String contrasena, Rol rol, String nombre,
                                 Long pacienteId, Long personalId) {
        if (repositorio.existsByCorreo(correo)) {
            return;
        }
        Usuario usuario = new Usuario();
        usuario.setCorreo(correo);
        usuario.setContrasenaHash(cifrador.encode(contrasena));
        usuario.setRol(rol);
        usuario.setNombre(nombre);
        usuario.setPacienteId(pacienteId);
        usuario.setPersonalId(personalId);
        repositorio.save(usuario);
        log.info("[DatosIniciales] Cuenta de demostración creada: {} ({})", correo, rol);
    }
}
