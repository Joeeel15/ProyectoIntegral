import { Routes } from '@angular/router';

import { ListaLaboratorios } from './components/laboratorios/lista-laboratorios/lista-laboratorios';
import { FormularioLaboratorio } from './components/laboratorios/formulario-laboratorio/formulario-laboratorio';
import { DetalleLaboratorio } from './components/laboratorios/detalle-laboratorio/detalle-laboratorio';
import { ListaReservas } from './components/reservas/lista-reservas/lista-reservas';
import { Dashboard } from './components/dashboard/dashboard';

export const routes: Routes = [
  { path: '', component: Dashboard },

  {
    path: 'laboratorios',
    component: ListaLaboratorios,
  },

  {
    path: 'laboratorios/nuevo',
    component: FormularioLaboratorio,
  },

  {
    path: 'laboratorios/:id/editar',
    component: FormularioLaboratorio,
  },

  {
    path: 'laboratorios/:id',
    component: DetalleLaboratorio,
  },

  {
    path: 'reservas',
    component: ListaReservas,
  },

  {
    path: '**',
    redirectTo: 'laboratorios',
  },
];
