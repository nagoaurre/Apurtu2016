import fs from 'fs';
import pkg from 'xlsx';
const { read, utils } = pkg;

async function main() {
  const workbook = read(fs.readFileSync('temp_sheet.xlsx'));
  const sheet = workbook.Sheets['PARTIDOS APURTUARTE'];
  const data = pkg.utils.sheet_to_json<any[]>(sheet, { header: 1 });
  
  console.log("--- JORNADA 10 details (Col 146) ---");
  console.log("Rival row 8:", data[8][146 + 2]);
  console.log("L-V row 5:", data[5][146 + 2]);
  const row12 = data[12];
  console.log("Row 12 J10: A Favor=", row12[146 + 6], "Contra=", row12[146 + 7]);
  
  console.log("\nPlayer goals in J10:");
  const players = data.slice(12, 25);
  players.forEach(p => {
    const goals = p[146 + 5] || 0;
    const convoc = p[146 + 1] || 0;
    console.log(`  ${p[1]}: Convocado=${convoc}, Goles=${goals}`);
  });
}

main().catch(err => {
  console.error("Error executing script:", err);
});
