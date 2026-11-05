import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CampusHubService } from '../../../services/campushub.service';
import { Reserva } from '../../../models/reserva.interface';
import { EstadoReservaPipe } from '../../../pipes/estado-reserva-pipe';

@Component({
  selector: 'app-lista-reservas',
  standalone: true,
  imports: [RouterLink, EstadoReservaPipe],
  templateUrl: './lista-reservas.html',
  styleUrl: './lista-reservas.css'
})
export class ListaReservas implements OnInit {

  private servicio = inject(CampusHubService);
  private cdr = inject(ChangeDetectorRef);

  reservas: Reserva[] = [];
  reservasFiltradas: Reserva[] = [];

  cargando = false;
  mensajeError = '';
  estadoSeleccionado = 'todos';

  ngOnInit(): void {
    this.cargarReservas();
  }

  cargarReservas(): void {
    this.cargando = true;
    this.mensajeError = '';

    this.servicio.obtenerReservas().subscribe({
      next: (datos) => {
        this.reservas = datos;
        this.filtrarReservas();
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar reservas:', error);
        this.mensajeError = 'No se pudieron cargar las reservas. Verifica que la API esté funcionando.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  filtrarReservas(): void {
    if (this.estadoSeleccionado === 'todos') {
      this.reservasFiltradas = [...this.reservas];
    } else {
      this.reservasFiltradas = this.reservas.filter(
        reserva => reserva.estado === this.estadoSeleccionado
      );
    }
  }

  cambiarEstado(event: Event): void {
    const elemento = event.target as HTMLSelectElement;
    this.estadoSeleccionado = elemento.value;
    this.filtrarReservas();
  }

  eliminarReserva(id: number): void {
    const confirmar = confirm('¿Estás seguro de que deseas eliminar esta reserva?');

    if (!confirmar) return;

    this.servicio.eliminarReserva(id).subscribe({
      next: () => {
        alert('Reserva eliminada correctamente.');
        this.cargarReservas();
      },
      error: (error) => {
        console.error('Error al eliminar reserva:', error);
        alert('No se pudo eliminar la reserva.');
      }
    });
  }
}
