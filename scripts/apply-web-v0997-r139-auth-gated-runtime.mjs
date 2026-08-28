import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const targets=[resolve(root,'dist'),resolve(root,'apps/web/dist')];
const oldRuntime='primary-authority-r138.js';
const newRuntime='primary-authority-r139.js';

for(const dir of targets){
  const primaryPath=resolve(dir,'primary.html');
  let html=await readFile(primaryPath,'utf8');
  await copyFile(resolve(dir,oldRuntime),resolve(dir,newRuntime));

  const oldTag=`<script src="/${oldRuntime}"></script><script>void bootPrimary();</script>`;
  if(!html.includes(oldTag))throw new Error('r139: static runtime anchor missing in '+primaryPath);

  const replacement=`<script>
window.__ctPrimaryRuntime139='auth-gated-runtime';
let __ctPrimaryRuntimePromise=null;
function loadPrimaryRuntime139(){
  if(window.__ct0997Primary133Loaded)return Promise.resolve(true);
  if(__ctPrimaryRuntimePromise)return __ctPrimaryRuntimePromise;
  __ctPrimaryRuntimePromise=new Promise((resolve,reject)=>{
    const s=document.createElement('script');
    s.src='/${newRuntime}';
    s.async=true;
    s.onload=()=>resolve(true);
    s.onerror=()=>reject(new Error('Falha ao carregar o runtime principal.'));
    document.head.appendChild(s);
  });
  return __ctPrimaryRuntimePromise;
}
enterPrimary=async function enterPrimary139(){
  renderShell();
  const p=cleanPath();
  if(p==='/configs'){renderConfigsClean();return true;}
  const c=document.querySelector('.content');
  if(c)c.innerHTML='<div class="boot-note">Carregando dados autenticados…</div>';
  try{
    await loadPrimaryRuntime139();
    if(typeof window.__ct132Go!=='function')throw new Error('Roteador principal indisponível.');
    let finished=false;
    const watchdog=setTimeout(()=>{
      if(finished)return;
      const loading=document.querySelector('#ct133-page .ct133-loading');
      if(loading)loading.outerHTML='<div class="ct133-error">A consulta demorou além do esperado. Tente novamente ou abra outra seção.</div>';
    },12000);
    try{return await window.__ct132Go(p)}finally{finished=true;clearTimeout(watchdog)}
  }catch(e){
    if(c)c.innerHTML='<div class="clean-config-card"><h2>Não foi possível carregar esta seção</h2><p>'+String(e?.message||e)+'</p><div class="clean-actions"><button class="clean-btn" onclick="location.reload()">Tentar novamente</button></div></div>';
    return false;
  }
};
void bootPrimary();
</script>`;

  html=html.replace(oldTag,replacement);
  if(html.includes(`<script src="/${oldRuntime}">`))throw new Error('r139: static old runtime still present in '+primaryPath);
  if(!html.includes("window.__ctPrimaryRuntime139='auth-gated-runtime'"))throw new Error('r139: auth gate marker missing in '+primaryPath);
  if(!html.includes(`s.src='/${newRuntime}'`))throw new Error('r139: dynamic fresh runtime missing in '+primaryPath);
  await writeFile(primaryPath,html,'utf8');
}
console.log('CineTracker Web 0.99.7 r139: primary authority loads only after authenticated session restoration.');
