import { Posicion } from "../types";
import { BaseJugador } from "../utils/statsCalculator";
import { Jornada, EstadisticaPorJugadorPorJornada, Equipo } from "../types";

export const SEED_EQUIPO: Equipo = {
  entrenador: "Asier & Gaizka",
  equipo: "Apurtuarte Benjamín 2016",
  temporada: "2025-2026",
  duracionPartido: 40, // 2 tiempos de 20 min (Benjamin F7)
  jornadasAJugar: 26,
  minutosTotales: 600, // 15 jornadas * 40 min posibles
};

export const SEED_BASE_JUGADORES: BaseJugador[] = [
  { dorsal: 1, nombre: "Ander", posicion: Posicion.Portero },
  { dorsal: 2, nombre: "Unai", posicion: Posicion.Defensa },
  { dorsal: 3, nombre: "Aritz", posicion: Posicion.Defensa },
  { dorsal: 4, nombre: "Iker", posicion: Posicion.Defensa },
  { dorsal: 5, nombre: "Oier", posicion: Posicion.Medio },
  { dorsal: 6, nombre: "Jon", posicion: Posicion.Medio },
  { dorsal: 7, nombre: "Mikel", posicion: Posicion.Extremo },
  { dorsal: 8, nombre: "Julen", posicion: Posicion.Medio },
  { dorsal: 9, nombre: "Markel", posicion: Posicion.Extremo },
  { dorsal: 10, nombre: "Ekain", posicion: Posicion.Delantero },
  { dorsal: 11, nombre: "Ibai", posicion: Posicion.Delantero },
];

export const SEED_JORNADAS: Jornada[] = [
  {
    numeroJornada: 1,
    fecha: "2025-10-04",
    hora: "10:30",
    rival: "Retuerto Sport",
    localVisitante: "Local",
    resultadoDescanso: "1-0",
    resultadoFinal: "3-1",
    golesFavor: 3,
    golesContra: 1,
  },
  {
    numeroJornada: 2,
    fecha: "2025-10-11",
    hora: "11:15",
    rival: "Danok Bat",
    localVisitante: "Visitante",
    resultadoDescanso: "1-2",
    resultadoFinal: "2-4",
    golesFavor: 2,
    golesContra: 4,
  },
  {
    numeroJornada: 3,
    fecha: "2025-10-18",
    hora: "09:45",
    rival: "Sestao River",
    localVisitante: "Local",
    resultadoDescanso: "2-1",
    resultadoFinal: "5-2",
    golesFavor: 5,
    golesContra: 2,
  },
  {
    numeroJornada: 4,
    fecha: "2025-10-25",
    hora: "12:00",
    rival: "Santutxu",
    localVisitante: "Visitante",
    resultadoDescanso: "2-2",
    resultadoFinal: "3-3",
    golesFavor: 3,
    golesContra: 3,
  },
  {
    numeroJornada: 5,
    fecha: "2025-11-08",
    hora: "10:15",
    rival: "Erandio Club",
    localVisitante: "Local",
    resultadoDescanso: "2-0",
    resultadoFinal: "4-1",
    golesFavor: 4,
    golesContra: 1,
  },
  {
    numeroJornada: 6,
    fecha: "2025-11-15",
    hora: "11:00",
    rival: "Galea",
    localVisitante: "Visitante",
    resultadoDescanso: "1-1",
    resultadoFinal: "2-1",
    golesFavor: 2,
    golesContra: 1,
  },
  {
    numeroJornada: 7,
    fecha: "2025-11-22",
    hora: "10:00",
    rival: "Getxo",
    localVisitante: "Local",
    resultadoDescanso: "1-0",
    resultadoFinal: "3-0",
    golesFavor: 3,
    golesContra: 0,
  },
  {
    numeroJornada: 8,
    fecha: "2025-11-29",
    hora: "13:00",
    rival: "Arenas Club",
    localVisitante: "Visitante",
    resultadoDescanso: "0-2",
    resultadoFinal: "1-3",
    golesFavor: 1,
    golesContra: 3,
  },
  {
    numeroJornada: 9,
    fecha: "2025-12-13",
    hora: "10:30",
    rival: "Leioa",
    localVisitante: "Local",
    resultadoDescanso: "2-1",
    resultadoFinal: "4-2",
    golesFavor: 4,
    golesContra: 2,
  },
  {
    numeroJornada: 10,
    fecha: "2025-12-20",
    hora: "11:45",
    rival: "Portugalete",
    localVisitante: "Visitante",
    resultadoDescanso: "1-1",
    resultadoFinal: "2-2",
    golesFavor: 2,
    golesContra: 2,
  },
  {
    numeroJornada: 11,
    fecha: "2026-01-10",
    hora: "09:30",
    rival: "Barakaldo",
    localVisitante: "Local",
    resultadoDescanso: "2-0",
    resultadoFinal: "3-1",
    golesFavor: 3,
    golesContra: 1,
  },
  {
    numeroJornada: 12,
    fecha: "2026-01-17",
    hora: "12:15",
    rival: "Sodupe",
    localVisitante: "Visitante",
    resultadoDescanso: "3-0",
    resultadoFinal: "6-1",
    golesFavor: 6,
    golesContra: 1,
  },
  {
    numeroJornada: 13,
    fecha: "2026-01-24",
    hora: "10:30",
    rival: "Indautxu",
    localVisitante: "Local",
    resultadoDescanso: "1-2",
    resultadoFinal: "2-3",
    golesFavor: 2,
    golesContra: 3,
  },
  {
    numeroJornada: 14,
    fecha: "2026-02-07",
    hora: "11:15",
    rival: "Kaskagorri",
    localVisitante: "Visitante",
    resultadoDescanso: "2-1",
    resultadoFinal: "4-2",
    golesFavor: 4,
    golesContra: 2,
  },
  {
    numeroJornada: 15,
    fecha: "2026-02-14",
    hora: "10:00",
    rival: "Gernika",
    localVisitante: "Local",
    resultadoDescanso: "1-0",
    resultadoFinal: "3-0",
    golesFavor: 3,
    golesContra: 0,
  },
];

