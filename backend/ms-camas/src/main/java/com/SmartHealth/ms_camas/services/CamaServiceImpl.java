package com.SmartHealth.ms_camas.services;

import com.SmartHealth.ms_camas.clients.HospitalClient;
import com.SmartHealth.ms_camas.clients.PacienteClient;
import com.SmartHealth.ms_camas.enums.TipoCama;
import com.SmartHealth.ms_camas.models.Cama;
import com.SmartHealth.ms_camas.models.HospitalDTO;
import com.SmartHealth.ms_camas.models.PacienteDTO;
import com.SmartHealth.ms_camas.repositories.CamaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CamaServiceImpl implements CamaService {

    private static final Logger log = LoggerFactory.getLogger(CamaServiceImpl.class);

    @Autowired
    private CamaRepository repository;

    @Autowired
    private HospitalClient hospitalClient;

    @Autowired
    private PacienteClient pacienteClient;

    @Override
    public List<Cama> obtenerTodas() {
        log.debug("[CamaService] Consultando todas las camas activas");
        List<Cama> camas = repository.findByActivaTrue();
        log.info("[CamaService] Total camas activas encontradas: {}", camas.size());
        return camas;
    }

    @Override
    public Cama obtenerPorId(Long id) {
        log.debug("[CamaService] Buscando cama con ID: {}", id);
        Cama cama = repository.findById(id)
                .orElseThrow(() -> {
                    log.warn("[CamaService] Cama con ID {} no encontrada", id);
                    return new RuntimeException("Cama con ID " + id + " no encontrada en el sistema.");
                });
        log.info("[CamaService] Cama encontrada: {} - Estado: {}", cama.getCodigo(), cama.getEstado());
        return cama;
    }

    @Override
    public Cama obtenerPorCodigo(String codigo) {
        log.debug("[CamaService] Buscando cama con código: {}", codigo);
        Cama cama = repository.findByCodigo(codigo)
                .orElseThrow(() -> {
                    log.warn("[CamaService] Cama con código '{}' no encontrada", codigo);
                    return new RuntimeException("Cama con código '" + codigo + "' no encontrada en el sistema.");
                });
        log.info("[CamaService] Cama '{}' encontrada en hospital ID: {}", cama.getCodigo(), cama.getHospitalId());
        return cama;
    }

    @Override
    public List<Cama> obtenerPorHospital(Long hospitalId) {
        log.debug("[CamaService] Consultando camas del hospital ID: {}", hospitalId);
        validarHospitalExiste(hospitalId);
        List<Cama> camas = repository.findByHospitalIdAndActivaTrue(hospitalId);
        log.info("[CamaService] {} camas encontradas para hospital ID {}", camas.size(), hospitalId);
        return camas;
    }

    @Override
    public List<Cama> obtenerDisponiblesPorHospital(Long hospitalId) {
        log.debug("[CamaService] Consultando camas DISPONIBLES del hospital ID: {}", hospitalId);
        validarHospitalExiste(hospitalId);
        List<Cama> disponibles = repository.findByHospitalIdAndEstadoAndActivaTrue(hospitalId, "DISPONIBLE");
        log.info("[CamaService] {} camas DISPONIBLES en hospital ID {}", disponibles.size(), hospitalId);
        return disponibles;
    }

    @Override
    public List<Cama> obtenerPorEstado(String estado) {
        log.debug("[CamaService] Filtrando camas por estado: {}", estado);
        List<Cama> camas = repository.findByEstadoAndActivaTrue(estado.toUpperCase());
        log.info("[CamaService] {} camas con estado '{}'", camas.size(), estado);
        return camas;
    }

    @Override
    public List<Cama> obtenerPorTipo(String tipo) {
        log.debug("[CamaService] Filtrando camas por tipo: {}", tipo);
        if (!TipoCama.isValido(tipo)) {
            String tiposValidos = TipoCama.getTiposValidos();
            String mensaje = "Tipo de cama inválido: '" + tipo + "'. Tipos válidos: " + tiposValidos;
            log.warn("[CamaService] {}", mensaje);
            throw new RuntimeException(mensaje);
        }
        List<Cama> camas = repository.findByTipoAndActivaTrue(tipo.toUpperCase());
        log.info("[CamaService] {} camas de tipo '{}'", camas.size(), tipo);
        return camas;
    }

    @Override
    public Map<String, Object> obtenerResumenHospital(Long hospitalId) {
        log.debug("[CamaService] Generando resumen de camas para hospital ID: {}", hospitalId);
        HospitalDTO hospital = validarHospitalExiste(hospitalId);

        long disponibles = repository.contarDisponiblesPorHospital(hospitalId);
        List<Cama> todasCamas = repository.findByHospitalIdAndActivaTrue(hospitalId);
        long ocupadas = todasCamas.stream().filter(c -> "OCUPADA".equals(c.getEstado())).count();
        long mantencion = todasCamas.stream().filter(c -> "MANTENCION".equals(c.getEstado())).count();
        long reservadas = todasCamas.stream().filter(c -> "RESERVADA".equals(c.getEstado())).count();

        Map<String, Object> resumen = new HashMap<>();
        resumen.put("hospitalId", hospitalId);
        resumen.put("nombreHospital", hospital.getNombre());
        resumen.put("region", hospital.getRegion());
        resumen.put("totalCamasRegistradas", todasCamas.size());
        resumen.put("disponibles", disponibles);
        resumen.put("ocupadas", ocupadas);
        resumen.put("enMantencion", mantencion);
        resumen.put("reservadas", reservadas);
        resumen.put("porcentajeOcupacion",
                todasCamas.isEmpty() ? 0 : Math.round((double) ocupadas / todasCamas.size() * 100));

        log.info("[CamaService] Resumen hospital '{}': {} disponibles / {} total",
                hospital.getNombre(), disponibles, todasCamas.size());
        return resumen;
    }

    @Override
    public Cama guardarCama(Cama cama) {
        log.debug("[CamaService] Registrando nueva cama: {} para hospital ID: {}", cama.getCodigo(), cama.getHospitalId());

        // Validar que el hospital existe (llama a ms-hospitales via Feign)
        validarHospitalExiste(cama.getHospitalId());

        // Validar código único
        if (repository.existsByCodigo(cama.getCodigo())) {
            log.warn("[CamaService] Ya existe una cama con código: {}", cama.getCodigo());
            throw new RuntimeException("Ya existe una cama registrada con el código '" + cama.getCodigo() + "'.");
        }

        // Por defecto, nueva cama está DISPONIBLE
        if (cama.getEstado() == null || cama.getEstado().isBlank()) {
            cama.setEstado("DISPONIBLE");
        }

        Cama guardada = repository.save(cama);
        log.info("[CamaService] Cama '{}' (tipo: {}) registrada con ID: {} en hospital {}",
                guardada.getCodigo(), guardada.getTipo(), guardada.getId(), guardada.getHospitalId());
        return guardada;
    }

    @Override
    public Cama actualizarEstado(Long id, String nuevoEstado, String rutPaciente) {
        log.debug("[CamaService] Actualizando estado de cama ID {} a '{}'", id, nuevoEstado);
        Cama cama = obtenerPorId(id);
        String estadoAnterior = cama.getEstado();
        cama.setEstado(nuevoEstado.toUpperCase());

        // Si la cama pasa a DISPONIBLE, limpiar el RUT del paciente
        if ("DISPONIBLE".equalsIgnoreCase(nuevoEstado)) {
            cama.setRutPacienteActual(null);
            log.info("[CamaService] Cama {} liberada (estaba: {})", cama.getCodigo(), estadoAnterior);
        } else if ("OCUPADA".equalsIgnoreCase(nuevoEstado)) {
            if (rutPaciente == null || rutPaciente.isBlank()) {
                throw new RuntimeException("Para marcar una cama como OCUPADA se requiere el RUT del paciente.");
            }
            // ✅ NUEVA: Validar que el RUT corresponde a un paciente existente
            validarPacienteExiste(rutPaciente);
            cama.setRutPacienteActual(rutPaciente);
            log.info("[CamaService] Cama {} asignada al paciente RUT: {}", cama.getCodigo(), rutPaciente);
        }

        Cama actualizada = repository.save(cama);
        log.info("[CamaService] Estado de cama '{}' cambiado: {} -> {}", cama.getCodigo(), estadoAnterior, nuevoEstado);
        return actualizada;
    }

    @Override
    public Cama actualizarCama(Long id, Cama datosNuevos) {
        log.debug("[CamaService] Actualizando datos de cama ID: {}", id);
        validarHospitalExiste(datosNuevos.getHospitalId());
        return repository.findById(id).map(c -> {
            c.setCodigo(datosNuevos.getCodigo());
            c.setTipo(datosNuevos.getTipo());
            c.setEstado(datosNuevos.getEstado());
            c.setSector(datosNuevos.getSector());
            c.setHospitalId(datosNuevos.getHospitalId());
            c.setRutPacienteActual(datosNuevos.getRutPacienteActual());
            Cama actualizada = repository.save(c);
            log.info("[CamaService] Cama ID {} actualizada correctamente", id);
            return actualizada;
        }).orElseThrow(() -> {
            log.error("[CamaService] No se pudo actualizar: cama con ID {} no existe", id);
            return new RuntimeException("Cama con ID " + id + " no encontrada para actualizar.");
        });
    }

    @Override
    public Cama desactivarCama(Long id) {
        log.debug("[CamaService] Desactivando cama ID: {}", id);
        Cama cama = obtenerPorId(id);
        cama.setActiva(false);
        Cama desactivada = repository.save(cama);
        log.info("[CamaService] Cama '{}' (ID: {}) desactivada del sistema", cama.getCodigo(), id);
        return desactivada;
    }

    // ---- Métodos privados de apoyo ----

    /**
     * Valida que el hospital con el ID especificado exista y esté activo.
     * Se comunica con ms-hospitales vía Feign.
     *
     * @param hospitalId ID del hospital a validar
     * @return HospitalDTO si es válido
     * @throws RuntimeException si no existe o no está activo
     */
    private HospitalDTO validarHospitalExiste(Long hospitalId) {
        try {
            HospitalDTO hospital = hospitalClient.obtenerHospitalPorId(hospitalId);
            if (hospital == null || Boolean.FALSE.equals(hospital.getActivo())) {
                log.warn("[CamaService] Hospital ID {} no activo o no encontrado", hospitalId);
                throw new RuntimeException("El hospital con ID " + hospitalId + " no existe o no está activo.");
            }
            return hospital;
        } catch (RuntimeException ex) {
            throw ex;
        } catch (Exception ex) {
            log.error("[CamaService] Error al consultar ms-hospitales para ID {}: {}", hospitalId, ex.getMessage());
            throw new RuntimeException("No se pudo verificar el hospital con ID " + hospitalId +
                    ". Asegúrese de que ms-hospitales esté disponible.");
        }
    }

    /**
     * Valida que el paciente con el RUT especificado exista y esté activo.
     * Se comunica con ms-pacientes vía Feign.
     *
     * @param rut RUT del paciente a validar
     * @return PacienteDTO si es válido
     * @throws RuntimeException si no existe, no está activo o hay error en la comunicación
     */
    private PacienteDTO validarPacienteExiste(String rut) {
        try {
            log.debug("[CamaService] Validando existencia de paciente con RUT: {}", rut);
            PacienteDTO paciente = pacienteClient.obtenerPacientePorRut(rut);
            if (paciente == null || Boolean.FALSE.equals(paciente.getActivo())) {
                log.warn("[CamaService] Paciente RUT {} no activo o no encontrado", rut);
                throw new RuntimeException("El paciente con RUT " + rut + " no existe o no está activo.");
            }
            log.info("[CamaService] Paciente RUT {} validado correctamente: {}", rut, paciente.getNombreCompleto());
            return paciente;
        } catch (RuntimeException ex) {
            throw ex;
        } catch (Exception ex) {
            log.error("[CamaService] Error al consultar ms-pacientes para RUT {}: {}", rut, ex.getMessage());
            throw new RuntimeException("No se pudo validar el paciente con RUT " + rut +
                    ". Asegúrese de que ms-pacientes esté disponible.");
        }
    }
}
