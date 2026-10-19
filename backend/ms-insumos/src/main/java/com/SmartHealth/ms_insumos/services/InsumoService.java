package com.SmartHealth.ms_insumos.services;

import com.SmartHealth.ms_insumos.models.Insumo;
import java.util.List;

public interface InsumoService {
    List<Insumo> listarTodosActivos();
    Insumo buscarPorCodigo(String codigo);
    Insumo guardarInsumo(Insumo insumo);
    void eliminarInsumo(String codigo); // Soft delete
}