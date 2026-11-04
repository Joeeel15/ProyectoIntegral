
import { test } from "node:test";
import assert from "node:assert/strict";

// Importar validadores
import {
    esCorreoUTP,
    esCodigoAlumno,
    esHora,
    esFecha,
    validarCorreoUTP
} from "./validadores.js";

// Importar modelos
import {
    Usuario,
    Laboratorio,
    Reserva
} from "./modelos.js";

// Importar estadísticas
import {
    contarReservasPorEstado,
    calcularOcupacionPorLaboratorio,
    obtenerSedesUnicas,
    obtenerRankingLaboratorios,
    crearGeneradorCodigos
} from "./estadisticas.js";

// ==========================================
// PRUEBAS DE VALIDADORES
// ==========================================

test("1. Debe aceptar el correo institucional que coincide con el codigo", () => {
    assert.equal(
        esCorreoUTP("U12345678@utp.edu.pe", "U12345678"),
        true
    );
});

test("2. Debe rechazar correos que no tengan el formato institucional", () => {
    assert.equal(esCorreoUTP("alumno@gmail.com", "U12345678"), false);
    assert.equal(esCorreoUTP("alumno@utp.edu.pe", "U12345678"), false);
});

test("3. Debe aceptar un código de alumno válido", () => {
    assert.equal(esCodigoAlumno("U20231234"), true);
});

test("4. Debe rechazar un código de alumno inválido", () => {
    assert.equal(esCodigoAlumno("A20231234"), false);
});

test("5. Debe rechazar un correo que no coincida con el codigo del estudiante", () => {
    assert.equal(
        esCorreoUTP("U87654321@utp.edu.pe", "U12345678"),
        false
    );
});

test("6. Debe validar correctamente las horas", () => {
    assert.equal(esHora("08:30"), true);
    assert.equal(esHora("25:70"), false);
});

test("7. Debe validar fechas reales en formato AAAA-MM-DD", () => {
    assert.equal(esFecha("2026-11-20"), true);
    assert.equal(esFecha("2026-02-30"), false);
});

test("8. Debe generar un mensaje de error para un correo incorrecto", () => {
    const mensaje = validarCorreoUTP(
        "alumno@gmail.com",
        "U12345678"
    );

    assert.ok(mensaje.includes("no es válido"));
});

// ==========================================
// PRUEBAS DE MODELOS
// ==========================================

test("8. Debe crear correctamente un usuario administrador", () => {
    const usuario = new Usuario({
        id: 1,
        nombre: "Ana Torres",
        correo: "ana@utp.edu.pe",
        codigo: "U20231234",
        rol: "admin",
        password: "admin123"
    });

    assert.equal(usuario.nombre, "Ana Torres");
    assert.equal(usuario.esAdministrador(), true);
});

test("9. Debe comprobar la disponibilidad de un laboratorio", () => {
    const laboratorio = new Laboratorio({
        id: 1,
        nombre: "Laboratorio A-301",
        sede: "Lima Centro",
        capacidad: 30,
        equipos: ["PC i7", "Proyector"],
        estado: "disponible"
    });

    assert.equal(laboratorio.estaDisponible(), true);
});

test("10. Debe calcular la duración de una reserva", () => {
    const reserva = new Reserva({
        laboratorioId: 1,
        fecha: "2026-11-20",
        horaInicio: "08:00",
        horaFin: "11:00"
    });

    assert.equal(reserva.duracionHoras(), 3);
});

test("11. Debe detectar el cruce de dos reservas", () => {
    const reserva1 = new Reserva({
        laboratorioId: 1,
        fecha: "2026-11-20",
        horaInicio: "08:00",
        horaFin: "10:00"
    });

    const reserva2 = new Reserva({
        laboratorioId: 1,
        fecha: "2026-11-20",
        horaInicio: "09:00",
        horaFin: "11:00"
    });

    assert.equal(reserva1.seCruzaCon(reserva2), true);
});

// ==========================================
// PRUEBAS DE ESTADISTICAS
// ==========================================

test("12. Debe contar reservas, calcular ocupación, obtener sedes, ranking y códigos", () => {

    const reservas = [
        { laboratorioId: 1, estado: "aprobada" },
        { laboratorioId: 1, estado: "pendiente" },
        { laboratorioId: 2, estado: "rechazada" },
        { laboratorioId: 1, estado: "aprobada" }
    ];

    const laboratorios = [
        { id: 1, nombre: "Lab A-301", sede: "Lima Centro" },
        { id: 2, nombre: "Lab B-205", sede: "Lima Sur" },
        { id: 3, nombre: "Lab C-101", sede: "Lima Centro" }
    ];

    // Comprobar reduce
    const conteo = contarReservasPorEstado(reservas);

    assert.deepEqual(conteo, {
        pendiente: 1,
        aprobada: 2,
        rechazada: 1
    });

    // Comprobar Map
    const ocupacion = calcularOcupacionPorLaboratorio(reservas);

    assert.equal(ocupacion.get(1), 3);
    assert.equal(ocupacion.get(2), 1);

    // Comprobar Set
    const sedes = obtenerSedesUnicas(laboratorios);

    assert.deepEqual(sedes, ["Lima Centro", "Lima Sur"]);

    // Comprobar ranking
    const ranking = obtenerRankingLaboratorios(
        laboratorios,
        reservas
    );

    assert.equal(ranking[0].id, 1);
    assert.equal(ranking[0].totalReservas, 3);

    // Comprobar closure y padStart
    const generarCodigo = crearGeneradorCodigos();

    assert.equal(generarCodigo(), "RES-0001");
    assert.equal(generarCodigo(), "RES-0002");
    assert.equal(generarCodigo(), "RES-0003");
});
