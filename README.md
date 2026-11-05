# CampusHub - Sistema de Gestión de Laboratorios

Plataforma modular para la administración, reserva y control de uso de laboratorios universitarios.

---

## Integrantes

* **Russell Manuel Espinoza Nateros**
* **Cristian Joel Astorayme Hurtado**

---

## Estructura del Repositorio

El proyecto está organizado en tres componentes principales:

* `core-js/`: Dominio central con reglas de negocio, modelos (Usuario, Laboratorio, Reserva) y validaciones de fechas u horarios.
* `api-mock/`: API REST mock basada en `json-server` con middleware para la simulación de persistencia y endpoints.
* `angular-admin/`: Frontend administrativo interactivo construido con Angular y Bootstrap.

---

## Requisitos Previos

* **Node.js**: `v18.x` o superior
* **npm**: `v9.x` o superior
* **Angular CLI**: `npm install -g @angular/cli`

---

## Instalación y Ejecución Local

### 1. Pruebas de la API Simulada

El proyecto incluye una colección de pruebas para validar los 5 métodos HTTP requeridos (`GET`, `GET por ID`, `POST`, `PATCH`, `DELETE`) de la rúbrica.

**Cómo ejecutar las pruebas desde el editor:**
1. Levanta el servidor local ubicándote en la carpeta de la API: 
   `cd api-mock && npm run api`
2. Abre el archivo `api-mock/pruebas-api.http` en VS Code.
3. Asegúrate de tener instalada la extensión **REST Client**.
4. Haz clic en el botón **Send Request** que aparece sobre cada petición para interactuar con la base de datos `db.json` y verificar los códigos de estado HTTP (200, 201, etc.).

### 2. Mock API (`api-mock`):
Levanta el servidor mock con los datos de prueba de `db.json`:

```bash
cd api-mock
npx npm install 
npx node server.js

---

### 3. Angular Front (`admin-angular`):
Levanta el servidor front de angular con la vista del administrador:

```bash
cd angular-admin
npx npm install
npx ng serve

### 4. Prueba de Test(`core.test.js`):

```bash
cd core-js
node --test