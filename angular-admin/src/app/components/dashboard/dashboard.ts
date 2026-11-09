import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { MediTurnoService } from '../../services/mediturno.service';
import { Medico } from '../../models/medico.interface';
import { Cita } from '../../models/cita.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  private readonly servicio = inject(MediTurnoService);
  private readonly cdr = inject(ChangeDetectorRef);

  medicos: Medico[] = [];
  citas: Cita[] = [];
  cargando = false;
  mensajeError = '';

  get activos(): number {
    return this.medicos.filter(m => m.estado === 'activo').length;
  }

  get pendientes(): number {
    return this.citas.filter(c => c.estado === 'pendiente').length;
  }

  get aprobadas(): number {
    // Las citas "programada" son registros anteriores al flujo de aprobación.
    return this.citas.filter(c => ['aprobada', 'programada'].includes(c.estado)).length;
  }

  get atendidas(): number {
    return this.citas.filter(c => c.estado === 'atendida').length;
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando = true;
    this.mensajeError = '';

    forkJoin({
      medicos: this.servicio.obtenerMedicos(),
      citas: this.servicio.obtenerCitas()
    }).subscribe({
      next: ({ medicos, citas }) => {
        this.medicos = medicos;
        this.citas = citas;
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.mensajeError = 'No se pudo conectar con MediTurno. Verifica que el API esté activo en el puerto 3000.';
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }
}
