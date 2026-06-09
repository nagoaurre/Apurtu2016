export enum Posicion {
  Portero = "Portero",
  Defensa = "Defensa",
  Medio = "Medio",
  Extremo = "Extremo",
  Delantero = "Delantero",
}

export interface Equipo {
  entrenador: string;
  equipo: string;
  temporada: string;
  duracionPartido: number; // en minutos, ej. 40 o 50
  jornadasAJugar: number;
  minutosTotales: number;
}

export interface Jugador {
  dorsal: number;
  nombre: string;
  posicion: Posicion;
  convocatorias: number;
  ausencias: number;
  porcentajeConvocado: number;
  titularidades: number;
  suplencias: number;
  porcentajeTitular: number;
  porcentajeSuplente: number;
  minutosPosibles: number;
  minutosJugados: number;
  porcentajeMinutos: number;
  goles: number;
  asistencias: number;
  tarjetasAmarillas: number;
  tarjetasRojas: number;
  puntos: number;
  golesPorPartido: number;
  asistenciasPorPartido: number;
}

export interface Jornada {
  numeroJornada: number;
  fecha: string;
  hora: string;
  rival: string;
  localVisitante: "Local" | "Visitante";
  resultadoDescanso: string; // ej. "1-0"
  resultadoFinal: string; // ej. "3-1"
  golesFavor: number;
  golesContra: number;
}

export interface EstadisticaPorJugadorPorJornada {
  jugadorDorsal: number;
  jornadaNumero: number;
  convocado: boolean;
  ausente: boolean;
  titular: boolean;
  suplente: boolean;
  minutos: number;
  goles: number;
  asistencias: number;
  tarjetasAmarillas: number;
  tarjetasRojas: number;
  puntos: number;
  golesEnContra?: number; // Para porteros
  penaltis?: number;
  faltas?: number;
}

export interface AppState {
  equipo: Equipo;
  jugadores: Jugador[];
  jornadas: Jornada[];
  estadisticasMatch: EstadisticaPorJugadorPorJornada[];
}
