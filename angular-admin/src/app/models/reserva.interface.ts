export interface Reserva {
  id: number;
  codigo: string;
  usuarioId: number;
  laboratorioId: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  motivo: string;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  creadoEn: string;
}
