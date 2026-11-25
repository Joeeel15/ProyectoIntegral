# MediTurno — Sistema de citas médicas universitarias

Proyecto de JavaScript Avanzado, adaptado al dominio **MediTurno** del enunciado. Un estudiante puede solicitar atención con cualquier médico, independientemente de su sede. Los administradores gestionan médicos y pueden aprobar o rechazar solicitudes de citas pendientes desde Angular. El proyecto integra una API REST compartida por tres componentes principales: el núcleo JavaScript, el panel administrativo Angular y el portal del estudiante React.

## Integrantes

- Russell Manuel Espinoza Nateros
- Cristian Joel Astorayme Hurtado

## Estado de desarrollo

**Avance 1, Avance 2 y Avance 3 desarrollados.** Este repositorio contiene:

- `core-js/`: modelos `Usuario`, `Medico` y `Cita`, validadores, estadísticas y pruebas con `node:test`.
- `api-mock/`: API REST con `json-server@0.17.4` y `db.json`; middleware para validación de citas y de médicos.
- `angular-admin/`: panel administrativo Angular + Bootstrap. Incluye dashboard, CRUD de médicos y gestión de citas pendientes con pipe de estados.
- `react-estudiante/`: SPA de estudiante React + Vite + Bootstrap; login simulado contra la API, catálogo y detalle con Fetch, creación y cancelación de citas con Axios, resumen con Alova y rutas protegidas. Las citas se guardan en `api-mock/db.json`. La copia local `src/data/db.json` es un recurso heredado del Avance 2 y ya no alimenta las vistas activas.

## Cómo ejecutar

Requisitos: Node.js, npm y VS Code. Desde la raíz del proyecto, abre tres terminales para utilizar Angular, React y el API compartido:

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

**Terminal 3 — React estudiante (puerto 5173, conectado al API)**

```bash
cd react-estudiante
npm ci
npm run dev
```

Abre <http://localhost:5173>. **Es necesario iniciar primero el API** (`http://localhost:3000`).
El catálogo, login, creación y cancelación de citas usan el servidor: los cambios
persisten en `api-mock/db.json`, incluso después de recargar React. En «Mis citas»
se consulta el estado cada 15 segundos; la aprobación realizada en Angular aparece
automáticamente. La cancelación se realiza mediante `DELETE /citas/:id`, pero el
middleware conserva el registro y cambia su estado a `cancelada` (cancelación lógica).
Para las pruebas y la compilación: `cd react-estudiante && npm test && npm run build`.
Más información en [`react-estudiante/README.md`](react-estudiante/README.md).

## Comparación de las librerías HTTP

| Característica | Fetch API | Axios | Alova |
|---|---|---|---|
| Uso en MediTurno | Consultar médicos y usuarios | Crear y cancelar citas | Resumen de citas |
| Configuración | API nativa del navegador | Instancia con baseURL | Instancia con adaptador Fetch |
| Manejo de errores | Verificación de response.ok | Interceptor de respuesta | Estados de error de useRequest |
| Asincronía | async/await | async/await | useRequest |
| Caché | No se configuró | No se configuró | Caché de 30 segundos |
| Ventaja principal | No requiere instalación adicional | Facilita las peticiones y el manejo centralizado de errores | Integra las peticiones con el estado de React |


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

**React (40 pruebas en la versión revisada):** `cd react-estudiante && npm test`.

**API HTTP:** abre `api-mock/pruebas-api.http` con la extensión REST Client en VS Code y ejecuta las peticiones de una en una. Los POST, PUT y DELETE cambian `db.json`.

## Notas de desarrollo

- La API mock aún no implementa autenticación ni autorización; utilízala únicamente con credenciales ficticias y en un entorno local.
- Los estados del flujo de citas son `pendiente`, `aprobada`, `rechazada`, `atendida`, `cancelada` y `no_asistio`. Una cita confirmada usa `aprobada`.
- Se ha utilizado asistencia de IA para revisar y adaptar partes de la implementación; el equipo debe comprender y poder explicar cada cambio, conforme al enunciado del curso.
