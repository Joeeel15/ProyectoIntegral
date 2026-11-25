const test = require('node:test');
const assert = require('node:assert/strict');
const {
  instanteFinCita,
  puedeCerrarAsistencia,
  debeMarcarNoAsistio,
} = require('./reglasAsistencia');

const cita = { id: 'CIT-9000', estado: 'aprobada', fecha: '2026-12-01', horaFin: '10:30' };
const fin = Date.parse('2026-12-01T10:30:00-05:00');
const dia = 24 * 60 * 60 * 1000;

test('la hora de fin se interpreta en horario de Perú', () => {
  assert.equal(instanteFinCita(cita), fin);
});
test('el estudiante no puede confirmar antes de finalizar la cita', () => {
  assert.equal(puedeCerrarAsistencia(cita, fin - 1), false);
});
test('la confirmación está habilitada exactamente al terminar la cita', () => {
  assert.equal(puedeCerrarAsistencia(cita, fin), true);
});
test('se puede confirmar un instante antes de cumplirse 24 horas', () => {
  assert.equal(puedeCerrarAsistencia(cita, fin + dia - 1), true);
});
test('al cumplirse 24 horas, vence la confirmación y se marca no asistió', () => {
  assert.equal(puedeCerrarAsistencia(cita, fin + dia), false);
  assert.equal(debeMarcarNoAsistio(cita, fin + dia), true);
});
test('una cita atendida jamás se transforma automáticamente en no asistió', () => {
  assert.equal(debeMarcarNoAsistio({ ...cita, estado: 'atendida' }, fin + dia + 1), false);
});
test('canceladas, rechazadas y pendientes tampoco expiran como no asistió', () => {
  for (const estado of ['cancelada', 'rechazada', 'pendiente', 'no_asistio']) {
    assert.equal(debeMarcarNoAsistio({ ...cita, estado }, fin + dia + 1), false);
  }
});
