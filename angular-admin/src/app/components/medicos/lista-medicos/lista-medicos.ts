import { NgClass } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ResaltarInactivo } from '../../../directives/resaltar-inactivo';
import { Medico } from '../../../models/medico.interface';
import { MediTurnoService } from '../../../services/mediturno.service';

@Component({
  selector: 'app-lista-medicos',
  standalone: true,
  imports: [FormsModule, RouterLink, NgClass, ResaltarInactivo],
  templateUrl: './lista-medicos.html',
})
export class ListaMedicos implements OnInit {
  private readonly servicio = inject(MediTurnoService);
  private readonly cdr = inject(ChangeDetectorRef);

  medicos: Medico[] = [];
  busqueda = '';
  sedeSeleccionada = '';
  cargando = false;
  eliminandoId: string | null = null;
  mensajeError = '';
  mensajeExito = '';

  get medicosFiltrados(): Medico[] {
    const texto = this.busqueda.toLocaleLowerCase().trim();
    return this.medicos.filter(
      (m) =>
        (!this.sedeSeleccionada || m.sede === this.sedeSeleccionada) &&
        (!texto || `${m.nombre} ${m.especialidad}`.toLocaleLowerCase().includes(texto)),
    );
  }

  ngOnInit(): void {
    this.cargarMedicos();
  }

  cargarMedicos(): void {
    this.cargando = true;
    this.mensajeError = '';
    this.servicio.obtenerMedicos().subscribe({
      next: (datos) => {
        this.medicos = datos;
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.mensajeError = 'No fue posible cargar el catálogo. Comprueba que la API esté activa.';
        this.cargando = false;
        this.cdr.markForCheck();
      },
    });
  }

  eliminarMedico(medico: Medico): void {
    if (
      this.eliminandoId ||
      !confirm(`¿Eliminar a ${medico.nombre} (${medico.id})? Esta acción no se puede deshacer.`)
    ) {
      return;
    }

    this.eliminandoId = medico.id;
    this.mensajeError = '';
    this.mensajeExito = '';

    this.servicio.eliminarMedico(medico.id).subscribe({
      next: () => {
        // La tabla se actualiza sin recargar la página.
        this.medicos = this.medicos.filter((m) => m.id !== medico.id);
        this.mensajeExito = `${medico.nombre} fue eliminado correctamente.`;
        this.eliminandoId = null;
        this.cdr.markForCheck();
      },
      error: (error: HttpErrorResponse) => {
        this.mensajeError = error.error?.error ?? 'No se pudo eliminar el médico.';
        this.eliminandoId = null;
        this.cdr.markForCheck();
      },
    });
  }
}
