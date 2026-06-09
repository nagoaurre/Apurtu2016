import React, { useState } from "react";
import { AppState, Posicion } from "../types";
import { SEED_EQUIPO, SEED_BASE_JUGADORES, SEED_JORNADAS, SEED_ESTADISTICAS_MATCH } from "../data/seedData";
import { calcularEstadisticasJugadores } from "../utils/statsCalculator";
import * as XLSX from "xlsx";
import { Upload, Database, CheckCircle2, RotateCcw, AlertCircle, FileSpreadsheet, Clipboard } from "lucide-react";

interface ImportTabProps {
  onImportState: (newState: AppState) => void;
  onResetToSeed: () => void;
}

export const ImportTab: React.FC<ImportTabProps> = ({ onImportState, onResetToSeed }) => {
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [activeImportMode, setActiveImportMode] = useState<"file" | "paste">("file");
  const [pastedJSON, setPastedJSON] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const bstr = event.target?.result;
        const workbook = XLSX.read(bstr, { type: "binary" });

        // Intentar parsear las hojas o interpretar los datos principales
        // En nuestro modelo de normalización, si el usuario sube un archivo con las pestañas "Jornadas" y "Estadisticas", las mapeamos.
        // Si no, integramos los datos de forma inteligente estructurando el JSON.
        
        let jornadasImportadas = [...SEED_JORNADAS];
        let estadisticasImportadas = [...SEED_ESTADISTICAS_MATCH];
        let baseJugadoresImportados = [...SEED_BASE_JUGADORES];

        // Mapeamos hojas de forma inteligente si coinciden con nombres como "Jornadas", "Partidos", "Plantilla", "Estadísticas"
        workbook.SheetNames.forEach((sheetName) => {
          const lowerName = sheetName.toLowerCase();
          const worksheet = workbook.Sheets[sheetName];
          const rawJson = XLSX.utils.sheet_to_json<any>(worksheet);

          if (lowerName.includes("jornada") || lowerName.includes("partido")) {
            jornadasImportadas = rawJson.map((row: any) => ({
              numeroJornada: parseInt(row.numeroJornada || row.jornada || row.Jornada || 1),
              fecha: row.fecha || row.Fecha || "2026-01-01",
              hora: row.hora || row.Hora || "10:00",
              rival: row.rival || row.Rival || "Rival Desconocido",
              localVisitante: (row.localVisitante || row.LocalVisitante || "").toLowerCase().includes("vis") ? "Visitante" : "Local",
              resultadoDescanso: row.resultadoDescanso || row.Descanso || "0-0",
              resultadoFinal: row.resultadoFinal || row.Resultado || "0-0",
              golesFavor: parseInt(row.golesFavor || row.Favor || row.GolesFavor || 0),
              golesContra: parseInt(row.golesContra || row.Contra || row.GolesContra || 0),
            }));
          } else if (lowerName.includes("jugador") || lowerName.includes("plantilla")) {
            baseJugadoresImportados = rawJson.map((row: any) => {
              let pos = Posicion.Medio;
              const rPos = (row.posicion || row.Posicion || "").toLowerCase();
              if (rPos.includes("port") || rPos.includes("gk")) pos = Posicion.Portero;
              else if (rPos.includes("def") || rPos.includes("df")) pos = Posicion.Defensa;
              else if (rPos.includes("ext") || rPos.includes("wf")) pos = Posicion.Extremo;
              else if (rPos.includes("del") || rPos.includes("fw") || rPos.includes("ata")) pos = Posicion.Delantero;

              return {
                dorsal: parseInt(row.dorsal || row.Dorsal || row.Numero || 1),
                nombre: row.nombre || row.Nombre || "Jugador",
                posicion: pos,
              };
            });
          } else if (lowerName.includes("estadistica") || lowerName.includes("desempeño") || lowerName.includes("juegos")) {
            estadisticasImportadas = rawJson.map((row: any) => ({
              jugadorDorsal: parseInt(row.jugadorDorsal || row.dorsal || row.Dorsal || 1),
              jornadaNumero: parseInt(row.jornadaNumero || row.jornada || row.Jornada || 1),
              convocado: row.convocado === undefined ? true : !!row.convocado,
              ausente: !!row.ausente,
              titular: !!row.titular,
              suplente: !!row.suplente,
              minutos: parseInt(row.minutos || row.Minutos || 0),
              goles: parseInt(row.goles || row.Goles || 0),
              asistencias: parseInt(row.asistencias || row.Asistencias || 0),
              tarjetasAmarillas: parseInt(row.tarjetasAmarillas || row.amarillas || 0),
              tarjetasRojas: parseInt(row.tarjetasRojas || row.rojas || 0),
              puntos: parseInt(row.puntos || row.Puntos || 0),
            }));
          }
        });

        // Calcular e importar
        const jugadoresCalculados = calcularEstadisticasJugadores(
          baseJugadoresImportados,
          jornadasImportadas,
          estadisticasImportadas,
          SEED_EQUIPO.duracionPartido
        );

        onImportState({
          equipo: {
            ...SEED_EQUIPO,
            minutosTotales: jornadasImportadas.length * SEED_EQUIPO.duracionPartido,
          },
          jugadores: jugadoresCalculados,
          jornadas: jornadasImportadas,
          estadisticasMatch: estadisticasImportadas,
        });

        setSuccessMsg(`¡Excelente! Archivo Excel parseado con éxito. Se detectaron ${jornadasImportadas.length} jornadas, ${baseJugadoresImportados.length} jugadores en la plantilla y ${estadisticasImportadas.length} entradas estadísticas.`);
        setErrorMsg("");
      } catch (err: any) {
        setErrorMsg(`Error al procesar el Excel: ${err.message || "Estructura del archivo no soportada."}`);
        setSuccessMsg("");
      }
    };
    reader.readAsBinaryString(file);
  };

  const handlePasteImport = () => {
    try {
      if (!pastedJSON.trim()) {
        setErrorMsg("El campo de texto está vacío.");
        return;
      }

      const parsed = JSON.parse(pastedJSON);
      
      // Validar estructura básica
      if (!parsed.equipo || !parsed.jornadas || !parsed.estadisticasMatch) {
         throw new Error("El JSON debe contener las llaves 'equipo', 'jornadas' y 'estadisticasMatch'.");
      }

      const baseJugadores = parsed.baseJugadores || SEED_BASE_JUGADORES;
      const jugadoresCalculados = calcularEstadisticasJugadores(
        baseJugadores,
        parsed.jornadas,
        parsed.estadisticasMatch,
        parsed.equipo.duracionPartido || 40
      );

      onImportState({
        equipo: parsed.equipo,
        jugadores: jugadoresCalculados,
        jornadas: parsed.jornadas,
        estadisticasMatch: parsed.estadisticasMatch,
      });

      setSuccessMsg("¡Perfecto! El JSON fue importado y recalculado por completo de forma satisfactoria.");
      setErrorMsg("");
    } catch (err: any) {
      setErrorMsg(`Error al validar JSON: ${err.message}`);
    }
  };

  const handleLoadSampleJSON = () => {
    const sample = {
      equipo: SEED_EQUIPO,
      baseJugadores: SEED_BASE_JUGADORES,
      jornadas: SEED_JORNADAS.slice(0, 3), // Ejemplo corto
      estadisticasMatch: SEED_ESTADISTICAS_MATCH.filter(s => s.jornadaNumero <= 3),
    };
    setPastedJSON(JSON.stringify(sample, null, 2));
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-800 dark:text-slate-100">
      
      {/* Cabecera / Explicativo */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
        <h2 className="text-xl font-bold font-sans text-slate-900 dark:text-white flex items-center gap-2">
          <Database className="w-5.5 h-5.5 text-emerald-500" /> Sincronización e Importación de Datos
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
          Puedes alimentar las estadísticas directamente subiendo tu Excel de seguimiento de partidos, o pegando un dataset estructurado. La aplicación recalculará de forma instantánea todos los rankings individuales, porcentajes, promedios y visualizaciones gráficas de la plantilla.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-950 rounded-xl flex items-start gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500 mt-0.5" />
          <div className="text-xs font-semibold leading-relaxed">{successMsg}</div>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-850 dark:text-rose-300 border border-rose-100 dark:border-rose-950 rounded-xl flex items-start gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
          <div className="text-xs font-semibold leading-relaxed">{errorMsg}</div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Panel de Importación Activo */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-6">
          <div className="flex bg-slate-100 dark:bg-slate-800/40 p-1 rounded-xl max-w-xs border border-slate-200/50">
            <button
              onClick={() => setActiveImportMode("file")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeImportMode === "file" ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs" : "text-slate-500"
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" /> Archivo Excel
            </button>
            <button
              onClick={() => setActiveImportMode("paste")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeImportMode === "paste" ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs" : "text-slate-500"
              }`}
            >
              <Clipboard className="w-3.5 h-3.5" /> Pegar Datos
            </button>
          </div>

          {activeImportMode === "file" ? (
            <div className="space-y-4">
              <label className="flex flex-col items-center justify-center w-full aspect-[16/6] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                  <Upload className="w-8 h-8 text-slate-400 mb-3" />
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Selecciona o arrastra tu Excel (.xlsx / .xls)</p>
                  <p className="text-xs text-slate-400 mt-1">Hojas reconocidas: "Jornadas" y "Estadisticas" (Fútbol Base)</p>
                </div>
                <input 
                  type="file" 
                  accept=".xlsx, .xls" 
                  className="hidden" 
                  onChange={handleFileUpload} 
                />
              </label>
              
              <div className="bg-slate-50 dark:bg-slate-800/20 p-4 rounded-xl border border-slate-100 dark:border-slate-800/50">
                <h4 className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">Instrucciones de Mapeado:</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                  Para lograr la sincronización total de tu libro local, nombra tus pestañas como <b>"Jornadas"</b> (con columnas <i>numeroJornada, rival, fecha, hora, golesFavor, golesContra</i>) y <b>"Estadísticas"</b> (con columnas <i>dorsal, jornada, minutos, goles, asistencias</i>) para que el lector del club Apurtuarte reconstruya el panel automáticamente.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <textarea
                value={pastedJSON}
                onChange={(e) => setPastedJSON(e.target.value)}
                placeholder="Pega tu estructura JSON de análisis aquí..."
                rows={10}
                className="w-full p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl font-mono text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 border border-transparent"
              />
              
              <div className="flex gap-2 justify-end">
                <button
                  onClick={handleLoadSampleJSON}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Cargar Estructura de Muestra
                </button>
                <button
                  onClick={handlePasteImport}
                  className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs rounded-xl hover:opacity-90 transition-all cursor-pointer"
                >
                  Procesar e Importar JSON
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Acciones de recuperación (Reset to seed) */}
        <div className="bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/40 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="font-bold text-slate-950 dark:text-white flex items-center gap-1.5 text-sm">
              <RotateCcw className="w-4 h-4 text-emerald-500" /> Restablecer por Defecto
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-semibold">
              ¿Quieres borrar cualquier cambio importado y regresar instantáneamente a la base de datos preconfigurada de las 15 jornadas del <b>Apurtuarte Benjamín 2016</b> con sus estadísticas de Pichichi, minutaje y calendario oficial 2025-2026?
            </p>
          </div>

          <button
            onClick={() => {
              onResetToSeed();
              setSuccessMsg("Base de datos original del Apurtuarte Benjamín 2016 restablecida exitosamente por completo.");
              setErrorMsg("");
            }}
            className="w-full flex items-center justify-center gap-1.5 px-4 py-3 bg-red-50 text-red-700 dark:bg-rose-950/20 dark:text-rose-400 border border-current font-bold text-xs rounded-xl hover:bg-red-100/50 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> Restaurar Seed Original
          </button>
        </div>

      </div>
    </div>
  );
};
