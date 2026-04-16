/// <reference lib="dom" />
import ms from "ms";

interface EssenEintrag {
    name: string;
    essen: string;
    zeitstempel: number;
}

function formatierteZeit(zeitstempel: number): string {
    const differenz = Date.now() - zeitstempel * 1000;
    return ms(differenz, { long: true });
}

async function ladeEssen() {
    const tabelle = document.getElementById("tabelle") as HTMLTableSectionElement;
    tabelle.innerHTML = "";

    try {
        const response = await fetch("/essen");
        console.log("Response Status:", response.status);
        const daten: EssenEintrag[] = await response.json();
        console.log("Daten:", daten);

        for (const eintrag of daten) {
            const zeile = document.createElement("tr");
            zeile.innerHTML = `
                <td>${eintrag.name}</td>
                <td>${eintrag.essen}</td>
                <td>vor ${formatierteZeit(eintrag.zeitstempel)}</td>
            `;
            tabelle.appendChild(zeile);
        }
    } catch (error) {
        console.error("Fehler beim Laden:", error);
        tabelle.innerHTML = `<tr><td colspan="3">Fehler: ${error}</td></tr>`;
    }
}

const holeEssenBtn = document.getElementById("hole-essen") as HTMLButtonElement;
holeEssenBtn.addEventListener("click", ladeEssen);

const loescheEssenBtn = document.getElementById("loesche-essen") as HTMLButtonElement;
loescheEssenBtn.addEventListener("click", () => {
    const tabelle = document.getElementById("tabelle") as HTMLTableSectionElement;
    tabelle.innerHTML = "";
});

ladeEssen();
