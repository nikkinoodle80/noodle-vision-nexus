const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Noodle-Vision VR System' });
});

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Noodle-Vision VR System</title></head>
      <body>
        <h1>🚀 Noodle-Vision VR System Live!</h1>
        <p>Status: Operational</p>
        <p>Build: Unified VR/AR Pipeline</p>
      </body>
    </html>
  `);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Cockpit live at http://0.0.0.0:${PORT}`);
});
