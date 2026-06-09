import React, { useState, useMemo } from "react";
import { Jugador, Posicion } from "../types";
import { Search, ArrowUpDown, Filter, Eye, Download, Star, Info, Check } from "lucide-react";

interface TableTabProps {
  jugadores: Jugador[];
  onSelectPlayer: (dorsal: number) => void;
}

export const TableTab: React.FC<TableTabProps> = ({ jugadores, onSelectPlayer }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState<string>("TODAS");
  const [minutosMinFilter, setMinutosMinFilter] = useState<number>(0);
  const [sortField, setSortField] = useState<keyof Jugador>("dorsal");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Control de visibilidad de columnas
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    dorsal: true,
    nombre: true,
    posicion: true,
    convocatorias: true,
    ausencias: false,
    porcentajeConvocado: true,
    titularidades: true,
    suplencias: false,
    porcentajeTitular: true,
    porcentajeSuplente: false,
    minutosPosibles: false,
    minutosJugados: true,
    porcentajeMinutos: true,
    goles: true,
    asistencias: true,
    tarjetasAmarillas: true,
    tarjetasRojas: false,
    puntos: true,
    golesPorPartido: true,
    asistenciasPorPartido: true,
  });

  const [showConfig, setShowConfig] = useState(false);

  // Columnas descriptivas
  const columnsList = [
    { key: "dorsal", label: "#" },
    { key: "nombre", label: "Nombre" },
    { key: "posicion", label: "Posición" },
    { key: "convocatorias", label: "Conv." },
    { key: "ausencias", label: "Aus." },
    { key: "porcentajeConvocado", label: "% Conv." },
    { key: "titularidades", label: "Tit." },
    { key: "suplencias", label: "Supl." },
    { key: "porcentajeTitular", label: "% Tit." },
    { key: "porcentajeSuplente", label: "% Supl." },
    { key: "minutosPosibles", label: "Min. Posib." },
    { key: "minutosJugados", label: "Min. Jugados" },
    { key: "porcentajeMinutos", label: "% Min." },
    { key: "goles", label: "Goles" },
    { key: "asistencias", label: "Asist." },
    { key: "tarjetasAmarillas", label: "Am." },
    { key: "tarjetasRojas", label: "Ro." },
    { key: "puntos", label: "Puntos" },
    { key: "golesPorPartido", label: "G/P" },
    { key: "asistenciasPorPartido", label: "A/P" },
  ];

  // Hallar máximos para resaltar líderes estadísticos
  const maxEstadisticas = useMemo(() => {
    return {
      goles: Math.max(...jugadores.map((j) => j.goles)),
      asistencias: Math.max(...jugadores.map((j) => j.asistencias)),
      minutosJugados: Math.max(...jugadores.map((j) => j.minutosJugados)),
      puntos: Math.max(...jugadores.map((j) => j.puntos)),
    };
  }, [jugadores]);

  const handleSort = (field: keyof Jugador) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc"); // Default to desc for quick ranking
    }
  };

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Filtrar y ordenar
  const filteredAndSortedJugadores = useMemo(() => {
    let result = [...jugadores];

    // Filtrar por término de búsqueda
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (j) =>
          j.nombre.toLowerCase().includes(term) ||
          j.posicion.toLowerCase().includes(term) ||
          j.dorsal.toString() === term
      );
    }

    // Filtrar por posición
    if (positionFilter !== "TODAS") {
      result = result.filter((j) => j.posicion === positionFilter);
    }

    // Filtrar por minutos mínimos
    if (minutosMinFilter > 0) {
      result = result.filter((j) => j.minutosJugados >= minutosMinFilter);
    }

    // Ordenar
    result.sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];

      if (typeof valA === "string" && typeof valB === "string") {
        return sortDirection === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      } else {
        // Numéricos o booleanos
        const numA = (valA as number) ?? 0;
        const numB = (valB as number) ?? 0;
        return sortDirection === "asc" ? numA - numB : numB - numA;
      }
    });

    return result;
  }, [jugadores, searchTerm, positionFilter, minutosMinFilter, sortField, sortDirection]);

  // Exportar a CSV
  const handleExportCSV = () => {
    // Generar cabecera con columnas visibles
    const headers = columnsList
      .filter((col) => visibleColumns[col.key])
      .map((col) => col.label);

    const rows = filteredAndSortedJugadores.map((jugador) => {
      return columnsList
        .filter((col) => visibleColumns[col.key])
        .map((col) => {
          const val = jugador[col.key as keyof Jugador];
          return typeof val === "string" ? `"${val}"` : val;
        });
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Estadisticas_Apurtuarte_2016.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Posición badge styling
  const obtenerPosicionStyle = (pos: Posicion) => {
    switch (pos) {
      case Posicion.Portero:
        return "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-200 dark:border-amber-900";
      case Posicion.Defensa:
        return "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-400 border border-blue-200 dark:border-blue-900";
      case Posicion.Medio:
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900";
      case Posicion.Extremo:
        return "bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-400 border border-purple-200 dark:border-purple-900";
      case Posicion.Delantero:
        return "bg-red-100 text-red-800 dark:bg-rose-950/50 dark:text-rose-400 border border-red-200 dark:border-red-900";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-800 dark:text-slate-100">
      {/* Controles de Filtros */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-xs border border-slate-100 dark:border-slate-800 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto flex-1">
            {/* Buscador buscador por nombre */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por jugador o posición..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-sm font-medium border border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-xs outline-hidden tracking-normal transition-all"
              />
            </div>

            {/* Selector por posición */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={positionFilter}
                onChange={(e) => setPositionFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800/50 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 border border-transparent"
              >
                <option value="TODAS">Todas las posiciones</option>
                <option value={Posicion.Portero}>Porteros</option>
                <option value={Posicion.Defensa}>Defensas</option>
                <option value={Posicion.Medio}>Centrocampistas</option>
                <option value={Posicion.Extremo}>Extremos</option>
                <option value={Posicion.Delantero}>Delanteros</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2.5 w-full sm:w-auto shrink-0">
            {/* Mostrar/ocultar columnas toggler */}
            <button
              onClick={() => setShowConfig(!showConfig)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                showConfig
                  ? "bg-slate-100 border-slate-300 dark:bg-slate-800 dark:border-slate-700"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <Eye className="w-4 h-4" /> Configurar Columnas
            </button>

            {/* Exportar a CSV */}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" /> Exportar CSV
            </button>
          </div>
        </div>

        {/* Panel de Configuración de Columnas visibles */}
        {showConfig && (
          <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-4 border border-slate-100 dark:border-slate-800/50 space-y-3">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-emerald-500" /> Selecciona qué columnas deseas mostrar u ocultar:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
              {columnsList.map((col) => (
                <button
                  key={col.key}
                  disabled={col.key === "nombre" || col.key === "dorsal"}
                  onClick={() => toggleColumn(col.key)}
                  className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-semibold text-left border transition-all ${
                    col.key === "nombre" || col.key === "dorsal"
                      ? "opacity-60 bg-slate-100 border-slate-200"
                      : visibleColumns[col.key]
                      ? "bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-400"
                      : "bg-white border-slate-200 text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 hover:border-slate-300"
                  }`}
                >
                  <span className="truncate">{col.label}</span>
                  {visibleColumns[col.key] && <Check className="w-3.5 h-3.5 shrink-0 ml-1.5 text-emerald-500" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tabla Principal */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xs border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800">
                {columnsList
                  .filter((col) => visibleColumns[col.key])
                  .map((col) => {
                    const isSorted = sortField === col.key;
                    return (
                      <th
                        key={col.key}
                        onClick={() => handleSort(col.key as keyof Jugador)}
                        className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <div className="flex items-center gap-1.5">
                          {col.label}
                          <ArrowUpDown className={`w-3 h-3 transition-colors ${
                            isSorted ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-300'
                          }`} />
                        </div>
                      </th>
                    );
                  })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAndSortedJugadores.map((jugador) => (
                <tr
                  key={jugador.dorsal}
                  onClick={() => onSelectPlayer(jugador.dorsal)}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/20 transition-colors cursor-pointer group"
                >
                  {visibleColumns.dorsal && (
                    <td className="p-4 font-mono font-black text-slate-900 dark:text-white">
                      #{jugador.dorsal}
                    </td>
                  )}
                  {visibleColumns.nombre && (
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {jugador.nombre}
                        </span>
                        {/* Highlights lideres */}
                        {(jugador.goles === maxEstadisticas.goles && jugador.goles > 0) && (
                          <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 text-[9px] font-black tracking-wider flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 fill-current" /> Pichichi
                          </span>
                        )}
                      </div>
                    </td>
                  )}
                  {visibleColumns.posicion && (
                    <td className="p-4 text-xs">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${obtenerPosicionStyle(jugador.posicion)}`}>
                        {jugador.posicion}
                      </span>
                    </td>
                  )}
                  {visibleColumns.convocatorias && <td className="p-4 text-sm font-semibold text-slate-700 dark:text-slate-300">{jugador.convocatorias}</td>}
                  {visibleColumns.ausencias && <td className="p-4 text-sm text-slate-500">{jugador.ausencias}</td>}
                  {visibleColumns.porcentajeConvocado && <td className="p-4 text-sm font-semibold">{jugador.porcentajeConvocado}%</td>}
                  {visibleColumns.titularidades && <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{jugador.titularidades}</td>}
                  {visibleColumns.suplencias && <td className="p-4 text-sm text-slate-500">{jugador.suplencias}</td>}
                  {visibleColumns.porcentajeTitular && <td className="p-4 text-sm text-slate-500">{jugador.porcentajeTitular}%</td>}
                  {visibleColumns.porcentajeSuplente && <td className="p-4 text-sm text-slate-400">{jugador.porcentajeSuplente}%</td>}
                  {visibleColumns.minutosPosibles && <td className="p-4 text-sm text-slate-500">{jugador.minutosPosibles}'</td>}
                  {visibleColumns.minutosJugados && (
                    <td className="p-4 font-mono text-sm font-semibold">
                      {jugador.minutosJugados}'
                    </td>
                  )}
                  {visibleColumns.porcentajeMinutos && (
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-12 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-emerald-500 h-full rounded-full" 
                            style={{ width: `${Math.min(100, jugador.porcentajeMinutos)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{jugador.porcentajeMinutos}%</span>
                      </div>
                    </td>
                  )}
                  {visibleColumns.goles && (
                    <td className={`p-4 font-black ${jugador.goles === maxEstadisticas.goles && jugador.goles > 0 ? "text-amber-500 dark:text-amber-400" : "text-slate-900 dark:text-white"}`}>
                      {jugador.goles}
                    </td>
                  )}
                  {visibleColumns.asistencias && (
                    <td className="p-4 font-bold text-indigo-600 dark:text-indigo-400">
                      {jugador.asistencias}
                    </td>
                  )}
                  {visibleColumns.tarjetasAmarillas && (
                    <td className="p-4 text-xs font-semibold">
                      {jugador.tarjetasAmarillas > 0 ? (
                        <span className="px-2 py-0.5 bg-amber-400 text-slate-900 font-bold rounded-sm text-[10px]">
                          {jugador.tarjetasAmarillas}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                  )}
                  {visibleColumns.tarjetasRojas && (
                    <td className="p-4 text-xs font-semibold">
                      {jugador.tarjetasRojas > 0 ? (
                        <span className="px-2 py-0.5 bg-red-600 text-white font-bold rounded-sm text-[10px]">
                          {jugador.tarjetasRojas}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                  )}
                  {visibleColumns.puntos && (
                    <td className="p-4 font-mono font-bold text-orange-600 dark:text-orange-400 text-sm">
                      {jugador.puntos}
                    </td>
                  )}
                  {visibleColumns.golesPorPartido && <td className="p-4 text-xs text-slate-500 font-mono">{jugador.golesPorPartido}</td>}
                  {visibleColumns.asistenciasPorPartido && <td className="p-4 text-xs text-slate-500 font-mono">{jugador.asistenciasPorPartido}</td>}
                </tr>
              ))}
              {filteredAndSortedJugadores.length === 0 && (
                <tr>
                  <td colSpan={20} className="p-8 text-center text-slate-400 font-medium">
                    Ningún jugador coincide con los filtros especificados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pie Metrallado */}
      <div className="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex items-start gap-2.5">
        <Info className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
          Haz clic en cualquier fila para ver la ficha detallada de estilo "FIFA/Panini" de ese jugador, o usa las cabeceras para reordenar por goles, asistencias o minutos jugados.
        </div>
      </div>
    </div>
  );
};
