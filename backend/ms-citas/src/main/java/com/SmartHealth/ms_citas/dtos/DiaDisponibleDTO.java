package com.SmartHealth.ms_citas.dtos;

import java.util.List;

/** Horas libres de un médico en un día ("HH:mm"). */
public record DiaDisponibleDTO(String fecha, List<String> horas) {
}
