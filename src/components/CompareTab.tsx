import React, { useState } from "react";
import { AppState, Jugador, Posicion } from "../types";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Users, Check, ArrowRight, ShieldCheck, Scale, Award } from "lucide-react";

interface CompareTabProps {
  state: AppState;
  onSelectPlayer: (dorsal: number) => void;
}

export const CompareTab: React.FC<CompareTabProps> = ({ state, onSelectPlayer }) => {
  const { jugadores } = state;

  // Jugadores seleccionados para comparar (por defecto, los dos primeros)
  const [selectedDorsals, setSelectedDorsals] = useState<number[]>([
    jugadores[0]?.dorsal || 1,
    jugadores[1]?.dorsal || 2,
  ]);

  const handleTogglePlayer = (dorsal: number) => {
    setSelectedDorsals((prev) => {
      if (prev.includes(dorsal)) {
        // Permitir deselección solo si quedan al menos 2
        if (prev.length <= 2) return prev;
        return prev.filter((d) => d !== dorsal);
      } else {
        // Límite de 4 jugadores simuláneos por claridad visual
        if (prev.length >= 4) return prev;
        return [...prev, dorsal];
      }
    });
  };

  const comparedPlayers = jugadores.filter((p) => selectedDorsals.includes(p.dorsal));

  // Preparar datos para el Radar Chart (Normalizados de 0-100 para comparar habilidades de forma equitativa)
  // Atributos de comparación: Goles, Asistencias, % Minutos, % Titularidad, % Convocado, Puntos (escalado)
  const maxGoles = Math.max(...jugadores.map((p) => p.goles)) || 1;
  const maxAsistencias = Math.max(...jugadores.map((p) => p.asistencias)) || 1;
  const maxPuntos = Math.max(...jugadores.map((p) => p.puntos)) || 1;

  const radarData = [
    {
      subject: "Goles",
    },
    {
      subject: "Asistencias",
    },
    {
      subject: "% Minutos",
    },
    {
      subject: "% Titular",
    },
    {
      subject: "% Convocado",
    },
    {
      subject: "Eficiencia Pts",
    },
  ].map((metric) => {
    const row: Record<string, any> = { subject: metric.subject };
    comparedPlayers.forEach((p) => {
      let value = 0;
      if (metric.subject === "Goles") {
        value = Math.round((p.goles / maxGoles) * 100);
      } else if (metric.subject === "Asistencias") {
        value = Math.round((p.asistencias / maxAsistencias) * 100);
      } else if (metric.subject === "% Minutos") {
        value = p.porcentajeMinutos;
      } else if (metric.subject === "% Titular") {
        value = p.porcentajeTitular;
      } else if (metric.subject === "% Convocado") {
        value = p.porcentajeConvocado;
      } else if (metric.subject === "Eficiencia Pts") {
        value = Math.round((p.puntos / maxPuntos) * 100);
      }
      row[p.nombre] = value;
    });
    return row;
  });

  // Datos para los Bar Charts directos de volumen
  const volumeData = comparedPlayers.map((p) => ({
    name: p.nombre,
    Goles: p.goles,
    Asistencias: p.asistencias,
    Puntos: p.puntos,
  }));

  // Colores para dibujar los radares o barras de los jugadores comparados
  const COMP_COLORS = ["#10b981", "#3b82f6", "#a855f7", "#eab308"];

  // Colores de Posición badges
  const getBadgeStyle = (pos: Posicion) => {
    switch (pos) {
      case Posicion.Portero: return "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400";
      case Posicion.Defensa: return "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400";
      case Posicion.Medio: return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400";
      case Posicion.Extremo: return "bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-400";
      case Posicion.Delantero: return "bg-red-100 text-red-800 dark:bg-rose-950/40 dark:text-rose-400";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-800 dark:text-slate-100">
      
      {/* Selector de Jugadores a Comparar */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 workspace-intro">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-emerald-500" />
          <h3 className="font-bold text-slate-950 dark:text-white">Selector de Comparativa</h3>
        </div>
        <p className="text-xs text-slate-400 mb-4 font-semibold">Selecciona entre 2 y 4 jugadores de la plantilla para comparar sus datos agregados:</p>
        
        <div className="flex flex-wrap gap-2.5">
          {jugadores.map((p) => {
            const isChecked = selectedDorsals.includes(p.dorsal);
            return (
              <button
                key={p.dorsal}
                onClick={() => handleTogglePlayer(p.dorsal)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  isChecked
                    ? "bg-slate-950 border-slate-950 text-white dark:bg-slate-800 dark:border-slate-700 dark:text-emerald-400 shadow-md"
                    : "bg-white border-slate-200 text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 hover:border-slate-300"
                }`}
              >
                <span className="font-mono text-[10px] text-slate-400">#{p.dorsal}</span>
                <span>{p.nombre}</span>
                {isChecked && <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Visualización comparativa */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Radar de Competencias */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 mb-4">
            <Scale className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider">Habilidades Relativas (%)</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed font-semibold">
            Muestra el rendimiento de cada jugador normalizado del 0% al 100% en comparación con los valores máximos de la plantilla.
          </p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} fontWeight={600} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" fontSize={9} />
                {comparedPlayers.map((p, idx) => (
                  <Radar
                    key={p.dorsal}
                    name={p.nombre}
                    dataKey={p.nombre}
                    stroke={COMP_COLORS[idx % COMP_COLORS.length]}
                    fill={COMP_COLORS[idx % COMP_COLORS.length]}
                    fillOpacity={0.25}
                  />
                ))}
                <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Comparativa de Volumen de Goles y Puntos */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 mb-4">
            <Award className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider">Goles, Asistencias y Puntos</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed font-semibold">
            Comparativa directa del volumen absoluto de goles, pases de gol y puntos fantasy acumulados.
          </p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeData} margin={{ left: 10, right: 10, top: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="Goles" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={16} />
                <Bar dataKey="Asistencias" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={16} />
                <Bar dataKey="Puntos" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Tabla comparativa detallada */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-50 dark:border-slate-800/60">
          <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider">Tabla Comparativa Cara a Cara</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-max">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="p-4">Estadística</th>
                {comparedPlayers.map((p, idx) => (
                  <th key={p.dorsal} className="p-4">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COMP_COLORS[idx % COMP_COLORS.length] }}></span>
                      <span className="font-bold text-slate-950 dark:text-white text-sm">#{p.dorsal} {p.nombre}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold text-slate-700 dark:text-slate-300">
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                <td className="p-4 text-slate-400 font-bold">Posición Táctica</td>
                {comparedPlayers.map((p) => (
                  <td key={p.dorsal} className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${getBadgeStyle(p.posicion)}`}>
                      {p.posicion}
                    </span>
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                <td className="p-4 text-slate-400 font-bold">Minutos Totales Jugados</td>
                {comparedPlayers.map((p) => (
                  <td key={p.dorsal} className="p-4 font-mono font-bold text-slate-900 dark:text-white text-sm">{p.minutosJugados}' <span className="text-xs text-slate-400 font-normal">/ {p.minutosPosibles}'</span></td>
                ))}
              </tr>
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                <td className="p-4 text-slate-400 font-bold">% Minutos posibles</td>
                {comparedPlayers.map((p) => (
                  <td key={p.dorsal} className="p-4 font-mono text-slate-900 dark:text-white">{p.porcentajeMinutos}%</td>
                ))}
              </tr>
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                <td className="p-4 text-slate-400 font-bold">Goles Marcados</td>
                {comparedPlayers.map((p) => (
                  <td key={p.dorsal} className="p-4 font-mono font-black text-rose-500 text-sm">{p.goles}</td>
                ))}
              </tr>
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                <td className="p-4 text-slate-400 font-bold">Goles por partido</td>
                {comparedPlayers.map((p) => (
                  <td key={p.dorsal} className="p-4 font-mono text-slate-500">{p.golesPorPartido}</td>
                ))}
              </tr>
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                <td className="p-4 text-slate-400 font-bold">Asistencias</td>
                {comparedPlayers.map((p) => (
                  <td key={p.dorsal} className="p-4 font-mono font-bold text-indigo-500 text-sm">{p.asistencias}</td>
                ))}
              </tr>
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                <td className="p-4 text-slate-400 font-bold">Asistencias por partido</td>
                {comparedPlayers.map((p) => (
                  <td key={p.dorsal} className="p-4 font-mono text-slate-500">{p.asistenciasPorPartido}</td>
                ))}
              </tr>
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                <td className="p-4 text-slate-400 font-bold">Convocatorias / Ausencias</td>
                {comparedPlayers.map((p) => (
                  <td key={p.dorsal} className="p-4 text-slate-900 dark:text-white">{p.convocatorias} convocados / <span className="text-rose-500">{p.ausencias} ausente</span></td>
                ))}
              </tr>
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                <td className="p-4 text-slate-400 font-bold">Titularidades / Suplencias</td>
                {comparedPlayers.map((p) => (
                  <td key={p.dorsal} className="p-4 text-slate-900 dark:text-white">{p.titularidades} iniciados / {p.suplencias} relevos</td>
                ))}
              </tr>
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                <td className="p-4 text-slate-400 font-bold">Puntos Totales Fantasy</td>
                {comparedPlayers.map((p) => (
                  <td key={p.dorsal} className="p-4 font-mono font-black text-orange-500 text-sm">{p.puntos} pts</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
};
