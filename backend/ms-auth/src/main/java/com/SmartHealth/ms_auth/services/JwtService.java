package com.SmartHealth.ms_auth.services;

import com.SmartHealth.ms_auth.models.Usuario;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;

/**
 * Firma los tokens JWT con la misma clave que usa el gateway para validarlos (variable JWT_SECRET).
 */
@Service
public class JwtService {

    private final SecretKey clave;
    private final Duration duracion;

    /** La clave y la duración (8 horas por defecto) se leen de application.properties. */
    public JwtService(@Value("${jwt.secret}") String secreto,
                      @Value("${jwt.expiracion-horas:8}") long horas) {
        this.clave = Keys.hmacShaKeyFor(secreto.getBytes(StandardCharsets.UTF_8));
        this.duracion = Duration.ofHours(horas);
    }

    /**
     * Genera el token JWT firmado con HMAC-SHA. Contiene:
     * subject = id del usuario, correo, nombre, rol, fecha de emisión y de expiración,
     * y además pacienteId o personalId según el tipo de cuenta.
     * El gateway lee estos datos para saber quién hace cada petición.
     */
    public String generarToken(Usuario usuario) {
        Instant ahora = Instant.now();
        JwtBuilder token = Jwts.builder()
                .subject(String.valueOf(usuario.getId()))
                .claim("correo", usuario.getCorreo())
                .claim("nombre", usuario.getNombre())
                .claim("rol", usuario.getRol().name())
                .issuedAt(Date.from(ahora))
                .expiration(Date.from(ahora.plus(duracion)))
                .signWith(clave);
        if (usuario.getPacienteId() != null) token.claim("pacienteId", usuario.getPacienteId());
        if (usuario.getPersonalId() != null) token.claim("personalId", usuario.getPersonalId());
        return token.compact();
    }

    /** Duración del token en segundos (el frontend la recibe como expiraEnSegundos). */
    public long segundosDeVigencia() {
        return duracion.toSeconds();
    }
}
