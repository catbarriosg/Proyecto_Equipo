package com.SmartHealth.ms_insumos.repositories;

import com.SmartHealth.ms_insumos.models.Insumo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InsumoRepository extends JpaRepository<Insumo, Long> {

    // Método personalizado para buscar un insumo específico por su código
    Optional<Insumo> findByCodigo(String codigo);

    // Método para traer solo los insumos que no han sido eliminados (soft delete)
    List<Insumo> findByActivoTrue();
}
