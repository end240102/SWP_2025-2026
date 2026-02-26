// =======================
// Elemente holen
// =======================

const tabelle = document.getElementById("tabelle") as HTMLTableSectionElement | null;
const holeEssenBtn = document.getElementById("hole-essen") as HTMLButtonElement | null;
const loescheEssenBtn = document.getElementById("loesche-essen") as HTMLButtonElement | null;
const input = document.getElementById("zeit-input") as HTMLInputElement | null;
const convertBtn = document.getElementById("convert") as HTMLButtonElement | null;
const result = document.getElementById("result") as HTMLParagraphElement | null;

// Prüfen, ob alle Elemente existieren
if (!tabelle || !holeEssenBtn || !loescheEssenBtn || !input || !convertBtn || !result) {
  throw new Error("Ein oder mehrere Elemente wurden nicht gefunden!");
}

// =======================
// Typen für JSON-Daten
// =======================

interface EssenEintrag {
  name: string;
  essen: string;
}

interface ConvertResult {
  input: string;
  milliseconds: number;
  seconds: number;
  error?: string;
}

// =======================
// Essen laden
// =======================

holeEssenBtn.addEventListener("click", async () => {
  try {
    const response = await fetch("/essen");
    if (!response.ok) throw new Error(`Fehler beim Laden: ${response.status}`);

    const data: EssenEintrag[] = await response.json();

    // Tabelle leeren
    tabelle.innerHTML = "";

    data.forEach((eintrag) => {
      const row = document.createElement("tr");

      const nameCell = document.createElement("td");
      nameCell.textContent = eintrag.name;

      const essenCell = document.createElement("td");
      essenCell.textContent = eintrag.essen;

      row.appendChild(nameCell);
      row.appendChild(essenCell);

      tabelle.appendChild(row);
    });
  } catch (err) {
    console.error(err);
    alert("Fehler beim Laden der Essenliste.");
  }
});

// =======================
// Tabelle löschen
// =======================

loescheEssenBtn.addEventListener("click", () => {
  tabelle.innerHTML = "";
});

// =======================
// Zeit Converter
// =======================

convertBtn.addEventListener("click", async () => {
  const value = input.value.trim();

  if (!value) {
    result.textContent = "Bitte eine Zeit eingeben";
    return;
  }

  try {
    const response = await fetch(`/convert/${value}`);
    if (!response.ok) throw new Error(`Fehler beim Konvertieren: ${response.status}`);

    const data: ConvertResult = await response.json();

    if (data.error) {
      result.textContent = data.error;
      return;
    }

    result.textContent = `${data.input} = ${data.milliseconds} ms (${data.seconds} Sekunden)`;
  } catch (err) {
    console.error(err);
    result.textContent = "Fehler beim Konvertieren";
  }
});