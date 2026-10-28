#!/usr/bin/env node
// Drive a private Matheaufgaben Vite server and a private Chrome profile.
import { spawn, execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, openSync, readFileSync, rmSync, writeFileSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../../../..');
const port = Number(process.env.VERIFY_PORT || 5199);
const base = `http://127.0.0.1:${port}`;
const runDir = join(root, 'artifacts/verify-matheaufgaben/run');
const evidenceDir = join(root, 'artifacts/verify-matheaufgaben/evidence');
const statePath = join(runDir, 'state.json');
const viteLog = join(runDir, 'vite.log');
const chromeLog = join(runDir, 'chrome.log');

function fail(message) {
  const error = new Error(message);
  error.isFail = true;
  throw error;
}

function readState() {
  if (!existsSync(statePath)) fail(`No verification state at ${statePath}. Run launch first.`);
  return JSON.parse(readFileSync(statePath, 'utf8'));
}

function writeState(state) {
  mkdirSync(runDir, { recursive: true });
  writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`);
}

function alive(pid) {
  if (!pid || pid < 2) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function signal(pid, sig) {
  if (!pid || pid < 2) return;
  try {
    process.kill(-pid, sig);
  } catch {
    try {
      process.kill(pid, sig);
    } catch {
      // already gone
    }
  }
}

function commandOf(pid) {
  try {
    return execFileSync('ps', ['-p', String(pid), '-o', 'command='], { encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

function listenerPids() {
  try {
    const out = execFileSync('lsof', ['-nP', `-iTCP:${port}`, '-sTCP:LISTEN', '-Fp'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return [...out.matchAll(/^p(\d+)$/gm)].map((match) => Number(match[1]));
  } catch {
    return [];
  }
}

function gitHead() {
  return execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
}

function packageVersion() {
  return JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).version;
}

function findChrome() {
  if (process.env.VERIFY_CHROME) {
    if (!existsSync(process.env.VERIFY_CHROME)) fail(`VERIFY_CHROME does not exist: ${process.env.VERIFY_CHROME}`);
    return process.env.VERIFY_CHROME;
  }
  const cache = join(homedir(), 'Library/Caches/ms-playwright');
  if (existsSync(cache)) {
    const dirs = readdirSync(cache)
      .filter((name) => name.startsWith('chromium-') && !name.includes('headless'))
      .sort();
    for (const dir of dirs.reverse()) {
      const bin = join(
        cache,
        dir,
        'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
      );
      if (existsSync(bin)) return bin;
    }
  }
  const apps = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
  ];
  for (const app of apps) {
    if (existsSync(app)) return app;
  }
  fail('No Chrome binary found. Set VERIFY_CHROME to a Chrome executable.');
}

function spawnDetached(file, args, logPath) {
  const fd = openSync(logPath, 'a');
  const child = spawn(file, args, {
    cwd: root,
    detached: true,
    stdio: ['ignore', fd, fd],
  });
  child.unref();
  return child.pid;
}

async function waitFor(label, fn, timeoutMs) {
  const start = Date.now();
  let last = '';
  while (Date.now() - start < timeoutMs) {
    try {
      const value = await fn();
      if (value) return value;
      last = '';
    } catch (error) {
      last = error instanceof Error ? error.message : String(error);
    }
    await delay(200);
  }
  const logs = [viteLog, chromeLog]
    .filter((file) => existsSync(file))
    .map((file) => readFileSync(file, 'utf8').slice(-800))
    .filter(Boolean);
  fail(`${label} timed out. ${last}\n${logs.join('\n')}`);
}

class Cdp {
  constructor(ws) {
    this.ws = ws;
    this.next = 1;
    this.pending = new Map();
    this.listeners = new Map();
    ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id) {
        const pending = this.pending.get(msg.id);
        if (!pending) return;
        this.pending.delete(msg.id);
        if (msg.error) pending.reject(new Error(`${msg.error.message}`));
        else pending.resolve(msg.result || {});
      } else if (msg.method) {
        for (const listener of this.listeners.get(msg.method) || []) listener(msg.params || {});
      }
    });
  }

  on(method, listener) {
    const list = this.listeners.get(method) || [];
    list.push(listener);
    this.listeners.set(method, list);
  }

  send(method, params = {}, timeoutMs = 15000) {
    const id = this.next++;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`CDP timeout: ${method}`));
      }, timeoutMs);
      this.pending.set(id, {
        resolve: (value) => {
          clearTimeout(timer);
          resolve(value);
        },
        reject: (error) => {
          clearTimeout(timer);
          reject(error);
        },
      });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
}

async function connectTarget(state) {
  const listRes = await fetch(`http://127.0.0.1:${state.chromePort}/json/list`);
  if (!listRes.ok) fail(`Chrome list failed: ${listRes.status}`);
  const list = await listRes.json();
  const page = list.find((item) => item.id === state.targetId && item.type === 'page')
    || list.find((item) => item.type === 'page');
  if (!page?.webSocketDebuggerUrl) fail('Chrome has no page target. Run launch again.');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener('error', () => reject(new Error('Chrome websocket failed')), { once: true });
  });
  const cdp = new Cdp(ws);
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('DOM.enable');
  await cdp.send('Accessibility.enable');
  return { cdp, ws };
}

