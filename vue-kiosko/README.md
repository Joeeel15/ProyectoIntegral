# MediTurno — Kiosco de disponibilidad (Avance 4)

Kiosco público desarrollado con **Vue 3 + Vite**. Consume la misma API JSON Server de los avances anteriores (`http://localhost:3000`), sin autenticación y sin cambiar los datos de la aplicación.

## Puesta en marcha

Desde la raíz de `ProyectoIntegral-main`, en una terminal inicia el backend:

```bash
cd api-mock
npm install
npm run api
```

En otra terminal, inicia el kiosco:

```bash
cd vue-kiosko
npm install
npm run dev
```

Abre **http://localhost:5174**. Para ejecutar las pruebas de lógica: `npm test`. Para generar la compilación: `npm run build`.

Si necesitas cambiar la URL base, crea un archivo `.env.local` tomando como ejemplo `.env.example` y establece `VITE_API_URL`.

## Requisitos de la semana 16 cubiertos

- Vue 3 con Composition API y componentes `GrillaDisponibilidad` / `CeldaHorario` comunicados mediante props y eventos `emit`.
- Cuadrícula bidimensional de médicos × intervalos de 30 minutos entre 07:00 y 22:00.
- La lógica reutiliza **`core-js/modelos.js`**, concretamente `Cita.seCruzaCon` del Avance 1, para detectar intersecciones de citas y celdas.
- Estados: `libre`, `pendiente` y `ocupada`. Se añadió `no_disponible` para intervalos fuera de días u horarios de atención o médicos inactivos.
- `v-for` para filas y celdas, `v-if` para mensajes/diálogo, `:class` para colores, `v-model` para filtros de sede y fecha, `@click` para ver el detalle.
- Carga inicial con `onMounted`, actualización cada **30 segundos** y limpieza de intervalo + petición HTTP con `onUnmounted`.
- Gestión de carga, error y reintento manual; no muestra datos personales de pacientes.

## Reglas de estados

- `pendiente` → **pendiente**.
- `aprobada`, `atendida` y `no_asistio` → **ocupada**.
- `rechazada` y `cancelada` → **libre**, si el médico está disponible en ese intervalo.
- Médico inactivo, día no laborable o fuera de atención → **no disponible**, salvo que existan citas registradas que ocupen el intervalo.

Un intervalo aparece ocupado si se superpone a una cita (no se limita a buscar horas de inicio exactas).

## Estructura

- `src/App.vue`: filtros, resumen y diálogo de detalles.
- `src/components/GrillaDisponibilidad.vue`: grilla que envía eventos de selección.
- `src/components/CeldaHorario.vue`: celda que emite el clic.
- `src/components/DetalleCelda.vue`: muestra el resultado sin revelar identidades de estudiantes.
- `src/composables/useDisponibilidad.js`: consulta GET inicial y actualización cada 30 s.
- `src/services/api.js`: llamadas `GET /medicos` y `GET /citas`.
- `src/utils/grilla.js`: cálculo puro y bidimensional (reutiliza `core-js`).
- `tests/grilla.test.js`: pruebas automatizadas con `node:test`.

## Para la sustentación

1. Inicia `api-mock` y `vue-kiosko`, filtra por sede y cambia la fecha.
2. Selecciona un día y hora con citas cargadas en `db.json` para mostrar estados pendiente/ocupada.
3. Haz clic en cualquier celda para mostrar el detalle.
4. En Angular aprueba una cita pendiente o desde React genera una; pulsa **Actualizar ahora** en Vue y comprueba el cambio (o espera 30 segundos).
5. Muestra en `useDisponibilidad.js` `onMounted`, `setInterval(30000)` y `onUnmounted`.

