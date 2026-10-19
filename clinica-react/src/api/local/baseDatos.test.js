import { describe, it, expect } from 'vitest';  
import * as db from './baseDatos';  
describe('Pruebas de Base de Datos Local', () => {  
  it('debe ejecutar metodos de la base de datos', () => {  
    expect(db).toBeDefined();  
    if (db.obtenerMedicos) expect(Array.isArray(db.obtenerMedicos())).toBe(true);  
    if (db.obtenerEspecialidades) expect(Array.isArray(db.obtenerEspecialidades())).toBe(true);  
  });  
}); 