async function evaluate(cdp, expression) {
  const result = await cdp.send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (result.exceptionDetails) {
    fail(`Page eval failed: ${result.exceptionDetails.text}`);
  }
  return result.result?.value;
}

async function pageText(cdp) {
  return evaluate(cdp, 'document.body ? document.body.innerText : ""');
}

async function waitForText(cdp, text, timeoutMs = 8000) {
  await waitFor(`text ${JSON.stringify(text)}`, async () => {
    const body = await pageText(cdp);
    return body.includes(text);
  }, timeoutMs);
}

function axName(node) {
  return node.name?.value || '';
}

async function axNodes(cdp) {
  const tree = await cdp.send('Accessibility.getFullAXTree');
  return tree.nodes.filter((node) => !node.ignored && node.role?.value);
}

async function click(cdp, role, name) {
  const nodes = await axNodes(cdp);
  const matches = nodes.filter((node) => node.role.value === role && axName(node) === name && node.backendDOMNodeId);
  if (matches.length !== 1) {
    const names = nodes
      .filter((node) => node.role.value === role && axName(node))
      .map((node) => axName(node))
      .slice(0, 40);
    fail(`Expected 1 ${role} named ${JSON.stringify(name)}. Found ${matches.length}. Names: ${names.join(' | ')}`);
  }
  await cdp.send('DOM.getDocument', { depth: 0 });
  const box = await cdp.send('DOM.getBoxModel', { backendNodeId: matches[0].backendDOMNodeId });
  const quad = box.model.content;
  const x = (quad[0] + quad[2] + quad[4] + quad[6]) / 4;
  const y = (quad[1] + quad[3] + quad[5] + quad[7]) / 4;
  if (!Number.isFinite(x) || !Number.isFinite(y)) fail(`No box for ${role} ${JSON.stringify(name)}.`);
  await cdp.send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 });
  await cdp.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 });
}

async function fillPlaceholder(cdp, placeholder, value) {
  const focused = await evaluate(cdp, `(() => {
    const wanted = ${JSON.stringify(placeholder)};
    const el = [...document.querySelectorAll('input')].find((input) => input.placeholder === wanted);
    if (!el) return false;
    el.focus();
    el.select();
    return document.activeElement === el;
  })()`);
  if (!focused) fail(`No input with placeholder ${JSON.stringify(placeholder)}.`);
  await cdp.send('Input.insertText', { text: value });
  const actual = await evaluate(cdp, `(() => {
    const wanted = ${JSON.stringify(placeholder)};
    const el = [...document.querySelectorAll('input')].find((input) => input.placeholder === wanted);
    return el ? el.value : '';
  })()`);
  if (actual !== value) {
    fail(`Fill of ${JSON.stringify(placeholder)} left value ${JSON.stringify(actual)}, not ${JSON.stringify(value)}.`);
  }
}

