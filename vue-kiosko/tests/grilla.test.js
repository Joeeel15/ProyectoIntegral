import test from 'node:test';
import assert from 'node:assert/strict';
import { aMinutos, aHora, generarHoras, diaDeSemana, crearCelda, construirGrilla } from '../src/utils/grilla.js';

const medico = {
  id: 'MED-001', nombre: 'Dra. Ejemplo', sede: 'Lima Centro',
  especialidad: 'Medicina General', consultorio: 'A-101',
  estado: 'activo', diasDisponibles: ['lunes', 'martes', 'miercoles'],
  horarioAtencion: { horaInicio: '08:00', horaFin: '13:00' },
};
const fecha = '2026-11-23'; // lunes
const intervalo = { inicio: '08:00', fin: '08:30' };
function cita(estado, horaInicio = '08:00', horaFin = '08:30', extras = {}) {
  return { id: 'CIT-0001', medicoId: medico.id, estudianteId: 'USR-002', fecha,
    horaInicio, horaFin, estado, creadoEn: '2026-11-20T00:00:00Z', ...extras };
}

test('convierte las horas de manera consistente', () => {
  assert.equal(aMinutos('07:30'), 450);
  assert.equal(aHora(450), '07:30');
});

test('07:00–22:00 produce 30 intervalos de 30 minutos', () => {
  const horarios = generarHoras();
  assert.equal(horarios.length, 30);
  assert.deepEqual(horarios[0], { inicio: '07:00', fin: '07:30' });
  assert.deepEqual(horarios.at(-1), { inicio: '21:30', fin: '22:00' });
});

test('el día calculado para una fecha es correcto', () => {
  assert.equal(diaDeSemana(fecha), 'lunes');
  assert.equal(diaDeSemana('2026-11-25'), 'miercoles');
});

test('una celda sin citas durante horario laboral está libre', () => {
  assert.equal(crearCelda(medico, [], fecha, intervalo).estado, 'libre');
});

test('una cita pendiente genera una celda pendiente', () => {
  const celda = crearCelda(medico, [cita('pendiente')], fecha, intervalo);
  assert.equal(celda.estado, 'pendiente');
  assert.equal(celda.citas.length, 1);
});

test('una cita aprobada o atendida bloquea el horario', () => {
  for (const estado of ['aprobada', 'atendida', 'no_asistio']) {
    assert.equal(crearCelda(medico, [cita(estado)], fecha, intervalo).estado, 'ocupada');
  }
});

test('una cita cancelada o rechazada no bloquea la celda', () => {
  for (const estado of ['cancelada', 'rechazada']) {
    assert.equal(crearCelda(medico, [cita(estado)], fecha, intervalo).estado, 'libre');
  }
});

test('detecta cruces parciales con la clase Cita del núcleo JS', () => {
  assert.equal(crearCelda(medico, [cita('aprobada', '08:15', '08:45')], fecha, intervalo).estado, 'ocupada');
});

test('horas contiguas no se solapan', () => {
  assert.equal(crearCelda(medico, [cita('pendiente', '08:30', '09:00')], fecha, intervalo).estado, 'libre');
});

test('la cita de otro médico o fecha no afecta la celda', () => {
  const otros = [cita('aprobada', '08:00', '08:30', { medicoId: 'MED-002' }),
    cita('pendiente', '08:00', '08:30', { fecha: '2026-11-24' })];
  assert.equal(crearCelda(medico, otros, fecha, intervalo).estado, 'libre');
});

test('fuera del horario de atención o del día laboral está no disponible', () => {
  assert.equal(crearCelda(medico, [], fecha, { inicio: '07:30', fin: '08:00' }).estado, 'no_disponible');
  assert.equal(crearCelda(medico, [], '2026-11-28', intervalo).estado, 'no_disponible');
});

test('un médico inactivo está no disponible sin cita', () => {
  assert.equal(crearCelda({ ...medico, estado: 'inactivo' }, [], fecha, intervalo).estado, 'no_disponible');
});

test('un médico inactivo con cita ya registrada muestra la ocupación', () => {
  assert.equal(crearCelda({ ...medico, estado: 'inactivo' }, [cita('aprobada')], fecha, intervalo).estado, 'ocupada');
});

test('prioriza ocupada sobre pendiente ante datos inconsistentes', () => {
  assert.equal(crearCelda(medico, [cita('pendiente'), cita('aprobada', '08:00', '08:30', { id: 'CIT-0002' })], fecha, intervalo).estado, 'ocupada');
});

test('grilla bidimensional conserva una fila por médico y una celda por intervalo', () => {
  const otro = { ...medico, id: 'MED-002' };
  const grilla = construirGrilla({ medicos: [medico, otro], citas: [cita('pendiente')], fecha });
  assert.equal(grilla.filas.length, 2);
  assert.equal(grilla.horas.length, 30);
  assert.equal(grilla.filas[0].celdas.length, 30);
  assert.equal(grilla.filas[1].celdas.length, 30);
  assert.equal(grilla.filas[0].celdas[2].estado, 'pendiente');
  assert.equal(grilla.filas[1].celdas[2].estado, 'libre');
});

test('paso de horario inválido se rechaza explícitamente', () => {
  assert.throws(() => generarHoras('07:00', '22:00', 0), /intervalo/);
  assert.throws(() => generarHoras('22:00', '07:00'), /rango/);
});
