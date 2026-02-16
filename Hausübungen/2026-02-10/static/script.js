const startInput = document.getElementById("start");
const endInput = document.getElementById("end");
const stepInput = document.getElementById("step");
const tableBody = document.getElementById("table-body");
const calculateBtn = document.getElementById("calculate");
const canvas = document.getElementById("chart");
const ctx = canvas.getContext("2d");

const colors = ["#007acc", "#e74c3c", "#2ecc71", "#9b59b6"];
const labels = ["f(x)", "g(x)", "h(x)", "i(x)"];
const funcs = [f, g, h, i];

// ===== Funktionen =====
function f(x) { return x * x; }
function g(x) { return x * x / 4; }
function h(x) { return x * x - 4; }
function i(x) { return x * x / 4 - 4; }

// ===== Button =====
calculateBtn.addEventListener("click", calculate);

// ===== Hauptfunktion =====
function calculate() {
    let start = parseFloat(startInput.value);
    let end = parseFloat(endInput.value);
    let step = parseFloat(stepInput.value);

    if (isNaN(start) || isNaN(end) || isNaN(step) || step <= 0) {
        alert("Bitte gültige Werte eingeben (Step > 0).");
        return;
    }

    // Falls Start > Ende → tauschen
    if (start > end) [start, end] = [end, start];

    tableBody.innerHTML = "";

    for (let x = start; x <= end + 1e-9; x += step) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${x.toFixed(2)}</td>
            <td>${f(x).toFixed(2)}</td>
            <td>${g(x).toFixed(2)}</td>
            <td>${h(x).toFixed(2)}</td>
            <td>${i(x).toFixed(2)}</td>
        `;
        tableBody.appendChild(row);
    }

    drawChart(start, end, step);
}

// ===== Diagramm =====
function drawChart(start, end, step) {
    const padding = 50;

    // Canvas scharf machen
    const dpr = window.devicePixelRatio || 1;
    canvas.width = 600 * dpr;
    canvas.height = 400 * dpr;
    canvas.style.width = "600px";
    canvas.style.height = "400px";
    ctx.scale(dpr, dpr);

    const width = 600;
    const height = 400;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, width, height);

    let minY = Infinity, maxY = -Infinity;
    for (let x = start; x <= end; x += step) {
        funcs.forEach(fn => {
            const y = fn(x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
        });
    }

    const xRange = end - start || 1;
    const yRange = maxY - minY || 1;

    const toX = x => padding + ((x - start) / xRange) * (width - 2 * padding);
    const toY = y => height - padding - ((y - minY) / yRange) * (height - 2 * padding);

    // Gitter
    ctx.strokeStyle = "#eee";
    for (let i = 0; i <= 10; i++) {
        const x = padding + i / 10 * (width - 2 * padding);
        const y = padding + i / 10 * (height - 2 * padding);
        ctx.beginPath(); ctx.moveTo(x, padding); ctx.lineTo(x, height - padding); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(padding, y); ctx.lineTo(width - padding, y); ctx.stroke();
    }

    // Achsen nur wenn 0 sichtbar
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (start <= 0 && end >= 0) {
        ctx.moveTo(toX(0), padding);
        ctx.lineTo(toX(0), height - padding);
    }
    if (minY <= 0 && maxY >= 0) {
        ctx.moveTo(padding, toY(0));
        ctx.lineTo(width - padding, toY(0));
    }
    ctx.stroke();

    // Kurven
    funcs.forEach((fn, idx) => {
        ctx.strokeStyle = colors[idx];
        ctx.lineWidth = 2;
        ctx.beginPath();

        let first = true;
        for (let x = start; x <= end + 1e-9; x += step) {
            const cx = toX(x);
            const cy = toY(fn(x));
            if (first) {
                ctx.moveTo(cx, cy);
                first = false;
            } else {
                ctx.lineTo(cx, cy);
            }
        }
        ctx.stroke();
    });

    // Legende
    ctx.fillStyle = "#fff";
    ctx.fillRect(width - 130, padding - 10, 120, labels.length * 22 + 10);
    ctx.strokeStyle = "#ccc";
    ctx.strokeRect(width - 130, padding - 10, 120, labels.length * 22 + 10);

    labels.forEach((label, i) => {
        ctx.fillStyle = colors[i];
        ctx.fillRect(width - 120, padding + i * 22, 14, 14);
        ctx.fillStyle = "#333";
        ctx.fillText(label, width - 95, padding + i * 22 + 12);
    });
}