async function goto(cdp, url) {
  const loaded = new Promise((resolve) => {
    cdp.on('Page.loadEventFired', () => resolve(true));
  });
  await cdp.send('Page.navigate', { url });
  await Promise.race([loaded, delay(10000)]);
  await waitFor('rendered root', async () => {
    const text = await pageText(cdp);
    return text.trim().length > 10;
  }, 10000);
}

function flag(name) {
  const index = process.argv.indexOf(name);
  if (index === -1 || index + 1 >= process.argv.length) return undefined;
  return process.argv[index + 1];
}

async function withCdp(fn) {
  const state = readState();
  if (!alive(state.chromePid)) fail('Chrome is not running. Run launch, or cleanup and launch again.');
  const { cdp, ws } = await connectTarget(state);
  try {
    return await fn(cdp, state);
  } finally {
    ws.close();
  }
}

async function launch() {
  if (existsSync(statePath)) {
    const old = JSON.parse(readFileSync(statePath, 'utf8'));
    if (alive(old.pid) || alive(old.chromePid)) {
      fail(`A verification run is already recorded in ${statePath}. Run cleanup before launch.`);
    }
  }
  const listeners = listenerPids();
  if (listeners.length > 0) {
    fail(`Port ${port} is already in use by pid ${listeners.join(',')}. Do not kill it. Set VERIFY_PORT to a free port.`);
  }
  mkdirSync(runDir, { recursive: true });
  const state = {
    port,
    base,
    pid: null,
    chromePid: null,
    chromePort: null,
    targetId: null,
    git: gitHead(),
    version: packageVersion(),
    ready: false,
  };
  writeState(state);
  const viteBin = join(root, 'node_modules/.bin/vite');
  if (!existsSync(viteBin)) fail(`Missing ${viteBin}. Run npm install in ${root}.`);
  state.pid = spawnDetached(viteBin, ['--host', '127.0.0.1', '--port', String(port), '--strictPort'], viteLog);
  writeState(state);
  await waitFor('Vite ready log', async () => {
    if (!existsSync(viteLog)) return false;
    return readFileSync(viteLog, 'utf8').includes(`http://127.0.0.1:${port}/`);
  }, 30000);
  await waitFor('index HTML', async () => {
    const response = await fetch(`${base}/`);
    const html = await response.text();
    return response.ok && html.includes('<title>matheaufgaben</title>');
  }, 20000);
  await waitFor('app module', async () => {
    const response = await fetch(`${base}/src/main.tsx`);
    const body = await response.text();
    return response.ok && body.includes('createRoot');
  }, 20000);

  const chrome = findChrome();
  const profile = join(runDir, 'chrome-profile');
  state.chromeBin = chrome;
  state.chromePid = spawnDetached(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-sync',
    '--use-mock-keychain',
    `--user-data-dir=${profile}`,
    '--remote-debugging-port=0',
    '--remote-allow-origins=*',
    '--window-size=1400,1000',
    'about:blank',
  ], chromeLog);
  writeState(state);
  const devtools = await waitFor('Chrome DevTools port', async () => {
    if (!existsSync(chromeLog)) return false;
    const match = readFileSync(chromeLog, 'utf8').match(/DevTools listening on ws:\/\/127\.0\.0\.1:(\d+)\//);
    return match ? match[1] : false;
  }, 20000);
  state.chromePort = Number(devtools);
  writeState(state);
  const created = await fetch(`http://127.0.0.1:${state.chromePort}/json/new?${encodeURIComponent(`${base}/`)}`, { method: 'PUT' });
  if (!created.ok) fail(`Chrome /json/new failed: ${created.status} ${await created.text()}`);
  const target = await created.json();
  state.targetId = target.id;
  writeState(state);
  await withCdp(async (cdp) => {
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1400,
      height: 1000,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await goto(cdp, `${base}/`);
    await waitForText(cdp, 'Math Practice Worksheets');
    await waitForText(cdp, 'Schriftliche Division');
  });
  state.ready = true;
  writeState(state);
  process.stdout.write(`ready ${base}\npid ${state.pid}\nchrome ${state.chromePid}\n`);
}

