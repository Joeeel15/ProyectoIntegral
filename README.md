# MediTurno — Sistema de citas médicas universitarias

Proyecto de JavaScript Avanzado, adaptado al dominio **MediTurno** del enunciado. Un estudiante puede solicitar atención con cualquier médico, independientemente de su sede. Los administradores gestionan médicos y, en los siguientes avances, aprobarán o rechazarán las citas.

## Integrantes

- Russell Manuel Espinoza Nateros
- Cristian Joel Astorayme Hurtado

## Estado de desarrollo

**Avance 1 en preparación.** Este repositorio contiene:

- `core-js/`: modelos `Usuario`, `Medico` y `Cita`, validadores, estadísticas y pruebas con `node:test`.
- `api-mock/`: API REST con `json-server@0.17.4` y `db.json`; middleware para validación de citas y de médicos.
- `angular-admin/`: panel administrativo Angular + Bootstrap. Incluye dashboard, CRUD de médicos y listado de citas.

Los componentes antiguos de CampusHub aún se conservan como referencia dentro de `angular-admin/src/app/components/laboratorios` y `reservas`, pero ya no forman parte de las rutas utilizadas.

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

## Rutas de Angular

| Ruta | Función |
| --- | --- |
| `/` | Dashboard |
| `/medicos` | Lista, filtros y eliminación |
| `/medicos/nuevo` | Crear médico |
| `/medicos/:id` | Detalle de médico |
| `/medicos/:id/editar` | Editar médico |
| `/citas` | Listar y filtrar citas |

La eliminación de médicos con citas asociadas se bloquea para no dejar referencias huérfanas. Para demostrar eliminación, crea un médico de prueba y elimínalo antes de asignarle citas.

## Pruebas

**JavaScript:**

```bash
cd core-js
node --test
```

**API HTTP:** abre `api-mock/pruebas-api.http` con la extensión REST Client en VS Code y ejecuta las peticiones de una en una. Los POST, PUT y DELETE cambian `db.json`.

## Notas de desarrollo

- La API mock aún no implementa autenticación ni autorización; utilízala únicamente con credenciales ficticias y en un entorno local.
- Los estados del flujo de citas son `pendiente`, `aprobada`, `rechazada`, `atendida` y `cancelada`, conservando `programada` y `no_asistio` por compatibilidad con datos anteriores.
- Queda pendiente adaptar el pipe de citas, los botones de aprobar/rechazar en Angular y preparar los siguientes frontends conforme a los avances del curso.
- Se ha utilizado asistencia de IA para revisar y adaptar partes de la implementación; el equipo debe comprender y poder explicar cada cambio, conforme al enunciado del curso.
