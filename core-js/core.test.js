import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { Medico, Cita } from "./modelos.js";

import {
  contarCitasPorEstado,
  calcularOcupacionPorMedico,
  obtenerRankingMedicos,
  crearGeneradorCodigos,
} from "./estadisticas.js";

describe("Pruebas del Sistema MediTurno", () => {
  // --- Pruebas de Modelos ---

  test("1. Debe instanciar un Medico con los atributos correctos, incluyendo sede y horarios", () => {
    const medico = new Medico(
      "MED-001",
      "Dra. Gómez",
      "Neurología",
      "204",
      "Lima Norte",
      ["lunes"],
      { horaInicio: "08:00", horaFin: "13:00" },
    );
    assert.strictEqual(medico.id, "MED-001");
    assert.strictEqual(medico.sede, "Lima Norte");
    assert.strictEqual(medico.horarioAtencion.horaInicio, "08:00");
  });

  test("2. Debe instanciar una Cita con los atributos correctos, incluyendo estudianteId", () => {
    const cita = new Cita(
      "CIT-0001",
      "MED-001",
      "USR-002",
      "2026-11-20",
      "11:00",
      "11:30",
    );
    assert.strictEqual(cita.medicoId, "MED-001");
    assert.strictEqual(cita.estudianteId, "USR-002");
    assert.strictEqual(cita.estado, "programada"); // Verifica el valor por defecto
  });

  // --- Pruebas de Regla de Negocio (seCruzaCon) ---

  test("3. seCruzaCon: Detecta coincidencia de horario para el mismo médico y fecha", () => {
    const cita1 = new Cita(
      "CIT-0001",
      "MED-001",
      "PAC-001",
      "2026-11-20",
      "09:00",
      "10:00",
    );
    const cita2 = new Cita(
      "CIT-0002",
      "MED-001",
      "PAC-002",
      "2026-11-20",
      "09:30",
      "10:30",
    );
    assert.strictEqual(cita1.seCruzaCon(cita2), true);
  });

  test("4. seCruzaCon: No hay cruce si una cita termina exactamente cuando empieza la otra", () => {
    const cita1 = new Cita(
      "CIT-0001",
      "MED-001",
      "PAC-001",
      "2026-11-20",
      "09:00",
      "10:00",
    );
    const cita2 = new Cita(
      "CIT-0002",
      "MED-001",
      "PAC-002",
      "2026-11-20",
      "10:00",
      "11:00",
    );
    assert.strictEqual(cita1.seCruzaCon(cita2), false);
  });

  test("5. seCruzaCon: No hay cruce si es el mismo médico pero en fechas distintas", () => {
    const cita1 = new Cita(
      "CIT-0001",
      "MED-001",
      "PAC-001",
      "2026-11-20",
      "09:00",
      "10:00",
    );
    const cita2 = new Cita(
      "CIT-0002",
      "MED-001",
      "PAC-002",
      "2026-11-21",
      "09:00",
      "10:00",
    );
    assert.strictEqual(cita1.seCruzaCon(cita2), false);
  });

  test("6. seCruzaCon: No hay cruce a la misma hora y fecha si son médicos distintos", () => {
    const cita1 = new Cita(
      "CIT-0001",
      "MED-001",
      "PAC-001",
      "2026-11-20",
      "09:00",
      "10:00",
    );
    const cita2 = new Cita(
      "CIT-0002",
      "MED-002",
      "PAC-002",
      "2026-11-20",
      "09:00",
      "10:00",
    );
    assert.strictEqual(cita1.seCruzaCon(cita2), false);
  });

  test("7. seCruzaCon: Lanza error si el argumento no es una instancia de Cita", () => {
    const cita1 = new Cita(
      "CIT-0001",
      "MED-001",
      "PAC-001",
      "2026-11-20",
      "09:00",
      "10:00",
    );
    const citaFalsa = {
      medicoId: "MED-001",
      fecha: "2026-11-20",
      horaInicio: "09:00",
      horaFin: "10:00",
    };

    assert.throws(() => cita1.seCruzaCon(citaFalsa), {
      message: "Debe comparar con otra instancia de Cita",
    });
  });

  // --- Pruebas de Estadísticas ---

  test("8. contarCitasPorEstado: Agrupa y cuenta correctamente por estado", () => {
    const citas = [
      { estado: "atendida" },
      { estado: "programada" },
      { estado: "atendida" },
    ];
    const resultado = contarCitasPorEstado(citas);
    assert.deepEqual(resultado, { atendida: 2, programada: 1 });
  });

  test("9. calcularOcupacionPorMedico: Suma correctamente las citas asignadas a cada médico", () => {
    const citas = [
      { medicoId: "MED-001" },
      { medicoId: "MED-002" },
      { medicoId: "MED-001" },
    ];
    const resultado = calcularOcupacionPorMedico(citas);
    assert.deepEqual(resultado, { "MED-001": 2, "MED-002": 1 });
  });

  test("10. obtenerRankingMedicos: Ordena el arreglo de médicos de mayor a menor ocupación", () => {
    const citas = [
      { medicoId: "MED-001" },
      { medicoId: "MED-002" },
      { medicoId: "MED-001" },
    ];
    const resultado = obtenerRankingMedicos(citas);
    assert.deepEqual(resultado, [
      { medicoId: "MED-001", cantidad: 2 },
      { medicoId: "MED-002", cantidad: 1 },
    ]);
  });

  // --- Prueba de Utilidades ---

  test("11. crearGeneradorCodigos: Emite prefijos CIT- correlativos con padding", () => {
    const generar = crearGeneradorCodigos();
    assert.strictEqual(generar(), "CIT-0001");
    assert.strictEqual(generar(), "CIT-0002");
    assert.strictEqual(generar(), "CIT-0003");
  });
});
