// "programada" se conserva para leer las citas existentes en db.json.
// Las nuevas solicitudes usarán "pendiente" y el admin podrá aprobarlas o rechazarlas.
export type EstadoCita =
  | 'pendiente'
  | 'aprobada'
  | 'rechazada'
  | 'programada'
  | 'atendida'
  | 'cancelada'
  | 'no_asistio';

export interface Cita {
  id: string; // Ejemplo: CIT-0021
  medicoId: string;
  estudianteId: string;
  fecha: string; // AAAA-MM-DD
  horaInicio: string; // HH:mm
  horaFin: string; // HH:mm
  estado: EstadoCita;
  creadoEn: string; // Fecha y hora ISO
}

export type NuevaCita = Omit<Cita, 'estado'>;
