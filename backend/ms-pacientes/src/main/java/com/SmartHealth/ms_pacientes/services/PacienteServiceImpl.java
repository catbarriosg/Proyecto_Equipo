package com.SmartHealth.ms_pacientes.services;

import com.SmartHealth.ms_pacientes.clients.HistorialClient;
import com.SmartHealth.ms_pacientes.dtos.PacienteDTO;
import com.SmartHealth.ms_pacientes.exceptions.ApiException;
import com.SmartHealth.ms_pacientes.models.Paciente;
import com.SmartHealth.ms_pacientes.models.dtos.HistorialDTO;
import com.SmartHealth.ms_pacientes.repositories.PacienteRepository;
import com.SmartHealth.ms_pacientes.seguridad.Identidad;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PacienteServiceImpl implements PacienteService {

    private static final Logger logger = LoggerFactory.getLogger(PacienteServiceImpl.class);

    @Autowired
    private PacienteRepository repository;

    @Autowired
    private HistorialClient historialClient;

    private void cargarHistorialClinico(Paciente paciente) {
        try {
            List<HistorialDTO> historiales = historialClient.obtenerPorIdPaciente(paciente.getId());
            if (!historiales.isEmpty()) {
                paciente.setIdHistorialClinico(historiales.get(0).getId());
            }
        } catch (Exception e) {
            // El historial es información complementaria: si ms-historial no responde, se informa el paciente igual
            logger.warn("No se pudo cargar el historial del paciente ID {}: {}", paciente.getId(), e.getMessage());
        }
    }

    @Override
    public List<PacienteDTO> obtenerTodos(boolean incluirInactivos) {
        List<Paciente> pacientes = incluirInactivos ? repository.findAll() : repository.findByActivoTrue();
        return pacientes.stream().map(PacienteDTO::desde).toList();
    }

    @Override
    public PacienteDTO crear(PacienteDTO datos) {
        String rut = normalizarRut(datos.getRut());
        validarRut(rut);
        if (repository.findByRut(rut).isPresent()) {
            throw ApiException.conflicto("Ya existe un paciente registrado con el RUT " + rut + ".");
        }
        Paciente paciente = new Paciente();
        paciente.setRut(rut);
        copiarDatosEditables(datos, paciente);
        paciente.setActivo(datos.getActivo() == null || datos.getActivo());
        Paciente guardado = repository.save(paciente);
        logger.info("Paciente creado con ID {} y RUT {}", guardado.getId(), rut);
        return PacienteDTO.desde(guardado);
    }

    @Override
    public PacienteDTO obtenerPorRut(String rut) {
        Paciente paciente = repository.findByRut(normalizarRut(rut))
                .orElseThrow(() -> ApiException.noEncontrado("No encontramos un paciente con el RUT " + rut + "."));
        verificarAcceso(paciente.getId());
        cargarHistorialClinico(paciente);
        return PacienteDTO.desde(paciente);
    }

    @Override
    public PacienteDTO obtenerPorId(Long id) {
        verificarAcceso(id);
        Paciente paciente = buscar(id);
        cargarHistorialClinico(paciente);
        return PacienteDTO.desde(paciente);
    }

    /** El RUT no se modifica: identifica al paciente en todos los servicios. */
    @Override
    public PacienteDTO actualizar(Long id, PacienteDTO datos) {
        verificarAcceso(id);
        Paciente paciente = buscar(id);
        copiarDatosEditables(datos, paciente);
        return PacienteDTO.desde(repository.save(paciente));
    }

    @Override
    public PacienteDTO cambiarEstado(Long id, boolean activo) {
        Paciente paciente = buscar(id);
        paciente.setActivo(activo);
        return PacienteDTO.desde(repository.save(paciente));
    }

    private Paciente buscar(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> ApiException.noEncontrado("No encontramos al paciente con ID " + id + "."));
    }

    private static void copiarDatosEditables(PacienteDTO datos, Paciente paciente) {
        paciente.setNombreCompleto(datos.getNombreCompleto().trim());
        paciente.setCorreo(datos.getCorreo().trim().toLowerCase());
        paciente.setFechaNacimiento(datos.getFechaNacimiento());
        paciente.setPrevision(vacioANulo(datos.getPrevision()));
        paciente.setTelefono(vacioANulo(datos.getTelefono()));
    }

    /** Un paciente solo puede consultar o editar su propia ficha; el personal y otros servicios no tienen esa restricción. */
    private static void verificarAcceso(Long pacienteId) {
        Identidad yo = Identidad.actual();
        if (yo.esPaciente() && !pacienteId.equals(yo.pacienteId())) {
            throw ApiException.prohibido("Solo puedes acceder a tu propia ficha de paciente.");
        }
    }

    private static String normalizarRut(String rut) {
        return rut == null ? null : rut.replace(".", "").replace(" ", "").trim().toUpperCase();
    }

    /** Valida el dígito verificador con el algoritmo módulo 11. */
    static void validarRut(String rut) {
        if (rut == null || !rut.matches("^[0-9]{7,8}-[0-9K]$")) {
            throw ApiException.solicitudInvalida("El RUT debe tener el formato 12345678-9.");
        }
        String cuerpo = rut.substring(0, rut.indexOf('-'));
        char verificador = rut.charAt(rut.length() - 1);
        int suma = 0;
        int factor = 2;
        for (int i = cuerpo.length() - 1; i >= 0; i--) {
            suma += Character.getNumericValue(cuerpo.charAt(i)) * factor;
            factor = factor == 7 ? 2 : factor + 1;
        }
        int resto = 11 - (suma % 11);
        char esperado = resto == 11 ? '0' : resto == 10 ? 'K' : Character.forDigit(resto, 10);
        if (esperado != verificador) {
            throw ApiException.solicitudInvalida("El RUT " + rut + " no es válido: revisa el dígito verificador.");
        }
    }

    private static String vacioANulo(String valor) {
        return valor == null || valor.isBlank() ? null : valor.trim();
    }
}
