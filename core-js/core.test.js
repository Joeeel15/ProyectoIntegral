import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { Usuario, Medico, Cita } from "./modelos.js";

import {
  contarCitasPorEstado,
  calcularOcupacionPorMedico,
  obtenerRankingMedicos,
  crearGeneradorCodigos,
  obtenerSedesUnicas,
} from "./estadisticas.js";
import {
  esCorreoUTP,
  esCodigoAlumno,
  esHora,
  esFecha,
  validarFecha,
} from "./validadores.js";

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

  test("3. Usuario: Identifica al administrador y verifica su contraseña", () => {
    const usuario = new Usuario({
      id: "USR-001", nombre: "Administración", correo: "admin@utp.edu.pe",
      codigo: "ADM-001", rol: "admin", password: "clave123", sede: "Lima Norte",
    });
    assert.strictEqual(usuario.esAdministrador(), true);
    assert.strictEqual(usuario.verificarPassword("clave123"), true);
    assert.strictEqual(usuario.verificarPassword("incorrecta"), false);
  });

  test("4. duracionHoras: Calcula una hora y media como 1.5", () => {
    const cita = new Cita("CIT-0003", "MED-001", "USR-002", "2026-11-20", "09:15", "10:45");
    assert.strictEqual(cita.duracionHoras(), 1.5);
  });

  test("5. duracionHoras: Calcula 30 minutos como 0.5 horas", () => {
    const cita = new Cita("CIT-0004", "MED-001", "USR-002", "2026-11-20", "11:00", "11:30");
    assert.strictEqual(cita.duracionHoras(), 0.5);
  });

  // --- Pruebas de Regla de Negocio (seCruzaCon) ---

  test("6. seCruzaCon: Detecta coincidencia de horario para el mismo médico y fecha", () => {
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

  test("7. seCruzaCon: No hay cruce si una cita termina exactamente cuando empieza la otra", () => {
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

  test("8. seCruzaCon: No hay cruce si es el mismo médico pero en fechas distintas", () => {
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

  test("9. seCruzaCon: No hay cruce a la misma hora y fecha si son médicos distintos", () => {
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

  test("10. seCruzaCon: Lanza error si el argumento no es una instancia de Cita", () => {
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

  test("11. contarCitasPorEstado: Agrupa y cuenta correctamente por estado", () => {
    const citas = [
      { estado: "atendida" },
      { estado: "programada" },
      { estado: "atendida" },
    ];
    const resultado = contarCitasPorEstado(citas);
    assert.deepEqual(resultado, { atendida: 2, programada: 1 });
  });

  test("12. calcularOcupacionPorMedico: Suma correctamente las citas asignadas a cada médico", () => {
    const citas = [
      { medicoId: "MED-001" },
      { medicoId: "MED-002" },
      { medicoId: "MED-001" },
    ];
    const resultado = calcularOcupacionPorMedico(citas);
    assert.ok(resultado instanceof Map);
    assert.deepEqual([...resultado], [["MED-001", 2], ["MED-002", 1]]);
  });

  test("13. obtenerRankingMedicos: Ordena el arreglo de médicos de mayor a menor ocupación", () => {
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

  test("14. obtenerSedesUnicas: Utiliza Set y elimina sedes repetidas", () => {
    const medicos = [{ sede: "Lima Norte" }, { sede: "Lima Sur" }, { sede: "Lima Norte" }];
    assert.deepEqual(obtenerSedesUnicas(medicos), ["Lima Norte", "Lima Sur"]);
  });

  test("15. Estadísticas: Los arreglos vacíos generan un Map y un ranking vacíos", () => {
    assert.deepEqual(calcularOcupacionPorMedico([]), new Map());
    assert.deepEqual(obtenerRankingMedicos([]), []);
  });

  // --- Pruebas de Validadores ---

  test("16. esCodigoAlumno: Exige U seguida de ocho dígitos", () => {
    assert.strictEqual(esCodigoAlumno("U12345678"), true);
    assert.strictEqual(esCodigoAlumno("U1234567"), false);
    assert.strictEqual(esCodigoAlumno("A12345678"), false);
  });

  test("17. esCorreoUTP: Valida formato y coincidencia con el código", () => {
    assert.strictEqual(esCorreoUTP("U12345678@utp.edu.pe", "U12345678"), true);
    assert.strictEqual(esCorreoUTP("U12345678@utp.edu.pe", "U87654321"), false);
    assert.strictEqual(esCorreoUTP("otro@gmail.com"), false);
  });

  test("18. esHora: Solo acepta HH:mm en formato de 24 horas", () => {
    assert.strictEqual(esHora("00:00"), true);
    assert.strictEqual(esHora("23:59"), true);
    assert.strictEqual(esHora("24:00"), false);
    assert.strictEqual(esHora("9:30"), false);
  });

  test("19. esFecha: Verifica fechas existentes y años bisiestos", () => {
    assert.strictEqual(esFecha("2028-02-29"), true);
    assert.strictEqual(esFecha("2027-02-29"), false);
    assert.strictEqual(esFecha("2026-13-01"), false);
    assert.strictEqual(esFecha("2026/11/20"), false);
    assert.match(validarFecha("2027-02-29"), /no es válida/);
    assert.strictEqual(validarFecha("2028-02-29"), null);
  });

  // --- Prueba de Utilidades ---

  test("20. crearGeneradorCodigos: Emite prefijos CIT- correlativos con padding", () => {
    const generar = crearGeneradorCodigos();
    assert.strictEqual(generar(), "CIT-0001");
    assert.strictEqual(generar(), "CIT-0002");
    assert.strictEqual(generar(), "CIT-0003");
  });
});
