import { EstadoCitaPipe } from './estado-cita-pipe';

describe('EstadoCitaPipe', () => {
  const pipe = new EstadoCitaPipe();

  it('muestra los nombres de los estados del nuevo flujo', () => {
    expect(pipe.transform('pendiente')).toBe('Pendiente de aprobación');
    expect(pipe.transform('aprobada')).toBe('Aprobada');
    expect(pipe.transform('rechazada')).toBe('Rechazada');
  });

  it('conserva la lectura de los estados antiguos', () => {
    expect(pipe.transform('programada')).toBe('Programada (anterior)');
    expect(pipe.transform('no_asistio')).toBe('No asistió');
  });
});
