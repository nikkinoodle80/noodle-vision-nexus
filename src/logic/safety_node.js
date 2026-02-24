const http = require('http');
const PORT = 31173;
const server = http.createServer((req, res) => {
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
if (req.method === 'POST' && req.url === '/alert') {
let body = '';
req.on('data', chunk => body += chunk);
req.on('end', () => {
console.log('\n🚨 CARETAKER ALERT: ' + body);
res.end('PROCESSED');
});
} else {
res.end('Noodle-Vision Nexus Active');
}
});
server.listen(PORT, '0.0.0.0', () => {
console.log('SAFE ZONE ANCHOR ACTIVE ON PORT ' + PORT);
});
