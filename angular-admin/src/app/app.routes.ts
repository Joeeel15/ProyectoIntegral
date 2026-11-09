import { Routes } from '@angular/router';

import { Dashboard } from './components/dashboard/dashboard';
import { ListaMedicos } from './components/medicos/lista-medicos/lista-medicos';
import { FormularioMedico } from './components/medicos/formulario-medico/formulario-medico';
import { DetalleMedico } from './components/medicos/detalle-medico/detalle-medico';
import { ListaCitas } from './components/citas/lista-citas/lista-citas';

export const routes: Routes = [
  { path: '', component: Dashboard, pathMatch: 'full' },
  { path: 'medicos', component: ListaMedicos },
  // Orden importante: las rutas específicas preceden a /medicos/:id.
  { path: 'medicos/nuevo', component: FormularioMedico },
  { path: 'medicos/:id/editar', component: FormularioMedico },
  { path: 'medicos/:id', component: DetalleMedico },
  { path: 'citas', component: ListaCitas },
  { path: '**', redirectTo: 'medicos' }
];
