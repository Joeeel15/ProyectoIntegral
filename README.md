# MediTurno — Sistema de citas médicas universitarias

Proyecto de JavaScript Avanzado, adaptado al dominio **MediTurno** del enunciado. Un estudiante puede solicitar atención con cualquier médico, independientemente de su sede. Los administradores gestionan médicos y pueden aprobar o rechazar solicitudes de citas pendientes desde Angular.

## Integrantes

- Russell Manuel Espinoza Nateros
- Cristian Joel Astorayme Hurtado

## Estado de desarrollo

**Avance 1 finalizado. Avance 2 (React) desarrollado con datos locales.** Este repositorio contiene:

- `core-js/`: modelos `Usuario`, `Medico` y `Cita`, validadores, estadísticas y pruebas con `node:test`.
- `api-mock/`: API REST con `json-server@0.17.4` y `db.json`; middleware para validación de citas y de médicos.
- `angular-admin/`: panel administrativo Angular + Bootstrap. Incluye dashboard, CRUD de médicos y gestión de citas pendientes con pipe de estados.
- `react-estudiante/`: SPA de estudiante React + Vite + Bootstrap; login simulado, catálogo, detalle, solicitudes de citas, rutas protegidas, Context y Hooks; usa copia local de `db.json`.

## Cómo ejecutar

Requisitos: Node.js, npm y VS Code. En la raíz del proyecto, usa dos terminales:

**Terminal 1 — API simulada (puerto 3000)**

```bash
cd api-mock
npm install
npm run api
```

**Terminal 2 — Angular (puerto 4200)**

```bash
cd angular-admin
npm install
npm start
```

Abre <http://localhost:4200>.

**Terminal 3 — React estudiante (puerto 5173, datos locales)**

```bash
cd react-estudiante
npm ci
npm run dev
```

Abre <http://localhost:5173>. React todavía **no consume la API**, por lo que
puedes ejecutarlo sin iniciar JSON Server. Sus cambios se mantienen solamente
hasta refrescar la página. Para las pruebas: `cd react-estudiante && npm test`.
Más información en [`react-estudiante/README.md`](react-estudiante/README.md).

## Rutas de Angular

| Ruta | Función |
| --- | --- |
| `/` | Dashboard |
| `/medicos` | Lista, filtros y eliminación |
| `/medicos/nuevo` | Crear médico |
| `/medicos/:id` | Detalle de médico |
| `/medicos/:id/editar` | Editar médico |
| `/citas` | Listar, filtrar, aprobar y rechazar citas pendientes |

La eliminación de médicos con citas asociadas se bloquea para no dejar referencias huérfanas. Para demostrar eliminación, crea un médico de prueba y elimínalo antes de asignarle citas.

## Pruebas

**JavaScript del núcleo (20 pruebas):**

```bash
cd core-js
node --test
```

**API HTTP:** abre `api-mock/pruebas-api.http` con la extensión REST Client en VS Code y ejecuta las peticiones de una en una. Los POST, PUT y DELETE cambian `db.json`.

## Notas de desarrollo

- La API mock aún no implementa autenticación ni autorización; utilízala únicamente con credenciales ficticias y en un entorno local.
- Los estados del flujo de citas son `pendiente`, `aprobada`, `rechazada`, `atendida` y `cancelada`, conservando `programada` y `no_asistio` por compatibilidad con datos anteriores.
- Se ha utilizado asistencia de IA para revisar y adaptar partes de la implementación; el equipo debe comprender y poder explicar cada cambio, conforme al enunciado del curso.
