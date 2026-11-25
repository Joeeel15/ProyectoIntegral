const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');

async function leerLista(ruta, signal) {
  let respuesta;
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, { signal, cache: 'no-store' });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error('No se pudo conectar con la API de MediTurno en el puerto 3000.');
  }
  if (!respuesta.ok) throw new Error(`Error HTTP ${respuesta.status} al consultar ${ruta}.`);
  const datos = await respuesta.json();
  if (!Array.isArray(datos)) throw new Error(`La respuesta de ${ruta} no es una lista.`);
  return datos;
}

export async function consultarDisponibilidad(signal) {
  const [medicos, citas] = await Promise.all([
    leerLista('/medicos', signal),
    leerLista('/citas', signal),
  ]);
  return { medicos, citas };
}
