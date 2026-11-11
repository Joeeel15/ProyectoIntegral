import db from './db.json';
import { existeCruceCita as comprobarCruce } from '../utils/reglasCitas.js';

import {
  Usuario,
  Medico,
  Cita
} from '../../../core-js/modelos.js';

// ==========================================
// USUARIOS
// ==========================================

export const usuarios = db.usuarios.map(
  (usuario) => new Usuario(usuario)
);

// ==========================================
// MEDICOS
// ==========================================

export const medicos = db.medicos.map(
  (medico) =>
    new Medico(
      medico.id,
      medico.nombre,
      medico.especialidad,
      medico.consultorio,
      medico.sede,
      medico.diasDisponibles,
      medico.horarioAtencion,
      medico.estado
    )
);

// ==========================================
// CITAS
// ==========================================

export const citasIniciales = db.citas.map(
  (cita) =>
    new Cita(
      cita.id,
      cita.medicoId,
      cita.estudianteId,
      cita.fecha,
      cita.horaInicio,
      cita.horaFin,
      cita.estado,
      cita.creadoEn
    )
);

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================

export const obtenerMedicoPorId = (id) =>
  medicos.find((medico) => medico.id === id);

export const obtenerUsuarioPorId = (id) =>
  usuarios.find((usuario) => usuario.id === id);

export const obtenerCitasDeEstudiante = (estudianteId) =>
  citasIniciales.filter(
    (cita) => cita.estudianteId === estudianteId
  );

// Se conserva esta función auxiliar para la copia local de datos;
// opcionalmente acepta las citas actualizadas del estado de React.
export const existeCruceCita = (nuevaCita, citas = citasIniciales) =>
  comprobarCruce(nuevaCita, citas);

export { Cita };