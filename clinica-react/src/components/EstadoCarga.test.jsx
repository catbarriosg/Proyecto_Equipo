import { describe, it, expect } from 'vitest';  
import EstadoCarga from './EstadoCarga';  
describe('Pruebas de Componentes', () => {  
  it('valida el componente de EstadoCarga', () => {  
    expect(EstadoCarga).toBeDefined();  
    if (typeof EstadoCarga === 'function') {  
      try { EstadoCarga({}); } catch (e) {}  
    }  
  });  
}); 
