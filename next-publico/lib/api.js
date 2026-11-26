const API_URL = process.env.API_URL || 'http://localhost:3000';

export async function obtenerMedicos() {
  try {
    const respuesta = await fetch(`${API_URL}/medicos`, {
      cache: 'no-store'
    });

    if (!respuesta.ok) {
      throw new Error('No se pudieron obtener los médicos');
    }

    return await respuesta.json();
  } catch (error) {
    console.error('Error al obtener médicos:', error);
    throw error;
  }
}

export async function obtenerMedicoPorId(id) {
  try {
    const respuesta = await fetch(
      `${API_URL}/medicos/${encodeURIComponent(id)}`,
      { cache: 'no-store' }
    );

    if (respuesta.status === 404) {
      return null;
    }

    if (!respuesta.ok) {
      throw new Error('No se pudo obtener el médico');
    }

    return await respuesta.json();
  } catch (error) {
    console.error('Error al obtener médico:', error);
    throw error;
  }
}

export async function obtenerCitas() {
  try {
    const respuesta = await fetch(`${API_URL}/citas`, {
      cache: 'no-store'
    });

    if (!respuesta.ok) {
      throw new Error('No se pudieron obtener las citas');
    }

    return await respuesta.json();
  } catch (error) {
    console.error('Error al obtener citas:', error);
    throw error;
  }
}
