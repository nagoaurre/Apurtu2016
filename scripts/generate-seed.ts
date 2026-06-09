import fs from 'fs';
import pkg from 'xlsx';
const { read, utils } = pkg;

// Custom Excel date converter
function parseExcelDate(val: any): string {
  if (typeof val === 'number') {
    const date = new Date(1899, 11, 30 + val);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
  return String(val || '');
}

// Custom Excel time converter
function parseExcelTime(val: any): string {
  if (typeof val === 'number') {
    const totalSeconds = Math.round(val * 24 * 3600);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }
  return String(val || '');
}

async function main() {
  const workbook = read(fs.readFileSync('temp_sheet.xlsx'));
  const sheet = workbook.Sheets['PARTIDOS APURTUARTE'];
  const data = pkg.utils.sheet_to_json<any[]>(sheet, { header: 1 });

  const getCellW = (r: number, c: number) => {
    const cell = sheet[utils.encode_cell({ r, c })];
    return cell ? cell.w || String(cell.v) : '';
  };

  // 1. Team Metadata
  // Row 2 Col 11: Duración partido, Row 3 Col 11: Jornadas a jugar, Row 4 Col 11: Minutos totales
  const duracionPartido = Number(data[2][11] || 51);
  const jornadasAJugar = Number(data[3][11] || 20);
  const minutosTotales = Number(data[4][11] || 1020);
  const entrenadorRaw = String(data[7][0] || "Asier & Gaizka").trim();
  const entrenador = entrenadorRaw.replace(/\n/g, ' & ');
  const equipo = "Apurtuarte Benjamín 2016";
  const temporada = String(data[10][0] || "2025-2026").trim();

  // 2. Base players from Rows 12 to 24 (inclusive)
  const basePlayers: any[] = [];
  const posMapping: Record<string, string> = {
    "POR": "Portero",
    "DEL": "Delantero",
    "DEF": "Defensa",
    "EXT": "Extremo",
    "MED": "Medio",
    "CEN": "Medio"
  };

  for (let r = 12; r <= 24; r++) {
    const row = data[r];
    if (!row) continue;
    const dorsal = Number(row[0]);
    const nombre = String(row[1]).trim();
    const posStr = String(row[2]).trim().toUpperCase();
    const posicion = posMapping[posStr] || "Medio";
    
    basePlayers.push({ dorsal, nombre, posicion });
  }

  // 3. Scan for Jornadas in Row 4 starting at Col 26
  const row4 = data[4];
  const jBlocks: number[] = [];
  row4.forEach((val, idx) => {
    if (val && (String(val).toUpperCase().includes("JORNADA") || String(val).toUpperCase().includes("FASE"))) {
      jBlocks.push(idx);
    }
  });

  const row12 = data[12]; // First player's row to get team totals

  const jornadas: any[] = [];
  const estadistasMatch: any[] = [];

  jBlocks.forEach((colIdx, seqIdx) => {
    const jNum = seqIdx + 1; // 1-based sequential number for our JSON timeline
    const originalLabel = String(row4[colIdx]).trim();
    
    // Rows 5, 6, 7, 8, 9, 10
    const lvRaw = getCellW(5, colIdx + 2).toUpperCase(); // e.g. "LOCAL" or "VISITANTE"
    const localVisitante = lvRaw.includes("VISI") ? "Visitante" : "Local";
    const fecha = parseExcelDate(data[6][colIdx + 2]);
    const hora = parseExcelTime(data[7][colIdx + 2]);
    const rival = String(data[8][colIdx + 2] || "Rival").trim();
    const resultadoDescanso = getCellW(9, colIdx + 2);
    
    // Team goals are in Row 12 (Ekhi - ColIdx + 6 and ColIdx + 7)
    const golesFavor = Number(row12[colIdx + 6] || 0);
    const golesContra = Number(row12[colIdx + 7] || 0);
    
    // Standardize outcome string
    const resultadoFinal = localVisitante === "Local" 
      ? `${golesFavor}-${golesContra}` 
      : `${golesContra}-${golesFavor}`;

    jornadas.push({
      numeroJornada: jNum,
      fecha,
      hora,
      rival,
      localVisitante,
      resultadoDescanso,
      resultadoFinal,
      golesFavor,
      golesContra
    });

    // Players individual statistics for this match
    for (let r = 12; r <= 24; r++) {
      const pRow = data[r];
      if (!pRow) continue;
      const dorsal = Number(pRow[0]);

      const ausenVal = pRow[colIdx + 0];
      const convoVal = pRow[colIdx + 1];
      const titulVal = pRow[colIdx + 2];
      const suplenVal = pRow[colIdx + 3];

      const ausente = ausenVal === 1 || String(ausenVal).toUpperCase() === "SI";
      const convocado = convoVal === 1 || String(convoVal).toUpperCase() === "SI" || (!ausente && (titulVal === 1 || suplenVal === 1));
      
      const titular = convocado && (titulVal === 1 || String(titulVal).toUpperCase() === "SI");
      const suplente = convocado && !titular;

      const minutos = Number(pRow[colIdx + 4] || 0);
      const goles = Number(pRow[colIdx + 5] || 0);
      const asistencias = Number(pRow[colIdx + 11] || 0);
      const amarillas = Number(pRow[colIdx + 12] || 0);
      const rojas = Number(pRow[colIdx + 13] || 0);
      const puntos = Number(pRow[colIdx + 14] || 0);

      const isPortero = basePlayers.find(bp => bp.dorsal === dorsal)?.posicion === "Portero";
      const stat: any = {
        jugadorDorsal: dorsal,
        jornadaNumero: jNum,
        convocado,
        ausente,
        titular,
        suplente,
        minutos,
        goles,
        asistencias,
        tarjetasAmarillas: amarillas,
        tarjetasRojas: rojas,
        puntos
      };

      if (isPortero) {
        stat.golesEnContra = convocado ? golesContra : 0;
      }
      
      const penaltis = Number(pRow[colIdx + 8] || 0);
      const faltas = Number(pRow[colIdx + 9] || 0);
      if (penaltis > 0) stat.penaltis = penaltis;
      if (faltas > 0) stat.faltas = faltas;

      estadistasMatch.push(stat);
    }
  });

  // Write TS file
  const tsContent = `// Auto-generated seed data from Excel spreadsheet at ${new Date().toISOString()}
import { Posicion } from "../types";
import { BaseJugador } from "../utils/statsCalculator";
import { Jornada, EstadisticaPorJugadorPorJornada, Equipo } from "../types";

export const SEED_EQUIPO: Equipo = ${JSON.stringify({ entrenador, equipo, temporada, duracionPartido, jornadasAJugar, minutosTotales }, null, 2)};

export const SEED_BASE_JUGADORES: BaseJugador[] = ${JSON.stringify(basePlayers, null, 2).replace(/"posicion":\s*"([^"]+)"/g, (match, p1) => `"posicion": Posicion.${p1}`)};

export const SEED_JORNADAS: Jornada[] = ${JSON.stringify(jornadas, null, 2)};

export const SEED_ESTADISTICAS_MATCH: EstadisticaPorJugadorPorJornada[] = ${JSON.stringify(estadistasMatch, null, 2)};
`;

  fs.writeFileSync('src/data/seedData.ts', tsContent);
  console.log("Successfully generated /src/data/seedData.ts from Excel spreadsheet!");
}

main().catch(err => {
  console.error("Error executing script:", err);
});
