
// ==========================================
// 1. CONTAR RESERVAS POR ESTADO CON REDUCE
// ==========================================

export const contarReservasPorEstado = (reservas) => {

    return reservas.reduce((contador, reserva) => {

        contador[reserva.estado] =
            (contador[reserva.estado] || 0) + 1;

        return contador;

    }, {
        pendiente: 0,
        aprobada: 0,
        rechazada: 0
    });
};

// ==========================================
// 2. OCUPACION POR LABORATORIO CON MAP
// ==========================================

export const calcularOcupacionPorLaboratorio = (reservas) => {

    const ocupacion = new Map();

    reservas.forEach((reserva) => {

        const id = reserva.laboratorioId;

        ocupacion.set(
            id,
            (ocupacion.get(id) || 0) + 1
        );

    });

    return ocupacion;
};

// ==========================================
// 3. OBTENER SEDES UNICAS CON SET
// ==========================================

export const obtenerSedesUnicas = (laboratorios) => {

    const sedes = new Set(
        laboratorios.map(laboratorio => laboratorio.sede)
    );

    return [...sedes];
};

// ==========================================
// 4. RANKING DE LABORATORIOS
//    UTILIZANDO SORT Y SPREAD
// ==========================================

export const obtenerRankingLaboratorios = (
    laboratorios,
    reservas
) => {

    const ocupacion = calcularOcupacionPorLaboratorio(reservas);

    const ranking = laboratorios.map((laboratorio) => ({
        ...laboratorio,
        totalReservas: ocupacion.get(laboratorio.id) || 0
    }));

    return [...ranking].sort(
        (a, b) => b.totalReservas - a.totalReservas
    );
};

// ==========================================
// 5. GENERADOR DE CODIGOS CON CLOSURE
// ==========================================

export const crearGeneradorCodigos = () => {

    let contador = 0;

    return () => {

        contador++;

        return `RES-${String(contador).padStart(4, "0")}`;

    };
};
