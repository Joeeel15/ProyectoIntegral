import db from './db.json';

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

// Comprueba si una nueva cita se cruza
// con otra cita activa del mismo médico.
export const existeCruceCita = (nuevaCita) => {
  return citasIniciales.some((citaExistente) => {
    if (citaExistente.estado === 'cancelada') {
      return false;
    }

    return nuevaCita.seCruzaCon(citaExistente);
  });
};

export { Cita };