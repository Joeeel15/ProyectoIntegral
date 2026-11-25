<script setup>
import { computed } from 'vue';

const props = defineProps({
  celda: { type: Object, required: true },
  medico: { type: Object, required: true },
});
const emit = defineEmits(['seleccionar']);
const etiquetas = { libre: 'Libre', pendiente: 'Pendiente', ocupada: 'Ocupada', no_disponible: 'No disponible' };
const etiqueta = computed(() => etiquetas[props.celda.estado] || props.celda.estado);
</script>

<template>
  <button
    class="celda"
    type="button"
    :class="`celda--${celda.estado}`"
    :title="`${medico.nombre}: ${celda.inicio}–${celda.fin} · ${etiqueta}`"
    :aria-label="`${medico.nombre}, ${celda.inicio} a ${celda.fin}, ${etiqueta}`"
    @click="emit('seleccionar', { medico, celda })"
  >
    <span class="punto" aria-hidden="true"></span>
    <span class="texto-celda">{{ etiqueta }}</span>
  </button>
</template>
