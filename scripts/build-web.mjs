import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const web = resolve(root, 'apps/web');
const source = resolve(web, 'index.html');
const favicon = resolve(web, 'favicon.svg');
const serviceWorker = resolve(web, 'service-worker.js');
const patches = ['patch-v024.js','patch-v025.js','patch-v025-profile-sync.js','patch-v027.js','patch-v028.js','patch-v029.js','patch-v030.js','patch-v034.js','patch-v035.js','patch-v036.js','patch-v037.js','patch-v038.js','patch-v040.js','patch-v041.js','patch-v043.js','patch-v042.js','patch-v044.js','patch-v045.js','patch-v046.js','patch-v055-nav-hotfix.js','patch-v053.js','patch-v054.js','patch-v055-final.js','patch-v056-version.js','patch-v057-cache.js','patch-v058-v088.js','patch-v059-v089.js','patch-v060-v090.js','patch-v061-v090-android-export.js','patch-v061-v091.js','patch-v062-v091-preserve.js','patch-v063-v092.js','patch-v064-v092-episode-context.js','patch-v065-v093.js','patch-v066-v094.js','patch-v067-v095.js','patch-v068-v097.js','patch-v074-hotfix1-version.js'].map(x=>resolve(web,x));
const rootDist = resolve(root, 'dist');
const webDist = resolve(root, 'apps/web/dist');

function replaceSection(input, startMarker, endMarker, replacement, label) {
  const start = input.indexOf(startMarker);
  const end = input.indexOf(endMarker, start + startMarker.length);
  if (start < 0 || end < 0 || end <= start) throw new Error(`Auth recovery marker missing: ${label}`);
  return input.slice(0, start) + replacement.trimEnd() + '\n' + input.slice(end);
}

function applyAuthRecovery(raw) {
  let safe = raw;

  safe = replaceSection(safe, 'async function authRequest(path, body) {', 'function saveSession(session) {', `
function ctLooksLikeJwt(token) {
    if (typeof token !== 'string')
        return false;
    const parts = token.trim().split('.');
    return parts.length === 3 && parts.every(Boolean);
}
async function ctFetchWithTimeout(url, options = {}, timeoutMs = 8000) {
    const controller = typeof AbortController === 'function' ? new AbortController() : null;
    let timer = null;
    try {
        if (controller)
            timer = window.setTimeout(() => controller.abort(), timeoutMs);
        return await fetch(url, controller ? { ...options, signal: controller.signal } : options);
    }
    catch (error) {
        if (error?.name === 'AbortError')
            throw new Error('Tempo limite de autenticação excedido. Verifique sua conexão e tente novamente.');
        throw error;
    }
    finally {
        if (timer !== null)
            window.clearTimeout(timer);
    }
}
async function authRequest(path, body) {
    const headers = { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' };
    if (path === 'logout' && ctLooksLikeJwt(ctSession?.access_token))
        headers.Authorization = \`Bearer ${'${ctSession.access_token}'}\`;
    const r = await ctFetchWithTimeout(\`${'${SUPABASE_URL}'}/auth/v1/${'${path}'}\`, { method: 'POST', headers, body: JSON.stringify(body || {}) }, 8000);
    const d = await r.json().catch(() => ({}));
    if (!r.ok)
        throw new Error(d.msg || d.message || d.error_description || d.error || 'Falha na autenticação');
    return d;
}
`, 'authRequest');

  safe = replaceSection(safe, 'function saveSession(session) {', 'async function restoreSession() {', `
function saveSession(session) {
    if (!session?.access_token)
        return;
    if (!ctLooksLikeJwt(session.access_token))
        throw new Error('O servidor retornou uma sessão inválida. Tente entrar novamente.');
    const expiresAt = Math.floor(Date.now() / 1000) + Number(session.expires_in || 3600);
    ctSession = { ...session, expires_at: expiresAt };
    currentUser = session.user || currentUser;
    try {
        localStorage.setItem('cinetracker_session', JSON.stringify(ctSession));
    }
    catch (error) {
        console.warn('CineTracker: sessão válida em memória, mas não foi possível persistir no storage.', error);
    }
    try {
        if (window.CineTrackerNative?.saveSession)
            window.CineTrackerNative.saveSession(JSON.stringify(ctSession));
    }
    catch (error) {
        console.warn('CineTracker: sessão Web válida; ponte nativa indisponível.', error);
    }
}
`, 'saveSession');

  safe = replaceSection(safe, 'async function restoreSession() {', 'async function signIn(email, password)', `
async function ctRefreshSession() {
    const refreshToken = ctSession?.refresh_token;
    if (!refreshToken)
        throw new Error('Sessão sem token de renovação');
    const previousUser = currentUser;
    const d = await authRequest('token?grant_type=refresh_token', { refresh_token: refreshToken });
    saveSession({ ...d, user: d.user || previousUser });
    return true;
}
async function restoreSession() {
    try {
        const raw = localStorage.getItem('cinetracker_session');
        if (!raw)
            return false;
        ctSession = JSON.parse(raw);
        currentUser = ctSession?.user || currentUser;
        if (!ctLooksLikeJwt(ctSession?.access_token)) {
            if (!ctSession?.refresh_token)
                throw new Error('Sessão local inválida');
            ctSession = { ...ctSession, access_token: '' };
            await ctRefreshSession();
        }
        if (ctSession?.expires_at && ctSession.expires_at < Math.floor(Date.now() / 1000) + 60 && ctSession.refresh_token)
            await ctRefreshSession();
        let r = await ctFetchWithTimeout(\`${'${SUPABASE_URL}'}/auth/v1/user\`, { headers: authHeaders() }, 8000);
        if (!r.ok && ctSession?.refresh_token) {
            await ctRefreshSession();
            r = await ctFetchWithTimeout(\`${'${SUPABASE_URL}'}/auth/v1/user\`, { headers: authHeaders() }, 8000);
        }
        if (!r.ok)
            throw new Error('Sessão expirada');
        currentUser = await r.json();
        if (ctSession) {
            ctSession.user = currentUser;
            try { localStorage.setItem('cinetracker_session', JSON.stringify(ctSession)); } catch { }
        }
        return true;
    }
    catch (error) {
        try { localStorage.removeItem('cinetracker_session'); } catch { }
        ctSession = null;
        currentUser = null;
        return false;
    }
}
`, 'restoreSession');

  safe = replaceSection(safe, 'function bindAuth() {', 'const watchlistMedia', `
window.__ctAuthRecovery = 'v97-hotfix5';
async function authRecoveryWithTimeout(promise, timeoutMs, label) {
    let timer;
    try {
        return await Promise.race([
            promise,
            new Promise((_, reject) => { timer = window.setTimeout(() => reject(new Error(\`${'${label}'} excedeu ${'${Math.round(timeoutMs / 1000)}'}s\`)), timeoutMs); })
        ]);
    }
    finally {
        if (timer)
            window.clearTimeout(timer);
    }
}
async function runPostAuthHydration() {
    const token = ctSession?.access_token || '';
    if (!token)
        return;
    try {
        await authRecoveryWithTimeout(loadCloudState(), 10000, 'Carregamento do banco');
    }
    catch (error) {
        cloudConnected = false;
        cloudStatus = 'Banco temporariamente indisponível';
        console.warn('CineTracker: Home liberada; hidratação do banco falhou ou expirou.', error);
    }
    if (ctSession?.access_token !== token)
        return;
    render();
    if (!cloudConnected)
        return;
    try {
        await authRecoveryWithTimeout(primeOfficialSuggestions(), 12000, 'Carregamento das recomendações');
    }
    catch (error) {
        console.warn('CineTracker: recomendações não bloquearam a sessão.', error);
    }
    if (ctSession?.access_token === token)
        render();
}
function enterAuthenticatedHome() {
    view = 'home';
    render();
    void runPostAuthHydration();
}
function bindAuth() {
    document.querySelector('#auth-toggle')?.addEventListener('click', () => { authMode = authMode === 'signin' ? 'signup' : 'signin'; render(); });
    const form = document.querySelector('#auth-form');
    let submitting = false;
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (submitting)
            return;
        submitting = true;
        const email = (document.querySelector('#auth-email')?.value || '').trim();
        const password = document.querySelector('#auth-password')?.value || '';
        const error = document.querySelector('#auth-error');
        const button = form.querySelector('button[type="submit"]');
        const buttonText = button?.textContent || '';
        try {
            if (error)
                error.textContent = '';
            if (button) {
                button.disabled = true;
                button.textContent = authMode === 'signup' ? 'Criando conta…' : 'Entrando…';
            }
            if (authMode === 'signup')
                await signUp(email, password);
            else
                await signIn(email, password);
            if (!ctLooksLikeJwt(ctSession?.access_token))
                throw new Error('Login aceito, mas a sessão recebida é inválida.');
            enterAuthenticatedHome();
        }
        catch (err) {
            if (error)
                error.textContent = err instanceof Error ? err.message : 'Não foi possível autenticar';
        }
        finally {
            submitting = false;
            if (document.querySelector('#auth-form') === form && button) {
                button.disabled = false;
                button.textContent = buttonText || (authMode === 'signup' ? 'Criar conta' : 'Entrar no CineTracker');
            }
        }
    });
}
`, 'bindAuth');

  safe = replaceSection(safe, 'async function bootstrap() {', 'function stats()', `
async function bootstrap() {
    const restored = await restoreSession();
    if (!restored) {
        render();
        return;
    }
    enterAuthenticatedHome();
}
`, 'bootstrap');

  return safe;
}

