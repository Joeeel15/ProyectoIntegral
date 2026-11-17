// Avance 3: Fetch + async/await para consultas de lectura.
// Vite permite sobrescribir la URL mediante VITE_API_URL (opcional).
export const API_URL = (import.meta.env?.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');

async function consultarAPI(ruta, { signal } = {}) {
  let respuesta;
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, { signal });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error('No se pudo conectar con la API de MediTurno (puerto 3000).');
  }

  // fetch no lanza excepciones para 404/500: se comprueba response.ok.
  if (!respuesta.ok) {
    if (respuesta.status === 404) {
      throw new Error('No se encontró el recurso solicitado (HTTP 404).');
    }
    throw new Error(`No se pudo completar la consulta (HTTP ${respuesta.status}).`);
  }

  return respuesta.json();
}

export function obtenerMedicos({ signal } = {}) {
  return consultarAPI('/medicos', { signal });
}

export function obtenerMedico(id, { signal } = {}) {
  return consultarAPI(`/medicos/${encodeURIComponent(id)}`, { signal });
}

// json-server filtra por el correo del registro. Normalizar el código U/A
// permite que el estudiante lo escriba en minúsculas aunque esté en mayúsculas en db.json.
export function buscarUsuariosPorCorreo(correo, { signal } = {}) {
  const normalizado = correo.trim().toLowerCase()
    .replace(/^[au]\d{8}/, (codigo) => codigo.toUpperCase());
  const parametros = new URLSearchParams({ correo: normalizado });
  return consultarAPI(`/usuarios?${parametros}`, { signal });
}
