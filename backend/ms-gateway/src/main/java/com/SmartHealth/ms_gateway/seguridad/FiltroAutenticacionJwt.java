package com.SmartHealth.ms_gateway.seguridad;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Valida el token JWT de cada petición y reenvía la identidad del usuario a los microservicios
 * mediante las cabeceras X-Usuario-*. Esas cabeceras se eliminan primero si vienen del navegador,
 * para que nadie pueda hacerse pasar por otro usuario.
 */
@Component
public class FiltroAutenticacionJwt implements GlobalFilter, Ordered {

    private static final Logger log = LoggerFactory.getLogger(FiltroAutenticacionJwt.class);

    public static final String CABECERA_ID = "X-Usuario-Id";
    public static final String CABECERA_ROL = "X-Usuario-Rol";
    public static final String CABECERA_CORREO = "X-Usuario-Correo";
    public static final String CABECERA_PACIENTE = "X-Paciente-Id";
    public static final String CABECERA_PERSONAL = "X-Personal-Id";

    private final ReglasAcceso reglasAcceso;
    private final SecretKey clave;
    private final ObjectMapper mapper = new ObjectMapper();

    public FiltroAutenticacionJwt(ReglasAcceso reglasAcceso, @Value("${jwt.secret}") String secreto) {
        this.reglasAcceso = reglasAcceso;
        this.clave = Keys.hmacShaKeyFor(secreto.getBytes(StandardCharsets.UTF_8));
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest peticion = exchange.getRequest().mutate()
                .headers(cabeceras -> {
                    cabeceras.remove(CABECERA_ID);
                    cabeceras.remove(CABECERA_ROL);
                    cabeceras.remove(CABECERA_CORREO);
                    cabeceras.remove(CABECERA_PACIENTE);
                    cabeceras.remove(CABECERA_PERSONAL);
                })
                .build();

        String ruta = peticion.getPath().value();
        ReglasAcceso.Regla regla = reglasAcceso.buscar(peticion.getMethod(), ruta);
        if (regla == null) {
            return responderError(exchange, HttpStatus.NOT_FOUND, "RUTA_NO_DISPONIBLE",
                    "La ruta solicitada no existe o no está disponible.");
        }
        if (regla.esPublica()) {
            return chain.filter(exchange.mutate().request(peticion).build());
        }

        String autorizacion = peticion.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (autorizacion == null || !autorizacion.startsWith("Bearer ")) {
            return responderError(exchange, HttpStatus.UNAUTHORIZED, "SESION_REQUERIDA",
                    "Debes iniciar sesión para realizar esta acción.");
        }

        Claims datos;
        try {
            datos = Jwts.parser().verifyWith(clave).build()
                    .parseSignedClaims(autorizacion.substring(7))
                    .getPayload();
        } catch (JwtException | IllegalArgumentException e) {
            log.warn("[Gateway] Token rechazado en {}: {}", ruta, e.getMessage());
            return responderError(exchange, HttpStatus.UNAUTHORIZED, "SESION_INVALIDA",
                    "Tu sesión expiró o no es válida. Vuelve a iniciar sesión.");
        }

        String rol = datos.get("rol", String.class);
        if (rol == null || !regla.roles().contains(rol)) {
            return responderError(exchange, HttpStatus.FORBIDDEN, "ACCESO_DENEGADO",
                    "Tu cuenta no tiene permisos para realizar esta acción.");
        }

        ServerHttpRequest conIdentidad = peticion.mutate()
                .headers(cabeceras -> {
                    cabeceras.set(CABECERA_ID, datos.getSubject());
                    cabeceras.set(CABECERA_ROL, rol);
                    agregarSiExiste(cabeceras, CABECERA_CORREO, datos.get("correo"));
                    agregarSiExiste(cabeceras, CABECERA_PACIENTE, datos.get("pacienteId"));
                    agregarSiExiste(cabeceras, CABECERA_PERSONAL, datos.get("personalId"));
                })
                .build();
        return chain.filter(exchange.mutate().request(conIdentidad).build());
    }

    private static void agregarSiExiste(HttpHeaders cabeceras, String nombre, Object valor) {
        if (valor != null) {
            cabeceras.set(nombre, String.valueOf(valor));
        }
    }

    private Mono<Void> responderError(ServerWebExchange exchange, HttpStatus estado, String codigo, String mensaje) {
        Map<String, Object> cuerpo = new LinkedHashMap<>();
        cuerpo.put("timestamp", LocalDateTime.now().toString());
        cuerpo.put("status", estado.value());
        cuerpo.put("error", codigo);
        cuerpo.put("mensaje", mensaje);

        ServerHttpResponse respuesta = exchange.getResponse();
        respuesta.setStatusCode(estado);
        respuesta.getHeaders().setContentType(MediaType.APPLICATION_JSON);
        try {
            DataBuffer buffer = respuesta.bufferFactory().wrap(mapper.writeValueAsBytes(cuerpo));
            return respuesta.writeWith(Mono.just(buffer));
        } catch (Exception e) {
            return respuesta.setComplete();
        }
    }

    @Override
    public int getOrder() {
        // Antes del enrutamiento y del balanceo de carga
        return -100;
    }
}
