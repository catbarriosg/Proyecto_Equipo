import { describe, it, expect } from 'vitest';
import { SesionContext } from './SesionContext';

describe('Pruebas de SesionContext', () => {
  it('debe cargar el contexto de sesión correctamente', () => {
    expect(SesionContext).toBeDefined();
  });
});