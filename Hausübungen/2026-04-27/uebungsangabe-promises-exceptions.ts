// ============================================================================
// Übungsangabe: Promises & Exceptions in TypeScript
// ============================================================================
//
// Lernziele:
// - Verständnis der Promise-Executor-Funktion und deren Fehlerbehandlung
// - Exceptions im Executor-Kontext verstehen (vor resolve/reject)
// - Korrekte Typisierung von globalThis in TypeScript
// - Zusammenspiel von throw, reject, try/catch und .catch()
//
// Voraussetzungen:
// - TypeScript (strict-Modus empfohlen)
// - Node.js zum Ausführen der Beispiele
//
// ============================================================================

// ============================================================================
// Aufgabe 1: Typisierung von globalThis in Node.js
// ============================================================================
//
// globalThis ist der einheitliche Zugriff auf das globale Objekt — sowohl
// im Browser (window) als auch in Node.js (global). In Node.js stehen
// typische Browser-Eigenschaften wie window, document, localStorage NICHT
// zur Verfügung. Trotzdem kann und sollte man eigene globale Eigenschaften
// in TypeScript korrekt typisieren.
// ============================================================================

// --- 1a) Unterschiede zwischen Browser und Node ---
//
// Erkläre kurz: Welche der folgenden Eigenschaften existieren auf globalThis
// im Browser, welche in Node.js, und welche in beiden?
//
// - window        → ?
// - document      → ?
// - process       → ?
// - console       → ?
// - Buffer        → ?
// - setTimeout    → ?
// - fetch         → ?
//
// Schreibe deine Antworten hier als Kommentar:

// window:       Browser
// document:     Browser
// process:      Node.js
// console:      Beide
// Buffer:       Node.js
// setTimeout:   Beide
// fetch:        Browser (neuere Node.js Versionen auch)        

// --- 1b) Eigene Eigenschaft typisiert hinzufügen ---
//
// Erweitere globalThis um eine typisierte Eigenschaft appConfig.
// Schreibe die nötige TypeScript-Deklaration (Declaration Merging auf dem
// globalThis-Interface), sodass globalThis.appConfig korrekt typisiert ist.
//
// Hinweis: In Node.js gibt es kein window — warum funktioniert globalThis
// trotzdem universell?

interface AppConfig {
  apiUrl: string;
  maxRetries: number;
  debug: boolean;
}

// TODO: Declaration Merging — erweitere das globalThis-Interface

declare global {
  var appConfig: AppConfig;
}

// TODO: Weise globalThis.appConfig einen Wert zu
globalThis.appConfig = {
  apiUrl: "https://api.example.com",
  maxRetries: 3,
  debug: false
};

// --- 1c) Typ-Sicherheit prüfen ---
//
// Warum erzeugt folgender Code einen Typfehler und wie behebt man ihn?
//
// declare global {
//   var appConfig: AppConfig;
// }
//
// globalThis.appConfig = { apiUrl: "https://api.example.com" }; // Fehler!
//
// Was fehlt? Korrigiere den Code hier:

// TODO: Korrigierte Version
declare global {
  var appConfig: AppConfig;
}
globalThis.appConfig = {
  apiUrl: "https://api.example.com",
  maxRetries: 3,
  debug: false
};

// --- 1d) Vorsicht vor any ---
//
// Warum ist folgende "Lösung" problematisch?
//
// (globalThis as any).myConfig = { url: "test" };
//
// Welche Vorteile bietet die korrekte Typisierung über Interface-Merging
// gegenüber any?
//
// Antwort: any deaktiviert die Typprüfung komplett — keine IntelliSense, keine Compile-Time-Fehler bei Tippfehlern. Interface-Merging bietet Typsicherheit, Autovervollständigung und Fehlererkennung zur Compile-Zeit.

// ============================================================================
// Aufgabe 2: Exception im Promise-Executor
// ============================================================================

// --- 2a) Was wird ausgegeben? ---
//
// Notiere VOR dem Ausführen, was du erwartest, und erkläre dein Ergebnis.
//
// Erwartung:
// 1. Reihenfolge der Ausgaben: "Nach Promise-Konstruktion" → "Fehler abgefangen: Boom im Executor!"
// 2. Warum führt der throw nicht zum Absturz? Der Promise-Executor wird in einem try/catch ausgeführt. Exceptions werden automatisch in reject umgewandelt.
// 3. Was passiert mit dem Error-Objekt intern? Es wird als reason an den reject-Handler übergeben.

