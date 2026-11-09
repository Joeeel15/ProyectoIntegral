import { HttpErrorResponse } from '@angular/common/http';
import { NgClass } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { forkJoin } from 'rxjs';

import { Cita, EstadoCita } from '../../../models/cita.interface';
import { Medico } from '../../../models/medico.interface';
import { Usuario } from '../../../models/usuario.interface';
import { EstadoCitaPipe } from '../../../pipes/estado-cita-pipe';
import { MediTurnoService } from '../../../services/mediturno.service';

@Component({
  selector: 'app-lista-citas',
  standalone: true,
  imports: [NgClass, EstadoCitaPipe],
  templateUrl: './lista-citas.html',
})
export class ListaCitas implements OnInit {
  private readonly servicio = inject(MediTurnoService);
  private readonly cdr = inject(ChangeDetectorRef);

  citas: Cita[] = [];
  cargando = false;
  actualizandoId: string | null = null;
  mensajeError = '';
  mensajeExito = '';
  estadoSeleccionado = 'todos';
  nombresMedicos = new Map<string, string>();
  nombresUsuarios = new Map<string, string>();

  get citasFiltradas(): Cita[] {
    return this.estadoSeleccionado === 'todos'
      ? this.citas
      : this.citas.filter((cita) => cita.estado === this.estadoSeleccionado);
  }

  get pendientes(): number {
    return this.citas.filter((cita) => cita.estado === 'pendiente').length;
  }

  get aprobadas(): number {
    return this.citas.filter((cita) => cita.estado === 'aprobada').length;
  }

  get rechazadas(): number {
    return this.citas.filter((cita) => cita.estado === 'rechazada').length;
  }

  ngOnInit(): void {
    this.cargarCitas();
  }

  cargarCitas(): void {
    if (this.actualizandoId) return;
    this.cargando = true;
    this.mensajeError = '';
    this.mensajeExito = '';

    forkJoin({
      citas: this.servicio.obtenerCitas(),
      medicos: this.servicio.obtenerMedicos(),
      usuarios: this.servicio.obtenerUsuarios(),
    }).subscribe({
      next: ({
        citas,
        medicos,
        usuarios,
      }: {
        citas: Cita[];
        medicos: Medico[];
        usuarios: Usuario[];
      }) => {
        this.citas = [...citas].sort((a, b) =>
          `${b.fecha}T${b.horaInicio}`.localeCompare(`${a.fecha}T${a.horaInicio}`),
        );
        this.nombresMedicos = new Map(medicos.map((m) => [m.id, m.nombre]));
        this.nombresUsuarios = new Map(usuarios.map((u) => [u.id, u.nombre]));
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.mensajeError = 'No fue posible cargar las citas. Comprueba que la API esté activa.';
        this.cargando = false;
        this.cdr.markForCheck();
      },
    });
  }

  cambiarEstado(event: Event): void {
    this.estadoSeleccionado = (event.target as HTMLSelectElement).value;
  }

  aprobar(cita: Cita): void {
    if (cita.estado !== 'pendiente' || this.actualizandoId) return;
    this.guardarEstado(cita, 'aprobada');
  }

  rechazar(cita: Cita): void {
    if (cita.estado !== 'pendiente' || this.actualizandoId) return;
    if (!confirm(`¿Rechazar la solicitud ${cita.id}? Se liberará el horario del médico.`)) return;
    this.guardarEstado(cita, 'rechazada');
  }

  private guardarEstado(cita: Cita, estado: 'aprobada' | 'rechazada'): void {
    this.actualizandoId = cita.id;
    this.mensajeError = '';
    this.mensajeExito = '';

    const peticion =
      estado === 'aprobada'
        ? this.servicio.aprobarCita(cita.id)
        : this.servicio.rechazarCita(cita.id);

    peticion.subscribe({
      next: (actualizada) => {
        // Actualización en memoria, sin necesidad de recargar toda la página.
        this.citas = this.citas.map((c) => (c.id === cita.id ? actualizada : c));
        this.mensajeExito = `La cita ${cita.id} fue ${estado === 'aprobada' ? 'aprobada' : 'rechazada'} correctamente.`;
        this.actualizandoId = null;
        this.cdr.markForCheck();
      },
      error: (error: HttpErrorResponse) => {
        this.mensajeError =
          typeof error.error?.error === 'string'
            ? error.error.error
            : `No se pudo ${estado === 'aprobada' ? 'aprobar' : 'rechazar'} la cita. Intenta actualizar la lista.`;
        this.actualizandoId = null;
        this.cdr.markForCheck();
      },
    });
  }

  claseEstado(estado: EstadoCita): string {
    switch (estado) {
      case 'pendiente':
        return 'text-bg-warning';
      case 'aprobada':
      case 'programada':
        return 'text-bg-primary';
      case 'atendida':
        return 'text-bg-success';
      case 'rechazada':
      case 'cancelada':
        return 'text-bg-danger';
      default:
        return 'text-bg-secondary';
    }
  }
}
