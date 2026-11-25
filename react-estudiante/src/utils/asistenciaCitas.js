// La cita usa la zona horaria peruana: UTC-05:00.
const VENTANA_MS = 24 * 60 * 60 * 1000;

export function finCitaMs(cita) {
  if (!cita || !/^\d{4}-\d{2}-\d{2}$/.test(cita.fecha) ||
      !/^([01]\d|2[0-3]):[0-5]\d$/.test(cita.horaFin)) return NaN;
  return Date.parse(`${cita.fecha}T${cita.horaFin}:00-05:00`);
}

export function puedeMarcarAtendida(cita, ahora = Date.now()) {
  const fin = finCitaMs(cita);
  return cita?.estado === 'aprobada' && Number.isFinite(fin) &&
    ahora >= fin && ahora < fin + VENTANA_MS;
}