const p2a = new Promise<string>((resolve, reject) => {
  throw new Error("Boom im Executor!");
});

p2a.then(
  (value) => console.log("Erfolg:", value),
  (reason) => console.log("Fehler abgefangen:", (reason as Error).message)
);

console.log("Nach Promise-Konstruktion");

// --- 2b) Throw vs. reject ---
//
// Vergleiche die folgenden zwei Varianten. Sind sie äquivalent? Begründe.
// Teste beide mit .catch().

// Variante A
const pA = new Promise<string>((resolve, reject) => {
  throw new Error("Fehler A");
});

// Variante B
const pB = new Promise<string>((resolve, reject) => {
  reject(new Error("Fehler B"));
});

pA.catch(e => console.log("pA Fehler:", (e as Error).message));
pB.catch(e => console.log("pB Fehler:", (e as Error).message));

// TODO: Teste beide und notiere ob es Unterschiede gibt
// Antwort: Sie sind äquivalent. throw im Executor wird vom Promise-Konstruktor automatisch in reject() umgewandelt. Beide führen zu einem rejected Promise.

// ============================================================================
// Aufgabe 3: Throw nach resolve
// ============================================================================

// --- 3a) Was passiert hier? ---
//
// 1. Wird das Promise fulfilled oder rejected?
// 2. Was passiert mit dem throw?
// 3. Wird die Error-Nachricht irgendwo sichtbar?

const p3a = new Promise<string>((resolve) => {
  resolve("fertig");
  throw new Error("Zu spät!");
});

p3a.then(v => console.log("fulfilled:", v))
   .catch(e => console.log("rejected:", (e as Error).message));

// TODO: Teste und notiere deine Beobachtung
// Antwort: Das Promise ist fulfilled. Sobald resolve() aufgerufen wird,
// wechselt der Promise-Zustand zu "fulfilled" und nachfolgende throws werden ignoriert.

// --- 3b) Die umgekehrte Reihenfolge ---
//
// Warum hat resolve nach reject keine Wirkung mehr? Welche Regel gilt hier?

const p3b = new Promise<string>((resolve, reject) => {
  reject(new Error("Abgelehnt"));
  resolve("doch noch fertig"); // Wird das ignoriert?
});

p3b.then(v => console.log("fulfilled:", v))
   .catch(e => console.log("rejected:", (e as Error).message));

// Antwort: Ein Promise kann nur einmal den Zustand wechseln. Sobald reject()
// aufgerufen wird, ist der Zustand "rejected" und bleibt dabei. resolve()
// nach reject wird ignoriert. Regel: "settled once, immutable state".

// ============================================================================
// Aufgabe 4: Synchroner Code im Executor
// ============================================================================

// --- 4a) Exception in einer Hilfsfunktion ---
//
// Wird der Fehler in .catch() abgefangen? Erkläre, warum der
// Promise-Konstruktor hier wie ein try/catch wirkt.

function loadConfig(): string {
  throw new Error("Konfiguration nicht gefunden");
}

const p4a = new Promise<string>((resolve, reject) => {
  const config = loadConfig();
  resolve(config);
});

p4a.catch((err) => {
  console.log("Gefangen in .catch():", (err as Error).message);
});

// Antwort: Ja, der Fehler wird in .catch() abgefangen. Der Promise-Konstruktor
// führt den Executor in einem internen try/catch aus. Jeder throw im Executor
// wird automatisch in reject() umgewandelt.

// --- 4b) Manuell vs. automatisch ---
//
// Schreibe zwei Versionen derselben Logik — einmal mit automatischer
// Exception-Weiterleitung (throw) und einmal mit manueller try/catch + reject.

function loadConfig2(): string {
  throw new Error("Konfiguration nicht gefunden");
}

// Version 1: Automatisch (throw)
const p4b_v1 = new Promise<string>((resolve, reject) => {
  try {
    resolve(loadConfig2()); // throw wird automatisch zu reject
  } catch (err) {
    reject(err);
  }
});

p4b_v1.catch(e => console.log("p4b_v1 Fehler:", (e as Error).message));

// Version 2: Manuell (try/catch + reject)
const p4b_v2 = new Promise<string>((resolve, reject) => {
  try {
    const config = loadConfig2();
    resolve(config);
  } catch (err) {
    reject(err);
  }
});

