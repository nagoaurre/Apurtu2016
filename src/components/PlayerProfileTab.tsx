import React, { useState, useMemo } from "react";
import { AppState, Posicion, Jugador } from "../types";
import { 
  User, Award, Star, Activity, Goal, Calendar, Shield, Sparkles, 
  MapPin, CheckCircle, ChevronLeft, ChevronRight, BarChart
} from "lucide-react";

interface PlayerProfileTabProps {
  state: AppState;
  selectedPlayerDorsal: number | null;
  onSelectPlayer: (dorsal: number | null) => void;
}

export const PlayerProfileTab: React.FC<PlayerProfileTabProps> = ({ 
  state, 
  selectedPlayerDorsal, 
  onSelectPlayer 
}) => {
  const { jugadores, jornadas, estadisticasMatch, equipo } = state;
  const [searchQuery, setSearchQuery] = useState("");

  // Obtener jugador actual
  const actualDorsal = selectedPlayerDorsal || (jugadores[0]?.dorsal);
  const jugador = useMemo(() => {
    return jugadores.find((j) => j.dorsal === actualDorsal) || jugadores[0];
  }, [jugadores, actualDorsal]);

  // Filtrar lista lateral de jugadores
  const filteredPlayers = useMemo(() => {
    if (!searchQuery.trim()) return jugadores;
    const q = searchQuery.toLowerCase();
    return jugadores.filter((p) => 
      p.nombre.toLowerCase().includes(q) || 
      p.posicion.toLowerCase().includes(q)
    );
  }, [jugadores, searchQuery]);

  // Calcular moyennes/medias del equipo
  const mediasEquipo = useMemo(() => {
    const totalJugadores = jugadores.length || 1;
    return {
      goles: parseFloat((jugadores.reduce((sum, p) => sum + p.goles, 0) / totalJugadores).toFixed(2)),
      asistencias: parseFloat((jugadores.reduce((sum, p) => sum + p.asistencias, 0) / totalJugadores).toFixed(2)),
      minutos: parseFloat((jugadores.reduce((sum, p) => sum + p.minutosJugados, 0) / totalJugadores).toFixed(2)),
      puntos: parseFloat((jugadores.reduce((sum, p) => sum + p.puntos, 0) / totalJugadores).toFixed(2)),
    };
  }, [jugadores]);

  // Calcular rankings internos
  const rankings = useMemo(() => {
    if (!jugador) return { goles: 1, asistencias: 1, minutos: 1, puntos: 1 };
    
    const sortedGoles = [...jugadores].sort((a, b) => b.goles - a.goles);
    const sortedAsist = [...jugadores].sort((a, b) => b.asistencias - a.asistencias);
    const sortedMinutos = [...jugadores].sort((a, b) => b.minutosJugados - a.minutosJugados);
    const sortedPuntos = [...jugadores].sort((a, b) => b.puntos - a.puntos);

    return {
      goles: sortedGoles.findIndex((p) => p.dorsal === jugador.dorsal) + 1,
      asistencias: sortedAsist.findIndex((p) => p.dorsal === jugador.dorsal) + 1,
      minutos: sortedMinutos.findIndex((p) => p.dorsal === jugador.dorsal) + 1,
      puntos: sortedPuntos.findIndex((p) => p.dorsal === jugador.dorsal) + 1,
    };
  }, [jugadores, jugador]);

  // Historial jornada a jornada para el jugador
  const historialJornadas = useMemo(() => {
    if (!jugador) return [];
    return estadisticasMatch
      .filter((s) => s.jugadorDorsal === jugador.dorsal)
      .sort((a, b) => a.jornadaNumero - b.jornadaNumero)
      .map((stats) => {
        const jornada = jornadas.find((j) => j.numeroJornada === stats.jornadaNumero);
        return {
          jornadaNumero: stats.jornadaNumero,
          rival: jornada?.rival || `Jornada ${stats.jornadaNumero}`,
          resultadoFinal: jornada?.resultadoFinal || "",
          minutos: stats.minutos,
          goles: stats.goles,
          asistencias: stats.asistencias,
          ausente: stats.ausente,
          titular: stats.titular,
          suplente: stats.suplente,
          puntos: stats.puntos,
        };
      });
  }, [estadisticasMatch, jugador, jornadas]);

  if (!jugador) {
    return <div className="text-center p-8 text-slate-400">Cargando jugadores...</div>;
  }

  // Colores por posición
  const getColoresPosicion = (pos: Posicion) => {
    switch (pos) {
      case Posicion.Portero:
        return {
          bgBadge: "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-900",
          glow: "shadow-amber-500/10 border-amber-400",
          banner: "from-amber-600 via-yellow-500 to-amber-700",
          text: "text-amber-600",
          accentBg: "bg-amber-500/10"
        };
      case Posicion.Defensa:
        return {
          bgBadge: "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-900",
          glow: "shadow-blue-500/10 border-blue-400",
          banner: "from-blue-600 via-blue-500 to-indigo-700",
          text: "text-blue-600",
          accentBg: "bg-blue-500/10"
        };
      case Posicion.Medio:
        return {
          bgBadge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900",
          glow: "shadow-emerald-500/10 border-emerald-400",
          banner: "from-emerald-600 via-emerald-500 to-teal-700",
          text: "text-emerald-600",
          accentBg: "bg-emerald-500/10"
        };
      case Posicion.Extremo:
        return {
          bgBadge: "bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-400 border-purple-200 dark:border-purple-900",
          glow: "shadow-purple-500/10 border-purple-400",
          banner: "from-purple-600 via-fuchsia-500 to-indigo-700",
          text: "text-purple-600",
          accentBg: "bg-purple-500/10"
        };
      case Posicion.Delantero:
        return {
          bgBadge: "bg-red-100 text-red-800 dark:bg-rose-950/40 dark:text-rose-400 border-red-200 dark:border-red-900",
          glow: "shadow-rose-500/10 border-rose-400",
          banner: "from-rose-600 via-red-500 to-orange-600",
          text: "text-red-500",
          accentBg: "bg-rose-500/10"
        };
    }
  };

  const estiloPos = getColoresPosicion(jugador.posicion);

  // Auto-badges para el jugador (Requirement 11)
  const autoBadges = [];
  if (jugador.goles === mediasEquipo.goles * 2 && jugador.goles > 0) autoBadges.push({ label: "Goleador Letal", desc: "Gran efectividad ofensiva" });
  if (rankings.goles === 1) autoBadges.push({ label: "Pichichi Trinchante", desc: "Máximo goleador del Apurtuarte" });
  if (rankings.asistencias === 1) autoBadges.push({ label: "Asistente Estrella", desc: "El mejor conductor de oportunidades" });
  if (jugador.porcentajeConvocado === 100) autoBadges.push({ label: "Fiel Escudero", desc: "Convocado al 100% de partidos" });
  if (jugador.porcentajeMinutos >= 80) autoBadges.push({ label: "Pulmón Incombustible", desc: "Juega casi todo" });
  if (jugador.suplencias > jugador.titularidades && jugador.minutosJugados > 150) autoBadges.push({ label: "Revulsivo de Oro", desc: "Factor clave desde el banquillo" });
  if (jugador.puntos > mediasEquipo.puntos * 1.5) autoBadges.push({ label: "Líder de Puntos", desc: "Presencia crucial en el campo" });

  const handleNextPlayer = () => {
    const idx = jugadores.findIndex(p => p.dorsal === jugador.dorsal);
    const nextIdx = (idx + 1) % jugadores.length;
    onSelectPlayer(jugadores[nextIdx].dorsal);
  };

  const handlePrevPlayer = () => {
    const idx = jugadores.findIndex(p => p.dorsal === jugador.dorsal);
    const prevIdx = (idx - 1 + jugadores.length) % jugadores.length;
    onSelectPlayer(jugadores[prevIdx].dorsal);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in text-slate-800 dark:text-slate-100">
      
      {/* Lista Lateral de Selección */}
      <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4 max-h-[calc(100vh-140px)] overflow-y-auto">
        <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Seleccionar Jugador</h3>
        <input
          type="text"
          placeholder="Buscar..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-xs font-semibold focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 border border-transparent"
        />
        <div className="space-y-1.5">
          {filteredPlayers.map((p) => {
            const isSelected = p.dorsal === jugador.dorsal;
            const styleOpt = getColoresPosicion(p.posicion);
            return (
              <button
                key={p.dorsal}
                onClick={() => onSelectPlayer(p.dorsal)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer ${
                  isSelected 
                    ? "bg-indigo-750 text-white dark:bg-indigo-900 font-black scale-[1.02] shadow-sm" 
                    : "hover:bg-indigo-50/20 dark:hover:bg-slate-800/40 text-slate-750 dark:text-slate-300"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`w-5 font-mono text-xs font-black text-left shrink-0 ${isSelected ? "text-amber-300" : "text-slate-400"}`}>#{p.dorsal}</span>
                  <span className="truncate text-xs font-bold">{p.nombre}</span>
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded-full shrink-0 font-bold uppercase ${
                  isSelected ? "bg-amber-400/20 text-amber-300" : styleOpt.bgBadge
                }`}>
                  {p.posicion}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Renders de visuales Ficha Individual */}
      <div className="lg:col-span-3 space-y-6">
        
        {/* Superior Paginador & Cabecera */}
        <div className="flex justify-between items-center bg-white dark:bg-slate-900 px-5 py-3 rounded-2xl border border-slate-100 dark:border-slate-800">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Modo Presentador de Jugador</p>
          <div className="flex gap-2">
            <button 
              onClick={handlePrevPlayer}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Anterior jugador"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={handleNextPlayer}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Siguiente jugador"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Panel bento principal */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Tarjeta FIFA grande / Panini */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className={`relative w-full max-w-[280px] aspect-[4/6] rounded-3xl overflow-hidden bg-slate-950 text-white shadow-2xl border ${estiloPos.glow} flex flex-col justify-between p-6 group transition-all duration-300`}>
              
              {/* Dynamic shining filter */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none group-hover:translate-x-full transition-transform duration-1000"></div>
              
              {/* Top metadata */}
              <div className="flex justify-between items-start">
                <div className="flex flex-col items-center select-none font-sans">
                  <span className="text-4xl font-black tracking-tighter leading-none">{jugador.dorsal}</span>
                  <span className="text-[10px] font-bold uppercase text-slate-300 mt-1">{jugador.posicion.substring(0,3)}</span>
                </div>
                {/* Visual Position Badge */}
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 text-white font-extrabold text-xs">
                  AP
                </div>
              </div>

              {/* Middle Section: Avatar & Name */}
              <div className="flex flex-col items-center text-center my-4 space-y-2">
                <div className={`w-28 h-28 rounded-full bg-gradient-to-br ${estiloPos.banner} p-1 shadow-lg relative`}>
                  <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                    <span className="text-4xl font-extrabold select-none tracking-normal uppercase bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                      {jugador.nombre.substring(0, 2)}
                    </span>
                  </div>
                  {/* Position mini dot */}
                  <div className="absolute bottom-1 right-1 w-5 h-5 bg-indigo-500 border-2 border-slate-950 rounded-full flex items-center justify-center" title="Activo">
                    <span className="block w-1.5 h-1.5 bg-white rounded-full"></span>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight">{jugador.nombre}</h2>
                  <p className="text-[10px] font-mono text-slate-400 tracking-wider">APURTUARTE B. 2016 • F7</p>
                </div>
              </div>

              {/* Bottom Section: Primary Stats quick view */}
              <div className="grid grid-cols-3 gap-1 pt-3 border-t border-white/10 text-center font-mono">
                <div>
                  <span className="block text-sm font-black text-amber-300">{jugador.minutosJugados}'</span>
                  <span className="text-[8px] text-slate-300 uppercase tracking-widest">MIN</span>
                </div>
                <div>
                  <span className="block text-sm font-black text-rose-450">{jugador.goles}</span>
                  <span className="text-[8px] text-slate-300 uppercase tracking-widest">GOL</span>
                </div>
                <div>
                  <span className="block text-sm font-black text-indigo-400">{jugador.asistencias}</span>
                  <span className="text-[8px] text-slate-355 uppercase tracking-widest">ASI</span>
                </div>
              </div>
            </div>

            {/* Auto Dynamic Badges */}
            {autoBadges.length > 0 && (
              <div className="mt-4 w-full max-w-[280px] space-y-2">
                {autoBadges.map((b) => (
                  <div key={b.label} className="bg-amber-400/10 dark:bg-amber-950/15 border border-amber-500/25 dark:border-amber-500/15 p-2.5 rounded-xl flex items-center gap-2 shadow-xs">
                    <Award className="w-5 h-5 text-amber-500 dark:text-amber-400 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-amber-900 dark:text-amber-250 leading-none">{b.label}</p>
                      <p className="text-[10px] text-amber-700/80 dark:text-amber-300/80 mt-0.5 leading-none">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Estadísticas detalladas de rendimiento */}
          <div className="md:col-span-7 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-6">
              <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider">Estadísticas Clave del Jugador</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl relative overflow-hidden">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Minutos Totales</p>
                  <p className="text-xl font-black mt-1 text-slate-950 dark:text-white">{jugador.minutosJugados}'</p>
                  <p className="text-[9px] text-slate-500 mt-1">{jugador.porcentajeMinutos}% de posib.</p>
                  <span className="absolute top-2 right-2 text-xs font-extrabold text-slate-400">#{rankings.minutos}</span>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl relative overflow-hidden">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Goles Marcados</p>
                  <p className="text-xl font-black mt-1 text-rose-500">{jugador.goles}</p>
                  <p className="text-[9px] text-slate-500 mt-1">{jugador.golesPorPartido} p/partido</p>
                  <span className="absolute top-2 right-2 text-xs font-extrabold text-slate-400">#{rankings.goles}</span>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl relative overflow-hidden">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Asistencias</p>
                  <p className="text-xl font-black mt-1 text-indigo-500">{jugador.asistencias}</p>
                  <p className="text-[9px] text-slate-500 mt-1">{jugador.asistenciasPorPartido} p/partido</p>
                  <span className="absolute top-2 right-2 text-xs font-extrabold text-slate-400">#{rankings.asistencias}</span>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl relative overflow-hidden">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Puntos Fantasy</p>
                  <p className="text-xl font-black mt-1 text-orange-500">{jugador.puntos}</p>
                  <p className="text-[9px] text-slate-500 mt-1">Suma acumulada</p>
                  <span className="absolute top-2 right-2 text-xs font-extrabold text-slate-400">#{rankings.puntos}</span>
                </div>
              </div>

              {/* Ratios y porcentajes */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Participaciones y Presencia</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Convocado / Ausente */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                      <span>Convocatorias: {jugador.convocatorias}</span>
                      <span>Ausencias: {jugador.ausences || jugador.ausencias}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                      <div className="h-full bg-emerald-500 rounded-l-full" style={{ width: `${jugador.porcentajeConvocado}%` }}></div>
                      <div className="h-full bg-slate-300 dark:bg-slate-700" style={{ width: `${100 - jugador.porcentajeConvocado}%` }}></div>
                    </div>
                  </div>

                  {/* Titular vs Suplente */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                      <span>Titular: {jugador.titularidades} ({jugador.porcentajeTitular}%)</span>
                      <span>Suplente: {jugador.suplencias} ({jugador.porcentajeSuplente}%)</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex flex-row">
                      <div className="h-full bg-indigo-600 rounded-l-full" style={{ width: `${jugador.porcentajeTitular}%` }}></div>
                      <div className="h-full bg-slate-400" style={{ width: `${jugador.porcentajeSuplente}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comparación directa con la media del equipo */}
              <div className="space-y-3.5">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Comparativa contra la media del Apurtuarte</h4>
                
                <div className="space-y-3">
                  {/* Goles */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>Goles Marcados</span>
                      <span>Este Jugador: <b className="text-rose-500 font-extrabold">{jugador.goles}</b> (Media: {mediasEquipo.goles})</span>
                    </div>
                    <div className="relative h-4 bg-slate-100 dark:bg-slate-800/60 rounded-lg overflow-hidden flex items-center">
                      <div 
                        className="absolute h-full bg-rose-500" 
                        style={{ width: `${Math.min(100, (jugador.goles / (mediasEquipo.goles || 1)) * 50)}%` }} // Escala relativa
                      ></div>
                      <div 
                        className="absolute w-0.5 h-full bg-slate-950 dark:bg-white" 
                        style={{ left: "50%" }}
                        title="Media del equipo"
                      ></div>
                    </div>
                  </div>

                  {/* Minutos */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>Minutos Jugados</span>
                      <span>Este Jugador: <b className="text-indigo-600 dark:text-indigo-400 font-extrabold">{jugador.minutosJugados}'</b> (Media: {mediasEquipo.minutos}')</span>
                    </div>
                    <div className="relative h-4 bg-slate-100 dark:bg-slate-800/60 rounded-lg overflow-hidden flex items-center">
                      <div 
                        className="absolute h-full bg-indigo-600 dark:bg-indigo-500" 
                        style={{ width: `${Math.min(100, (jugador.minutosJugados / (mediasEquipo.minutos || 1)) * 50)}%` }}
                      ></div>
                      <div 
                        className="absolute w-0.5 h-full bg-slate-950 dark:bg-white" 
                        style={{ left: "50%" }}
                        title="Media del equipo"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>

        {/* Historial Jornada a Jornada */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider mb-4">Evolución de Rendimiento Jornada a Jornada</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400 min-w-max">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="py-2.5 font-bold">Jornada</th>
                  <th className="py-2.5 font-bold">Rival</th>
                  <th className="py-2.5 font-bold text-center">Involucración</th>
                  <th className="py-2.5 font-bold text-center">Minutos</th>
                  <th className="py-2.5 font-bold text-center">Goles</th>
                  <th className="py-2.5 font-bold text-center">Asistencias</th>
                  <th className="py-2.5 font-bold text-center">Puntos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {historialJornadas.map((h) => {
                  let condition = "-";
                  let conditionColor = "text-slate-400";
                  if (h.ausente) {
                    condition = "Ausente";
                    conditionColor = "text-rose-500 font-bold";
                  } else if (h.titular) {
                    condition = "Titular";
                    conditionColor = "text-indigo-600 dark:text-indigo-400 font-bold";
                  } else if (h.suplente) {
                    condition = "Suplente";
                    conditionColor = "text-amber-500 font-bold";
                  }

                  return (
                    <tr key={h.jornadaNumero} className="hover:bg-slate-50/50 dark:hover:bg-indigo-950/15 transition-all">
                      <td className="py-3 font-mono font-bold">Jornada {h.jornadaNumero}</td>
                      <td className="py-3 font-semibold text-slate-900 dark:text-white">{h.rival} <span className="text-slate-400 font-normal">({h.resultadoFinal})</span></td>
                      <td className={`py-3 text-center ${conditionColor}`}>{condition}</td>
                      <td className="py-3 text-center font-mono font-bold">{h.minutos}'</td>
                      <td className="py-3 text-center font-bold text-rose-500">{h.goles || "-"}</td>
                      <td className="py-3 text-center font-bold text-indigo-550">{h.asistencias || "-"}</td>
                      <td className="py-3 text-center font-mono font-black text-amber-500">{h.puntos} pts</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  );
};
