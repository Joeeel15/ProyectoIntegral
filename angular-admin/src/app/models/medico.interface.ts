export type EstadoMedico = 'activo' | 'inactivo';

export interface HorarioAtencion {
  horaInicio: string; // HH:mm
  horaFin: string; // HH:mm
}

export interface Medico {
  id: string; // Ejemplo: MED-001
  nombre: string;
  especialidad: string;
  consultorio: string;
  sede: string;
  diasDisponibles: string[]; // Ejemplo: ['lunes', 'miercoles']
  horarioAtencion: HorarioAtencion;
  estado: EstadoMedico;
}
