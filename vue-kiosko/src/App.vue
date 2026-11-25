<script setup>
import { computed, ref } from 'vue';
import GrillaDisponibilidad from './components/GrillaDisponibilidad.vue';
import DetalleCelda from './components/DetalleCelda.vue';
import { useDisponibilidad } from './composables/useDisponibilidad.js';
import { construirGrilla } from './utils/grilla.js';

function fechaLocal() {
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

const fecha = ref(fechaLocal());
const sede = ref('');
const seleccion = ref(null);
const { medicos, citas, cargando, actualizando, error, ultimaActualizacion, actualizar } = useDisponibilidad();
const sedes = computed(() => [...new Set(medicos.value.map((m) => m.sede))].sort());
const medicosFiltrados = computed(() => sede.value
  ? medicos.value.filter((m) => m.sede === sede.value)
  : medicos.value);
const grilla = computed(() => construirGrilla({ medicos: medicosFiltrados.value, citas: citas.value, fecha: fecha.value }));
const totales = computed(() => grilla.value.filas.flatMap((f) => f.celdas).reduce((acc, celda) => {
  acc[celda.estado] += 1;
  return acc;
}, { libre: 0, pendiente: 0, ocupada: 0, no_disponible: 0 }));
</script>

<template>
  <div class="pagina">
    <header class="encabezado">
      <div class="encabezado-interior">
        <div class="marca"><span class="logo">✚</span><span>Medi<span class="marca-acento">Turno</span></span></div>
        <span class="identificador">Kiosco de disponibilidad · Vue 3</span>
      </div>
    </header>

    <main class="contenedor">
      <div class="presentacion">
        <div>
          <p class="eyebrow">Horarios médicos</p>
          <h1>Encuentra un horario disponible</h1>
          <p class="subtitulo">Consulta la disponibilidad por médico, sede y fecha. Los datos se actualizan automáticamente cada 30 segundos.</p>
        </div>
        <div class="actualizacion">
          <span class="indicador" :class="{ 'indicador--error': error }"></span>
          <span v-if="ultimaActualizacion">Actualizado: {{ ultimaActualizacion.toLocaleTimeString('es-PE') }}</span>
          <span v-else>Esperando la API</span>
        </div>
      </div>

      <section class="filtros" aria-label="Filtros de disponibilidad">
        <label class="control"><span>Sede</span>
          <select v-model="sede">
            <option value="">Todas las sedes</option>
            <option v-for="valor in sedes" :key="valor" :value="valor">{{ valor }}</option>
          </select>
        </label>
        <label class="control"><span>Fecha</span><input v-model="fecha" type="date" /></label>
        <button type="button" class="boton boton-secundario" :disabled="actualizando" @click="actualizar({ mostrarCarga: false })">
          {{ actualizando ? 'Actualizando…' : 'Actualizar ahora' }}
        </button>
      </section>

      <p v-if="error" class="mensaje mensaje--error" role="alert">{{ error }} Los últimos datos cargados se conservan.</p>
      <p v-if="cargando" class="mensaje" role="status">Cargando médicos y citas desde la API…</p>

      <template v-else>
        <section class="estadisticas" aria-label="Resumen de intervalos">
          <div class="estadistica"><span>Libre</span><strong>{{ totales.libre }}</strong><i class="color-libre"></i></div>
          <div class="estadistica"><span>Pendiente</span><strong>{{ totales.pendiente }}</strong><i class="color-pendiente"></i></div>
          <div class="estadistica"><span>Ocupada</span><strong>{{ totales.ocupada }}</strong><i class="color-ocupada"></i></div>
          <div class="estadistica"><span>No disponible</span><strong>{{ totales.no_disponible }}</strong><i class="color-no-disponible"></i></div>
        </section>

        <section class="grilla-seccion" aria-label="Disponibilidad por médico y hora">
          <div class="grilla-titulo">
            <div><h2>Disponibilidad por médico</h2><p>Bloques de 30 minutos · 07:00 a 22:00</p></div>
            <span class="conteo-medicos">{{ medicosFiltrados.length }} médicos</span>
          </div>
          <div v-if="medicosFiltrados.length === 0" class="mensaje">
            No hay médicos para la sede seleccionada.
          </div>
          <GrillaDisponibilidad v-else :horas="grilla.horas" :filas="grilla.filas" @seleccionar="seleccion = $event" />
          <p class="ayuda-grilla">Desplázate horizontalmente para ver todos los horarios. Pulsa una celda para conocer su estado.</p>
        </section>
      </template>
      <footer class="pie">MediTurno · Consulta pública de disponibilidad · Sin datos personales</footer>
    </main>
    <DetalleCelda v-if="seleccion" :seleccion="seleccion" @cerrar="seleccion = null" />
  </div>
</template>
