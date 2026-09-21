const { spawn } = require('child_process');
const http = require('http');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = 9222;
const BASE_URL = 'http://localhost:8080';

const PAGES = [
  'index.html',
  'home2.html',
  'about.html',
  'services.html',
  'blog.html',
  'blog-details.html',
  'checkout.html',
  'contact.html',
  'login.html',
  'signup.html',
  'maintenance.html',
  '404.html',
  'sitemap.html',
  'privacy.html',
  'terms.html'
];

const BREAKPOINTS = [320, 360, 480, 760, 1024];

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
  console.log('--- STARTING RESPONSIVE AUDIT ACROSS 15 PAGES AT 5 BREAKPOINTS ---');
  
  // 1. Launch headless Edge
  const edgeProc = spawn(EDGE_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--hide-scrollbars',
    'about:blank'
  ], { stdio: 'ignore' });

  // Wait for remote debugging to be ready
  let targets = null;
  for (let i = 0; i < 30; i++) {
    try {
      await sleep(300);
      targets = await fetchJson(`http://localhost:${PORT}/json`);
      if (targets && targets.length > 0) break;
    } catch (e) {}
  }

  if (!targets || targets.length === 0) {
    console.error('Failed to connect to Edge remote debugging port');
    edgeProc.kill();
    process.exit(1);
  }

  const pageTarget = targets.find(t => t.type === 'page') || targets[0];
  const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await client.connect();

  await client.send('Page.enable');
  await client.send('DOM.enable');

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  const issues = [];

  for (const page of PAGES) {
    const pageUrl = `${BASE_URL}/${page}`;
    await client.send('Page.navigate', { url: pageUrl });
    await sleep(600); // Allow DOM and script execution

    for (const width of BREAKPOINTS) {
      totalTests++;
      const height = 800;

      // Set device emulation
      await client.send('Emulation.setDeviceMetricsOverride', {
        width,
        height,
        deviceScaleFactor: 1,
        mobile: width <= 760
      });

      await sleep(250); // Allow CSS reflow

      // Evaluate scrollWidth vs innerWidth and look for overflowing elements
      const evalRes = await client.send('Runtime.evaluate', {
        expression: `
          (() => {
            const scrollWidth = document.documentElement.scrollWidth;
            const innerWidth = window.innerWidth;
            const hasHorizontalOverflow = scrollWidth > innerWidth;
            
            let badElements = [];
            if (hasHorizontalOverflow) {
              const all = document.querySelectorAll('*');
              for (const el of all) {
                const rect = el.getBoundingClientRect();
                if (rect.right > innerWidth + 1 || rect.left < -1) {
                  const tag = el.tagName.toLowerCase();
                  const cls = el.className ? '.' + el.className.toString().split(' ').filter(Boolean).join('.') : '';
                  const id = el.id ? '#' + el.id : '';
                  badElements.push({
                    selector: tag + id + cls,
                    rect: { left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width) }
                  });
                }
              }
            }

            return {
              scrollWidth,
              innerWidth,
              hasHorizontalOverflow,
              badCount: badElements.length,
              badSample: badElements.slice(0, 3)
            };
          })()
        `,
        returnByValue: true
      });

      const res = evalRes.result.value;
      if (res.hasHorizontalOverflow) {
        failedTests++;
        const info = `[FAIL] ${page} @ ${width}px: scrollWidth (${res.scrollWidth}px) > innerWidth (${res.innerWidth}px). Overflow count: ${res.badCount}`;
        console.error(info);
        if (res.badSample && res.badSample.length > 0) {
          console.error('  Sample overflowing elements:', JSON.stringify(res.badSample));
        }
        issues.push({ page, width, details: res });
      } else {
        passedTests++;
        console.log(`[PASS] ${page} @ ${width}px: width=${res.innerWidth}px, scrollWidth=${res.scrollWidth}px (zero overflow)`);
      }
    }
  }

  client.close();
  edgeProc.kill();

  console.log('\n======================================================');
  console.log(`TOTAL TESTS: ${totalTests}`);
  console.log(`PASSED: ${passedTests}`);
  console.log(`FAILED: ${failedTests}`);
  console.log('======================================================');

  if (failedTests > 0) {
    process.exit(1);
  }
}

run().catch(err => {
  console.error('Fatal error in audit script:', err);
  process.exit(1);
});
