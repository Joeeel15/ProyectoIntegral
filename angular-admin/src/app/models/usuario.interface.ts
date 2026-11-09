export type RolUsuario = 'admin' | 'estudiante';

export interface Usuario {
  id: string; // Ejemplo: USR-002
  nombre: string;
  correo: string;
  codigo: string;
  rol: RolUsuario;
  password: string; // Solo para el login simulado de los primeros avances
  sede: string | null; // Los administradores globales tienen sede: null
}
