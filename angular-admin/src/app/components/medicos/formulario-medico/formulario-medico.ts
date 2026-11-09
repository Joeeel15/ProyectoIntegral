import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import {
  AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors,
  ValidatorFn, Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { EstadoMedico, Medico } from '../../../models/medico.interface';
import { MediTurnoService } from '../../../services/mediturno.service';

const horasValidas = /^([01]\d|2[0-3]):[0-5]\d$/;
const nombreValido = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ. '\-]+$/;

const validarHorario: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const inicio: string = control.get('horaInicio')?.value ?? '';
  const fin: string = control.get('horaFin')?.value ?? '';
  if (!horasValidas.test(inicio) || !horasValidas.test(fin)) return null;
  return inicio < fin ? null : { horarioInvalido: true };
};

const validarDias: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const dias = control.value as Record<string, boolean> | null;
  return dias && Object.values(dias).some(Boolean) ? null : { sinDias: true };
};

@Component({
  selector: 'app-formulario-medico',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './formulario-medico.html'
})
export class FormularioMedico implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly servicio = inject(MediTurnoService);
  private readonly ruta = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly diasSemana = [
    { clave: 'lunes', etiqueta: 'Lunes' },
    { clave: 'martes', etiqueta: 'Martes' },
    { clave: 'miercoles', etiqueta: 'Miércoles' },
    { clave: 'jueves', etiqueta: 'Jueves' },
    { clave: 'viernes', etiqueta: 'Viernes' },
    { clave: 'sabado', etiqueta: 'Sábado' },
    { clave: 'domingo', etiqueta: 'Domingo' }
  ] as const;

  idMedico: string | null = null;
  codigoNuevo = '';
  modoEdicion = false;
  cargando = true;
  guardando = false;
  mensajeError = '';
  cargaFallida = false;

  formulario = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(3), Validators.pattern(nombreValido)]],
    especialidad: ['', [Validators.required, Validators.minLength(3)]],
    consultorio: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9-]{1,12}$/)]],
    sede: ['', Validators.required],
    horaInicio: ['08:00', [Validators.required, Validators.pattern(horasValidas)]],
    horaFin: ['13:00', [Validators.required, Validators.pattern(horasValidas)]],
    estado: ['activo', Validators.required],
    diasDisponibles: this.fb.nonNullable.group({
      lunes: false, martes: false, miercoles: false,
      jueves: false, viernes: false, sabado: false, domingo: false
    }, { validators: validarDias })
  }, { validators: validarHorario });

  get f() { return this.formulario.controls; }

  ngOnInit(): void {
    this.idMedico = this.ruta.snapshot.paramMap.get('id');
    this.modoEdicion = this.idMedico !== null;

    if (this.idMedico) {
      this.cargarMedico(this.idMedico);
    } else {
      this.servicio.obtenerMedicos().subscribe({
        next: medicos => {
          // IDs alfanuméricos: MED-001, MED-002, ...
          const mayor = medicos.reduce((max, medico) => {
            const n = /^MED-(\d+)$/.exec(medico.id);
            return n ? Math.max(max, Number(n[1])) : max;
          }, 0);
          this.codigoNuevo = `MED-${String(mayor + 1).padStart(3, '0')}`;
          this.cargando = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.cargaFallida = true;
          this.mensajeError = 'No se pudo consultar la lista de médicos para asignar el código.';
          this.cargando = false;
          this.cdr.markForCheck();
        }
      });
    }
  }

  cargarMedico(id: string): void {
    this.servicio.obtenerMedico(id).subscribe({
      next: medico => {
        this.formulario.patchValue({
          nombre: medico.nombre,
          especialidad: medico.especialidad,
          consultorio: medico.consultorio,
          sede: medico.sede,
          horaInicio: medico.horarioAtencion.horaInicio,
          horaFin: medico.horarioAtencion.horaFin,
          estado: medico.estado,
          diasDisponibles: {
            lunes: medico.diasDisponibles.includes('lunes'),
            martes: medico.diasDisponibles.includes('martes'),
            miercoles: medico.diasDisponibles.includes('miercoles'),
            jueves: medico.diasDisponibles.includes('jueves'),
            viernes: medico.diasDisponibles.includes('viernes'),
            sabado: medico.diasDisponibles.includes('sabado'),
            domingo: medico.diasDisponibles.includes('domingo')
          }
        });
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.cargaFallida = true;
        this.mensajeError = 'No se encontró el médico solicitado.';
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  guardarMedico(): void {
    this.formulario.markAllAsTouched();
    if (this.formulario.invalid || this.guardando || this.cargando) return;
    this.guardando = true;
    this.mensajeError = '';

    const valores = this.formulario.getRawValue();
    const datos: Omit<Medico, 'id'> = {
      nombre: valores.nombre.trim(),
      especialidad: valores.especialidad.trim(),
      consultorio: valores.consultorio.trim(),
      sede: valores.sede,
      diasDisponibles: this.diasSemana
        .filter(dia => valores.diasDisponibles[dia.clave])
        .map(dia => dia.clave),
      horarioAtencion: { horaInicio: valores.horaInicio, horaFin: valores.horaFin },
      estado: valores.estado as EstadoMedico
    };

    const operacion = this.idMedico
      ? this.servicio.actualizarMedico(this.idMedico, datos)
      : this.servicio.crearMedico({ id: this.codigoNuevo, ...datos });

    operacion.subscribe({
      next: () => {
        this.guardando = false;
        this.router.navigate(['/medicos']);
      },
      error: (error: HttpErrorResponse) => {
        this.mensajeError = error.error?.error ?? 'No se pudo guardar el médico.';
        this.guardando = false;
        this.cdr.markForCheck();
      }
    });
  }
}
