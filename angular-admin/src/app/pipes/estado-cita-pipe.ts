import { Pipe, PipeTransform } from '@angular/core';
import { EstadoCita } from '../models/cita.interface';

/** Convierte el estado persistido en db.json en una etiqueta legible. */
@Pipe({
  name: 'estadoCita',
  standalone: true
})
export class EstadoCitaPipe implements PipeTransform {
  transform(estado: EstadoCita): string {
    const etiquetas: Record<EstadoCita, string> = {
      pendiente: 'Pendiente de aprobación',
      aprobada: 'Aprobada',
      rechazada: 'Rechazada',
      programada: 'Programada (anterior)',
      atendida: 'Atendida',
      cancelada: 'Cancelada',
      no_asistio: 'No asistió'
    };

    return etiquetas[estado] ?? 'Estado desconocido';
  }
}
