package com.SmartHealth.ms_auth.repositories;

import com.SmartHealth.ms_auth.models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Acceso a la tabla "usuarios". JpaRepository ya trae save, findById, findAll, deleteById, etc.
 * Los métodos declarados aquí se implementan solos: Spring Data arma la consulta a partir del nombre
 * (findByCorreo → SELECT ... WHERE correo = ?; existsBy... → devuelve true/false).
 */
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByCorreo(String correo);
    boolean existsByCorreo(String correo);
    boolean existsByPacienteId(Long pacienteId);
    boolean existsByPersonalId(Long personalId);
}
