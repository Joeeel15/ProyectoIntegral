# MediTurno — Portal React del estudiante (Avance 2)

SPA creada con **Vite, React, React Router y Bootstrap**. En este avance utiliza
únicamente los datos locales de `src/data/db.json`, importados como una copia de
`api-mock/db.json`. **No consulta ni modifica la API:** eso corresponde al Avance 3.

## Cómo ejecutar

Desde `react-estudiante/`:

```bash
npm ci
npm run dev
```

Abre <http://localhost:5173>. Para validar el código:

```bash
npm test
npm run lint
npm run build
```

Para las pruebas del núcleo JS: `cd ../core-js && npm test`.

## Rutas

| Ruta | Descripción |
| --- | --- |
| `/` | Inicio |
| `/catalogo` | Médicos activos y filtros por sede/texto |
| `/catalogo/:id` | Detalle del médico (useParams) |
| `/login` | Login simulado con usuarios locales |
| `/mis-reservas` | Citas del estudiante, protegida por sesión |
| `/nueva-reserva` | Formulario controlado, protegido por sesión |
| `*` | Página 404 |

## Hooks y componentes

- `AuthContext` administra la sesión solo en memoria; se reinicia al refrescar.
- `ThemeContext` administra el modo claro/oscuro.
- `useState` mantiene filtros, formulario y citas.
- `useEffect` cambia el título y actualiza el contador regresivo cada segundo.
- `useCuentaRegresiva` cancela su intervalo cuando se desmonta.
- `useRef` enfoca el médico al abrir el formulario y limpia el formulario tras guardar.
- Los componentes reciben datos mediante props, muestran listas con `key`
  y usan renderizado condicional.

El formulario reutiliza `core-js/validadores.js` y la clase `Cita`; valida
fecha, horas, día y horario de atención del médico, y evita citas superpuestas.
Las solicitudes nuevas se guardan como **pendiente**. En **Mis citas**, el estudiante puede cancelar citas pendientes, aprobadas o programadas (previa confirmación); el estado cambia a **cancelada** y el horario queda disponible. Solo las citas
**rechazadas** y **canceladas** liberan su horario. El contador muestra
únicamente la próxima cita **aprobada** o **programada** (compatibilidad con
registros antiguos).

## Alcance

Los cambios de citas son locales mientras esta SPA está abierta: no persisten
al refrescar ni se reflejan todavía en Angular. En el Avance 3 se conectará
al API REST y se integrará el flujo de aprobación.

El acceso es de demostración; no contiene autenticación real y no se deben usar
contraseñas reales. El proyecto fue desarrollado con asistencia de IA y el
código debe poder ser explicado por los integrantes.
