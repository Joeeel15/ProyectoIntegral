<script setup>
import { computed } from 'vue';
const props = defineProps({ seleccion: { type: Object, required: true } });
const emit = defineEmits(['cerrar']);
const etiquetas = { libre: 'Libre', pendiente: 'Pendiente', ocupada: 'Ocupada', no_disponible: 'No disponible' };
const estado = computed(() => etiquetas[props.seleccion.celda.estado] || props.seleccion.celda.estado);
</script>

<template>
  <div class="detalle-fondo" @click.self="emit('cerrar')">
    <section class="detalle-panel" role="dialog" aria-modal="true" aria-labelledby="titulo-detalle">
      <div class="detalle-encabezado">
        <div>
          <p class="eyebrow">Detalle de horario</p>
          <h2 id="titulo-detalle">{{ seleccion.medico.nombre }}</h2>
        </div>
        <button type="button" class="boton-cerrar" aria-label="Cerrar detalle" @click="emit('cerrar')">×</button>
      </div>
      <p class="detalle-especialidad">{{ seleccion.medico.especialidad }} · {{ seleccion.medico.sede }}</p>
      <dl class="detalle-lista">
        <div><dt>Fecha</dt><dd>{{ seleccion.celda.fecha }}</dd></div>
        <div><dt>Horario</dt><dd>{{ seleccion.celda.inicio }} – {{ seleccion.celda.fin }}</dd></div>
        <div><dt>Consultorio</dt><dd>{{ seleccion.medico.consultorio }}</dd></div>
        <div><dt>Disponibilidad</dt><dd><span class="etiqueta-estado" :class="`estado--${seleccion.celda.estado}`">{{ estado }}</span></dd></div>
      </dl>
      <p v-if="seleccion.celda.estado === 'pendiente'" class="detalle-ayuda">
        Existe una solicitud pendiente de aprobación para este intervalo.
      </p>
      <p v-else-if="seleccion.celda.estado === 'ocupada'" class="detalle-ayuda">
        Este intervalo ya está ocupado por una cita confirmada o registrada.
      </p>
      <p v-else-if="seleccion.celda.estado === 'no_disponible'" class="detalle-ayuda">
        El médico no atiende en este intervalo o se encuentra inactivo.
      </p>
      <p v-else class="detalle-ayuda">El intervalo no tiene citas que bloqueen el horario.</p>
      <p class="nota-privacidad">Por privacidad, el kiosco no muestra información de estudiantes ni pacientes.</p>
      <button type="button" class="boton boton-primario detalle-accion" @click="emit('cerrar')">Entendido</button>
    </section>
  </div>
</template>
