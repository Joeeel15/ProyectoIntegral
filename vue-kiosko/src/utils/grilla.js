// Reutilizamos la clase Cita del Avance 1: su método seCruzaCon
// comprueba el solapamiento entre las citas y las celdas de la grilla.
import { Cita } from '../../../core-js/modelos.js';

export const MINUTOS_CELDA = 30;
export const INICIO_GRILLA = '07:00';
export const FIN_GRILLA = '22:00';

const DIAS = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
const ESTADOS_OCUPADOS = new Set(['aprobada', 'atendida', 'no_asistio']);
const ESTADOS_QUE_BLOQUEAN = new Set([...ESTADOS_OCUPADOS, 'pendiente']);

export function aMinutos(hora) {
  const [h, m] = String(hora).split(':').map(Number);
  return h * 60 + m;
}

export function aHora(minutos) {
  return `${String(Math.floor(minutos / 60)).padStart(2, '0')}:${String(minutos % 60).padStart(2, '0')}`;
}

export function generarHoras(inicio = INICIO_GRILLA, fin = FIN_GRILLA, paso = MINUTOS_CELDA) {
  if (!Number.isInteger(paso) || paso <= 0) throw new Error('El intervalo debe ser positivo.');
  const desde = aMinutos(inicio);
  const hasta = aMinutos(fin);
  if (!Number.isFinite(desde) || !Number.isFinite(hasta) || hasta <= desde) {
    throw new Error('El rango de horas no es válido.');
  }
  const celdas = [];
  for (let minuto = desde; minuto < hasta; minuto += paso) {
    celdas.push({ inicio: aHora(minuto), fin: aHora(Math.min(minuto + paso, hasta)) });
  }
  return celdas;
}

export function diaDeSemana(fecha) {
  // Fijamos UTC al mediodía para evitar cambios de día según huso horario.
  const d = new Date(`${fecha}T12:00:00Z`);
  return Number.isNaN(d.getTime()) ? null : DIAS[d.getUTCDay()];
}

function citaComoClase(cita) {
  return new Cita(
    cita.id,
    cita.medicoId,
    cita.estudianteId,
    cita.fecha,
    cita.horaInicio,
    cita.horaFin,
    cita.estado,
    cita.creadoEn,
  );
}

export function crearCelda(medico, citas, fecha, intervalo) {
  const dia = diaDeSemana(fecha);
  const horario = medico.horarioAtencion ?? {};
  const atiendeEseDia = medico.diasDisponibles?.includes(dia) ?? false;
  const atiendeEnEsteHorario = Boolean(
    horario.horaInicio && horario.horaFin &&
    aMinutos(intervalo.inicio) >= aMinutos(horario.horaInicio) &&
    aMinutos(intervalo.fin) <= aMinutos(horario.horaFin),
  );
  const disponible = medico.estado === 'activo' && atiendeEseDia && atiendeEnEsteHorario;
  const turno = new Cita('CELDA', medico.id, null, fecha, intervalo.inicio, intervalo.fin);
  const citasCoincidentes = citas.filter((cita) =>
    cita.medicoId === medico.id && cita.fecha === fecha &&
    ESTADOS_QUE_BLOQUEAN.has(cita.estado) && turno.seCruzaCon(citaComoClase(cita)),
  );

  // Una cita confirmada tiene prioridad visual sobre una pendiente.
  let estado = 'libre';
  if (citasCoincidentes.some((cita) => ESTADOS_OCUPADOS.has(cita.estado))) {
    estado = 'ocupada';
  } else if (citasCoincidentes.some((cita) => cita.estado === 'pendiente')) {
    estado = 'pendiente';
  } else if (!disponible) {
    estado = 'no_disponible';
  }

  return {
    ...intervalo,
    estado,
    citas: citasCoincidentes,
    medicoId: medico.id,
    fecha,
  };
}

export function construirGrilla({ medicos = [], citas = [], fecha, paso = MINUTOS_CELDA }) {
  const horas = generarHoras(INICIO_GRILLA, FIN_GRILLA, paso);
  const filas = medicos.map((medico) => ({
    medico,
    celdas: horas.map((intervalo) => crearCelda(medico, citas, fecha, intervalo)),
  }));
  return { horas, filas };
}
