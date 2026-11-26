# MediTurno — Portal público Next.js (Avance 4)

Portal público SSR del sistema de citas médicas universitarias. Usa **Next.js App Router** y consulta la **misma API REST de `api-mock`**, disponible en `http://localhost:3000`.

## Instalación y ejecución

Desde `next-publico/`:

```bash
npm ci
npm run dev
```

Abre **http://localhost:3001**. El puerto 3001 está configurado en `package.json`; la API utiliza 3000. Para producción local: `npm run build` y `npm start` (también en el puerto 3001).

También se puede iniciar con todos los módulos desde la raíz mediante `npm run dev`, después de instalar las dependencias correspondientes.

## Rutas

| Ruta | Función |
|---|---|
| `/` | Inicio y catálogo público de médicos |
| `/medicos` | Catálogo público SSR; reutiliza la página de inicio |
| `/medicos/[id]` | Perfil del médico y citas aprobadas de la semana actual |
| `/consultar-cita` | Formulario de búsqueda por código de cita |
| `/cita` | Redirige al código buscado |
| `/cita/[codigo]` | Estado público de una cita por su `id` (`CIT-0001`) |
| Código inexistente | Página personalizada 404 |

Los datos se obtienen en el servidor mediante `lib/api.js`, con `fetch(..., { cache: 'no-store' })`, sin requerir inicio de sesión. La consulta pública no muestra datos personales del estudiante.

## Comprobación para la rúbrica

1. Inicia primero la API en `http://localhost:3000` y Next.js en `http://localhost:3001`.
2. Abre `/medicos` y entra al detalle de cualquier médico.
3. Usa **Ver código fuente** (`Ctrl + U`) en `/medicos/MED-001`; busca su nombre dentro del HTML de respuesta para demostrar el renderizado en servidor.
4. Verifica `/cita/CIT-0001` y un código inexistente para demostrar rutas dinámicas y 404.
5. Revisa `generateMetadata` en las páginas dinámicas y los metadatos globales en `app/layout.js`.

> Nota: si la API no está disponible, la consulta de datos no funcionará. El portal SSR no utiliza `db.json` de React ni una base de datos independiente.
