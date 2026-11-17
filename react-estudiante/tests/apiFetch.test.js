import { test } from 'node:test';
import assert from 'node:assert/strict';
import { obtenerMedicos, obtenerMedico, buscarUsuariosPorCorreo } from '../src/services/apiFetch.js';

test('Fetch consulta la lista de médicos por GET', async (t) => {
  t.mock.method(globalThis, 'fetch', async (url, opciones) => {
    assert.match(url, /\/medicos$/);
    assert.ok('signal' in opciones);
    return { ok: true, json: async () => [{ id: 'MED-001' }] };
  });
  assert.deepEqual(await obtenerMedicos(), [{ id: 'MED-001' }]);
});

test('Fetch obtiene detalle usando el código del médico', async (t) => {
  t.mock.method(globalThis, 'fetch', async (url) => {
    assert.match(url, /\/medicos\/MED-001$/);
    return { ok: true, json: async () => ({ id: 'MED-001' }) };
  });
  assert.equal((await obtenerMedico('MED-001')).id, 'MED-001');
});

test('Fetch interpreta 404 mediante response.ok', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => ({ ok: false, status: 404 }));
  await assert.rejects(() => obtenerMedico('MED-999'), /404/);
});

test('Fetch traduce la caída de la API a un mensaje comprensible', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => { throw new TypeError('Failed to fetch'); });
  await assert.rejects(() => obtenerMedicos(), /No se pudo conectar/);
});

test('Login simulado consulta usuarios por correo y normaliza U mayúscula', async (t) => {
  t.mock.method(globalThis, 'fetch', async (url) => {
    assert.match(url, /\/usuarios\?correo=U20230002%40utp.edu.pe$/);
    return { ok: true, json: async () => [{ id: 'USR-002' }] };
  });
  const usuarios = await buscarUsuariosPorCorreo('u20230002@utp.edu.pe');
  assert.equal(usuarios[0].id, 'USR-002');
});
