const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

const db = new sqlite3.Database('./vms.db');

router.get('/db-viewer', (req, res) => {
    db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
        if (err) return res.status(500).send(err.message);
        
        let html = `
        <html>
        <head>
            <title>VMS Database Admin</title>
            <style>
                body { font-family: sans-serif; padding: 20px; background: #f8fafc; }
                table { border-collapse: collapse; width: 100%; margin-top: 20px; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
                th, td { border: 1px solid #e2e8f0; padding: 12px; text-align: left; }
                th { background: #0f172a; color: white; }
                h1 { color: #0f172a; }
                .nav { margin-bottom: 20px; }
                .nav a { margin-right: 15px; padding: 8px 16px; background: #d4af37; color: #0f172a; text-decoration: none; border-radius: 6px; font-weight: bold; }
            </style>
        </head>
        <body>
            <h1>VMS Database Admin Panel</h1>
            <div class="nav">
                ${tables.map(t => `<a href="?table=${t.name}">${t.name}</a>`).join('')}
            </div>
        `;

        const selectedTable = req.query.table || (tables.length > 0 ? tables[0].name : null);

        if (selectedTable) {
            db.all(`SELECT * FROM ${selectedTable} LIMIT 100`, [], (err, rows) => {
                if (err) {
                    html += `<p style="color: red">Error: ${err.message}</p></body></html>`;
                    return res.send(html);
                }

                if (rows.length > 0) {
                    const headers = Object.keys(rows[0]);
                    html += `<h2>Table: ${selectedTable}</h2>`;
                    html += `<table><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>`;
                    html += rows.map(row => `<tr>${headers.map(h => `<td>${typeof row[h] === 'string' && row[h].startsWith('data:image') ? '[Image Data]' : row[h]}</td>`).join('')}</tr>`).join('');
                    html += `</table>`;
                } else {
                    html += `<p>Table ${selectedTable} is empty.</p>`;
                }
                html += `</body></html>`;
                res.send(html);
            });
        } else {
            html += `<p>No tables found.</p></body></html>`;
            res.send(html);
        }
    });
});

module.exports = router;
