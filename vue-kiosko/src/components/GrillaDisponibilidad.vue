<script setup>
import CeldaHorario from './CeldaHorario.vue';

defineProps({
  horas: { type: Array, required: true },
  filas: { type: Array, required: true },
});
const emit = defineEmits(['seleccionar']);
</script>

<template>
  <div class="tabla-scroll" role="region" aria-label="Grilla de disponibilidad médica" tabindex="0">
    <table class="tabla-disponibilidad">
      <thead>
        <tr>
          <th class="col-medico" scope="col">Médico / hora</th>
          <th v-for="hora in horas" :key="hora.inicio" scope="col" class="col-hora">
            {{ hora.inicio }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="fila in filas" :key="fila.medico.id">
          <th class="col-medico" scope="row">
            <strong>{{ fila.medico.nombre }}</strong>
            <small>{{ fila.medico.especialidad }}</small>
            <small>{{ fila.medico.sede }}</small>
          </th>
          <td v-for="celda in fila.celdas" :key="celda.inicio">
            <CeldaHorario
              :medico="fila.medico"
              :celda="celda"
              @seleccionar="emit('seleccionar', $event)"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
