import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CampusHubService } from '../../../services/campushub.service';
import { Laboratorio } from '../../../models/laboratorio.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lista-laboratorios',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './lista-laboratorios.html',
  styleUrl: './lista-laboratorios.css',
})
export class ListaLaboratorios implements OnInit {
  private campusHubService = inject(CampusHubService);
  private cdr = inject(ChangeDetectorRef);

  laboratorios: Laboratorio[] = [];

  busqueda: string = '';
  sedeSeleccionada: string = '';

  cargando: boolean = false;
  mensajeError: string = '';

  ngOnInit(): void {
    this.cargarLaboratorios();
  }

  cargarLaboratorios(): void {
    this.cargando = true;
    this.mensajeError = '';

    this.campusHubService
      .obtenerLaboratorios(this.sedeSeleccionada || undefined, this.busqueda || undefined)
      .subscribe({
        next: (datos) => {
          this.laboratorios = datos;
          this.cargando = false;

          this.cdr.markForCheck();
        },

        error: (error) => {
          console.error('Error al cargar laboratorios:', error);

          this.mensajeError =
            'No se pudieron cargar los laboratorios. Verifica que la API esté funcionando.';

          this.cargando = false;

          this.cdr.markForCheck();
        },
      });
  }

  buscar(): void {
    this.cargarLaboratorios();
  }

  cambiarSede(sede: string): void {
    this.sedeSeleccionada = sede;
    this.cargarLaboratorios();
  }

  eliminarLaboratorio(id: number): void {
    const confirmar = window.confirm('¿Estás seguro de que deseas eliminar este laboratorio?');

    if (!confirmar) {
      return;
    }

    this.campusHubService.eliminarLaboratorio(id).subscribe({
      next: () => {
        alert('Laboratorio eliminado correctamente.');
        this.cargarLaboratorios();
      },

      error: (error) => {
        console.error('Error al eliminar:', error);
        alert('No se pudo eliminar el laboratorio.');
      },
    });
  }
}
