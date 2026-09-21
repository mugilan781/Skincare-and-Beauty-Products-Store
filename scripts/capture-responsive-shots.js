const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = 9223;
const BASE_URL = 'http://localhost:8080';
const OUT_DIR = 'C:\\Users\\LENOVO LOQ\\.gemini\\antigravity-ide\\brain\\fff1c765-8181-4a60-b6f9-f7e735e1d9b1';

const SHOTS = [
  { page: 'index.html', width: 320, name: 'index_320px.png' },
  { page: 'index.html', width: 360, name: 'index_360px.png' },
  { page: 'index.html', width: 760, name: 'index_760px.png' },
  { page: 'index.html', width: 1024, name: 'index_1024px.png' },
  { page: 'home2.html', width: 320, name: 'home2_320px.png' },
  { page: 'home2.html', width: 760, name: 'home2_760px.png' },
  { page: 'checkout.html', width: 360, name: 'checkout_360px.png' },
  { page: 'about.html', width: 320, name: 'about_320px.png' },
  { page: 'services.html', width: 360, name: 'services_360px.png' }
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.msgId = 1;
    this.callbacks = new Map();
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = err => reject(err);
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const { resolve, reject } = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) {
            reject(new Error(msg.error.message));
          } else {
            resolve(msg.result);
          }
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.msgId++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

async function run() {
  const edgeProc = spawn(EDGE_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--hide-scrollbars',
    'about:blank'
  ], { stdio: 'ignore' });

  let targets = null;
  for (let i = 0; i < 30; i++) {
    try {
      await sleep(300);
      targets = await fetchJson(`http://localhost:${PORT}/json`);
      if (targets && targets.length > 0) break;
    } catch (e) {}
  }

  const pageTarget = targets.find(t => t.type === 'page') || targets[0];
  const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await client.connect();

  await client.send('Page.enable');

  for (const item of SHOTS) {
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: item.width,
      height: 900,
      deviceScaleFactor: 1,
      mobile: item.width <= 760
    });

    await client.send('Page.navigate', { url: `${BASE_URL}/${item.page}` });
    await sleep(700);
    await client.send('Runtime.evaluate', {
      expression: `const pl = document.getElementById('pageLoader'); if (pl) pl.remove();`
    });
    await sleep(200);

    const shotRes = await client.send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: item.width, height: 900, scale: 1 }
    });

    const buf = Buffer.from(shotRes.data, 'base64');
    const outPath = path.join(OUT_DIR, item.name);
    fs.writeFileSync(outPath, buf);
    console.log(`Saved screenshot: ${item.name} (${item.width}px)`);
  }

  client.close();
  edgeProc.kill();
}

run().catch(console.error);
