# MediTurno — Portal React del estudiante (Avances 2 y 3)

SPA con **Vite, React, React Router y Bootstrap**, conectada a la API REST del proyecto.
En el Avance 3, los médicos y las citas provienen de `api-mock/db.json` a través
de la API del puerto 3000, no de la copia local del Avance 2.

## Cómo ejecutar

Desde la raíz del repositorio, en dos terminales distintas:

```bash
cd api-mock
npm ci
npm run api
```

```bash
cd react-estudiante
npm ci
npm run dev
```

Abre <http://localhost:5173>. La API se ejecuta en <http://localhost:3000>.
Opcionalmente configura `VITE_API_URL` en un archivo `.env` de React para modificar
la URL base. En otra terminal puedes iniciar `angular-admin` con `npm start`.

Comprobaciones desde `react-estudiante/`:

```bash
npm test
npm run lint
npm run build
```

Para `core-js`, ejecuta `npm test` en `core-js/`.

## Rutas y sesiones

| Ruta | Descripción |
|---|---|
| `/` | Inicio |
| `/catalogo` | Catálogo de médicos desde la API |
| `/catalogo/:id` | Detalle del médico por Fetch y `useParams` |
| `/login` | Login simulado con `GET /usuarios?correo=` |
| `/mis-reservas` | Citas del estudiante; requiere sesión |
| `/nueva-reserva` | Formulario de citas; requiere sesión |
| `*` | Página 404 |

`AuthContext` conserva el usuario en `localStorage` sin guardar su contraseña.
Es un **login simulado**, sin token JWT ni protección real del servidor (corresponde
al Avance 5). `ThemeContext` mantiene el modo claro/oscuro.

## Servicios HTTP del Avance 3

| Librería | Uso concreto | Archivos |
|---|---|---|
| **Fetch** | Catálogo, detalle de médico y búsqueda de usuario; `async/await` y `response.ok` | `src/services/apiFetch.js` |
| **Axios** | `GET /citas`, `POST /citas`, `DELETE /citas/:id`, con instancia `baseURL` e interceptor de errores HTTP | `src/services/apiAxios.js`, `erroresAxios.js`, `servicioCitas.js`, `citasAxios.js` |
| **Alova** | Resumen de citas por estado con `useRequest`, caché de 30 s y botón de actualización | `src/services/apiAlova.js`, `src/components/ResumenCitas.jsx` |

El hook `useReservas(usuarioId)` (`src/hooks/useReservas.js`) concentra la carga,
los errores, la creación y cancelación de citas; actualiza los datos cada **15 s**
y limpia el intervalo al desmontarse. El catálogo de médicos se reutiliza también
en las tarjetas del historial con `useMedicosCitas`, evitando usar la copia local.

## Reglas de citas y persistencia

Las solicitudes nuevas se crean como **`pendiente`** y pueden aprobarse o rechazarse
en Angular. Los estados `programada` siguen admitiéndose para datos antiguos.
El formulario reutiliza `core-js/validadores.js` y la clase `Cita` para
verificar fechas, horarios de los médicos y cruces; los errores se muestran junto
a los campos. El servidor también comprueba los cruces antes de registrar la cita.

Al cancelar, Axios utiliza `DELETE /citas/:id` como requiere el PDF. En MediTurno,
el middleware intercepta ese método, conserva la cita en `db.json` y cambia su
estado a **`cancelada`**. Esto mantiene el historial del estudiante y libera el
horario; no es una eliminación física.

## Demostración de integración con Angular

1. Inicia API (`3000`), React (`5173`) y Angular (`4200`).
2. Inicia sesión como estudiante en React y solicita una cita futura válida.
3. Comprueba que aparece como **Pendiente** en React y en la lista de Angular.
4. Aprueba la cita desde Angular (`PATCH /citas/:id`).
5. Vuelve a React y utiliza **Actualizar citas** o espera hasta 15 segundos:
   se mostrará **Aprobada**. El resumen de Alova tiene su propio botón de actualización.
6. Cancela una cita desde React y verifica que permanece en el historial como
   **Cancelada**, incluso después de recargar.

La aplicación es un prototipo académico y utiliza credenciales ficticias.
Se utilizó asistencia de IA en la implementación; el equipo debe comprender
cada sección para sustentarla ante el docente.
