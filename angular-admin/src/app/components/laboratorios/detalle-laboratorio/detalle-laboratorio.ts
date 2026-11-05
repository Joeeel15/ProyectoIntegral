import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { CampusHubService } from '../../../services/campushub.service';
import { Laboratorio } from '../../../models/laboratorio.interface';

@Component({
  selector: 'app-detalle-laboratorio',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './detalle-laboratorio.html',
  styleUrl: './detalle-laboratorio.css'
})
export class DetalleLaboratorio implements OnInit {

  private servicio = inject(CampusHubService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  laboratorio: Laboratorio | null = null;
  cargando = true;
  mensajeError = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id || Number.isNaN(id)) {
      this.mensajeError = 'El identificador del laboratorio no es válido.';
      this.cargando = false;
      return;
    }

    this.servicio.obtenerLaboratorio(id).subscribe({
      next: (datos) => {
        this.laboratorio = datos;
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al obtener laboratorio:', error);
        this.mensajeError = 'No se pudo encontrar el laboratorio solicitado.';
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }
}
