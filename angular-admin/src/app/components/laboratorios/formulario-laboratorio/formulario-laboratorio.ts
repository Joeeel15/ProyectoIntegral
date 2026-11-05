import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { CampusHubService } from '../../../services/campushub.service';
import { Laboratorio } from '../../../models/laboratorio.interface';

@Component({
  selector: 'app-formulario-laboratorio',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './formulario-laboratorio.html',
  styleUrl: './formulario-laboratorio.css',
})
export class FormularioLaboratorio implements OnInit {
  private fb = inject(FormBuilder);
  private servicio = inject(CampusHubService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  idLaboratorio: number | null = null;
  modoEdicion = false;
  cargando = false;
  guardando = false;
  mensajeError = '';

  // Validador personalizado para el nombre del laboratorio.
  validarNombre(control: AbstractControl): ValidationErrors | null {
    const nombre = control.value;

    if (!nombre) {
      return null;
    }

    const patron = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.-]+$/;

    return patron.test(nombre) ? null : { nombreInvalido: true };
  }

  formulario = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3), this.validarNombre]],

    sede: ['', Validators.required],

    piso: [1, [Validators.required, Validators.min(1), Validators.max(20)]],

    capacidad: [1, [Validators.required, Validators.min(1), Validators.max(100)]],

    equipos: ['', Validators.required],

    estado: ['disponible', Validators.required],

    descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(250)]],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.idLaboratorio = Number(id);
      this.modoEdicion = true;
      this.cargarDatosLaboratorio();
    }
  }

  get f() {
    return this.formulario.controls;
  }

  cargarDatosLaboratorio(): void {
    if (this.idLaboratorio === null) return;

    this.cargando = true;
    this.mensajeError = '';

    this.servicio.obtenerLaboratorio(this.idLaboratorio).subscribe({
      next: (laboratorio) => {
        this.formulario.patchValue({
          nombre: laboratorio.nombre,
          sede: laboratorio.sede,
          piso: laboratorio.piso,
          capacidad: laboratorio.capacidad,
          equipos: laboratorio.equipos.join(', '),
          estado: laboratorio.estado,
          descripcion: laboratorio.descripcion,
        });

        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar laboratorio:', error);

        this.mensajeError = 'No se pudo cargar la información del laboratorio.';

        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  guardarLaboratorio(): void {
    this.formulario.markAllAsTouched();

    if (this.formulario.invalid) {
      return;
    }

    this.guardando = true;
    this.mensajeError = '';

    const valores = this.formulario.getRawValue();

    const laboratorio: Omit<Laboratorio, 'id'> = {
      nombre: valores.nombre!.trim(),
      sede: valores.sede!,
      piso: Number(valores.piso),
      capacidad: Number(valores.capacidad),
      equipos: valores
        .equipos!.split(',')
        .map((equipo) => equipo.trim())
        .filter((equipo) => equipo.length > 0),
      estado: valores.estado as 'disponible' | 'mantenimiento',
      descripcion: valores.descripcion!.trim(),
    };

    const operacion =
      this.modoEdicion && this.idLaboratorio !== null
        ? this.servicio.actualizarLaboratorio(this.idLaboratorio, laboratorio)
        : this.servicio.crearLaboratorio(laboratorio);

    operacion.subscribe({
      next: () => {
        alert(
          this.modoEdicion
            ? 'Laboratorio actualizado correctamente.'
            : 'Laboratorio registrado correctamente.',
        );

        this.guardando = false;
        this.router.navigate(['/laboratorios']);
      },

      error: (error) => {
        console.error('Error al guardar laboratorio:', error);

        this.mensajeError = 'No se pudo guardar el laboratorio. Inténtalo nuevamente.';
        this.guardando = false;
      },
    });
  }
}
