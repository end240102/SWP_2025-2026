document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('calculate').addEventListener('click', function() {
        const start = parseFloat(document.getElementById('start').value) || 0;
        const end = parseFloat(document.getElementById('end').value) || 10;
        const step = parseFloat(document.getElementById('step').value) || 1;
        
        const tbody = document.getElementById('table-body');
        const canvas = document.getElementById('chart');
        const ctx = canvas.getContext('2d');
        
        // Tabelle und Canvas leeren
        tbody.innerHTML = '';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        let values = [];
        
        // Werte berechnen und Tabelle füllen
        for (let x = start; x <= end; x += step) {
            const fx = x * x;                    // f(x) = x²
            const gx = Math.sin(x);              // g(x) = sin(x)
            const hx = fx + gx;                  // h(x) = f(x) + g(x)
            const ix = Math.cos(x);              // i(x) = cos(x)
            
            // Tabelle
            const row = tbody.insertRow();
            row.insertCell(0).textContent = x.toFixed(2);
            row.insertCell(1).textContent = fx.toFixed(2);
            row.insertCell(2).textContent = gx.toFixed(2);
            row.insertCell(3).textContent = hx.toFixed(2);
            row.insertCell(4).textContent = ix.toFixed(2);
            
            values.push({x, fx, gx, hx, ix});
        }
        
        // Grafik zeichnen
        drawChart(ctx, values, start, end);
    });
    
    function drawChart(ctx, values, start, end) {
        const width = 600;
        const height = 400;
        const padding = 50;
        const scaleX = (width - 2 * padding) / (end - start);
        const scaleY = 100; // Skalierung für Y-Achse
        
        // Achsen
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();
        
        // Beschriftungen
        ctx.fillStyle = '#333';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('x', width - padding + 20, height - padding + 20);
        ctx.textAlign = 'right';
        ctx.fillText('f(x), g(x)', padding - 10, padding - 10);
        
        // f(x) = x² (blau)
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;
        ctx.beginPath();
        values.forEach((v, i) => {
            const px = padding + (v.x - start) * scaleX;
            const py = height - padding - (v.fx / scaleY);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        });
        ctx.stroke();
        
        // g(x) = sin(x) (rot)
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.beginPath();
        values.forEach((v, i) => {
            const px = padding + (v.x - start) * scaleX;
            const py = height - padding - ((v.gx + 2) * 20); // Offset für Sichtbarkeit
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        });
        ctx.stroke();
        
        // Legende
        ctx.fillStyle = 'blue';
        ctx.fillRect(width - 120, 30, 15, 15);
        ctx.fillStyle = '#333';
        ctx.fillText('f(x) = x²', width - 100, 42);
        
        ctx.fillStyle = 'red';
        ctx.fillRect(width - 120, 55, 15, 15);
        ctx.fillStyle = '#333';
        ctx.fillText('g(x) = sin(x)', width - 100, 67);
    }
});
