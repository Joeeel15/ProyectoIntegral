import { apiAxios } from './apiAxios.js';
import { crearServicioCitas } from './servicioCitas.js';

// API lista para consumir desde useReservas(usuarioId), pendiente de tu compañero.
const servicio = crearServicioCitas(apiAxios);

export const listarCitas = (estudianteId) => servicio.listar(estudianteId);
export const crearCita = (formulario, estudianteId) => servicio.crear(formulario, estudianteId);
export const cancelarCita = (citaId) => servicio.cancelar(citaId);