// Generar una base de participación realista para 15 jornadas
function generarEstadisticasDefault(): EstadisticaPorJugadorPorJornada[] {
  const stats: EstadisticaPorJugadorPorJornada[] = [];

  // Mapeamos rendimientos fijos para que sea sumamente coherente:
  // Ander (GK) juega siempre entero si está convocado. Unai, Aritz, Iker rotan defensas.
  // Jon, Oier, Julen rotan medios. Mikel, Markel rotan extremos. Ekain, Ibai rotan delanteros.

  const totalJornadas = 15;

  for (let j = 1; j <= totalJornadas; j++) {
    const esVictoria = [1, 3, 5, 6, 7, 9, 11, 12, 14, 15].includes(j);
    const esEmpate = [4, 10].includes(j);
    
    SEED_BASE_JUGADORES.forEach((p) => {
      // 1. Ausencias aleatorias leves (familias en base)
      let ausente = false;
      if (p.dorsal === 3 && j === 4) ausente = true; // Aritz se ausentó en J4
      if (p.dorsal === 8 && j === 8) ausente = true; // Julen estuvo de viaje en J8
      if (p.dorsal === 11 && j === 12) ausente = true; // Ibai se constipó en J12
      
      const convocado = !ausente;
      
      if (ausente) {
        stats.push({
          jugadorDorsal: p.dorsal,
          jornadaNumero: j,
          convocado: false,
          ausente: true,
          titular: false,
          suplente: false,
          minutos: 0,
          goles: 0,
          asistencias: 0,
          tarjetasAmarillas: 0,
          tarjetasRojas: 0,
          puntos: 1, // puntos por participar de forma pasiva / asistencia
        });
        return;
      }

      // Establecer titularidad (7 titulares por jornada en Fútbol 7)
      let titular = false;
      // Regla de titularidades según dorsal y jornada
      if (p.posicion === Posicion.Portero) {
        // Ander es portero, juega siempre titular 40 min
        titular = true;
      } else if (p.posicion === Posicion.Defensa) {
        // De los 3 defensas (2, 3, 4), juegan 2 de inicio.
        if (p.dorsal === 2) titular = (j % 3 !== 0);
        if (p.dorsal === 3) titular = (j % 3 !== 1);
        if (p.dorsal === 4) titular = (j % 3 !== 2);
      } else if (p.posicion === Posicion.Medio) {
        // De los 3 medios (5, 6, 8), juegan 2 de inicio.
        if (p.dorsal === 5) titular = (j % 2 === 0);
        if (p.dorsal === 6) titular = (j % 2 === 1);
        if (p.dorsal === 8) titular = (j % 3 !== 2);
      } else if (p.posicion === Posicion.Extremo) {
        // De los 2 extremos (7, 9), juega 1 titular.
        if (p.dorsal === 7) titular = (j % 2 === 0);
        if (p.dorsal === 9) titular = (j % 2 === 1);
      } else if (p.posicion === Posicion.Delantero) {
        // De los 2 delanteros (10, 11), juega 1 de inicio.
        if (p.dorsal === 10) titular = (j % 2 === 1);
        if (p.dorsal === 11) titular = (j % 2 === 0);
      }

      const suplente = !titular;

      // Calcular minutos de juego (F7 Benjamin, cambios ilimitados, rotaciones constantes)
      let minutos = 20; // base para suplente
      if (p.posicion === Posicion.Portero) {
        minutos = 40;
      } else if (titular) {
        minutos = 28 + (j % 5); // 28 a 32 minutos
      } else {
        minutos = 12 + (j % 4); // 12 a 15 minutos
      }

      // Goles y asistencias coherentes con el resultado de la jornada
      let goles = 0;
      let asistencias = 0;

      const jObj = SEED_JORNADAS.find((item) => item.numeroJornada === j);
      const golesTotalesFavor = jObj ? jObj.golesFavor : 0;

      // Asignar goles según posición y probabilidad
      if (golesTotalesFavor > 0) {
        if (p.posicion === Posicion.Delantero) {
          // Delanteros marcan mucho
          if (p.dorsal === 10 && j % 3 === 0) goles = 1;
          if (p.dorsal === 10 && j === 12) goles = 2; // Hat-trick secundario
          if (p.dorsal === 11 && j % 3 === 1) goles = 1;
          if (p.dorsal === 11 && j === 14) goles = 2;
        } else if (p.posicion === Posicion.Extremo) {
          if (p.dorsal === 9 && j % 4 === 1) goles = 1;
          if (p.dorsal === 7 && j % 4 === 2) goles = 1;
        } else if (p.posicion === Posicion.Medio) {
          if (p.dorsal === 6 && j === 3) goles = 1;
          if (p.dorsal === 8 && j === 5) goles = 1;
          if (p.dorsal === 5 && j === 12) goles = 1;
        } else if (p.posicion === Posicion.Defensa) {
          if (p.dorsal === 4 && j === 1) goles = 1; // Un gol de corner
        }
      }

      // Asistencias
      if (golesTotalesFavor > 0) {
        if (p.posicion === Posicion.Extremo) {
          if (p.dorsal === 7 && j % 3 === 0) asistencias = 1;
          if (p.dorsal === 9 && j % 3 === 1) asistencias = 1;
          if (p.dorsal === 9 && j === 12) asistencias = 2;
        } else if (p.posicion === Posicion.Medio) {
          if (p.dorsal === 6 && j % 4 === 0) asistencias = 1;
          if (p.dorsal === 8 && j % 4 === 1) asistencias = 1;
          if (p.dorsal === 5 && j % 4 === 2) asistencias = 1;
        } else if (p.posicion === Posicion.Delantero) {
          if (p.dorsal === 10 && j % 5 === 1) asistencias = 1;
          if (p.dorsal === 11 && j % 5 === 2) asistencias = 1;
        }
      }

      // Tarjetas (pocas porque es Benjamin, pero algunas para mostrar)
      let amarillas = 0;
      let rojas = 0;
      if (p.dorsal === 4 && j === 8) amarillas = 1; // Tarjeta amarilla de Iker
      if (p.dorsal === 5 && j === 13) amarillas = 1; // Tarjeta amarilla de Oier

      // Puntos de rendimiento (fórmula escolar/fantasy: minutos, goles, asistencias, tarjetas, resultado)
      let puntos = Math.round(minutos / 10); // base por minutos (1-4 puntos)
      if (titular) puntos += 1;
      puntos += goles * 4;
      puntos += asistencias * 3;
      if (esVictoria) puntos += 3;
      if (esEmpate) puntos += 1;
      puntos -= amarillas * 2;

      stats.push({
        jugadorDorsal: p.dorsal,
        jornadaNumero: j,
        convocado,
        ausente,
        titular,
        suplente,
        minutos,
        goles,
        asistencias,
        tarjetasAmarillas: amarillas,
        tarjetasRojas: rojas,
        puntos: Math.max(1, puntos),
      });
    });
  }

  return stats;
}

export const SEED_ESTADISTICAS_MATCH = generarEstadisticasDefault();
