package com.SmartHealth.ms_citas.services;

import org.springframework.stereotype.Component;

import java.time.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Reglas del horario de atención de la clínica:
 * lunes a viernes de 08:00 a 19:30, sábado de 09:00 a 13:30, domingo cerrado, bloques de 30 minutos
 * y reservas hasta 90 días hacia adelante.
 */
@Component
public class AgendaHorarios {

    public static final int DIAS_ANTICIPACION = 90;
    public static final int HORAS_MINIMAS_PARA_GESTIONAR = 24;
    private static final int MINUTOS_POR_BLOQUE = 30;

    private final Clock reloj;

    /** Recibe el reloj de la clínica definido en CitasConfig. */
    public AgendaHorarios(Clock reloj) {
        this.reloj = reloj;
    }

    /** Fecha actual en la zona horaria de la clínica. */
    public LocalDate hoy() {
        return LocalDate.now(reloj);
    }

    /** Fecha y hora actual en la zona horaria de la clínica. */
    public LocalDateTime ahora() {
        return LocalDateTime.now(reloj);
    }

    /** Último día que se puede reservar (hoy + 90 días). */
    public LocalDate ultimoDiaReservable() {
        return hoy().plusDays(DIAS_ANTICIPACION);
    }

    /** Bloques de atención de un día. Si el día es hoy, solo se devuelven los que aún no pasan. */
    public List<LocalTime> horariosDelDia(LocalDate fecha) {
        List<LocalTime> horarios = new ArrayList<>();
        if (fecha.getDayOfWeek() == DayOfWeek.SUNDAY) {
            return horarios;
        }
        boolean esSabado = fecha.getDayOfWeek() == DayOfWeek.SATURDAY;
        LocalTime inicio = esSabado ? LocalTime.of(9, 0) : LocalTime.of(8, 0);
        LocalTime fin = esSabado ? LocalTime.of(13, 30) : LocalTime.of(19, 30);
        LocalDateTime ahora = ahora();

        for (LocalTime hora = inicio; !hora.isAfter(fin); hora = hora.plusMinutes(MINUTOS_POR_BLOQUE)) {
            if (LocalDateTime.of(fecha, hora).isAfter(ahora)) {
                horarios.add(hora);
            }
        }
        return horarios;
    }

    /** Un horario es reservable si está dentro del rango permitido y corresponde a un bloque de atención futuro. */
    public boolean esReservable(LocalDate fecha, LocalTime hora) {
        return !fecha.isBefore(hoy())
                && !fecha.isAfter(ultimoDiaReservable())
                && horariosDelDia(fecha).contains(hora);
    }

    /** El paciente puede modificar o cancelar solo si faltan más de 24 horas para la atención. */
    public boolean faltanMasDe24Horas(LocalDate fecha, LocalTime hora) {
        return LocalDateTime.of(fecha, hora).isAfter(ahora().plusHours(HORAS_MINIMAS_PARA_GESTIONAR));
    }

    /** true si la fecha y hora todavía no llegan (regla que se aplica a médicos y administradores). */
    public boolean esFutura(LocalDate fecha, LocalTime hora) {
        return LocalDateTime.of(fecha, hora).isAfter(ahora());
    }
}