const raw = await readFile(source, 'utf8');
const recovered = applyAuthRecovery(raw);
const withIcon = recovered.includes('rel="icon"') ? recovered : recovered.replace('</head>', '<link rel="icon" type="image/svg+xml" href="/favicon.svg"></head>');
const tags = patches.map(f=>`<script src="/${f.split('/').pop()}"></script>`).join('');
const built = withIcon.replace('</body>', tags+'</body>');
const legacyFix7File = 'patch-v073' + '-v097-fix7.js';
if (!built.includes("window.__ctAuthRecovery = 'v97-hotfix5'")) throw new Error('HOTFIX 5 auth recovery was not installed in built HTML.');
if (built.includes('auth-preboot-fix7.js') || built.includes(legacyFix7File)) throw new Error('Legacy FIX 7 auth is still active in built HTML.');
if (!built.includes('void bootstrap();')) throw new Error('Recovered base bootstrap is not active.');
if (!built.includes('ctLooksLikeJwt')) throw new Error('HOTFIX 5 JWT validation missing.');
if (!built.includes("path === 'logout'")) throw new Error('HOTFIX 5 auth request isolation missing.');
if (!built.includes('patch-v074-hotfix1-version.js')) throw new Error('HOTFIX 5 version layer file missing from built HTML.');

for (const dist of [rootDist, webDist]) {
  await rm(dist, { recursive: true, force: true });
  await mkdir(dist, { recursive: true });
  await writeFile(resolve(dist, 'index.html'), built, 'utf8');
  await cp(favicon, resolve(dist, 'favicon.svg'));
  await cp(serviceWorker, resolve(dist, 'service-worker.js'));
  for (const f of patches) await cp(f, resolve(dist, f.split('/').pop()));
}
console.log('CineTracker 0.0.97 HOTFIX 5: local-authoritative auth recovery; JWT/session hardening active');
