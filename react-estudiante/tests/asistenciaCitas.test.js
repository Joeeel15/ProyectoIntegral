import test from 'node:test';
import assert from 'node:assert/strict';
import { Cita } from '../../core-js/modelos.js';
import { puedeMarcarAtendida, finCitaMs } from '../src/utils/asistenciaCitas.js';
import { crearServicioCitas } from '../src/services/servicioCitas.js';

const cita = new Cita('CIT-9000', 'MED-001', 'USR-002', '2026-12-01', '10:00', '10:30', 'aprobada');
const fin = Date.parse('2026-12-01T10:30:00-05:00');
const dia = 86400000;

test('React: reconoce el fin de la cita en horario de Perú', () => {
  assert.equal(finCitaMs(cita), fin);
});
test('React: botón solo disponible en las 24 horas siguientes a la cita aprobada', () => {
  assert.equal(puedeMarcarAtendida(cita, fin - 1), false);
  assert.equal(puedeMarcarAtendida(cita, fin), true);
  assert.equal(puedeMarcarAtendida(cita, fin + dia - 1), true);
  assert.equal(puedeMarcarAtendida(cita, fin + dia), false);
  for (const estado of ['pendiente', 'rechazada', 'cancelada', 'atendida', 'no_asistio']) {
    const conOtroEstado = new Cita('CIT-9000', 'MED-001', 'USR-002', '2026-12-01', '10:00', '10:30', estado);
    assert.equal(puedeMarcarAtendida(conOtroEstado, fin + 1000), false);
  }
});
test('Axios: confirmar asistencia envía PATCH y conserva la instancia Cita', async () => {
  const cliente = {
    async patch(ruta, datos) {
      assert.equal(ruta, '/citas/CIT-9000');
      assert.deepEqual(datos, { estado: 'atendida' });
      return { data: { id:'CIT-9000', medicoId:'MED-001', estudianteId:'USR-002',
        fecha:'2026-12-01', horaInicio:'10:00', horaFin:'10:30',
        estado:'atendida', creadoEn:'2026-11-20T12:00:00Z' } };
    },
  };
  const resultado = await crearServicioCitas(cliente).marcarAtendida('CIT-9000');
  assert.ok(resultado instanceof Cita);
  assert.equal(resultado.estado, 'atendida');
  assert.equal(resultado.estudianteId, 'USR-002');
});
