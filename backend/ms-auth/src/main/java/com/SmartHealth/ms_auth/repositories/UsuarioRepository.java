package com.SmartHealth.ms_auth.repositories;

import com.SmartHealth.ms_auth.models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByCorreo(String correo);
    boolean existsByCorreo(String correo);
    boolean existsByPacienteId(Long pacienteId);
    boolean existsByPersonalId(Long personalId);
}
