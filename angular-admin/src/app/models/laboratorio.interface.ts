export interface Laboratorio {
  id: number;
  nombre: string;
  sede: string;
  piso: number;
  capacidad: number;
  equipos: string[];
  estado: 'disponible' | 'mantenimiento';
  descripcion: string;
}
