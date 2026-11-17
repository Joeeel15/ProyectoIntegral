import axios from 'axios';
import { instalarInterceptorErrores } from './erroresAxios.js';

// Reutiliza la misma URL opcional que el servicio Fetch del Avance 3.
const baseURL = (import.meta.env?.VITE_API_URL || 'http://localhost:3000')
  .replace(/\/$/, '');

export const apiAxios = axios.create({
  baseURL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// La traducción del error se aplica automáticamente a todas las peticiones.
instalarInterceptorErrores(apiAxios);