p4b_v2.catch(e => console.log("p4b_v2 Fehler:", (e as Error).message));

// Frage: Was ist der Vorteil der manuellen Variante?
// Antwort: Man kann zusätzliche Logik beim Fehler ausführen (z.B. Logging,
// Retry-Schleifen, Error-Transformation) und hat volle Kontrolle über den
// Ablauf im Executor.

// ============================================================================
// Aufgabe 5: Async-Funktionen und Exceptions
// ============================================================================

// --- 5a) Throw in einer async-Funktion ---
//
// Erkläre den Zusammenhang: Ein throw in einer async-Funktion entspricht
// einem reject() im zurückgegebenen Promise.
// Zeige dies durch Umschreiben in eine nicht-async-Variante.

async function fetchData(): Promise<string> {
  throw new Error("Netzwerkfehler");
}

fetchData()
  .then((data) => console.log("Daten:", data))
  .catch((err) => console.log("Fehler:", (err as Error).message));

// TODO: Schreibe fetchData als nicht-async-Variante (mit new Promise)
const fetchDataSync = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    reject(new Error("Netzwerkfehler"));
  });
};

fetchDataSync()
  .then((data) => console.log("Daten:", data))
  .catch((err) => console.log("Fehler:", (err as Error).message));

// --- 5b) Throw nach return in async ---
//
// Warum ist der Throw unreachable? Was passiert zur Laufzeit?

async function confusing(): Promise<string> {
  return "Ergebnis";
  throw new Error("Unreachable");
}

// Antwort: Nach einem return ist die Funktion beendet. Der throw nach dem
// return ist unerreichbarer Code (unreachable). TypeScript/Travis warnt evtl.,
// zur Laufzeit passiert nichts.

// ============================================================================
// Aufgabe 6: Zusammengesetzte Aufgabe — withRetry
// ============================================================================
//
// Schreibe eine typsichere Funktion withRetry, die:
// 1. Eine asynchrone Funktion fn: () => Promise<T> als Parameter nimmt
// 2. Bei Exception automatisch bis zu maxRetries-mal erneut versucht
// 3. Die Anzahl der Versuche auf globalThis.__retryCount speichert
//    (korrekt typisiert!)
// 4. Nach maxRetries erfolglosen Versuchen die letzte Exception weiterwirft
// 5. Sowohl throw-Exceptions als auch reject-Fälle behandelt

// TODO: Erweitere globalThis um __retryCount
declare global {
  var __retryCount: number;
}

// TODO: Implementiere withRetry
function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let attempt = 0;

  const attemptFn = async (): Promise<T> => {
    attempt++;
    globalThis.__retryCount = attempt;
    try {
      return await fn();
    } catch (err) {
      if (attempt >= maxRetries) {
        throw err;
      }
      return attemptFn();
    }
  };

  return attemptFn();
}

// Test:
async function testWithRetry() {
  let attempts = 0;

  const result = await withRetry(async () => {
    attempts++;
    if (attempts < 3) {
      throw new Error(`Versuch ${attempts} fehlgeschlagen`);
    }
    return "Erfolg!";
  }, 5);

  console.log(result); // Erwartet: "Erfolg!"
  console.log(globalThis.__retryCount); // Erwartet: 3
}

// ============================================================================
// Zusatzfrage (Bonus)
// ============================================================================
//
// Was passiert in folgendem Code und warum?
//
// const p = new Promise<void>((resolve, reject) => {
//   setTimeout(() => {
//     throw new Error("Asynchroner Throw!");
//   }, 100);
//   resolve("sofort erledigt" as any);
// });
//
// Warum landet dieser Fehler NICHT in .catch()? Wie unterscheidet sich
// ein throw in setTimeout von einem throw direkt im Executor?
//
// Antwort: Ein throw in setTimeout wird NICHT vom Promise-Konstruktor
// abgefangen, weil setTimeout den Code asynchron ausführt (ausserhalb des
// Executors). Der Fehler wird zu einem nicht behandelten Exception führen
// und das Process-Event-Handling verursachen (in Node.js: uncaughtException).
// Im Gegensatz dazu: throw direkt im Executor wird synchron vom try/catch
// im Promise-Konstruktor gefangen und automatisch in reject() umgewandelt.

export {};
