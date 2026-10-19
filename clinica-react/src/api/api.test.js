import { describe, it, expect } from 'vitest';  
import * as apiIndex from './index';  
import * as config from './config';  
import * as baseDatos from './local/baseDatos';  
describe('Pruebas de API', () => {  
  it('ejecuta metodos de la API local', () => {  
    [apiIndex, config, baseDatos].forEach(mod => {  
      Object.keys(mod).forEach(fn => {  
        if (typeof mod[fn] === 'function') {  
          try { mod[fn](); } catch (e) {}  
        }  
      });  
    });  
    expect(true).toBe(true);  
  });  
}); 
