import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoReserva',
  standalone: true
})
export class EstadoReservaPipe implements PipeTransform {

  transform(estado: string): string {
    switch (estado) {
      case 'pendiente':
        return 'Pendiente de revisión';

      case 'aprobada':
        return 'Reserva aprobada';

      case 'rechazada':
        return 'Reserva rechazada';

      default:
        return 'Estado desconocido';
    }
  }
}
