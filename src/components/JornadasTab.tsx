import React, { useState } from "react";
import { AppState, Jornada, Posicion } from "../types";
import { Calendar, Clock, MapPin, CheckCircle, Users, Activity, Goal, ArrowRightLeft, ShieldHalf } from "lucide-react";

interface JornadasTabProps {
  state: AppState;
  selectedJornada: number;
  onSelectJornada: (numero: number) => void;
  onSelectPlayer: (dorsal: number) => void;
}

export const JornadasTab: React.FC<JornadasTabProps> = ({ 
  state, 
  selectedJornada, 
  onSelectJornada,
  onSelectPlayer 
}) => {
  const { equipo, jornadas, jugadores, estadisticasMatch } = state;

  // Jornada actual seleccionada
  const jornada = jornadas.find((j) => j.numeroJornada === selectedJornada) || jornadas[0];

  // Estadísticas de jugadores para esta jornada
  const statsDeJornada = estadisticasMatch
    .filter((s) => s.jornadaNumero === jornada.numeroJornada)
    .map((s) => {
      const pl = jugadores.find((p) => p.dorsal === s.jugadorDorsal);
      return {
        ...s,
        nombre: pl?.nombre || `Jugador #${s.jugadorDorsal}`,
        posicion: pl?.posicion || Posicion.Medio,
      };
    });

  const convocados = statsDeJornada.filter((p) => p.convocado);
  const titulares = statsDeJornada.filter((p) => p.convocado && p.titular);
  const suplentes = statsDeJornada.filter((p) => p.convocado && p.suplente);
  const ausentes = statsDeJornada.filter((p) => p.ausente);

  // Goleadores de la jornada
  const goleadores = statsDeJornada.filter((p) => p.goles > 0);
  // Asistentes de la jornada
  const asistentes = statsDeJornada.filter((p) => p.asistencias > 0);

  // Colores por posición
  const getColoresPos = (pos: Posicion) => {
    switch (pos) {
      case Posicion.Portero: return "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400";
      case Posicion.Defensa: return "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200";
      case Posicion.Medio: return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200";
      case Posicion.Extremo: return "bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-400 border-purple-200";
      case Posicion.Delantero: return "bg-red-100 text-red-800 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-800 dark:text-slate-100">
      
      {/* Selector de Línea Temporal (Horizontal, Scrollable) */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
        <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3">Línea Temporal de la Temporada</h3>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {jornadas.map((j) => {
            const esActiva = j.numeroJornada === jornada.numeroJornada;
            const esJugado = j.resultadoFinal && j.resultadoFinal.trim() !== "";
            let colorStatus = "border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400";
            
            if (esActiva) {
              colorStatus = "bg-slate-950 text-white border-slate-950 dark:bg-slate-100 dark:text-slate-950 dark:border-slate-100 font-bold scale-102 shadow-md";
            } else if (esJugado) {
              const gano = j.golesFavor > j.golesContra;
              const empato = j.golesFavor === j.golesContra;
              colorStatus = gano 
                ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-950 text-emerald-800 dark:text-emerald-300" 
                : empato 
                ? "bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-950 text-amber-800 dark:text-amber-300"
                : "bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-950 text-rose-800 dark:text-rose-300";
            }

            return (
              <button
                key={j.numeroJornada}
                onClick={() => onSelectJornada(j.numeroJornada)}
                className={`py-2 px-4 rounded-xl text-xs whitespace-nowrap min-w-[70px] text-center border transition-all cursor-pointer ${colorStatus}`}
              >
                <span className="block text-[9px] uppercase font-bold text-slate-400">Jornada</span>
                <span className="text-sm font-black">{j.numeroJornada}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tarjeta de Scoreboard principal y Alineaciones */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Scoreboard Marcador */}
        <div className="lg:col-span-4 bg-linear-to-b from-slate-900 via-slate-950 to-slate-900 border border-slate-800 p-6 rounded-3xl text-white flex flex-col justify-between items-center text-center shadow-xl min-h-[360px] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-500/5 blur-3xl rounded-full"></div>
          
          <div className="space-y-1 w-full">
            <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 font-mono text-[9px] font-black uppercase rounded-full">
              Fórmula Benjamin F7
            </span>
            <p className="text-xs text-slate-400 font-medium">Jornada {jornada.numeroJornada}</p>
          </div>

          {/* Marcador Visual */}
          <div className="my-6 space-y-4 w-full">
            <div className="flex justify-between items-center gap-4">
              <div className="flex-1 text-right">
                <p className="font-extrabold text-sm uppercase tracking-wide truncate" title={equipo.equipo}>
                  {jornada.localVisitante === "Local" ? "Apurtuarte" : jornada.rival}
                </p>
                <span className="text-xs text-slate-400">{jornada.localVisitante === "Local" ? "Local" : "Visitante"}</span>
              </div>

              <div className="flex items-center gap-2 bg-slate-900/80 px-4 py-2.5 rounded-2xl border border-slate-800 shadow-lg">
                <span className="text-4xl font-black leading-none">{jornada.localVisitante === "Local" ? jornada.golesFavor : jornada.golesContra}</span>
                <span className="text-slate-500 font-bold">:</span>
                <span className="text-4xl font-black leading-none">{jornada.localVisitante === "Visitante" ? jornada.golesFavor : jornada.golesContra}</span>
              </div>

              <div className="flex-1 text-left">
                <p className="font-extrabold text-sm uppercase tracking-wide truncate" title={jornada.rival}>
                  {jornada.localVisitante === "Local" ? jornada.rival : "Apurtuarte"}
                </p>
                <span className="text-xs text-slate-400">{jornada.localVisitante === "Local" ? "Visitante" : "Local"}</span>
              </div>
            </div>

            {/* Descanso */}
            <p className="text-xs font-mono text-slate-400">
              Al descanso: <span className="font-bold text-slate-300">{jornada.resultadoDescanso || "0-0"}</span>
            </p>
          </div>

          {/* Metadata del Partido */}
          <div className="space-y-2 border-t border-slate-800/60 pt-4 w-full text-xs text-slate-400 font-semibold flex flex-col items-center">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>{jornada.fecha}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>{jornada.hora}h</span>
            </div>
          </div>

          {/* Goles del Partido */}
          {goleadores.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-800/40 w-full text-center space-y-1">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Goleadores Apurtuarte</p>
              <div className="flex flex-wrap justify-center gap-1.5 text-xs text-slate-300">
                {goleadores.map((g) => (
                  <span key={g.jugadorDorsal} className="font-bold">
                    {g.nombre} ({g.goles}⚽)
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Alineación Inicial y Suplencias */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldHalf className="w-4 h-4 text-emerald-500" /> Convocatoria y Distribución de Roles
            </h3>
            <span className="text-xs font-bold text-slate-500">
              Total Convocados: {convocados.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Titulares */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Titulares (Fútbol 7)
              </h4>
              <div className="space-y-1.5">
                {titulares.map((t) => (
                  <div 
                    key={t.jugadorDorsal} 
                    onClick={() => onSelectPlayer(t.jugadorDorsal)}
                    className="flex justify-between items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100/50 dark:hover:bg-slate-800/80 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-slate-400">#{t.jugadorDorsal}</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{t.nombre}</span>
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${getColoresPos(t.posicion)}`}>
                      {t.posicion}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Suplentes y Ausentes */}
            <div className="space-y-6">
              {/* Suplentes */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1">
                  <ArrowRightLeft className="w-3.5 h-3.5" /> Suplentes / Rotación
                </h4>
                <div className="space-y-1.5">
                  {suplentes.map((s) => (
                    <div 
                      key={s.jugadorDorsal} 
                      onClick={() => onSelectPlayer(s.jugadorDorsal)}
                      className="flex justify-between items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100/50 dark:hover:bg-slate-800/80 cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-slate-400">#{s.jugadorDorsal}</span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{s.nombre}</span>
                      </div>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${getColoresPos(s.posicion)}`}>
                        {s.posicion}
                      </span>
                    </div>
                  ))}
                  {suplentes.length === 0 && (
                    <p className="text-xs text-slate-400">No hubo suplentes en esta jornada.</p>
                  )}
                </div>
              </div>

              {/* Ausentes */}
              {ausentes.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                    Ausentes
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {ausentes.map((a) => (
                      <span 
                        key={a.jugadorDorsal}
                        onClick={() => onSelectPlayer(a.jugadorDorsal)}
                        className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 text-xs font-bold cursor-pointer border border-rose-100 dark:border-rose-950"
                      >
                        #{a.jugadorDorsal} {a.nombre}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabla detallada de estadísticas de este partido */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
        <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider mb-4">Desempeño Individual del Encuentro</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold">
                <th className="py-2.5">Dorsal</th>
                <th className="py-2.5">Jugador</th>
                <th className="py-2.5">Estado</th>
                <th className="py-2.5 text-center">Minutos</th>
                <th className="py-2.5 text-center">Goles</th>
                <th className="py-2.5 text-center">Asistencias</th>
                <th className="py-2.5 text-center">Tarjetas</th>
                <th className="py-2.5 text-center">Puntos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {statsDeJornada.map((p) => (
                <tr 
                  key={p.jugadorDorsal}
                  onClick={() => onSelectPlayer(p.jugadorDorsal)}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 cursor-pointer transition-colors"
                >
                  <td className="py-3 font-mono font-black text-slate-900 dark:text-white">#{p.jugadorDorsal}</td>
                  <td className="py-3 font-bold text-slate-950 dark:text-white">{p.nombre}</td>
                  <td className="py-3 font-semibold text-xs">
                    {p.ausente ? (
                      <span className="text-rose-500">Ausente</span>
                    ) : p.titular ? (
                      <span className="text-emerald-500">Titular</span>
                    ) : (
                      <span className="text-blue-500">Suplente</span>
                    )}
                  </td>
                  <td className="py-3 text-center font-mono font-medium">{p.minutos}'</td>
                  <td className="py-3 text-center font-bold text-rose-500">{p.goles || "-"}</td>
                  <td className="py-3 text-center font-bold text-indigo-500">{p.asistencias || "-"}</td>
                  <td className="py-3 text-center">
                    <div className="flex gap-1 justify-center">
                      {p.tarjetasAmarillas > 0 && <span className="text-[10px] bg-yellow-400 px-1 py-0.2 rounded-xs select-none">🟨</span>}
                      {p.tarjetasRojas > 0 && <span className="text-[10px] bg-red-600 px-1 py-0.2 rounded-xs select-none">🟥</span>}
                      {!p.tarjetasAmarillas && !p.tarjetasRojas && "-"}
                    </div>
                  </td>
                  <td className="py-3 text-center font-mono font-black text-orange-500 text-sm">{p.puntos} pts</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
};
