package com.SmartHealth.ms_triaje.services;


import com.SmartHealth.ms_triaje.models.Triaje;
import java.util.List;

public interface TriajeService {
    Triaje registrarTriaje(Triaje triaje);
    List<Triaje> obtenerTodos();
    List<Triaje> obtenerPorRut(String rutPaciente);
    List<Triaje> obtenerPorNivelUrgencia(String nivelUrgencia);
    Triaje obtenerPorId(Long id);
    
    /**
     * Calcula automáticamente la puntuación y nivel de urgencia del triaje.
     * 
     * @param triaje El triaje a evaluar
     * @return La puntuación calculada (0-15)
     */
    Integer calcularPuntuacionTriaje(Triaje triaje);
    
    /**
     * Determina el nivel de urgencia basado en la puntuación.
     * 
     * @param puntuacion La puntuación del triaje (0-15)
     * @return El nivel de urgencia (AZUL, VERDE, AMARILLO, ROJO)
     */
    String determinarNivelUrgencia(Integer puntuacion);
}