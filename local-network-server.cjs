// Optional local endpoint for Permission Dialog Lab. Run: node local-network-server.cjs
// Serves only a fixed response; it does not read files, cookies, or request bodies.
// Stop with Ctrl+C. Port can be set with PERMISSION_LAB_PORT.
const http = require('node:http');
const os = require('node:os');
const port = Number(process.env.PERMISSION_LAB_PORT || 8766);
const server = http.createServer((req,res)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Private-Network','true');
  res.setHeader('Cache-Control','no-store');
  if(req.method==='OPTIONS'){res.writeHead(204);res.end();return;}
  if(req.method!=='GET'||req.url!=='/ping'){res.writeHead(404);res.end('Not found');return;}
  res.setHeader('Content-Type','text/plain');res.end('Permission Dialog Lab test endpoint');
});
server.listen(port,'0.0.0.0',()=>{console.log(`Loopback: http://127.0.0.1:${port}/ping`);for(const entries of Object.values(os.networkInterfaces()))for(const entry of entries||[])if(entry.family==='IPv4'&&!entry.internal)console.log(`LAN: http://${entry.address}:${port}/ping`);console.log('Listening on LAN and loopback. Ctrl+C stops this test server.');});
