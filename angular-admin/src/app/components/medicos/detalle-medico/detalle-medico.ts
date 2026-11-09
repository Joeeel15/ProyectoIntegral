import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Medico } from '../../../models/medico.interface';
import { MediTurnoService } from '../../../services/mediturno.service';

@Component({
  selector: 'app-detalle-medico',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './detalle-medico.html'
})
export class DetalleMedico implements OnInit {
  private readonly servicio = inject(MediTurnoService);
  private readonly ruta = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);

  medico: Medico | null = null;
  cargando = true;
  mensajeError = '';

  ngOnInit(): void {
    const id = this.ruta.snapshot.paramMap.get('id');
    if (!id) {
      this.mensajeError = 'No se proporcionó un identificador de médico.';
      this.cargando = false;
      return;
    }

    this.servicio.obtenerMedico(id).subscribe({
      next: medico => {
        this.medico = medico;
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.mensajeError = 'No se encontró el médico solicitado.';
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  nombreDia(dia: string): string {
    const nombres: Record<string, string> = {
      lunes: 'Lunes', martes: 'Martes', miercoles: 'Miércoles',
      jueves: 'Jueves', viernes: 'Viernes', sabado: 'Sábado', domingo: 'Domingo'
    };
    return nombres[dia] ?? dia;
  }
}