function doctor() {
  const state = readState();
  const problems = [];
  if (!state.ready) problems.push('Launch has not confirmed the overview heading.');
  if (state.port !== port) problems.push(`State port is ${state.port}. VERIFY_PORT is ${port}.`);
  if (!alive(state.pid)) problems.push(`Vite pid ${state.pid} is not running.`);
  const command = commandOf(state.pid);
  if (command && !command.includes('vite')) problems.push(`Pid ${state.pid} is not vite: ${command}`);
  if (command && !command.includes(`--port ${port}`) && !command.includes(`--port=${port}`)) {
    problems.push(`Vite command does not bind port ${port}: ${command}`);
  }
  const listeners = listenerPids();
  if (!listeners.includes(state.pid)) {
    const childOwns = listeners.some((pid) => {
      let current = pid;
      for (let hop = 0; hop < 8; hop += 1) {
        if (current === state.pid) return true;
        try {
          current = Number(execFileSync('ps', ['-p', String(current), '-o', 'ppid='], { encoding: 'utf8' }).trim());
        } catch {
          return false;
        }
        if (!current || current === 1) return false;
      }
      return false;
    });
    if (!childOwns) problems.push(`Port ${port} listeners are ${listeners.join(',') || 'none'}, not pid ${state.pid}.`);
  }
  let head = '';
  try {
    head = gitHead();
  } catch (error) {
    problems.push(`git rev-parse failed: ${error instanceof Error ? error.message : error}`);
  }
  if (head && head !== state.git) problems.push(`HEAD is ${head}. Launch recorded ${state.git}.`);
  const version = packageVersion();
  if (version !== state.version) problems.push(`package.json version is ${version}. Launch recorded ${state.version}.`);
  return { state, problems, head, version };
}

async function doctorHttp(state, problems) {
  try {
    const response = await fetch(`${state.base}/`);
    const html = await response.text();
    if (!response.ok || !html.includes('<title>matheaufgaben</title>')) {
      problems.push(`GET / did not return the matheaufgaben title. Status ${response.status}.`);
    }
  } catch (error) {
    problems.push(`GET / failed: ${error instanceof Error ? error.message : error}`);
  }
  try {
    const response = await fetch(`${state.base}/src/main.tsx`);
    const body = await response.text();
    if (!response.ok || !body.includes('createRoot')) {
      problems.push('GET /src/main.tsx is not the Vite app entry.');
    }
  } catch (error) {
    problems.push(`GET /src/main.tsx failed: ${error instanceof Error ? error.message : error}`);
  }
}

async function cleanup() {
  if (!existsSync(statePath)) {
    process.stdout.write('nothing to clean\n');
    return;
  }
  const state = JSON.parse(readFileSync(statePath, 'utf8'));
  signal(state.chromePid, 'SIGTERM');
  signal(state.pid, 'SIGTERM');
  await delay(500);
  if (alive(state.chromePid)) signal(state.chromePid, 'SIGKILL');
  if (alive(state.pid)) signal(state.pid, 'SIGKILL');
  await delay(200);
  rmSync(runDir, { recursive: true, force: true });
  process.stdout.write(`removed ${runDir}\nevidence kept at ${evidenceDir}\n`);
}

function usage() {
  process.stdout.write(`Usage: node ${join(here, 'drive.mjs')} <command>\n`);
  process.stdout.write('Commands: launch, doctor, cleanup, goto, click, fill, text, url, snapshot, screenshot, wait-text\n');
}

