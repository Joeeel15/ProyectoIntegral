# MediTurno — Sistema de citas médicas universitarias

Proyecto desarrollado para el curso de **JavaScript Avanzado**, adaptado al dominio **MediTurno**, un sistema de citas médicas universitarias.

Un estudiante puede solicitar atención con cualquier médico, independientemente de su sede. Los administradores gestionan médicos y pueden aprobar o rechazar solicitudes de citas pendientes desde el panel administrativo.

El proyecto integra una API REST compartida por cinco componentes: el núcleo JavaScript, el panel administrativo Angular, el portal del estudiante React, el kiosco de disponibilidad Vue y el portal público Next.js.

## Integrantes

- Russell Manuel Espinoza Nateros
- Cristian Joel Astorayme Hurtado

## Estado de desarrollo

**Avances 1, 2, 3 y 4 desarrollados.**

El repositorio contiene los siguientes componentes:

| Carpeta | Tecnología | Descripción |
|---|---|---|
| `core-js/` | JavaScript | Modelos `Usuario`, `Medico` y `Cita`, validadores, estadísticas y pruebas con `node:test`. Contiene lógica compartida por las aplicaciones. |
| `api-mock/` | Node.js + JSON Server | API REST compartida con `db.json` y middleware para validación de citas y médicos. |
| `angular-admin/` | Angular + Bootstrap | Panel administrativo. Incluye dashboard, CRUD de médicos y gestión de citas pendientes, con aprobación y rechazo. |
| `react-estudiante/` | React + Vite + Bootstrap | Portal del estudiante. Incluye login simulado, catálogo, detalle de médicos, creación y cancelación de citas, resumen con Alova y rutas protegidas. |
| `vue-kiosko/` | Vue 3 + Vite | Kiosco público de disponibilidad médica, con filtros por sede, cuadrícula de horarios y actualización automática cada 30 segundos. |
| `next-publico/` | Next.js | Portal público con catálogo de médicos, detalles dinámicos, consulta de citas por código y renderizado del lado del servidor (SSR). |

La API es compartida por todos los frontends y utiliza `api-mock/db.json` como fuente de datos.

La copia local `src/data/db.json` de React es un recurso heredado del Avance 2 y ya no alimenta las vistas activas.

## Estructura del proyecto

```text
ProyectoIntegral/
├── core-js/
├── api-mock/
├── angular-admin/
├── react-estudiante/
├── vue-kiosko/
├── next-publico/
└── README.md
```

## Requisitos

- Node.js
- npm
- Visual Studio Code
- Git

## Cómo ejecutar el proyecto

Cada aplicación se ejecuta en una terminal independiente. Es necesario iniciar primero la API para que los frontends puedan consultar y modificar los datos.

### 1. API compartida (puerto 3000)

```bash
cd api-mock
npm install
npm run api
```

API disponible en:

http://localhost:3000

### 2. Panel administrativo Angular (puerto 4200)

```bash
cd angular-admin
npm install
npm start
```

Aplicación disponible en:

http://localhost:4200

### 3. Portal del estudiante React (puerto 5173)

```bash
cd react-estudiante
npm ci
npm run dev
```

Aplicación disponible en:

http://localhost:5173

El portal utiliza Fetch para consultar médicos y usuarios, Axios para crear y cancelar citas, y Alova para el resumen de citas. Los cambios persisten en `api-mock/db.json`.

En «Mis citas» se consulta el estado cada 15 segundos para reflejar las aprobaciones realizadas desde Angular. La cancelación utiliza `DELETE /citas/:id`, pero el middleware conserva el registro y cambia su estado a `cancelada` (cancelación lógica).

### 4. Kiosco de disponibilidad Vue 3 (puerto 5174)

```bash
cd vue-kiosko
npm install
npm run dev
```

Aplicación disponible en:

http://localhost:5174

El kiosco muestra una cuadrícula de disponibilidad médica con horarios de 07:00 a 22:00.

Funcionalidades principales:

- Componentes `GrillaDisponibilidad` y `CeldaHorario`.
- Comunicación entre componentes mediante props y emit.
- Uso de `v-for`, `v-if`, `v-bind:class`, `v-model` y `@click`.
- Filtro de médicos por sede.
- Estados de disponibilidad: libre, pendiente y ocupado.
- Actualización automática cada 30 segundos.
- Carga inicial mediante `onMounted` y limpieza del intervalo mediante `onUnmounted`.
- Reutilización de lógica del núcleo `core-js`.

Para ejecutar las pruebas y compilar:

```bash
cd vue-kiosko
npm test
npm run build
```

### 5. Portal público Next.js (puerto 3001)

```bash
cd next-publico
npm install
npm run dev -- --port 3001
```

Portal disponible en:

http://localhost:3001

Funcionalidades principales:

- Catálogo público de médicos.
- Detalle dinámico de cada médico.
- Visualización de citas aprobadas de la semana.
- Consulta pública de citas mediante su código.
- Página personalizada para recursos o citas inexistentes.
- Metadatos SEO por página.
- Renderizado del lado del servidor (SSR) mediante componentes de servidor y consultas a la API con `cache: 'no-store'`.

Rutas principales:

