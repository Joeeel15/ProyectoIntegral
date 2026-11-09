import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { forkJoin } from 'rxjs';
import { NgClass } from '@angular/common';

import { Cita, EstadoCita } from '../../../models/cita.interface';
import { Medico } from '../../../models/medico.interface';
import { Usuario } from '../../../models/usuario.interface';
import { MediTurnoService } from '../../../services/mediturno.service';

@Component({
  selector: 'app-lista-citas',
  standalone: true,
  imports: [NgClass],
  templateUrl: './lista-citas.html'
})
export class ListaCitas implements OnInit {
  private readonly servicio = inject(MediTurnoService);
  private readonly cdr = inject(ChangeDetectorRef);

  citas: Cita[] = [];
  cargando = false;
  mensajeError = '';
  estadoSeleccionado = 'todos';
  nombresMedicos = new Map<string, string>();
  nombresUsuarios = new Map<string, string>();

  get citasFiltradas(): Cita[] {
    return this.estadoSeleccionado === 'todos' ? this.citas :
      this.citas.filter(c => c.estado === this.estadoSeleccionado);
  }

  ngOnInit(): void {
    this.cargarCitas();
  }

  cargarCitas(): void {
    this.cargando = true;
    this.mensajeError = '';
    forkJoin({
      citas: this.servicio.obtenerCitas(),
      medicos: this.servicio.obtenerMedicos(),
      usuarios: this.servicio.obtenerUsuarios()
    }).subscribe({
      next: ({ citas, medicos, usuarios }: { citas: Cita[], medicos: Medico[], usuarios: Usuario[] }) => {
        this.citas = [...citas].sort((a, b) =>
          `${b.fecha}T${b.horaInicio}`.localeCompare(`${a.fecha}T${a.horaInicio}`));
        this.nombresMedicos = new Map(medicos.map(m => [m.id, m.nombre]));
        this.nombresUsuarios = new Map(usuarios.map(u => [u.id, u.nombre]));
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.mensajeError = 'No fue posible cargar las citas. Revisa la API.';
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  cambiarEstado(event: Event): void {
    this.estadoSeleccionado = (event.target as HTMLSelectElement).value;
  }

  textoEstado(estado: EstadoCita): string {
    return estado.replaceAll('_', ' ');
  }

  claseEstado(estado: EstadoCita): string {
    switch (estado) {
      case 'pendiente': return 'text-bg-warning';
      case 'aprobada': case 'programada': return 'text-bg-primary';
      case 'atendida': return 'text-bg-success';
      case 'rechazada': case 'cancelada': return 'text-bg-danger';
      default: return 'text-bg-secondary';
    }
  }
}
