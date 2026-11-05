import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CampusHubService } from '../../services/campushub.service';
import { Laboratorio } from '../../models/laboratorio.interface';
import { Reserva } from '../../models/reserva.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  private servicio = inject(CampusHubService);
  private cdr = inject(ChangeDetectorRef);

  laboratorios: Laboratorio[] = [];
  reservas: Reserva[] = [];

  cargando = true;
  mensajeError = '';

  totalLaboratorios = 0;
  laboratoriosDisponibles = 0;
  laboratoriosMantenimiento = 0;

  totalReservas = 0;
  reservasPendientes = 0;
  reservasAprobadas = 0;
  reservasRechazadas = 0;

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando = true;
    this.mensajeError = '';

    let respuestasRecibidas = 0;
    let huboError = false;

    const verificarCarga = (): void => {
      respuestasRecibidas++;

      if (respuestasRecibidas === 2) {
        this.cargando = false;

        if (huboError) {
          this.mensajeError = 'No se pudieron cargar todos los indicadores. Verifica que la API esté funcionando.';
        }

        this.cdr.detectChanges();
      }
    };

    this.servicio.obtenerLaboratorios().subscribe({
      next: (datos) => {
        this.laboratorios = datos;
        this.calcularLaboratorios();
        verificarCarga();
      },
      error: (error) => {
        console.error('Error al cargar laboratorios:', error);
        huboError = true;
        verificarCarga();
      }
    });

    this.servicio.obtenerReservas().subscribe({
      next: (datos) => {
        this.reservas = datos;
        this.calcularReservas();
        verificarCarga();
      },
      error: (error) => {
        console.error('Error al cargar reservas:', error);
        huboError = true;
        verificarCarga();
      }
    });
  }

  private calcularLaboratorios(): void {
    this.totalLaboratorios = this.laboratorios.length;

    this.laboratoriosDisponibles = this.laboratorios.filter(
      laboratorio => laboratorio.estado === 'disponible'
    ).length;

    this.laboratoriosMantenimiento = this.laboratorios.filter(
      laboratorio => laboratorio.estado === 'mantenimiento'
    ).length;
  }

  private calcularReservas(): void {
    this.totalReservas = this.reservas.length;

    this.reservasPendientes = this.reservas.filter(
      reserva => reserva.estado === 'pendiente'
    ).length;

    this.reservasAprobadas = this.reservas.filter(
      reserva => reserva.estado === 'aprobada'
    ).length;

    this.reservasRechazadas = this.reservas.filter(
      reserva => reserva.estado === 'rechazada'
    ).length;
  }
}