async function main() {
  const command = process.argv[2];
  try {
    await run(command);
  } catch (error) {
    const message = error instanceof Error ? (error.isFail ? error.message : error.stack || error.message) : String(error);
    process.stderr.write(`${message}\n`);
    if (command === 'launch') {
      try {
        await cleanup();
      } catch (cleanupError) {
        const cleanupMessage = cleanupError instanceof Error ? cleanupError.message : String(cleanupError);
        process.stderr.write(`${cleanupMessage}\n`);
      }
    }
    process.exit(1);
  }
}

async function run(command) {
  if (command === 'launch') {
    await launch();
  } else if (command === 'doctor') {
  const { state, problems } = doctor();
  await doctorHttp(state, problems);
  if (problems.length) fail(problems.join('\n'));
  process.stdout.write([
    'ok',
    `url=${state.base}`,
    `pid=${state.pid}`,
    `port=${state.port}`,
    `chrome=${state.chromePid}`,
    `git=${state.git}`,
    `version=${state.version}`,
    'title=matheaufgaben',
    'auth=none',
  ].join('\n') + '\n');
} else if (command === 'cleanup') {
  await cleanup();
} else if (command === 'goto') {
  const pathArg = process.argv[3];
  if (!pathArg || !pathArg.startsWith('/')) fail('goto requires an app path that starts with /.');
  const text = flag('--text');
  await withCdp(async (cdp, state) => {
    await goto(cdp, `${state.base}${pathArg}`);
    if (text) await waitForText(cdp, text);
    process.stdout.write(`${await evaluate(cdp, 'location.href')}\n`);
  });
} else if (command === 'click') {
  const role = flag('--role');
  const name = flag('--name');
  if (!role || !name) fail('click requires --role and --name.');
  await withCdp(async (cdp) => {
    await click(cdp, role, name);
    await delay(300);
    process.stdout.write(`${await evaluate(cdp, 'location.href')}\n`);
  });
} else if (command === 'fill') {
  const placeholder = flag('--placeholder');
  const value = flag('--value');
  if (!placeholder || value === undefined) fail('fill requires --placeholder and --value.');
  await withCdp(async (cdp) => {
    await fillPlaceholder(cdp, placeholder, value);
    process.stdout.write(`${placeholder}=${value}\n`);
  });
} else if (command === 'text') {
  await withCdp(async (cdp) => {
    process.stdout.write(`${await pageText(cdp)}\n`);
  });
} else if (command === 'url') {
  await withCdp(async (cdp) => {
    process.stdout.write(`${await evaluate(cdp, 'location.href')}\n`);
  });
} else if (command === 'wait-text') {
  const text = process.argv[3];
  if (!text) fail('wait-text requires the text to find.');
  await withCdp(async (cdp) => {
    await waitForText(cdp, text);
    process.stdout.write(`found ${text}\n`);
  });
} else if (command === 'snapshot') {
  const out = flag('--path');
  if (!out) fail('snapshot requires --path.');
  await withCdp(async (cdp) => {
    const href = await evaluate(cdp, 'location.href');
    const title = await evaluate(cdp, 'document.title');
    const nodes = await axNodes(cdp);
    const keep = new Set([
      'RootWebArea',
      'heading',
      'link',
      'button',
      'spinbutton',
      'textbox',
      'searchbox',
      'checkbox',
      'radio',
      'switch',
      'status',
    ]);
    const lines = [`url: ${href}`, `title: ${title}`, '---'];
    for (const node of nodes) {
      const name = axName(node);
      if (!name || !keep.has(node.role.value)) continue;
      lines.push(`${node.role.value}\t${name}`);
    }
    mkdirSync(dirname(resolve(root, out)), { recursive: true });
    writeFileSync(resolve(root, out), `${lines.join('\n')}\n`);
    process.stdout.write(`${resolve(root, out)}\n`);
  });
} else if (command === 'screenshot') {
  const out = flag('--path');
  if (!out) fail('screenshot requires --path.');
  await withCdp(async (cdp) => {
    const shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
    const file = resolve(root, out);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, Buffer.from(shot.data, 'base64'));
    process.stdout.write(`${file}\n`);
  });
  } else {
    usage();
    if (command) fail(`Unknown command ${command}.`);
  }
}

main();
