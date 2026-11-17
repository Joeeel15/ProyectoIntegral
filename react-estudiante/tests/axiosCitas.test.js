import test from 'node:test';
import assert from 'node:assert/strict';
import { Cita } from '../../core-js/modelos.js';
import { crearServicioCitas } from '../src/services/servicioCitas.js';
import { instalarInterceptorErrores, traducirErrorAxios } from '../src/services/erroresAxios.js';

const citaJSON = {
  id: 'CIT-1000', medicoId: 'MED-001', estudianteId: 'USR-002',
  fecha: '2026-11-20', horaInicio: '09:00', horaFin: '09:30',
  estado: 'pendiente', creadoEn: '2026-11-17T15:00:00.000Z',
};

test('Axios: crear envía POST /citas en estado pendiente', async () => {
  const cliente = {
    async post(ruta, cuerpo) {
      assert.equal(ruta, '/citas');
      assert.match(cuerpo.id, /^CIT-\d{4,}$/);
      assert.equal(cuerpo.estudianteId, 'USR-002');
      assert.equal(cuerpo.estado, 'pendiente');
      assert.equal(cuerpo.medicoId, 'MED-001');
      assert.equal(cuerpo.horaInicio, '09:00');
      assert.ok(Number.isFinite(Date.parse(cuerpo.creadoEn)));
      return { data: { ...cuerpo } };
    },
  };
  const resultado = await crearServicioCitas(cliente).crear(citaJSON, 'USR-002');
  assert.ok(resultado instanceof Cita);
  assert.equal(resultado.estudianteId, 'USR-002');
  assert.equal(resultado.estado, 'pendiente');
});

test('Axios: cancelar envía PATCH y conserva la cita como instancia', async () => {
  const cliente = {
    async patch(ruta, cuerpo) {
      assert.equal(ruta, '/citas/CIT-1000');
      assert.deepEqual(cuerpo, { estado: 'cancelada' });
      return { data: { ...citaJSON, estado: 'cancelada' } };
    },
  };
  const resultado = await crearServicioCitas(cliente).cancelar('CIT-1000');
  assert.ok(resultado instanceof Cita);
  assert.equal(resultado.id, 'CIT-1000');
  assert.equal(resultado.estudianteId, 'USR-002');
  assert.equal(resultado.estado, 'cancelada');
  assert.equal(typeof resultado.seCruzaCon, 'function');
});

test('Axios: listar consulta las citas del estudiante y convierte JSON a Cita', async () => {
  const cliente = {
    async get(ruta, config) {
      assert.equal(ruta, '/citas');
      assert.deepEqual(config.params, { estudianteId: 'USR-002' });
      return { data: [citaJSON] };
    },
  };
  const datos = await crearServicioCitas(cliente).listar('USR-002');
  assert.equal(datos.length, 1);
  assert.ok(datos[0] instanceof Cita);
  assert.equal(datos[0].id, 'CIT-1000');
});

test('Axios: sin sesión no permite crear una cita', async () => {
  await assert.rejects(
    () => crearServicioCitas({}).crear(citaJSON, ''), /iniciar sesión/,
  );
});

test('Axios: interceptor traduce error 409 con mensaje del backend', async () => {
  const traducido = traducirErrorAxios({
    response: { status: 409, data: { error: 'El médico ya tiene una cita en ese horario.' } },
  });
  assert.equal(traducido.status, 409);
  assert.match(traducido.message, /ya tiene una cita/);
});

test('Axios: interceptor muestra mensaje distinto ante HTTP 404', async () => {
  const traducido = traducirErrorAxios({ response: { status: 404, data: {} } });
  assert.equal(traducido.status, 404);
  assert.match(traducido.message, /404/);
});

test('Axios: caída de la API produce mensaje de conexión', () => {
  const traducido = traducirErrorAxios({ code: 'ERR_NETWORK' });
  assert.match(traducido.message, /No se pudo conectar/);
});

test('Axios: la instancia instala un interceptor de respuestas', async () => {
  let exito, fallo;
  const cliente = {
    interceptors: { response: { use(ok, error) { exito = ok; fallo = error; } } },
  };
  instalarInterceptorErrores(cliente);
  const respuesta = { data: { ok: true } };
  assert.equal(exito(respuesta), respuesta);
  await assert.rejects(
    () => fallo({ response: { status: 400, data: { error: 'Fecha inválida' } } }),
    /Fecha inválida/,
  );
});
