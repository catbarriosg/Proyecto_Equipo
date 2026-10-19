package com.SmartHealth.ms_citas.services;

import com.SmartHealth.ms_citas.clients.MedicoClient;
import com.SmartHealth.ms_citas.clients.PacienteClient;
import com.SmartHealth.ms_citas.dtos.*;
import com.SmartHealth.ms_citas.exceptions.ApiException;
import com.SmartHealth.ms_citas.models.Cita;
import com.SmartHealth.ms_citas.models.EstadoCita;
import com.SmartHealth.ms_citas.repositories.CitaRepository;
import com.SmartHealth.ms_citas.seguridad.Identidad;
import feign.FeignException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CitaService {

    private static final Logger log = LoggerFactory.getLogger(CitaService.class);
    private static final Set<EstadoCita> ESTADOS_ACTIVOS = EnumSet.of(EstadoCita.SOLICITADA, EstadoCita.CONFIRMADA);
    private static final int MAXIMO_DIAS_CONSULTA = 31;

    private final CitaRepository repositorio;
    private final AgendaHorarios agenda;
    private final PacienteClient pacienteClient;
    private final MedicoClient medicoClient;

    public CitaService(CitaRepository repositorio, AgendaHorarios agenda, PacienteClient pacienteClient,
                       MedicoClient medicoClient) {
        this.repositorio = repositorio;
        this.agenda = agenda;
        this.pacienteClient = pacienteClient;
        this.medicoClient = medicoClient;
    }

    // ------------------------------------------------------------------ Consultas

    /** Cada rol ve sus citas: el paciente las suyas, el médico las de su agenda y el administrador todas. */
    public List<CitaDTO> listar(EstadoCita estado) {
        Identidad yo = Identidad.actual();
        List<Cita> citas;
        if (yo.esPaciente()) {
            citas = repositorio.findByPacienteIdOrderByFechaDescHoraDesc(exigirPacienteId(yo));
        } else if (yo.esMedico()) {
            citas = repositorio.findByMedicoIdOrderByFechaDescHoraDesc(exigirPersonalId(yo));
        } else {
            citas = repositorio.findAllByOrderByFechaDescHoraDesc();
        }
        return citas.stream()
                .filter(cita -> estado == null || cita.getEstado() == estado)
                .map(cita -> aDTO(cita, yo))
                .toList();
    }

    public CitaDTO obtener(Long id) {
        Identidad yo = Identidad.actual();
        return aDTO(buscarConAcceso(id, yo), yo);
    }

    public CitaDTO obtenerPorCodigo(String codigo) {
        Identidad yo = Identidad.actual();
        Cita cita = repositorio.findByCodigoIgnoreCase(codigo.trim())
                .filter(encontrada -> tieneAcceso(encontrada, yo))
                .orElseThrow(() -> ApiException.noEncontrado(
                        "No encontramos una reserva con ese código. Revisa Mis horas médicas."));
        return aDTO(cita, yo);
    }

    /** Días y horas libres de un médico. Con excluirCitaId se ignora la cita que se está reprogramando. */
    public List<DiaDisponibleDTO> disponibilidad(Long medicoId, LocalDate desde, LocalDate hasta, Long excluirCitaId) {
        obtenerMedico(medicoId);
        LocalDate inicio = desde == null || desde.isBefore(agenda.hoy()) ? agenda.hoy() : desde;
        LocalDate fin = hasta == null ? inicio.plusDays(6) : hasta;
        if (fin.isAfter(agenda.ultimoDiaReservable())) fin = agenda.ultimoDiaReservable();
        if (fin.isBefore(inicio)) return List.of();
        if (fin.isAfter(inicio.plusDays(MAXIMO_DIAS_CONSULTA))) {
            throw ApiException.solicitudInvalida("Consulta como máximo " + MAXIMO_DIAS_CONSULTA + " días a la vez.");
        }

        Map<LocalDate, Set<LocalTime>> ocupadas = repositorio
                .findByMedicoIdAndFechaBetweenAndEstadoIn(medicoId, inicio, fin, ESTADOS_ACTIVOS).stream()
                .filter(cita -> !cita.getId().equals(excluirCitaId))
                .collect(Collectors.groupingBy(Cita::getFecha,
                        Collectors.mapping(Cita::getHora, Collectors.toSet())));

        List<DiaDisponibleDTO> dias = new ArrayList<>();
        for (LocalDate dia = inicio; !dia.isAfter(fin); dia = dia.plusDays(1)) {
            Set<LocalTime> tomadas = ocupadas.getOrDefault(dia, Set.of());
            List<String> libres = agenda.horariosDelDia(dia).stream()
                    .filter(hora -> !tomadas.contains(hora))
                    .map(hora -> hora.toString().substring(0, 5))
                    .toList();
            dias.add(new DiaDisponibleDTO(dia.toString(), libres));
        }
        return dias;
    }

    // ------------------------------------------------------------------ Operaciones

    @Transactional
    public CitaDTO crear(CrearCitaRequest datos) {
        Identidad yo = Identidad.actual();
        MedicoDTO medico = obtenerMedico(datos.getMedicoId());
        if (yo.esMedico() && !medico.getId().equals(yo.personalId())) {
            throw ApiException.prohibido("Solo puedes agendar horas en tu propia agenda.");
        }
        PacienteDTO paciente = resolverPaciente(yo, datos.getRutPaciente());
        LocalDate fecha = leerFecha(datos.getFecha());
        LocalTime hora = leerHora(datos.getHora());
        validarHorarioLibre(medico.getId(), paciente.getId(), fecha, hora, null);

        Cita cita = new Cita();
        cita.setPacienteId(paciente.getId());
        cita.setPacienteNombre(paciente.getNombreCompleto());
        cita.setPacienteRut(paciente.getRut());
        cita.setPacienteCorreo(paciente.getCorreo());
        cita.setMedicoId(medico.getId());
        cita.setMedicoNombre(medico.getNombre());
        cita.setEspecialidad(medico.getEspecialidad());
        cita.setSucursalId(medico.getSucursalId());
        cita.setFecha(fecha);
        cita.setHora(hora);
        cita.setEstado(EstadoCita.CONFIRMADA);
        cita.setMotivo(datos.getMotivo() == null || datos.getMotivo().isBlank() ? null : datos.getMotivo().trim());
        cita.setCreadoPorUsuarioId(yo.usuarioId());
        cita.setRolCreador(yo.rol());
        cita.actualizarFranja();

        Cita guardada = guardarReservandoHorario(cita);
        guardada.setCodigo(String.format("AM-%06d", guardada.getId()));
        guardada = repositorio.save(guardada);
        log.info("[CitaService] Cita {} creada para paciente {} con médico {} el {} {}",
                guardada.getCodigo(), paciente.getId(), medico.getId(), fecha, hora);
        return aDTO(guardada, yo);
    }

    @Transactional
    public CitaDTO reprogramar(Long id, ReprogramarCitaRequest datos) {
        Identidad yo = Identidad.actual();
        Cita cita = buscarConAcceso(id, yo);
        exigirGestionable(cita, yo, "modificar");

        LocalDate fecha = leerFecha(datos.getFecha());
        LocalTime hora = leerHora(datos.getHora());
        if (fecha.equals(cita.getFecha()) && hora.equals(cita.getHora())) {
            throw ApiException.solicitudInvalida("Elegiste la misma fecha y hora de tu reserva actual.");
        }
        validarHorarioLibre(cita.getMedicoId(), cita.getPacienteId(), fecha, hora, cita.getId());

        cita.setFecha(fecha);
        cita.setHora(hora);
        cita.actualizarFranja();
        Cita guardada = guardarReservandoHorario(cita);
        log.info("[CitaService] Cita {} reprogramada para el {} {}", cita.getCodigo(), fecha, hora);
        return aDTO(guardada, yo);
    }

    @Transactional
    public CitaDTO cancelar(Long id) {
        Identidad yo = Identidad.actual();
        Cita cita = buscarConAcceso(id, yo);
        exigirGestionable(cita, yo, "cancelar");
        cita.setEstado(EstadoCita.CANCELADA);
        cita.actualizarFranja();
        log.info("[CitaService] Cita {} cancelada por {}", cita.getCodigo(), yo.rol());
        return aDTO(repositorio.save(cita), yo);
    }

    /** Confirmar, marcar como atendida o cancelar desde la agenda del médico o la administración. */
    @Transactional
    public CitaDTO cambiarEstado(Long id, EstadoCita nuevoEstado) {
        Identidad yo = Identidad.actual();
        if (yo.esPaciente()) {
            throw ApiException.prohibido("Los pacientes solo pueden modificar o cancelar sus horas.");
        }
        Cita cita = buscarConAcceso(id, yo);
        if (!cita.getEstado().estaActiva()) {
            throw ApiException.solicitudInvalida("La cita ya está " + cita.getEstado().name().toLowerCase()
                    + " y no se puede cambiar.");
        }
        cita.setEstado(nuevoEstado);
        cita.actualizarFranja();
        return aDTO(guardarReservandoHorario(cita), yo);
    }

    // ------------------------------------------------------------------ Reglas

    private void validarHorarioLibre(Long medicoId, Long pacienteId, LocalDate fecha, LocalTime hora, Long citaActual) {
        if (!agenda.esReservable(fecha, hora)) {
            throw ApiException.solicitudInvalida("El horario elegido no está dentro de la atención de la clínica "
                    + "o ya pasó. Elige otro en el calendario.");
        }
        boolean ocupado = repositorio
                .findByMedicoIdAndFechaBetweenAndEstadoIn(medicoId, fecha, fecha, ESTADOS_ACTIVOS).stream()
                .anyMatch(otra -> otra.getHora().equals(hora) && !otra.getId().equals(citaActual));
        if (ocupado) {
            throw ApiException.conflicto("Ese horario ya fue reservado. Elige otro horario disponible.");
        }
        boolean pacienteOcupado = repositorio.existsByPacienteIdAndFechaAndHoraAndEstadoInAndIdNot(
                pacienteId, fecha, hora, ESTADOS_ACTIVOS, citaActual == null ? -1L : citaActual);
        if (pacienteOcupado) {
            throw ApiException.conflicto("El paciente ya tiene otra hora agendada en ese mismo horario.");
        }
    }

    private void exigirGestionable(Cita cita, Identidad yo, String accion) {
        if (!cita.getEstado().estaActiva()) {
            throw ApiException.solicitudInvalida("Esta reserva está " + cita.getEstado().name().toLowerCase()
                    + " y no se puede " + accion + ".");
        }
        if (yo.esPaciente() && !agenda.faltanMasDe24Horas(cita.getFecha(), cita.getHora())) {
            throw ApiException.solicitudInvalida("Las horas se pueden " + accion + " con al menos "
                    + AgendaHorarios.HORAS_MINIMAS_PARA_GESTIONAR + " horas de anticipación. "
                    + "Comunícate con la clínica.");
        }
    }

    /** La restricción única de "franja" detecta reservas simultáneas del mismo horario. */
    private Cita guardarReservandoHorario(Cita cita) {
        try {
            return repositorio.saveAndFlush(cita);
        } catch (DataIntegrityViolationException e) {
            throw ApiException.conflicto("Ese horario acaba de ser reservado. Elige otro horario disponible.");
        }
    }

    private boolean tieneAcceso(Cita cita, Identidad yo) {
        if (yo.esInterna() || yo.esAdministrador()) return true;
        if (yo.esPaciente()) return cita.getPacienteId().equals(yo.pacienteId());
        if (yo.esMedico()) return cita.getMedicoId().equals(yo.personalId());
        return false;
    }

    private Cita buscarConAcceso(Long id, Identidad yo) {
        return repositorio.findById(id)
                .filter(cita -> tieneAcceso(cita, yo))
                .orElseThrow(() -> ApiException.noEncontrado("No encontramos la reserva solicitada."));
    }

    private boolean esGestionable(Cita cita, Identidad yo) {
        if (!cita.getEstado().estaActiva()) return false;
        return yo.esPaciente()
                ? agenda.faltanMasDe24Horas(cita.getFecha(), cita.getHora())
                : agenda.esFutura(cita.getFecha(), cita.getHora());
    }

    private CitaDTO aDTO(Cita cita, Identidad yo) {
        return CitaDTO.desde(cita, esGestionable(cita, yo));
    }

    // ------------------------------------------------------------------ Otros servicios

    private MedicoDTO obtenerMedico(Long medicoId) {
        try {
            MedicoDTO medico = medicoClient.obtenerPorId(medicoId);
            if (medico == null || Boolean.FALSE.equals(medico.getActivo())) {
                throw ApiException.noEncontrado("El médico seleccionado no está disponible.");
            }
            return medico;
        } catch (FeignException.NotFound e) {
            throw ApiException.noEncontrado("El médico seleccionado no existe o no está disponible.");
        }
    }

    private PacienteDTO resolverPaciente(Identidad yo, String rutPaciente) {
        PacienteDTO paciente;
        try {
            if (yo.esPaciente()) {
                paciente = pacienteClient.obtenerPorId(exigirPacienteId(yo));
            } else {
                if (rutPaciente == null || rutPaciente.isBlank()) {
                    throw ApiException.solicitudInvalida("Ingresa el RUT del paciente.");
                }
                paciente = pacienteClient.obtenerPorRut(rutPaciente.trim().toUpperCase());
            }
        } catch (FeignException.NotFound e) {
            throw ApiException.noEncontrado("No encontramos un paciente con ese RUT. "
                    + "El paciente debe registrarse o ser ingresado por la administración.");
        }
        if (paciente == null || Boolean.FALSE.equals(paciente.getActivo())) {
            throw ApiException.solicitudInvalida("La ficha del paciente está inactiva. Comunícate con la clínica.");
        }
        return paciente;
    }

    private static Long exigirPacienteId(Identidad yo) {
        if (yo.pacienteId() == null) {
            throw ApiException.prohibido("Tu cuenta no está asociada a una ficha de paciente.");
        }
        return yo.pacienteId();
    }

    private static Long exigirPersonalId(Identidad yo) {
        if (yo.personalId() == null) {
            throw ApiException.prohibido("Tu cuenta no está asociada a un profesional.");
        }
        return yo.personalId();
    }

    private static LocalDate leerFecha(String valor) {
        try {
            return LocalDate.parse(valor);
        } catch (DateTimeParseException e) {
            throw ApiException.solicitudInvalida("La fecha " + valor + " no es válida.");
        }
    }

    private static LocalTime leerHora(String valor) {
        try {
            return LocalTime.parse(valor);
        } catch (DateTimeParseException e) {
            throw ApiException.solicitudInvalida("La hora " + valor + " no es válida.");
        }
    }
}
