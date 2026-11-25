import { onMounted, onUnmounted, ref } from 'vue';
import { consultarDisponibilidad } from '../services/api.js';

export function useDisponibilidad() {
  const medicos = ref([]);
  const citas = ref([]);
  const cargando = ref(true);
  const actualizando = ref(false);
  const error = ref('');
  const ultimaActualizacion = ref(null);
  let intervalo = null;
  let controlador = null;
  let activo = true;

  async function actualizar({ mostrarCarga = false } = {}) {
    controlador?.abort();
    const actual = new AbortController();
    controlador = actual;
    if (mostrarCarga) cargando.value = true;
    actualizando.value = true;
    error.value = '';
    try {
      const datos = await consultarDisponibilidad(actual.signal);
      if (!activo || actual.signal.aborted) return;
      medicos.value = datos.medicos;
      citas.value = datos.citas;
      ultimaActualizacion.value = new Date();
    } catch (fallo) {
      if (!activo || actual.signal.aborted) return;
      error.value = fallo.message || 'No se pudo actualizar la disponibilidad.';
    } finally {
      if (activo && !actual.signal.aborted) {
        cargando.value = false;
        actualizando.value = false;
      }
    }
  }

  onMounted(() => {
    activo = true;
    actualizar({ mostrarCarga: true });
    intervalo = setInterval(() => actualizar(), 30_000);
  });

  onUnmounted(() => {
    activo = false;
    if (intervalo !== null) clearInterval(intervalo);
    controlador?.abort();
  });

  return { medicos, citas, cargando, actualizando, error, ultimaActualizacion, actualizar };
}
