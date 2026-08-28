import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const patch = 'patch-v133-v0997-primary-authority.js';
const targets = [resolve(root, 'dist'), resolve(root, 'apps/web/dist')];

const nativeNav = `function installNativeNav137(route=pathNow()){
  const current=String(route||pathNow()||'/home').split('?')[0];
  const items=[['/home','⌂','Home'],['/discover','✦','Descobrir'],['/profile','◉','Perfil'],['/configs','⚙','Configurações']];
  const desktop=$('.sidebar .nav');
  if(desktop){
    desktop.dataset.ct137Native='1';
    desktop.style.display='flex';desktop.style.flexDirection='column';desktop.style.gap='6px';
    desktop.innerHTML=items.map(([p,icon,label])=>\`<a href="\${href(p)}" class="ct137-native-nav-link\${current===p?' active':''}" style="display:flex;align-items:center;gap:7px;padding:10px 12px;border:1px solid \${current===p?'#3d88b4':'transparent'};border-radius:10px;background:\${current===p?'#10354d':'transparent'};color:#eaf6ff;text-decoration:none;cursor:pointer;pointer-events:auto">\${icon} \${label}</a>\`).join('');
  }
  const mobile=$('.mobile-nav');
  if(mobile){
    mobile.dataset.ct137Native='1';
    mobile.innerHTML=items.map(([p,icon,label])=>\`<a href="\${href(p)}" class="ct137-native-mobile-link\${current===p?' active':''}" style="display:inline-flex;align-items:center;justify-content:center;gap:4px;padding:8px;color:#eaf6ff;text-decoration:none;pointer-events:auto">\${icon}<span>\${label}</span></a>\`).join('');
  }
}
`;

const rest137 = `async function rest(path,options={}){const b=base();if(!b)throw new Error('Supabase indisponível');const headers={...auth(),Accept:'application/json'};if(options.body!=null)headers['Content-Type']='application/json';if(options.prefer)headers.Prefer=options.prefer;const ctrl=new AbortController(),timeoutMs=Math.max(1500,Number(options.timeoutMs||5500)),timer=setTimeout(()=>ctrl.abort(),timeoutMs);let r;try{r=await fetch(\`${'${b}'}/rest/v1/${'${path}'}\`,{method:options.method||'GET',headers,body:options.body==null?undefined:(typeof options.body==='string'?options.body:JSON.stringify(options.body)),signal:ctrl.signal})}catch(e){if(e?.name==='AbortError')throw new Error(\`Tempo limite ao carregar ${'${String(path).split(\'?\')[0]}'}\`);throw e}finally{clearTimeout(timer)}if(!r.ok)throw new Error(\`Supabase ${'${r.status}'}: ${'${(await r.text()).slice(0,160)}'}\`);if(r.status===204)return null;const text=await r.text();if(!text)return null;try{return JSON.parse(text)}catch{return text}}
`;

function patchOne(input, where) {
  let out = input;
  if (!out.includes("r136-direct-sidebar-nav")) throw new Error(`r137: r136 marker missing in ${where}`);
  if (!out.includes("window.__ct0997PrimaryObserverSuppressed=true;")) throw new Error(`r137: r136 observer cutoff missing in ${where}`);

  const markerNeedle = "window.__ct0997DirectNav='r136-direct-sidebar-nav';";
  if (!out.includes(markerNeedle)) throw new Error(`r137: direct-nav marker anchor missing in ${where}`);
  out = out.replace(markerNeedle, `${markerNeedle}\nwindow.__ct0997R137='r137-rpc-timeout-native-nav';`);

  const restStart = out.indexOf('async function rest(path,options={}){');
  const rpcStart = out.indexOf('async function rpcDirect', restStart);
  if (restStart < 0 || rpcStart < 0) throw new Error(`r137: rest/rpc anchors missing in ${where}`);
  out = out.slice(0, restStart) + rest137 + out.slice(rpcStart);

  const commonAnchor = 'function common(title,subtitle){';
  if (!out.includes(commonAnchor)) throw new Error(`r137: common anchor missing in ${where}`);
  out = out.replace(commonAnchor, nativeNav + commonAnchor);

  const bodyNeedle = "document.body.classList.add('ct133-primary-active');c.innerHTML=";
  if (!out.includes(bodyNeedle)) throw new Error(`r137: primary body anchor missing in ${where}`);
  out = out.replace(bodyNeedle, "document.body.classList.add('ct133-primary-active');installNativeNav137('/'+route);c.innerHTML=");

  const configNeedle = 'function applyConfigFix(){leavePrimary();';
  if (!out.includes(configNeedle)) throw new Error(`r137: config anchor missing in ${where}`);
  out = out.replace(configNeedle, "function applyConfigFix(){installNativeNav137('/configs');leavePrimary();");

  const homeNeedle = 'const data=await homeData();';
  if (!out.includes(homeNeedle)) throw new Error(`r137: Home await anchor missing in ${where}`);
  out = out.replace(homeNeedle, "const data=await Promise.race([homeData(),new Promise((_,reject)=>setTimeout(()=>reject(new Error('Tempo limite ao carregar a Home. Use o menu para abrir outra seção ou tente novamente.')),9000))]);");

  const startNeedle = "const start=pathNow()==='/'?'/home':pathNow();";
  if (!out.includes(startNeedle)) throw new Error(`r137: startup route anchor missing in ${where}`);
  out = out.replace(startNeedle, `${startNeedle}installNativeNav137(start);`);

  if (!out.includes("signal:ctrl.signal")) throw new Error(`r137: AbortController signal missing in ${where}`);
  if (!out.includes("r137-rpc-timeout-native-nav")) throw new Error(`r137: marker missing after patch in ${where}`);
  if (!out.includes("ct137-native-nav-link")) throw new Error(`r137: native sidebar missing after patch in ${where}`);
  return out;
}

for (const dir of targets) {
  const file = resolve(dir, patch);
  const input = await readFile(file, 'utf8');
  await writeFile(file, patchOne(input, file), 'utf8');
}

console.log('CineTracker Web 0.99.7 r137: RPCs abortáveis, Home com deadline e navegação primária nativa/única.');
