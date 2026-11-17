import { Cita } from '../../../core-js/modelos.js';

// La API responde con JSON plano. React necesita instancias auténticas de Cita
// porque las validaciones reutilizan seCruzaCon() y los getters de core-js.
export function convertirCitaAPI(registro) {
  return new Cita(
    registro.id,
    registro.medicoId,
    registro.estudianteId,
    registro.fecha,
    registro.horaInicio,
    registro.horaFin,
    registro.estado,
    registro.creadoEn,
  );
}

function nuevoCodigoCita() {
  // El middleware de api-mock exige CIT- seguido de al menos 4 dígitos.
  // Fecha actual + sufijo aleatorio evita colisiones habituales entre clientes.
  return `CIT-${Date.now()}${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
}

// Recibe un cliente compatible con Axios, para facilitar pruebas sin red.
export function crearServicioCitas(cliente) {
  return {
    async listar(estudianteId) {
      if (!estudianteId) return [];
      const respuesta = await cliente.get('/citas', {
        params: { estudianteId },
      });
      return respuesta.data.map(convertirCitaAPI);
    },

    async crear(formulario, estudianteId) {
      if (!estudianteId) throw new Error('Debes iniciar sesión para solicitar una cita.');

      const datos = {
        id: nuevoCodigoCita(),
        medicoId: formulario.medicoId,
        estudianteId,
        fecha: formulario.fecha,
        horaInicio: formulario.horaInicio,
        horaFin: formulario.horaFin,
        estado: 'pendiente',
        creadoEn: new Date().toISOString(),
      };
      const respuesta = await cliente.post('/citas', datos);
      return convertirCitaAPI(respuesta.data);
    },

    async cancelar(citaId) {
      if (!citaId) throw new Error('No se identificó la cita a cancelar.');
      // Cancelación lógica: conservar la cita en el historial de MediTurno.
      const respuesta = await cliente.patch(
        `/citas/${encodeURIComponent(citaId)}`,
        { estado: 'cancelada' },
      );
      return convertirCitaAPI(respuesta.data);
    },
  };
}
