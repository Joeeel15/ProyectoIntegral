import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Laboratorio } from '../models/laboratorio.interface';
import { Reserva } from '../models/reserva.interface';

@Injectable({
  providedIn: 'root'
})
export class CampusHubService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3001';

  // =====================================
  // OPERACIONES DE LABORATORIOS
  // =====================================

  obtenerLaboratorios(
    sede?: string,
    q?: string
  ): Observable<Laboratorio[]> {

    let params = new HttpParams();

    if (sede) {
      params = params.set('sede', sede);
    }

    if (q) {
      params = params.set('q', q);
    }

    return this.http.get<Laboratorio[]>(
      `${this.apiUrl}/laboratorios`,
      { params }
    );
  }

  obtenerLaboratorio(id: number): Observable<Laboratorio> {
    return this.http.get<Laboratorio>(
      `${this.apiUrl}/laboratorios/${id}`
    );
  }

  crearLaboratorio(
    laboratorio: Omit<Laboratorio, 'id'>
  ): Observable<Laboratorio> {
    return this.http.post<Laboratorio>(
      `${this.apiUrl}/laboratorios`,
      laboratorio
    );
  }

  actualizarLaboratorio(
    id: number,
    laboratorio: Partial<Laboratorio>
  ): Observable<Laboratorio> {
    return this.http.patch<Laboratorio>(
      `${this.apiUrl}/laboratorios/${id}`,
      laboratorio
    );
  }

  eliminarLaboratorio(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/laboratorios/${id}`
    );
  }

  // =====================================
  // OPERACIONES DE RESERVAS
  // =====================================

  obtenerReservas(usuarioId?: number): Observable<Reserva[]> {

    let params = new HttpParams();

    if (usuarioId !== undefined) {
      params = params.set('usuarioId', usuarioId);
    }

    return this.http.get<Reserva[]>(
      `${this.apiUrl}/reservas`,
      { params }
    );
  }

  crearReserva(
    reserva: Omit<Reserva, 'id'>
  ): Observable<Reserva> {
    return this.http.post<Reserva>(
      `${this.apiUrl}/reservas`,
      reserva
    );
  }

  eliminarReserva(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/reservas/${id}`
    );
  }
}
