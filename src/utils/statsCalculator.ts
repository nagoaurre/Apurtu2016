import { Equipo, Jugador, Jornada, EstadisticaPorJugadorPorJornada, Posicion } from "../types";

export interface BaseJugador {
  dorsal: number;
  nombre: string;
  posicion: Posicion;
}

export function calcularEstadisticasJugadores(
  baseJugadores: BaseJugador[],
  jornadas: Jornada[],
  estadisticasMatch: EstadisticaPorJugadorPorJornada[],
  duracionPartido: number
): Jugador[] {
  const jugadoresCalculados: Jugador[] = baseJugadores.map((bj) => {
    // Filtrar estadísticas de este jugador
    const statsJugador = estadisticasMatch.filter((s) => s.jugadorDorsal === bj.dorsal);

    const convocatorias = statsJugador.filter((s) => s.convocado).length;
    const ausencias = statsJugador.filter((s) => s.ausente).length;
    
    const divisorConv = (convocatorias + ausencias) || 1;
    const porcentajeConvocado = Math.round((convocatorias / divisorConv) * 100);

    const titularidades = statsJugador.filter((s) => s.convocado && s.titular).length;
    const suplencias = statsJugador.filter((s) => s.convocado && s.suplente).length;

    const divisorTit = convocatorias || 1;
    const porcentajeTitular = Math.round((titularidades / divisorTit) * 100);
    const porcentajeSuplente = Math.round((suplencias / divisorTit) * 100);

    const minutosPosibles = convocatorias * duracionPartido;
    const minutosJugados = statsJugador.reduce((sum, s) => sum + (s.minutos || 0), 0);
    
    const divisorMin = minutosPosibles || 1;
    const porcentajeMinutos = Math.round((minutosJugados / divisorMin) * 100);

    const goles = statsJugador.reduce((sum, s) => sum + (s.goles || 0), 0);
    const asistencias = statsJugador.reduce((sum, s) => sum + (s.asistencias || 0), 0);
    const tarjetasAmarillas = statsJugador.reduce((sum, s) => sum + (s.tarjetasAmarillas || 0), 0);
    const tarjetasRojas = statsJugador.reduce((sum, s) => sum + (s.tarjetasRojas || 0), 0);
    const puntos = statsJugador.reduce((sum, s) => sum + (s.puntos || 0), 0);

    const divisorPartidos = convocatorias || 1;
    const golesPorPartido = parseFloat((goles / divisorPartidos).toFixed(2));
    const asistenciasPorPartido = parseFloat((asistencias / divisorPartidos).toFixed(2));

    return {
      dorsal: bj.dorsal,
      nombre: bj.nombre,
      posicion: bj.posicion,
      convocatorias,
      ausencias,
      porcentajeConvocado,
      titularidades,
      suplencias,
      porcentajeTitular,
      porcentajeSuplente,
      minutosPosibles,
      minutosJugados,
      porcentajeMinutos,
      goles,
      asistencias,
      tarjetasAmarillas,
      tarjetasRojas,
      puntos,
      golesPorPartido,
      asistenciasPorPartido,
    };
  });

  return jugadoresCalculados;
}

export function obtenerEstadisticasEquipo(
  jornadas: Jornada[],
  jugadores: Jugador[],
  duracionPartido: number
) {
  const partidosJugados = jornadas.filter((j) => {
    // Si tiene un resultado final, se considera jugado
    return j.resultadoFinal && j.resultadoFinal.trim() !== "";
  }).length;

  let victorias = 0;
  let empates = 0;
  let derrotas = 0;
  let golesFavor = 0;
  let golesContra = 0;

  jornadas.forEach((j) => {
    if (j.resultadoFinal && j.resultadoFinal.trim() !== "") {
      golesFavor += j.golesFavor;
      golesContra += j.golesContra;
      if (j.golesFavor > j.golesContra) {
        victorias++;
      } else if (j.golesFavor === j.golesContra) {
        empates++;
      } else {
        derrotas++;
      }
    }
  });

  const diferenciaGoles = golesFavor - golesContra;
  const promedioGolesFavor = partidosJugados ? parseFloat((golesFavor / partidosJugados).toFixed(2)) : 0;
  const promedioGolesContra = partidosJugados ? parseFloat((golesContra / partidosJugados).toFixed(2)) : 0;

  const totalMinutosJugados = jugadores.reduce((sum, p) => sum + p.minutosJugados, 0);

  // Jugadores destacados
  let jugadorMasMinutos = "-";
  let maxMinutosVal = -1;
  let maxGoleador = "-";
  let maxGolesVal = -1;
  let maxAsistencias = "-";
  let maxAsistenciasVal = -1;
  let maxTitularidades = "-";
  let maxTitularidadesVal = -1;
  let mejorPorcentajeMinutos = "-";
  let mejorPorcMinVal = -1;

  jugadores.forEach((p) => {
    if (p.minutosJugados > maxMinutosVal) {
      maxMinutosVal = p.minutosJugados;
      jugadorMasMinutos = `${p.nombre} (${p.minutosJugados}')`;
    }
    if (p.goles > maxGolesVal) {
      maxGolesVal = p.goles;
      maxGoleador = `${p.nombre} (${p.goles})`;
    }
    if (p.asistencias > maxAsistenciasVal) {
      maxAsistenciasVal = p.asistencias;
      maxAsistencias = `${p.nombre} (${p.asistencias})`;
    }
    if (p.titularidades > maxTitularidadesVal) {
      maxTitularidadesVal = p.titularidades;
      maxTitularidades = `${p.nombre} (${p.titularidades})`;
    }
    if (p.porcentajeMinutos > mejorPorcMinVal) {
      mejorPorcMinVal = p.porcentajeMinutos;
      mejorPorcentajeMinutos = `${p.nombre} (${p.porcentajeMinutos}%)`;
    }
  });

  const totalAmarillas = jugadores.reduce((sum, p) => sum + p.tarjetasAmarillas, 0);
  const totalRojas = jugadores.reduce((sum, p) => sum + p.tarjetasRojas, 0);

  return {
    partidosJugados,
    victorias,
    empates,
    derrotas,
    golesFavor,
    golesContra,
    diferenciaGoles,
    promedioGolesFavor,
    promedioGolesContra,
    totalMinutosJugados,
    jugadorMasMinutos,
    maxGoleador,
    maxAsistencias,
    maxTitularidades,
    mejorPorcentajeMinutos,
    totalAmarillas,
    totalRojas,
  };
}
