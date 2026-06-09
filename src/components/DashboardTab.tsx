import React from "react";
import { AppState, Posicion } from "../types";
import { obtenerEstadisticasEquipo } from "../utils/statsCalculator";
import { 
  Trophy, 
  Calendar, 
  ShieldCheck, 
  Activity, 
  Goal, 
  UserCheck, 
  Sparkles, 
  AlertTriangle, 
  Plus, 
  ArrowUpRight, 
  CheckCircle,
  BarChart,
  Users
} from "lucide-react";

interface DashboardTabProps {
  state: AppState;
  onNavigateToTab: (tab: string) => void;
  onSelectPlayer: (dorsal: number) => void;
  onSelectJornada: (numero: number) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({ 
  state, 
  onNavigateToTab, 
  onSelectPlayer,
  onSelectJornada
}) => {
  const { equipo, jornadas, jugadores, estadisticasMatch } = state;
  const stats = obtenerEstadisticasEquipo(jornadas, jugadores, equipo.duracionPartido);

  // Encontrar el partido con más goles (golesFavor + golesContra)
  const partidoMasGoles = [...jornadas]
    .filter(j => j.resultadoFinal)
    .sort((a, b) => (b.golesFavor + b.golesContra) - (a.golesFavor + a.golesContra))[0];

  // Mejor jornada ofensiva (más goles a favor)
  const mejorJornadaOfensiva = [...jornadas]
    .filter(j => j.resultadoFinal)
    .sort((a, b) => b.golesFavor - a.golesFavor)[0];

  // Mayor diferencia de goles a favor
  const mayorDiferenciaGoles = [...jornadas]
    .filter(j => j.resultadoFinal)
    .sort((a, b) => (b.golesFavor - b.golesContra) - (a.golesFavor - a.golesContra))[0];

  // Jugador más efectivo por minuto (goles + asistencias por minuto entre quienes hayan jugado al menos 50 minutos)
  const jugadoresEfectivos = [...jugadores]
    .filter(p => p.minutosJugados >= 50)
    .map(p => ({
      ...p,
      efectividad: (p.goles + p.asistencias) / (p.minutosJugados || 1)
    }))
    .sort((a, b) => b.efectividad - a.efectividad);
  
  const jugadorMasEfectivo = jugadoresEfectivos[0];

  // Podiums
  const goleadoresPodio = [...jugadores].sort((a, b) => b.goles - a.goles).slice(0, 3);
  const asistentesPodio = [...jugadores].sort((a, b) => b.asistencias - a.asistencias).slice(0, 3);
  const minutosPodio = [...jugadores].sort((a, b) => b.minutosJugados - a.minutosJugados).slice(0, 3);

  // Rendimiento de las últimas 5 jornadas para la racha
  const ultimasJornadas = [...jornadas]
    .filter(j => j.resultadoFinal && j.resultadoFinal !== "")
    .sort((a, b) => b.numeroJornada - a.numeroJornada)
    .slice(0, 5)
    .reverse();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Banner (Vibrant Palette layout) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-indigo-900 p-8 text-white shadow-xl border border-indigo-800/30">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 -ml-16 -mb-16 w-80 h-80 rounded-full bg-orange-500/10 blur-3xl"></div>
        
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 text-amber-300 font-mono text-xs font-semibold uppercase tracking-wider mb-4 border border-amber-400/25">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Temporada {equipo.temporada}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-amber-100 uppercase font-display leading-tight">
              {equipo.equipo}
            </h1>
            <p className="mt-2 text-slate-300 font-medium max-w-xl text-lg">
              Dirigido por <span className="text-amber-400 font-black">{equipo.entrenador}</span>. Panel oficial de análisis estadístico de rendimiento futbolístico.
            </p>
          </div>

          {/* Racha y Partido Reciente */}
          <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-5 border border-slate-700/30 w-full md:w-auto">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Últimas 5 Jornadas</h3>
            <div className="flex gap-2 items-center">
              {ultimasJornadas.map((j) => {
                const esVictoria = j.golesFavor > j.golesContra;
                const esEmpate = j.golesFavor === j.golesContra;
                return (
                  <button
                    key={j.numeroJornada}
                    onClick={() => onSelectJornada(j.numeroJornada)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm transition-all hover:scale-115 active:scale-95 cursor-pointer ${
                      esVictoria 
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/30" 
                        : esEmpate 
                        ? "bg-amber-500 text-slate-950" 
                        : "bg-rose-600 text-white"
                    }`}
                    title={`J${j.numeroJornada} vs ${j.rival} (${j.resultadoFinal})`}
                  >
                    {esVictoria ? "V" : esEmpate ? "E" : "D"}
                  </button>
                );
              })}
              {ultimasJornadas.length === 0 && <span className="text-slate-500 text-sm">Sin datos aún</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Grid General de Estadísticas (Vibrant Palette Theme) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-emerald-50 dark:bg-emerald-950/20 p-5 rounded-2xl shadow-xs border border-emerald-100/40 dark:border-emerald-900/30 flex items-center gap-4">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-bold">Partidos Jugados</p>
            <p className="text-2xl font-black text-emerald-950 dark:text-emerald-250 mt-1">
              {stats.partidosJugados} <span className="text-xs font-semibold text-emerald-600/60 dark:text-emerald-400/60">/ {equipo.jornadasAJugar}</span>
            </p>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/20 p-5 rounded-2xl shadow-xs border border-blue-100/40 dark:border-blue-900/30 flex items-center gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded-xl">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-mono text-blue-600 dark:text-blue-400 uppercase tracking-wider font-bold">Victorias / E / D</p>
            <p className="text-2xl font-black text-blue-950 dark:text-blue-250 mt-1">
              {stats.victorias} <span className="text-blue-400 dark:text-blue-500 font-normal">/</span> {stats.empates} <span className="text-blue-400 dark:text-blue-500 font-normal">/</span> {stats.derrotas}
            </p>
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-950/20 p-5 rounded-2xl shadow-xs border border-orange-100/40 dark:border-orange-900/30 flex items-center gap-4">
          <div className="p-3 bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400 rounded-xl">
            <Goal className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-mono text-orange-600 dark:text-orange-400 uppercase tracking-wider font-bold">Goles F / C (Dif)</p>
            <p className="text-2xl font-black text-orange-950 dark:text-orange-255 mt-1">
              {stats.golesFavor}:{stats.golesContra}{" "}
              <span className={`text-sm font-bold ${stats.diferenciaGoles >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                ({stats.diferenciaGoles >= 0 ? '+' : ''}{stats.diferenciaGoles})
              </span>
            </p>
          </div>
        </div>

        <div className="bg-rose-50 dark:bg-rose-950/20 p-5 rounded-2xl shadow-xs border border-rose-100/40 dark:border-rose-900/30 flex items-center gap-4">
          <div className="p-3 bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-400 rounded-xl">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-mono text-rose-600 dark:text-rose-400 uppercase tracking-wider font-bold">Promedio Gol</p>
            <p className="text-2xl font-black text-rose-950 dark:text-rose-250 mt-1">
              {stats.promedioGolesFavor} <span className="text-xs font-semibold text-rose-605">Fav</span>
              <span className="text-rose-400 mx-1 font-normal text-sm">/</span>
              {stats.promedioGolesContra} <span className="text-xs font-semibold text-rose-605">Cont</span>
            </p>
          </div>
        </div>
      </div>

      {/* Podium Metálico de Jugadores (Tres columnas) */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold font-sans text-slate-900 dark:text-white flex items-center gap-2.5">
            <Trophy className="w-5.5 h-5.5 text-amber-500" /> Líderes Estadísticos
          </h2>
          <button 
            onClick={() => onNavigateToTab("tabla")} 
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-650 dark:text-indigo-400 hover:text-indigo-500 hover:underline cursor-pointer transition-all"
          >
            Ver tabla completa <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Goleadores */}
          <div className="bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/40 p-6 rounded-2xl shadow-xs border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="p-2 bg-amber-100 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 rounded-lg">
                <Goal className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-200">Máximos Goleadores</h3>
            </div>
            
            <div className="space-y-4">
              {goleadoresPodio.map((p, idx) => (
                <div 
                  key={p.dorsal} 
                  onClick={() => onSelectPlayer(p.dorsal)}
                  className="flex items-center justify-between group cursor-pointer p-1.5 hover:bg-indigo-50/30 dark:hover:bg-slate-800/30 rounded-xl transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 flex items-center justify-center rounded-lg font-bold text-xs ${
                      idx === 0 ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-300' :
                      idx === 1 ? 'bg-slate-300 text-slate-900' :
                      'bg-orange-205 text-orange-900'
                    }`}>
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-indigo-600 dark:group-hover:text-amber-400 transition-colors">
                        {p.nombre}
                      </p>
                      <p className="text-xs text-slate-400 font-medium">Dorsal {p.dorsal} • {p.posicion}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-slate-850 dark:text-slate-200 text-base">{p.goles}</span>
                    <p className="text-[10px] font-mono text-slate-400">goles</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Asistencias */}
          <div className="bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/40 p-6 rounded-2xl shadow-xs border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-200">Asistencias</h3>
            </div>
            
            <div className="space-y-4">
              {asistentesPodio.map((p, idx) => (
                <div 
                  key={p.dorsal} 
                  onClick={() => onSelectPlayer(p.dorsal)}
                  className="flex items-center justify-between group cursor-pointer p-1.5 hover:bg-indigo-50/30 dark:hover:bg-slate-800/30 rounded-xl transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 flex items-center justify-center rounded-lg font-bold text-xs ${
                      idx === 0 ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-300' :
                      idx === 1 ? 'bg-slate-300 text-slate-900' :
                      'bg-orange-205 text-orange-900'
                    }`}>
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-indigo-600 dark:group-hover:text-amber-400 transition-colors">
                        {p.nombre}
                      </p>
                      <p className="text-xs text-slate-400 font-medium">Dorsal {p.dorsal} • {p.posicion}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-slate-850 dark:text-slate-200 text-base">{p.asistencias}</span>
                    <p className="text-[10px] font-mono text-slate-400">asistencias</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Minutos Jugados */}
          <div className="bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/40 p-6 rounded-2xl shadow-xs border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="p-2 bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-lg">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-200">Minutos Jugados</h3>
            </div>
            
            <div className="space-y-4">
              {minutosPodio.map((p, idx) => (
                <div 
                  key={p.dorsal} 
                  onClick={() => onSelectPlayer(p.dorsal)}
                  className="flex items-center justify-between group cursor-pointer p-1.5 hover:bg-indigo-50/30 dark:hover:bg-slate-800/30 rounded-xl transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 flex items-center justify-center rounded-lg font-bold text-xs ${
                      idx === 0 ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-300' :
                      idx === 1 ? 'bg-slate-300 text-slate-900' :
                      'bg-orange-205 text-orange-900'
                    }`}>
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-indigo-600 dark:group-hover:text-amber-400 transition-colors">
                        {p.nombre}
                      </p>
                      <p className="text-xs text-slate-400 font-medium">Dorsal {p.dorsal} • {p.posicion}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-slate-850 dark:text-slate-200 text-base">{p.minutosJugados}'</span>
                    <p className="text-[10px] font-mono text-slate-400 font-medium">de {p.minutosPosibles}' posibles</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tarjetas Resumen Adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Dest        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-indigo-500" /> Líderes de Consistencia
          </h3>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Más titularidades</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 text-right">{stats.maxTitularidades}</span>
            </div>
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Mejor % minutos</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 text-right">{stats.mejorPorcentajeMinutos}</span>
            </div>
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total de Minutos Equipo</span>
              <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 font-mono">{stats.totalMinutosJugados}'</span>
            </div>
            <div className="py-2.5 flex justify-between items-center">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Fair Play (Tarjetas)</span>
              <div className="flex gap-2">
                <span className="px-2 py-0.5 bg-yellow-400 text-slate-900 text-xs font-black rounded-sm flex items-center gap-1" title="Amarillas">
                  {stats.totalAmarillas} 🟨
                </span>
                <span className="px-2 py-0.5 bg-red-650 text-white text-xs font-black rounded-sm flex items-center gap-1" title="Rojas">
                  {stats.totalRojas} 🟥
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Automatic Insights */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4 md:col-span-1 lg:col-span-2">
          <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-orange-500" /> Insights Deportivos Automáticos (IA)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mayor Efectividad goleadora</p>
              {jugadorMasEfectivo ? (
                <div className="cursor-pointer" onClick={() => onSelectPlayer(jugadorMasEfectivo.dorsal)}>
                  <p className="font-bold text-slate-900 dark:text-white text-sm hover:text-indigo-600 transition-colors">{jugadorMasEfectivo.nombre}</p>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                    {Math.round(jugadorMasEfectivo.efectividad * 100)} contribuciones por cada 100'
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-500">Sin datos</p>
              )}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Partido con más goles</p>
              {partidoMasGoles ? (
                <div className="cursor-pointer" onClick={() => onSelectJornada(partidoMasGoles.numeroJornada)}>
                  <p className="font-bold text-slate-900 dark:text-white text-sm hover:text-indigo-600 transition-colors">
                    Jornada {partidoMasGoles.numeroJornada} vs {partidoMasGoles.rival}
                  </p>
                  <p className="text-xs text-indigo-500 dark:text-indigo-400 font-semibold mt-0.5">
                    Resultado: {partidoMasGoles.resultadoFinal} ({partidoMasGoles.golesFavor + partidoMasGoles.golesContra} goles totales)
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-500">Sin datos</p>
              )}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mejor Jornada Ofensiva</p>
              {mejorJornadaOfensiva ? (
                <div className="cursor-pointer" onClick={() => onSelectJornada(mejorJornadaOfensiva.numeroJornada)}>
                  <p className="font-bold text-slate-900 dark:text-white text-sm hover:text-indigo-600 transition-colors">
                    Jornada {mejorJornadaOfensiva.numeroJornada} vs {mejorJornadaOfensiva.rival}
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
                    Marcados: {mejorJornadaOfensiva.golesFavor} goles a favor (Final: {mejorJornadaOfensiva.resultadoFinal})
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-500">Sin datos</p>
              )}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mayor Diferencia de Goles</p>
              {mayorDiferenciaGoles ? (
                <div className="cursor-pointer" onClick={() => onSelectJornada(mayorDiferenciaGoles.numeroJornada)}>
                  <p className="font-bold text-slate-900 dark:text-white text-sm hover:text-indigo-600 transition-colors">
                    Jornada {mayorDiferenciaGoles.numeroJornada} vs {mayorDiferenciaGoles.rival}
                  </p>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                    Diferencia de +{mayorDiferenciaGoles.golesFavor - mayorDiferenciaGoles.golesContra} (Resultado: {mayorDiferenciaGoles.resultadoFinal})
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-500">Sin datos</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Accesos rápidos (Redesigned Call to Action Card in Deep Indigo & Orange Theme) */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-indigo-900 border border-indigo-850 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-lg relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-orange-500/5 blur-2xl"></div>
        <div className="relative z-10">
          <h4 className="font-black text-amber-300">¿Quieres añadir o importar nuevas jornadas?</h4>
          <p className="text-xs text-indigo-200 mt-1">Sube tus archivos de Excel, carga hojas de datos personalizadas o restaura el seed inicial.</p>
        </div>
        <button 
          onClick={() => onNavigateToTab("importar")}
          className="relative z-10 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-md font-bold text-sm transition-all hover:scale-105 cursor-pointer active:scale-95"
        >
          Importar o Cargar Datos
        </button>
      </div>
    </div>
  );
};
