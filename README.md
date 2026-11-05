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

### 1. Mock API (`api-mock`)
Levanta el servidor mock con los datos de prueba de `db.json`:

```bash
cd api-mock
npm install
npm start