import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Usuario } from '../models/usuario.interface';
import { Medico } from '../models/medico.interface';
import { Cita, EstadoCita, NuevaCita } from '../models/cita.interface';

@Injectable({ providedIn: 'root' })
export class MediTurnoService {
  private readonly http = inject(HttpClient);

  // El PDF establece el puerto 3000 para la API única de MediTurno.
  private readonly apiUrl = 'http://localhost:3000';

  // USUARIOS
  obtenerUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/usuarios`);
  }

  obtenerUsuario(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/usuarios/${id}`);
  }

  // MÉDICOS: CRUD completo del catálogo (Avance 1)
  obtenerMedicos(sede?: string, busqueda?: string): Observable<Medico[]> {
    let params = new HttpParams();
    if (sede) params = params.set('sede', sede);
    if (busqueda) params = params.set('q', busqueda);

    return this.http.get<Medico[]>(`${this.apiUrl}/medicos`, { params });
  }

  obtenerMedico(id: string): Observable<Medico> {
    return this.http.get<Medico>(`${this.apiUrl}/medicos/${id}`);
  }

  crearMedico(medico: Medico): Observable<Medico> {
    // En db.json los IDs son textos como MED-009: hay que enviarlos.
    return this.http.post<Medico>(`${this.apiUrl}/medicos`, medico);
  }

  actualizarMedico(id: string, datos: Omit<Medico, 'id'>): Observable<Medico> {
    return this.http.put<Medico>(`${this.apiUrl}/medicos/${id}`, { id, ...datos });
  }

  eliminarMedico(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/medicos/${id}`);
  }

  // CITAS: listarlas en Angular y preparar la aprobación (Avance 3)
  obtenerCitas(estudianteId?: string): Observable<Cita[]> {
    let params = new HttpParams();
    if (estudianteId) params = params.set('estudianteId', estudianteId);

    return this.http.get<Cita[]>(`${this.apiUrl}/citas`, { params });
  }

  obtenerCita(id: string): Observable<Cita> {
    return this.http.get<Cita>(`${this.apiUrl}/citas/${id}`);
  }

  crearCita(datos: NuevaCita): Observable<Cita> {
    // Requiere que api-mock admita el nuevo estado "pendiente".
    return this.http.post<Cita>(`${this.apiUrl}/citas`, {
      ...datos,
      estado: 'pendiente'
    });
  }

  cambiarEstadoCita(id: string, estado: EstadoCita): Observable<Cita> {
    return this.http.patch<Cita>(`${this.apiUrl}/citas/${id}`, { estado });
  }

  aprobarCita(id: string): Observable<Cita> {
    return this.cambiarEstadoCita(id, 'aprobada');
  }

  rechazarCita(id: string): Observable<Cita> {
    return this.cambiarEstadoCita(id, 'rechazada');
  }

  cancelarCita(id: string): Observable<Cita> {
    return this.cambiarEstadoCita(id, 'cancelada');
  }

  eliminarCita(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/citas/${id}`);
  }
}
