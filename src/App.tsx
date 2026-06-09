import React, { useState, useEffect } from "react";
import { AppState, Posicion } from "./types";
import { SEED_EQUIPO, SEED_BASE_JUGADORES, SEED_JORNADAS, SEED_ESTADISTICAS_MATCH } from "./data/seedData";
import { calcularEstadisticasJugadores } from "./utils/statsCalculator";
import { DashboardTab } from "./components/DashboardTab";
import { TableTab } from "./components/TableTab";
import { GraphicsTab } from "./components/GraphicsTab";
import { PlayerProfileTab } from "./components/PlayerProfileTab";
import { JornadasTab } from "./components/JornadasTab";
import { CompareTab } from "./components/CompareTab";
import { ImportTab } from "./components/ImportTab";
import { 
  Trophy, Users, BarChart3, Presentation, CalendarCheck2, 
  ArrowLeftRight, Database, Sun, Moon, Sparkles, Menu, X, Landmark
} from "lucide-react";

export default function App() {
  // Estado principal de la aplicación
  const [appState, setAppState] = useState<AppState>(() => {
    const defaultPlayers = calcularEstadisticasJugadores(
      SEED_BASE_JUGADORES,
      SEED_JORNADAS,
      SEED_ESTADISTICAS_MATCH,
      SEED_EQUIPO.duracionPartido
    );
    return {
      equipo: SEED_EQUIPO,
      jugadores: defaultPlayers,
      jornadas: SEED_JORNADAS,
      estadisticasMatch: SEED_ESTADISTICAS_MATCH,
    };
  });

  // Navegación de pestañas
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // Estados de navegación cruzada
  const [selectedPlayerDorsal, setSelectedPlayerDorsal] = useState<number | null>(null);
  const [selectedJornada, setSelectedJornada] = useState<number>(1);

  // Modo Oscuro / Claro
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // Apuntar a oscuro por defecto para estética deportiva premium
    return true;
  });

  // Menú móvil responsive toggler
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  // Manejar importación de datos externa
  const handleImportState = (newState: AppState) => {
    setAppState(newState);
    // Reiniciar selecciones seguras
    setSelectedPlayerDorsal(newState.jugadores[0]?.dorsal || null);
    setSelectedJornada(newState.jornadas[0]?.numeroJornada || 1);
  };

  // Reestablecer datos iniciales de fábrica
  const handleResetToSeed = () => {
    const defaultPlayers = calcularEstadisticasJugadores(
      SEED_BASE_JUGADORES,
      SEED_JORNADAS,
      SEED_ESTADISTICAS_MATCH,
      SEED_EQUIPO.duracionPartido
    );
    setAppState({
      equipo: SEED_EQUIPO,
      jugadores: defaultPlayers,
      jornadas: SEED_JORNADAS,
      estadisticasMatch: SEED_ESTADISTICAS_MATCH,
    });
    setSelectedPlayerDorsal(SEED_BASE_JUGADORES[0]?.dorsal);
    setSelectedJornada(1);
    setActiveTab("dashboard");
  };

  // Navegación rápida de jugador
  const focusPlayerProfile = (dorsal: number | null) => {
    setSelectedPlayerDorsal(dorsal);
    setActiveTab("jugadores");
    setMobileMenuOpen(false);
  };

  // Navegación rápida de jornada
  const focusJornadaDetails = (numero: number) => {
    setSelectedJornada(numero);
    setActiveTab("jornadas");
    setMobileMenuOpen(false);
  };

  // Definición de las pestañas de navegación
  const navigationTabs = [
    { id: "dashboard", label: "Dashboard", icon: Trophy },
    { id: "tabla", label: "Tabla", icon: Users },
    { id: "graficos", label: "Gráficos", icon: BarChart3 },
    { id: "jugadores", label: "Fichas", icon: Presentation },
    { id: "jornadas", label: "Jornadas", icon: CalendarCheck2 },
    { id: "comparador", label: "Comparar", icon: ArrowLeftRight },
    { id: "importar", label: "Importación", icon: Database },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 font-sans antialiased transition-colors duration-200 selection:bg-indigo-500/30">
      
      {/* Top Navigation Bar (Vibrant Indigo theme) */}
      <header className="sticky top-0 z-40 bg-indigo-700 dark:bg-indigo-950 text-white shadow-lg border-b border-indigo-850/40 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo / Club Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-700 shadow-md">
              <Landmark className="w-5.5 h-5.5" />
            </div>
            <div>
              <p className="text-sm font-black tracking-tight leading-none uppercase text-white">
                {appState.equipo.equipo}
              </p>
              <p className="text-[10px] font-bold text-indigo-200 font-mono tracking-wider mt-0.5">
                TEMPORADA {appState.equipo.temporada}
              </p>
            </div>
          </div>

          {/* Desktop Tab Menu */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigationTabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-white/20 text-white shadow-inner border border-white/10"
                      : "text-indigo-150 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <TabIcon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-300' : 'text-indigo-200'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Header Operations (Theme toggle & burger menu) */}
          <div className="flex items-center gap-2">
            
            {/* Theme Toggle Button */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl border border-indigo-650 dark:border-indigo-850 bg-indigo-800 dark:bg-indigo-900 shadow-xs hover:bg-indigo-650 dark:hover:bg-indigo-800 text-indigo-105 transition-all cursor-pointer active:scale-95"
              title={darkMode ? "Estilo claro" : "Estilo oscuro"}
            >
              {darkMode ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-white" />}
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl border border-indigo-650 dark:border-indigo-850 bg-indigo-800 dark:bg-indigo-900 shadow-xs hover:bg-indigo-650 dark:hover:bg-indigo-800 text-indigo-105 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-4.5 h-4.5 text-white" /> : <Menu className="w-4.5 h-4.5 text-white" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Slider Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 z-50 bg-indigo-800/95 dark:bg-indigo-950/95 backdrop-blur-lg border-b border-indigo-900 p-6 space-y-3 animate-fade-in text-white">
          <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest px-2.5 mb-2">Secciones de Análisis</p>
          {navigationTabs.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                  isActive
                    ? "bg-white/20 text-white border border-white/10 shadow-md"
                    : "text-indigo-100 hover:bg-white/5"
                }`}
              >
                <TabIcon className={`w-5 h-5 shrink-0 ${isActive ? 'text-amber-400' : 'text-indigo-200'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Workspace Frame container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {activeTab === "dashboard" && (
          <DashboardTab 
            state={appState} 
            onNavigateToTab={(tabId) => setActiveTab(tabId)}
            onSelectPlayer={focusPlayerProfile}
            onSelectJornada={focusJornadaDetails}
          />
        )}
        {activeTab === "tabla" && (
          <TableTab 
            jugadores={appState.jugadores} 
            onSelectPlayer={focusPlayerProfile} 
          />
        )}
        {activeTab === "graficos" && (
          <GraphicsTab 
            state={appState} 
          />
        )}
        {activeTab === "jugadores" && (
          <PlayerProfileTab 
            state={appState} 
            selectedPlayerDorsal={selectedPlayerDorsal}
            onSelectPlayer={setSelectedPlayerDorsal}
          />
        )}
        {activeTab === "jornadas" && (
          <JornadasTab 
            state={appState} 
            selectedJornada={selectedJornada}
            onSelectJornada={setSelectedJornada}
            onSelectPlayer={focusPlayerProfile}
          />
        )}
        {activeTab === "comparador" && (
          <CompareTab 
            state={appState} 
            onSelectPlayer={focusPlayerProfile}
          />
        )}
        {activeTab === "importar" && (
          <ImportTab 
            onImportState={handleImportState}
            onResetToSeed={handleResetToSeed}
          />
        )}
      </main>

      {/* Responsive Footer */}
      <footer className="mt-20 border-t border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900/30 py-8 text-center text-xs text-slate-400 font-semibold font-mono tracking-wide">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <p>APURTUARTE BENJAMÍN 2016 • CLASIFICACIONES DE GOL, ASISTENCIAS Y PRESENCIA</p>
          <p className="text-[10px] text-slate-500 uppercase">
            Diseño proactivo • Creado mediante análisis e ingeniería deportiva senior • Temporada 2025-2026
          </p>
        </div>
      </footer>

    </div>
  );
}
