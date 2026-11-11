import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Cita } from '../../core-js/modelos.js';
import { cancelarCitaLocal, citaOcupaHorario, existeCruceCita, puedeCancelarCita } from '../src/utils/reglasCitas.js';

// Se usan instancias auténticas de core-js, como en el formulario React.
const cita = ({
  id = 'CIT-9999', medicoId = 'MED-001', fecha = '2026-12-01',
  horaInicio = '09:00', horaFin = '10:00', estado = 'pendiente',
} = {}) => new Cita(id, medicoId, 'USR-002', fecha, horaInicio, horaFin, estado);

test('una cita pendiente ocupa el horario', () => {
  assert.equal(citaOcupaHorario(cita()), true);
  assert.equal(existeCruceCita(cita({ id: 'CIT-1000' }), [cita()]), true);
});

test('una cita aprobada bloquea otra cita del mismo médico', () => {
  assert.equal(existeCruceCita(cita({ horaInicio: '09:30', horaFin: '10:30' }), [
    cita({ id: 'CIT-1001', estado: 'aprobada' }),
  ]), true);
});

test('las citas programadas anteriores siguen bloqueando el horario', () => {
  assert.equal(existeCruceCita(cita(), [cita({ estado: 'programada' })]), true);
});

test('una cita rechazada libera el horario', () => {
  assert.equal(citaOcupaHorario(cita({ estado: 'rechazada' })), false);
  assert.equal(existeCruceCita(cita(), [cita({ estado: 'rechazada' })]), false);
});

test('una cita cancelada libera el horario', () => {
  assert.equal(existeCruceCita(cita(), [cita({ estado: 'cancelada' })]), false);
});

test('no hay cruce con médicos distintos', () => {
  assert.equal(existeCruceCita(cita(), [cita({ medicoId: 'MED-002' })]), false);
});

test('no hay cruce en fechas distintas', () => {
  assert.equal(existeCruceCita(cita(), [cita({ fecha: '2026-12-02' })]), false);
});

test('los horarios consecutivos no se cruzan', () => {
  assert.equal(existeCruceCita(cita(), [cita({ horaInicio: '10:00', horaFin: '11:00' })]), false);
});

test('se comprueban también las citas añadidas durante la sesión', () => {
  const citas = [cita({ estado: 'rechazada' }), cita({ id: 'CIT-1002' })];
  assert.equal(existeCruceCita(cita({ id: 'CIT-1003' }), citas), true);
});

test('se pueden cancelar solicitudes pendientes y citas aprobadas o programadas', () => {
  for (const estado of ['pendiente', 'aprobada', 'programada']) {
    assert.equal(puedeCancelarCita(cita({ estado })), true);
  }
});

test('no se pueden cancelar citas finalizadas', () => {
  for (const estado of ['cancelada', 'rechazada', 'atendida', 'no_asistio']) {
    assert.equal(puedeCancelarCita(cita({ estado })), false);
  }
});

test('cancelar la cita cambia el estado y libera su horario', () => {
  const actual = cita({ estado: 'pendiente' });
  const resultado = cancelarCitaLocal([actual], actual.id, 'USR-002');
  assert.equal(resultado[0].estado, 'cancelada');
  assert.equal(existeCruceCita(cita({ id: 'CIT-1005' }), resultado), false);
  assert.equal(actual.estado, 'pendiente');
});

test('una cita de otro estudiante no puede cancelarse', () => {
  const originales = [cita()];
  assert.equal(cancelarCitaLocal(originales, 'CIT-9999', 'USR-003'), originales);
});

test('una cita cancelada no puede cancelarse de nuevo', () => {
  const originales = [cita({ estado: 'cancelada' })];
  assert.equal(cancelarCitaLocal(originales, 'CIT-9999', 'USR-002'), originales);
});

// Regresión: al cancelar, debe conservar los getters de la clase Cita.
test('una cita cancelada permanece en el listado del estudiante', () => {
  const original = cita({ id: 'CIT-1050', estado: 'aprobada' });
  const resultado = cancelarCitaLocal([original], 'CIT-1050', 'USR-002');
  const cancelada = resultado[0];

  assert.equal(resultado.length, 1);
  assert.ok(cancelada instanceof Cita);
  assert.equal(cancelada.id, 'CIT-1050');
  assert.equal(cancelada.estudianteId, 'USR-002');
  assert.equal(cancelada.medicoId, original.medicoId);
  assert.equal(cancelada.estado, 'cancelada');
  assert.equal(cancelada.creadoEn, original.creadoEn);
  assert.equal(resultado.filter((c) => c.estudianteId === 'USR-002').length, 1);
  assert.equal(original.estado, 'aprobada');
});

test('una cita cancelada conserva los métodos de Cita', () => {
  const original = cita({ id: 'CIT-1051' });
  const [cancelada] = cancelarCitaLocal([original], original.id, 'USR-002');
  assert.equal(typeof cancelada.seCruzaCon, 'function');
  assert.equal(cancelada.seCruzaCon(cita({ id: 'CIT-1052' })), true);
});
