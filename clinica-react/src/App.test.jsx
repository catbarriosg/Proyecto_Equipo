import { describe, it, expect } from 'vitest';  
import * as apiConfig from './api/config';  
import * as rutUtils from './utils/rut';  
describe('Pruebas integradas de la aplicacion', () => {  
  it('debe importar utilidades y configuraciones', () => {  
    expect(apiConfig).toBeDefined();  
    expect(rutUtils).toBeDefined();  
  });  
}); 
