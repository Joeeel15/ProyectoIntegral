import { Cita } from "../../../core-js/modelos.js";

// Estados que ya no ocupan un horario del médico.
// Coincide con la regla aplicada por api-mock/server.js.
const ESTADOS_QUE_LIBERAN_HORARIO = new Set(["rechazada", "cancelada"]);

export function citaOcupaHorario(cita) {
  return !ESTADOS_QUE_LIBERAN_HORARIO.has(cita.estado);
}

// Reutiliza la clase Cita de core-js para detectar solapamientos.
// El arreglo recibido incluye las citas iniciales y las creadas en esta sesión.
export function existeCruceCita(nuevaCita, citas) {
  return citas.some(
    (cita) => citaOcupaHorario(cita) && nuevaCita.seCruzaCon(cita),
  );
}

// El estudiante puede cancelar solicitudes pendientes o citas confirmadas.
const ESTADOS_CANCELABLES = new Set(["pendiente", "aprobada", "programada"]);

export function puedeCancelarCita(cita) {
  return ESTADOS_CANCELABLES.has(cita.estado);
}

export function cancelarCitaLocal(citas, citaId, estudianteId) {
  const seleccionada = citas.find((cita) => cita.id === citaId);
  if (!seleccionada || seleccionada.estudianteId !== estudianteId ||
      !puedeCancelarCita(seleccionada)) return citas;
  return citas.map((cita) =>
    cita.id === citaId
      ? new Cita(
          cita.id,
          cita.medicoId,
          cita.estudianteId,
          cita.fecha,
          cita.horaInicio,
          cita.horaFin,
          "cancelada",
          cita.creadoEn,
        )
      : cita,
  );
}