| Ruta | Función |
|---|---|
| `/` | Página principal y catálogo de médicos |
| `/medicos/[id]` | Detalle dinámico de un médico |
| `/consultar-cita` | Formulario para consultar una cita |
| `/cita/[codigo]` | Resultado de la consulta pública de una cita |
| `/cita` | Redirección al detalle de la cita consultada |
| `/_not-found` | Página personalizada para rutas inexistentes |

El portal no requiere iniciar sesión y no expone información personal del estudiante en la consulta pública.

Para compilar el proyecto:

```bash
cd next-publico
npm run build
```

## Comparación de frameworks

Durante el desarrollo de MediTurno se utilizaron Angular, React, Vue y Next.js para implementar diferentes interfaces conectadas a una misma API REST.

| Característica | Angular | React | Vue 3 | Next.js |
|---|---|---|---|---|
| Tipo | Framework | Biblioteca | Framework progresivo | Framework basado en React |
| Proyecto | Panel administrativo | Portal del estudiante | Kiosco de disponibilidad | Portal público |
| Componentes | Componentes Angular | Componentes funcionales | Componentes Vue | Componentes de servidor |
| Estado y reactividad | Servicios y mecanismos reactivos de Angular | Hooks y Context API | Composition API, `ref` y `computed` | Datos obtenidos en el servidor |
| Enrutamiento | Angular Router | React Router | No se utiliza en el kiosco | App Router |
| Renderizado utilizado | SPA | SPA | SPA | SSR dinámico |
| Curva de aprendizaje | Más estructurada y con mayor cantidad de conceptos iniciales | Flexible, pero requiere organizar el estado y las rutas | Sintaxis sencilla y reactividad intuitiva | Requiere comprender React, rutas y renderizado del servidor |

### Experiencia durante el desarrollo

**Angular:** permitió desarrollar un panel administrativo organizado mediante componentes, servicios, formularios y rutas. Su estructura facilita proyectos grandes, aunque requiere familiarizarse con más conceptos y herramientas.

**React:** permitió construir una interfaz flexible mediante componentes funcionales, hooks y Context API. La gestión del estado y la integración con React Router brindaron control sobre el portal del estudiante.

**Vue 3:** facilitó la construcción del kiosco mediante una sintaxis sencilla y una reactividad intuitiva. El uso de `ref`, `computed`, `v-model` y la comunicación mediante props y emit permitió implementar la cuadrícula de disponibilidad.

**Next.js:** permitió construir un portal público utilizando React y App Router. Su renderizado del lado del servidor facilita entregar contenido HTML con los datos obtenidos desde la API, además de gestionar rutas dinámicas y metadatos SEO.

### Conclusión de la comparación

Cada tecnología cumplió una función diferente dentro de MediTurno. Angular resultó apropiado para el panel administrativo estructurado; React permitió desarrollar el portal interactivo del estudiante; Vue facilitó la creación del kiosco de disponibilidad; y Next.js permitió implementar un portal público con renderizado del lado del servidor y rutas dinámicas.

La elección depende de las necesidades de cada interfaz, la organización del proyecto y la experiencia de desarrollo.

## Rutas de Angular

| Ruta | Función |
|---|---|
| `/` | Dashboard |
| `/medicos` | Lista, filtros y eliminación de médicos |
| `/medicos/nuevo` | Crear médico |
| `/medicos/:id` | Detalle de médico |
| `/medicos/:id/editar` | Editar médico |
| `/citas` | Listar, filtrar, aprobar y rechazar citas pendientes |

La eliminación de médicos con citas asociadas se bloquea para evitar referencias huérfanas. Para demostrar la eliminación, se puede crear un médico de prueba y eliminarlo antes de asignarle citas.

## Comparación de librerías HTTP

| Característica | Fetch API | Axios | Alova |
|---|---|---|---|
| Uso en MediTurno | Consultar médicos y usuarios | Crear y cancelar citas | Resumen de citas |
| Configuración | API nativa del navegador | Instancia con `baseURL` | Instancia con adaptador Fetch |
| Manejo de errores | Verificación de `response.ok` | Interceptor de respuesta | Estados de error de `useRequest` |
| Asincronía | `async/await` | `async/await` | `useRequest` |
| Caché | No configurada | No configurada | Caché de 30 segundos |
| Ventaja principal | No requiere instalación adicional | Facilita las peticiones y el manejo centralizado de errores | Integra las peticiones con el estado de React |

## Pruebas y compilación

### Núcleo JavaScript

```bash
cd core-js
node --test
```

### React

```bash
cd react-estudiante
npm test
npm run build
```

### Vue

```bash
cd vue-kiosko
npm test
npm run build
```

### Next.js

```bash
cd next-publico
npm run build
```

### API HTTP

Abrir `api-mock/pruebas-api.http` con la extensión REST Client de VS Code y ejecutar las peticiones individualmente.

Las operaciones POST, PUT y DELETE modifican los datos de `api-mock/db.json`.

## Notas de desarrollo

- La API mock todavía no implementa autenticación ni autorización real. Debe utilizarse únicamente con credenciales ficticias y en un entorno local.
- Los estados del flujo de citas son `pendiente`, `aprobada`, `rechazada`, `atendida`, `cancelada` y `no_asistio`.
- Una cita confirmada utiliza el estado `aprobada`.
- Todos los frontends utilizan la misma API REST para consultar la información.
- Se ha utilizado asistencia de IA para revisar y adaptar partes de la implementación. El equipo debe comprender y poder explicar cada cambio, conforme al enunciado del curso.