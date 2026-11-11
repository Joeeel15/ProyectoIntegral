import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Cita, Medico } from '../../core-js/modelos.js';
import { validarFormularioCita } from '../src/utils/validarFormularioCita.js';

const medico = new Medico(
  'MED-001', 'Dra. Test', 'Medicina general', 'C-01', 'Lima',
  ['lunes'], { horaInicio: '08:00', horaFin: '13:00' }, 'activo',
);
const formulario = {
  medicoId: medico.id, fecha: '2099-01-05', // lunes
  horaInicio: '09:00', horaFin: '10:00',
};
const hacerCita = (estado = 'pendiente') => new Cita(
  'CIT-1234', medico.id, 'USR-002', formulario.fecha,
  formulario.horaInicio, formulario.horaFin, estado,
);
const validar = (cambios = {}, citas = [], medicos = [medico]) =>
  validarFormularioCita({ ...formulario, ...cambios }, medicos, citas);

test('permite una solicitud futura, en un día y horario válidos', () => {
  assert.deepEqual(validar(), {});
});

test('exige seleccionar un médico', () => {
  assert.match(validar({ medicoId: '' }).medicoId, /seleccionar/);
});

test('rechaza médicos inactivos o inexistentes', () => {
  assert.match(validar({ medicoId: 'MED-999' }).medicoId, /no está disponible/);
  const inactivo = new Medico('MED-002', 'Dr. Prueba', 'General', 'C-02', 'Lima', ['lunes'],
    { horaInicio: '08:00', horaFin: '13:00' }, 'inactivo');
  assert.match(validar({ medicoId: 'MED-002' }, [], [inactivo]).medicoId, /no está disponible/);
});

test('no acepta días en los que el médico no atiende', () => {
  assert.match(validar({ fecha: '2099-01-06' }).fecha, /no atiende/);
});

test('rechaza horas anteriores al inicio de atención', () => {
  assert.match(validar({ horaInicio: '07:00' }).horaInicio, /08:00/);
});

test('rechaza horas posteriores al cierre de atención', () => {
  assert.match(validar({ horaFin: '14:00' }).horaFin, /13:00/);
});

test('requiere hora final mayor a la inicial', () => {
  assert.match(validar({ horaInicio: '11:00', horaFin: '10:00' }).horaFin, /posterior/);
});

test('muestra el cruce de citas pendientes debajo de las horas', () => {
  assert.match(validar({}, [hacerCita()]).horaInicio, /ya tiene una cita/);
});

test('rechazadas y canceladas no bloquean el formulario', () => {
  assert.deepEqual(validar({}, [hacerCita('rechazada')]), {});
  assert.deepEqual(validar({}, [hacerCita('cancelada')]), {});
});

test('citas aprobadas y antiguas programadas bloquean el formulario', () => {
  assert.match(validar({}, [hacerCita('aprobada')]).horaInicio, /ya tiene una cita/);
  assert.match(validar({}, [hacerCita('programada')]).horaInicio, /ya tiene una cita/);
});

test('horarios contiguos se permiten', () => {
  const citaAnterior = new Cita('CIT-0123', medico.id, 'USR-002', formulario.fecha,
    '08:00', '09:00', 'aprobada');
  assert.deepEqual(validar({}, [citaAnterior]), {});
});
