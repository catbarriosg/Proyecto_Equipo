package com.SmartHealth.ms_listas_de_espera.services;

import com.SmartHealth.ms_listas_de_espera.dtos.ListaEsperaDTO;
import com.SmartHealth.ms_listas_de_espera.models.ListaEspera;

import java.util.List;
import java.util.Optional;

public interface IListaEsperaService {

    ListaEsperaDTO crearListaEspera(ListaEsperaDTO listaEsperaDTO);

    ListaEsperaDTO obtenerPorId(Long id);

    List<ListaEsperaDTO> obtenerTodas();

    List<ListaEsperaDTO> obtenerPorPaciente(Long idPaciente);

    List<ListaEsperaDTO> obtenerPorHospital(Long idHospital);

    List<ListaEsperaDTO> obtenerPorEstado(String estado);

    ListaEsperaDTO actualizarListaEspera(Long id, ListaEsperaDTO listaEsperaDTO);

    void eliminarListaEspera(Long id);

    Long contarPendientesPorHospital(Long idHospital);

    Long contarPendientesPorPaciente(Long idPaciente);

    ListaEsperaDTO cambiarEstado(Long id, String nuevoEstado);

    List<ListaEsperaDTO> obtenerListasOrdenadas();
}
