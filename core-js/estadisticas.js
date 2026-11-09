// ==========================================
// 1. CONTAR CITAS POR ESTADO CON REDUCE
// ==========================================

export function contarCitasPorEstado(citas) {
  return citas.reduce((acumulador, cita) => {
    const estado = cita.estado || "programada";

    acumulador[estado] = (acumulador[estado] || 0) + 1;

    return acumulador;
  }, {});
}


// ==========================================
// 2. OCUPACION POR MÉDICO CON MAP
// ==========================================

export function calcularOcupacionPorMedico(citas) {
  return citas.reduce((acumulador, cita) => {
    const id = cita.medicoId;

    acumulador[id] = (acumulador[id] || 0) + 1;

    return acumulador;
  }, {});
}


// ==========================================
// 3. OBTENER SEDES UNICAS CON SET
// ==========================================

export const obtenerSedesUnicas = (medicos) => {
  const sedes = new Set(medicos.map((medico) => medico.sede));

  return [...sedes];
};


// ==========================================
// 4. RANKING DE MÉDICOS
//    UTILIZANDO SORT Y SPREAD
// ==========================================

export function obtenerRankingMedicos(citas) {
  const ocupacion = calcularOcupacionPorMedico(citas);

  return Object.entries(ocupacion)

    .map(([medicoId, cantidad]) => ({ medicoId, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad);
}


// ==========================================
// 5. GENERADOR DE CODIGOS CON CLOSURE
// ==========================================

export function crearGeneradorCodigos() {
  let contador = 0;

  return function () {
    contador++;

    return `CIT-${String(contador).padStart(4, "0")}`;
  };
}
