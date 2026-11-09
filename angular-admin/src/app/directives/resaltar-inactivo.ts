import { Directive, Input } from '@angular/core';
import { EstadoMedico } from '../models/medico.interface';

/** Resalta visualmente la fila de un médico dado de baja. */
@Directive({
  selector: '[appResaltarInactivo]',
  standalone: true,
  host: {
    '[class.table-secondary]': 'estado === "inactivo"',
    '[attr.title]': 'estado === "inactivo" ? "Médico inactivo" : null'
  }
})
export class ResaltarInactivo {
  @Input('appResaltarInactivo') estado: EstadoMedico = 'activo';
}
