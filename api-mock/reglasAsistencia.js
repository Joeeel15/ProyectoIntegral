// Ventana de confirmación en hora peruana (UTC-05:00).
// La autoridad para aprobar o cerrar una cita sigue siendo el backend.
const VENTANA_ASISTENCIA_MS = 24 * 60 * 60 * 1000;

function instanteFinCita(cita) {
  if (!cita || !/^\d{4}-\d{2}-\d{2}$/.test(cita.fecha) ||
      !/^([01]\d|2[0-3]):[0-5]\d$/.test(cita.horaFin)) return NaN;
  return Date.parse(`${cita.fecha}T${cita.horaFin}:00-05:00`);
}

function puedeCerrarAsistencia(cita, ahora = Date.now()) {
  const fin = instanteFinCita(cita);
  return cita?.estado === 'aprobada' && Number.isFinite(fin) &&
    ahora >= fin && ahora < fin + VENTANA_ASISTENCIA_MS;
}

function debeMarcarNoAsistio(cita, ahora = Date.now()) {
  const fin = instanteFinCita(cita);
  return cita?.estado === 'aprobada' && Number.isFinite(fin) &&
    ahora >= fin + VENTANA_ASISTENCIA_MS;
}

module.exports = { instanteFinCita, puedeCerrarAsistencia, debeMarcarNoAsistio };
