import React, { useState } from "react";
import { AppState, Posicion, Jugador } from "../types";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
  LineChart, Line, PieChart, Pie, AreaChart, Area
} from "recharts";
import { BarChart3, TrendingUp, Users, Grid, RefreshCw } from "lucide-react";

interface GraphicsTabProps {
  state: AppState;
}

export const GraphicsTab: React.FC<GraphicsTabProps> = ({ state }) => {
  const { jugadores, jornadas, estadisticasMatch } = state;
  const [activeSubTab, setActiveSubTab] = useState<"individual" | "colectivo" | "matriz">("individual");

  // Colores fijos de Recharts
  const COLORS_POSICIONES = {
    [Posicion.Portero]: "#eab308", // Amarillo/Dorado
    [Posicion.Defensa]: "#3b82f6", // Azul
    [Posicion.Medio]: "#10b981", // Verde
    [Posicion.Extremo]: "#a855f7", // Morado
    [Posicion.Delantero]: "#f43f5e", // Rojo/Rosa
  };

  // 1. Datos para Distribución por Posición
  const distribucionPosiciones = Object.values(Posicion).map((pos) => {
    const count = jugadores.filter((j) => j.posicion === pos).length;
    return { name: pos, value: count, color: COLORS_POSICIONES[pos] };
  });

  // 2. Jugadores ordenados por minutos
  const rankingMinutos = [...jugadores].sort((a, b) => b.minutosJugados - a.minutosJugados);

  // 3. Jugadores ordenados por goles
  const rankingGoles = [...jugadores]
    .filter((j) => j.goles > 0)
    .sort((a, b) => b.goles - a.goles);

  // 4. Jugadores ordenados por asistencias
  const rankingAsistencias = [...jugadores]
    .filter((j) => j.asistencias > 0)
    .sort((a, b) => b.asistencias - a.asistencias);

  // 5. Presencia: Convocatorias, Titularidades, Suplencias, Ausencias agregadas
  const participacionGlobal = jugadores.map((p) => ({
    name: p.nombre,
    Titular: p.titularidades,
    Suplente: p.suplencias,
    Ausente: p.ausencias,
  }));

  // 6. Evolución por jornada: goles a favor y en contra
  const golesPorJornada = jornadas.map((j) => ({
    name: `J${j.numeroJornada}`,
    Favor: j.golesFavor,
    Contra: j.golesContra,
    rival: j.rival,
  }));

  // 7. Puntos acumulados del equipo jornada a jornada
  let acum = 0;
  const puntosAcumulados = jornadas.map((j) => {
    let pts = 0;
    if (j.golesFavor > j.golesContra) pts = 3;
    else if (j.golesFavor === j.golesContra) pts = 1;
    acum += pts;
    return {
      name: `J${j.numeroJornada}`,
      "Puntos Acumulados": acum,
      rival: j.rival,
      Resultado: `${j.golesFavor}-${j.golesContra}`,
    };
  });

  return (
    <div className="space-y-6 animate-fade-in text-slate-800 dark:text-slate-100">
      {/* Mini-Navegador de Sub-Secciones */}
      <div className="flex bg-slate-100 dark:bg-slate-805 p-1.5 rounded-2xl max-w-md border border-slate-205/50 dark:border-slate-800">
        <button
          onClick={() => setActiveSubTab("individual")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === "individual"
              ? "bg-indigo-750 text-white dark:bg-indigo-900 shadow-sm font-extrabold"
              : "text-slate-550 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800"
          }`}
        >
          <Users className="w-4 h-4" /> Individuales
        </button>
        <button
          onClick={() => setActiveSubTab("colectivo")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === "colectivo"
              ? "bg-indigo-750 text-white dark:bg-indigo-900 shadow-sm font-extrabold"
              : "text-slate-550 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800"
          }`}
        >
          <TrendingUp className="w-4 h-4" /> Evolución Equipo
        </button>
        <button
          onClick={() => setActiveSubTab("matriz")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === "matriz"
              ? "bg-indigo-750 text-white dark:bg-indigo-900 shadow-sm font-extrabold"
              : "text-slate-550 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800"
          }`}
        >
          <Grid className="w-4 h-4" /> Matriz Presencia
        </button>
      </div>

      {activeSubTab === "individual" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ranking Goles */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5 prose-h3">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Goles Marcados por Jugador
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rankingGoles} layout="vertical" margin={{ left: 10, right: 10, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                  <YAxis dataKey="nombre" type="category" stroke="#94a3b8" fontSize={11} width={65} />
                  <Tooltip 
                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                    formatter={(val) => [`${val} goles`, "Goles"]}
                  />
                  <Bar dataKey="goles" fill="#f43f5e" radius={[0, 4, 4, 0]} barSize={16}>
                    {rankingGoles.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_POSICIONES[entry.posicion]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Ranking Asistencias */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5 prose-h3">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Asistencias de Gol
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rankingAsistencias} layout="vertical" margin={{ left: 10, right: 10, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                  <YAxis dataKey="nombre" type="category" stroke="#94a3b8" fontSize={11} width={65} />
                  <Tooltip 
                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                    formatter={(val) => [`${val} asistencias`, "Asistencias"]}
                  />
                  <Bar dataKey="asistencias" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={16}>
                    {rankingAsistencias.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_POSICIONES[entry.posicion]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Ranking de Minutos */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 lg:col-span-2">
            <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5 prose-h3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Minutos Totales Acumulados
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rankingMinutos} margin={{ left: 10, right: 10, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="nombre" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} unit="'" />
                  <Tooltip 
                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                    formatter={(val) => [`${val} minutos`, "Minutos"]}
                  />
                  <Bar dataKey="minutosJugados" radius={[4, 4, 0, 0]} barSize={24}>
                    {rankingMinutos.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_POSICIONES[entry.posicion]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Presencia Global: Titularidades vs Suplencias */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5 prose-h3">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Titularidad vs Suplencia vs Ausencia
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={participacionGlobal} margin={{ left: 10, right: 10, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} angle={-15} textAnchor="end" height={45} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="Titular" stackId="a" fill="#10b981" />
                  <Bar dataKey="Suplente" stackId="a" fill="#3b82f6" />
                  <Bar dataKey="Ausente" stackId="a" fill="#f43f5e" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Distribución por Posición */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5 prose-h3">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Distribución Táctica
            </h3>
            <div className="h-64 flex flex-col sm:flex-row items-center justify-around gap-4">
              <div className="w-44 h-44 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distribucionPosiciones}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {distribucionPosiciones.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val) => [`${val} jugadores`, "Cantidad"]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 w-full max-w-xs">
                {distribucionPosiciones.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-medium">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                      <span>{item.name}s</span>
                    </div>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{item.value} ({Math.round(item.value / jugadores.length * 100)}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "colectivo" && (
        <div className="space-y-6">
          {/* Goles a favor y en contra por jornada */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5 prose-h3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Goles a Favor vs Goles en Contra por Jornada
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={golesPorJornada} margin={{ left: 10, right: 10, top: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                    formatter={(val, name, props) => [`${val} goles`, name === "Favor" ? "Goles a Favor" : "Goles en Contra"]}
                    labelFormatter={(label, items) => {
                      const item = items[0]?.payload;
                      return `${label} vs ${item?.rival || ''}`;
                    }}
                  />
                  <Legend iconType="circle" />
                  <Line type="monotone" dataKey="Favor" stroke="#10b981" strokeWidth={3} activeDot={{ r: 8 }} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Contra" stroke="#f43f5e" strokeWidth={3} activeDot={{ r: 8 }} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Evolución de puntos acumulados */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5 prose-h3">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Evolución de la Clasificación (Puntos Acumulados)
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={puntosAcumulados} margin={{ left: 10, right: 10, top: 10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorPts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                    labelFormatter={(label, items) => {
                      const item = items[0]?.payload;
                      return `${label} vs ${item?.rival || ''} (${item?.Resultado || ''})`;
                    }}
                  />
                  <Legend iconType="circle" />
                  <Area type="monotone" dataKey="Puntos Acumulados" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorPts)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "matriz" && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider prose-h3">Matriz de Presencia por Jornada</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Representa visualmente los minutos jugados y la condición de cada uno en cada partido.</p>
            </div>
            
            {/* Legend indicators */}
            <div className="flex gap-4 text-[10px] font-bold">
              <div className="flex items-center gap-1">
                <span className="w-3.5 h-3.5 bg-emerald-500 rounded-sm"></span> Titular
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3.5 h-3.5 bg-blue-500 rounded-sm"></span> Suplente
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3.5 h-3.5 bg-rose-500 rounded-sm"></span> Ausente
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse min-w-max">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="p-2.5 text-left text-xs font-bold text-slate-400 uppercase">Jugador</th>
                  {jornadas.map((j) => (
                    <th key={j.numeroJornada} className="p-2.5 text-xs font-bold text-slate-400 font-mono w-12" title={`vs ${j.rival}`}>
                      J{j.numeroJornada}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {jugadores.map((player) => {
                  return (
                    <tr key={player.dorsal} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                      <td className="p-2.5 text-left font-bold text-sm text-slate-950 dark:text-white flex items-center gap-1.5">
                        <span className="text-[10px] font-black text-slate-400 w-5">#{player.dorsal}</span>
                        {player.nombre}
                      </td>
                      {jornadas.map((j) => {
                        const cellStat = estadisticasMatch.find(
                          (ev) => ev.jugadorDorsal === player.dorsal && ev.jornadaNumero === j.numeroJornada
                        );

                        let bgColor = "bg-slate-100 dark:bg-slate-800 text-slate-400";
                        let titleText = `${player.nombre} - No convocado`;

                        if (cellStat) {
                          if (cellStat.ausente) {
                            bgColor = "bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400";
                            titleText = `${player.nombre} - Ausente`;
                          } else if (cellStat.titular) {
                            bgColor = "bg-emerald-500 text-white shadow-xs font-black";
                            titleText = `${player.nombre} - Titular (${cellStat.minutos}')`;
                          } else if (cellStat.suplente) {
                            bgColor = "bg-blue-500 text-white font-bold";
                            titleText = `${player.nombre} - Suplente (${cellStat.minutos}')`;
                          }
                        }

                        return (
                          <td key={j.numeroJornada} className="p-1">
                            <div 
                              className={`h-8 w-11 mx-auto rounded-lg flex items-center justify-center text-[10px] font-mono transition-transform hover:scale-115 cursor-help ${bgColor}`}
                              title={titleText}
                            >
                              {cellStat && !cellStat.ausente ? `${cellStat.minutos}'` : "A"}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
