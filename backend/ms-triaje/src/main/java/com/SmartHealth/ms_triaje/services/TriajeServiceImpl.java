package com.SmartHealth.ms_triaje.services;

import com.SmartHealth.ms_triaje.clients.PacienteClient;
import com.SmartHealth.ms_triaje.clients.PersonalClient;
import com.SmartHealth.ms_triaje.models.PacienteDTO;
import com.SmartHealth.ms_triaje.models.PersonalSaludDTO;
import com.SmartHealth.ms_triaje.models.Triaje;
import com.SmartHealth.ms_triaje.repositories.TriajeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TriajeServiceImpl implements TriajeService {

    private static final Logger log = LoggerFactory.getLogger(TriajeServiceImpl.class);

    @Autowired
    private TriajeRepository repository;

    @Autowired
    private PacienteClient pacienteClient;

    @Autowired
    private PersonalClient personalClient;

    /**
     * Registra un nuevo triaje con puntuación automática.
     * Valida que el RUT del paciente y el personalId existan antes de crear el triaje.
     * Calcula puntuación y nivel de urgencia antes de guardar.
     */
    @Override
    public Triaje registrarTriaje(Triaje triaje) {
        log.info("[TriajeService] Registrando triaje para paciente RUT: {} con personal ID: {}", 
                triaje.getRutPaciente(), triaje.getPersonalId());
        
        // Validar que el paciente existe
        validarPacienteExiste(triaje.getRutPaciente());

        // Validar que el personal de salud existe
        validarPersonalExiste(triaje.getPersonalId());
        
        // Calcular puntuación automáticamente
        Integer puntuacion = calcularPuntuacionTriaje(triaje);
        triaje.setPuntuacionTriaje(puntuacion);
        
        // Determinar nivel de urgencia automáticamente
        String nivelUrgencia = determinarNivelUrgencia(puntuacion);
        triaje.setNivelUrgencia(nivelUrgencia);
        
        Triaje guardado = repository.save(triaje);
        log.info("[TriajeService] Triaje registrado exitosamente con ID: {} - Nivel: {}", 
                guardado.getId(), guardado.getNivelUrgencia());
        return guardado;
    }

    /**
     * Valida que el RUT del paciente exista en ms-pacientes.
     * Lanza RuntimeException si el paciente no existe o está inactivo.
     */
    private void validarPacienteExiste(String rut) {
        try {
            log.debug("[TriajeService] Validando existencia de paciente con RUT: {}", rut);
            PacienteDTO paciente = pacienteClient.obtenerPacientePorRut(rut);
            if (paciente == null || !paciente.getActivo()) {
                log.warn("[TriajeService] Paciente RUT {} no encontrado o inactivo", rut);
                throw new RuntimeException("Paciente con RUT " + rut + " no encontrado o inactivo");
            }
            log.info("[TriajeService] Paciente RUT {} validado: {}", rut, paciente.getNombreCompleto());
        } catch (RuntimeException ex) {
            throw ex;
        } catch (Exception ex) {
            log.error("[TriajeService] Error al validar paciente con RUT {}: {}", rut, ex.getMessage());
            throw new RuntimeException("Error al validar paciente con RUT " + rut + 
                    ". Asegúrese de que ms-pacientes esté disponible.");
        }
    }

    /**
     * Valida que el personal de salud con el ID especificado exista en ms-personal.
     * Lanza RuntimeException si el personal no existe o está inactivo.
     */
    private void validarPersonalExiste(Long personalId) {
        try {
            log.debug("[TriajeService] Validando existencia de personal con ID: {}", personalId);
            PersonalSaludDTO personal = personalClient.obtenerPersonalPorId(personalId);
            if (personal == null || !personal.getActivo()) {
                log.warn("[TriajeService] Personal ID {} no encontrado o inactivo", personalId);
                throw new RuntimeException("Personal de salud con ID " + personalId + " no encontrado o inactivo");
            }
            log.info("[TriajeService] Personal ID {} validado: {} ({})", 
                    personalId, personal.getNombreCompleto(), personal.getRol());
        } catch (RuntimeException ex) {
            throw ex;
        } catch (Exception ex) {
            log.error("[TriajeService] Error al validar personal con ID {}: {}", personalId, ex.getMessage());
            throw new RuntimeException("Error al validar personal con ID " + personalId + 
                    ". Asegúrese de que ms-personal esté disponible.");
        }
    }

    @Override
    public List<Triaje> obtenerTodos() {
        return repository.findAll();
    }

    @Override
    public List<Triaje> obtenerPorRut(String rutPaciente) {
        List<Triaje> triajes = repository.findByRutPacienteOrderByFechaEvaluacionDesc(rutPaciente);
        if (triajes.isEmpty()) {
            throw new RuntimeException("No se encontraron registros de triaje para el RUT: " + rutPaciente);
        }
        return triajes;
    }

    @Override
    public List<Triaje> obtenerPorNivelUrgencia(String nivelUrgencia) {
        return repository.findByNivelUrgencia(nivelUrgencia);
    }

    @Override
    public Triaje obtenerPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evaluación de triaje con ID " + id + " no encontrada."));
    }

    /**
     * Calcula automáticamente la puntuación de triaje (0-15) basado en signos vitales.
     * 
     * Criterios:
     * - Temperatura: Anormal (< 36°C o > 38.5°C) = +2 puntos
     * - Frecuencia cardíaca: Anormal (< 60 o > 100 lpm) = +2 puntos
     * - Presión arterial: Anormal (sistólica > 140 o < 90) = +2 puntos
     * - Saturación de oxígeno: Baja (< 95%) = +4 puntos
     * - Síntomas críticos (disnea, dolor torácico, etc.) = +5 puntos
     * 
     * @param triaje El triaje a evaluar
     * @return Puntuación total (0-15)
     */
    @Override
    public Integer calcularPuntuacionTriaje(Triaje triaje) {
        Integer puntuacion = 0;
        
        // Evaluación de temperatura (rango normal: 36.5-37.5°C)
        if (triaje.getTemperatura() < 36.0 || triaje.getTemperatura() > 38.5) {
            puntuacion += 2;
        }
        
        // Evaluación de frecuencia cardíaca (rango normal: 60-100 lpm)
        if (triaje.getFrecuenciaCardiaca() < 60 || triaje.getFrecuenciaCardiaca() > 100) {
            puntuacion += 2;
        }
        
        // Evaluación de presión arterial (rango normal: 90-139 sistólica)
        if (triaje.getPresionArterial() != null) {
            try {
                String[] valores = triaje.getPresionArterial().split("/");
                if (valores.length >= 1) {
                    Integer sistolica = Integer.parseInt(valores[0].trim());
                    if (sistolica < 90 || sistolica > 140) {
                        puntuacion += 2;
                    }
                }
            } catch (Exception e) {
                // Si no se puede parsear, sumar puntos como precaución
                puntuacion += 1;
            }
        }
        
        // Evaluación de saturación de oxígeno (rango normal: >= 95%)
        if (triaje.getSaturacionOxigeno() < 95) {
            puntuacion += 4;
        }
        
        // Evaluación de síntomas críticos
        String sintomas = triaje.getSintomas().toLowerCase();
        if (sintomas.contains("disnea") || sintomas.contains("dolor torácico") || 
            sintomas.contains("pérdida de conciencia") || sintomas.contains("sangrado") ||
            sintomas.contains("convulsiones")) {
            puntuacion += 5;
        }

        //acá se podría añadir un arreglo que contenga palabras clave de síntomas críticos y hacer un loop para sumar puntos por cada coincidencia, pero por ahora lo dejo así para no complicar el código
        
        // Limitar puntuación máxima a 15
        return Math.min(puntuacion, 15);
    }

    /**
     * Determina el nivel de urgencia (AZUL, VERDE, AMARILLO, ROJO) basado en la puntuación.
     * 
     * - AZUL (0-2): No urgente - Espera normal
     * - VERDE (3-6): Poco urgente - Espera estándar
     * - AMARILLO (7-11): Urgente - Atención prioritaria
     * - ROJO (12-15): Muy urgente - Atención inmediata
     * 
     * @param puntuacion La puntuación del triaje (0-15)
     * @return El nivel de urgencia
     */
    @Override
    public String determinarNivelUrgencia(Integer puntuacion) {
        if (puntuacion <= 2) {
            return "AZUL";
        } else if (puntuacion <= 6) {
            return "VERDE";
        } else if (puntuacion <= 11) {
            return "AMARILLO";
        } else {
            return "ROJO";
        }
    }
}