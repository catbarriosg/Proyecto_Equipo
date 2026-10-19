package com.SmartHealth.ms_gateway.seguridad;

import org.springframework.http.HttpMethod;
import org.springframework.http.server.PathContainer;
import org.springframework.stereotype.Component;
import org.springframework.web.util.pattern.PathPattern;
import org.springframework.web.util.pattern.PathPatternParser;

import java.util.List;
import java.util.Set;

/**
 * Tabla de permisos del gateway. Las reglas se revisan en orden y gana la primera que coincide.
 * Lo que no aparece en la tabla queda bloqueado.
 *
 * Los servicios aplican además las reglas de propiedad (por ejemplo, que un paciente solo vea sus propias citas)
 * usando las cabeceras X-Usuario-* que agrega {@link FiltroAutenticacionJwt}.
 */
@Component
public class ReglasAcceso {

    public static final String PACIENTE = "PACIENTE";
    public static final String MEDICO = "MEDICO";
    public static final String ADMINISTRADOR = "ADMINISTRADOR";

    private static final Set<String> PUBLICO = Set.of();
    private static final Set<String> CUALQUIER_SESION = Set.of(PACIENTE, MEDICO, ADMINISTRADOR);
    private static final Set<String> PERSONAL_CLINICO = Set.of(MEDICO, ADMINISTRADOR);
    private static final Set<String> SOLO_ADMIN = Set.of(ADMINISTRADOR);

    public record Regla(HttpMethod metodo, PathPattern patron, Set<String> roles) {
        boolean esPublica() {
            return roles.isEmpty();
        }
    }

    private final List<Regla> reglas;

    public ReglasAcceso() {
        PathPatternParser parser = new PathPatternParser();
        reglas = List.of(
                // Preflight de CORS
                regla(parser, HttpMethod.OPTIONS, "/**", PUBLICO),

                // Documentación y salud
                regla(parser, HttpMethod.GET, "/swagger-ui.html", PUBLICO),
                regla(parser, HttpMethod.GET, "/swagger-ui/**", PUBLICO),
                regla(parser, HttpMethod.GET, "/webjars/**", PUBLICO),
                regla(parser, HttpMethod.GET, "/v3/api-docs/**", PUBLICO),
                regla(parser, HttpMethod.GET, "/ms-*/v3/api-docs/**", PUBLICO),
                regla(parser, HttpMethod.GET, "/actuator/health", PUBLICO),

                // Autenticación
                regla(parser, HttpMethod.POST, "/api/auth/login", PUBLICO),
                regla(parser, HttpMethod.POST, "/api/auth/registro", PUBLICO),
                regla(parser, HttpMethod.GET, "/api/auth/me", CUALQUIER_SESION),
                regla(parser, null, "/api/auth/usuarios/**", SOLO_ADMIN),

                // Información pública de la clínica
                regla(parser, HttpMethod.GET, "/api/sucursales/**", PUBLICO),
                regla(parser, HttpMethod.GET, "/api/especialidades/**", PUBLICO),
                regla(parser, HttpMethod.GET, "/api/medicos/**", PUBLICO),
                regla(parser, HttpMethod.GET, "/api/citas/disponibilidad", PUBLICO),

                // Citas: cada servicio revisa que la cita pertenezca a quien la consulta
                regla(parser, null, "/api/citas/**", CUALQUIER_SESION),

                // Pacientes
                regla(parser, HttpMethod.GET, "/api/pacientes", PERSONAL_CLINICO),
                regla(parser, HttpMethod.GET, "/api/pacientes/rut/**", PERSONAL_CLINICO),
                regla(parser, HttpMethod.GET, "/api/pacientes/id/*", CUALQUIER_SESION),
                regla(parser, HttpMethod.PUT, "/api/pacientes/*", CUALQUIER_SESION),
                regla(parser, null, "/api/pacientes/**", SOLO_ADMIN),

                // Historial clínico
                regla(parser, HttpMethod.GET, "/api/historial/paciente/*", CUALQUIER_SESION),
                regla(parser, HttpMethod.POST, "/api/historial", PERSONAL_CLINICO),
                regla(parser, null, "/api/historial/**", SOLO_ADMIN),

                // Administración de la clínica
                regla(parser, null, "/api/personal/**", SOLO_ADMIN),
                regla(parser, null, "/api/medicos/**", SOLO_ADMIN),
                regla(parser, null, "/api/especialidades/**", SOLO_ADMIN),
                regla(parser, null, "/api/sucursales/**", SOLO_ADMIN),
                regla(parser, null, "/api/hospitales/**", SOLO_ADMIN),

                // Servicios internos sin vistas en el frontend
                regla(parser, null, "/api/camas/**", SOLO_ADMIN),
                regla(parser, null, "/api/triaje/**", SOLO_ADMIN),
                regla(parser, null, "/api/insumos/**", SOLO_ADMIN),
                regla(parser, null, "/api/equipamiento/**", SOLO_ADMIN),
                regla(parser, null, "/api/listas-espera/**", SOLO_ADMIN)
        );
    }

    private static Regla regla(PathPatternParser parser, HttpMethod metodo, String patron, Set<String> roles) {
        return new Regla(metodo, parser.parse(patron), roles);
    }

    /** Devuelve la primera regla que coincide, o null si la ruta no está permitida. */
    public Regla buscar(HttpMethod metodo, String ruta) {
        PathContainer camino = PathContainer.parsePath(ruta);
        for (Regla regla : reglas) {
            boolean mismoMetodo = regla.metodo() == null || regla.metodo().equals(metodo);
            if (mismoMetodo && regla.patron().matches(camino)) {
                return regla;
            }
        }
        return null;
    }
}
