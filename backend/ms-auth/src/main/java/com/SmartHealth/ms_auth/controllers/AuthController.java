package com.SmartHealth.ms_auth.controllers;

import com.SmartHealth.ms_auth.dtos.*;
import com.SmartHealth.ms_auth.exceptions.ApiException;
import com.SmartHealth.ms_auth.seguridad.Identidad;
import com.SmartHealth.ms_auth.services.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Endpoints REST de autenticación (/api/auth). El controlador solo recibe la petición, valida el cuerpo
 * con @Valid y delega la lógica en AuthService.
 */
@RestController
@RequestMapping("/api/auth")
@Tag(name = "Autenticación", description = "Registro de pacientes, inicio de sesión y cuentas del personal")
public class AuthController {

    private final AuthService servicio;

    public AuthController(AuthService servicio) {
        this.servicio = servicio;
    }

    /** POST /api/auth/login — valida las credenciales y devuelve el token JWT con los datos del usuario. */
    @PostMapping("/login")
    @Operation(summary = "Iniciar sesión y obtener un token JWT")
    public SesionDTO login(@Valid @RequestBody LoginRequest datos) {
        return servicio.iniciarSesion(datos);
    }

    /** POST /api/auth/registro — crea la ficha y la cuenta del paciente; responde 201 con la sesión iniciada. */
    @PostMapping("/registro")
    @Operation(summary = "Registrar un paciente nuevo (crea su ficha y su cuenta)")
    public ResponseEntity<SesionDTO> registro(@Valid @RequestBody RegistroRequest datos) {
        return ResponseEntity.status(HttpStatus.CREATED).body(servicio.registrarPaciente(datos));
    }

    /** GET /api/auth/me — datos de la cuenta conectada, según la identidad que agrega el gateway. */
    @GetMapping("/me")
    @Operation(summary = "Datos de la cuenta con sesión iniciada")
    public UsuarioDTO yo() {
        Identidad identidad = Identidad.actual();
        if (identidad.usuarioId() == null) {
            throw ApiException.noAutorizado("Debes iniciar sesión.");
        }
        return servicio.obtener(identidad.usuarioId());
    }

    /** GET /api/auth/usuarios — lista todas las cuentas (el gateway lo restringe al administrador). */
    @GetMapping("/usuarios")
    @Operation(summary = "Listar cuentas (administrador)")
    public List<UsuarioDTO> listar() {
        return servicio.listar();
    }

    /** POST /api/auth/usuarios — el administrador crea la cuenta de un médico u otro administrador. */
    @PostMapping("/usuarios")
    @Operation(summary = "Crear una cuenta de médico o administrador (administrador)")
    public ResponseEntity<UsuarioDTO> crear(@Valid @RequestBody CrearUsuarioRequest datos) {
        return ResponseEntity.status(HttpStatus.CREATED).body(servicio.crearCuenta(datos));
    }

    /** PATCH /api/auth/usuarios/{id}/estado — activa o desactiva una cuenta. Cuerpo: { "activo": true | false }. */
    @PatchMapping("/usuarios/{id}/estado")
    @Operation(summary = "Activar o desactivar una cuenta (administrador)")
    public UsuarioDTO cambiarEstado(@PathVariable Long id, @RequestBody Map<String, Boolean> cuerpo) {
        Boolean activo = cuerpo.get("activo");
        if (activo == null) {
            throw ApiException.solicitudInvalida("Indica si la cuenta queda activa (activo: true o false).");
        }
        return servicio.cambiarEstado(id, activo);
    }
}
