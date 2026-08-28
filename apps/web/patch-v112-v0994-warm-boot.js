(() => {
'use strict';
if(window.__ct0994WarmBootLoaded)return;
window.__ct0994WarmBootLoaded=true;
window.__ct0994WarmBoot='v112-bingers-style-warm-boot';

const HOME_RPC='cinetracker_profile_home_payload_v0994';
const REMAINING_RPC='cinetracker_profile_remaining_v0994';
const BOOT_TIMEOUT=18000;
const IMG_TIMEOUT=2600;
let warmPromise=null;
let ready=false;
let queuedTarget='home';

const style=document.createElement('style');
style.id='ct0994-warm-boot-style';
style.textContent=`
#ct112-boot{position:fixed;inset:0;z-index:2147483000;background:#05080b;display:grid;place-items:center;color:#eefaff;font-family:inherit;transition:opacity .18s ease;overscroll-behavior:none}
#ct112-boot.out{opacity:0;pointer-events:none}
.ct112-box{width:min(360px,82vw);display:grid;justify-items:center;gap:18px;text-align:center}.ct112-logo{font-size:28px;font-weight:950;letter-spacing:.08em;color:#7bd8ff;text-shadow:0 0 24px #28b8ff55}.ct112-sub{font-size:11px;color:#7897a8;min-height:16px}.ct112-spin{width:28px;height:28px;border:3px solid #173140;border-top-color:#64ceff;border-radius:50%;animation:ct112spin .75s linear infinite}.ct112-track{width:100%;height:4px;border-radius:999px;background:#0e202a;overflow:hidden}.ct112-bar{height:100%;width:4%;background:linear-gradient(90deg,#31a7df,#7de5ff);box-shadow:0 0 16px #43c7ff88;transition:width .2s ease}.ct112-retry{display:none;border:1px solid #2c6079;background:#0b1c25;color:#eaf9ff;border-radius:10px;padding:9px 14px;cursor:pointer}
@keyframes ct112spin{to{transform:rotate(360deg)}}
`;
document.getElementById(style.id)?.remove();document.head.appendChild(style);

function persistedSession(){try{const x=JSON.parse(localStorage.getItem('cinetracker_session')||'null');return Boolean(x?.access_token||x?.refresh_token)}catch{return false}}
function authenticated(){try{return Boolean(ctSession?.access_token)}catch{return false}}
function sleep(ms){return new Promise(r=>setTimeout(r,ms))}
function timeout(p,ms,label){return new Promise((resolve,reject)=>{let done=false;const t=setTimeout(()=>{if(done)return;done=true;reject(new Error(label||'Tempo limite'))},ms);Promise.resolve(p).then(v=>{if(done)return;done=true;clearTimeout(t);resolve(v)},e=>{if(done)return;done=true;clearTimeout(t);reject(e)})})}
async function retry(job,tries=2){let last;for(let i=0;i<tries;i++){try{return await job()}catch(e){last=e;if(i+1<tries)await sleep(350*(i+1))}}throw last}
function overlay(){let root=document.getElementById('ct112-boot');if(root)return root;root=document.createElement('div');root.id='ct112-boot';root.innerHTML='<div class="ct112-box"><div class="ct112-logo">CINETRACKER</div><div class="ct112-spin"></div><div class="ct112-sub">Preparando sua biblioteca…</div><div class="ct112-track"><div class="ct112-bar"></div></div><button type="button" class="ct112-retry">Tentar novamente</button></div>';document.body.appendChild(root);return root}
function stage(text,pct){const root=overlay();const s=root.querySelector('.ct112-sub'),b=root.querySelector('.ct112-bar');if(s)s.textContent=text;if(b)b.style.width=`${Math.max(4,Math.min(100,pct))}%`}
function imageUrl(path,size='w342'){try{return path?`${SUPABASE_URL}/functions/v1/tmdb-image?path=${encodeURIComponent(path)}&size=${size}`:''}catch{return ''}}
function collectPosters(home,dash,discover){const out=[],seen=new Set();const add=x=>{const p=x?.poster_path||x?.profile_path;if(!p||seen.has(p))return;seen.add(p);out.push(p)};(home?.series||[]).slice(0,18).forEach(add);(home?.movie_watchlist||[]).slice(0,18).forEach(add);(dash||[]).filter(x=>x?.media_type==='tv').slice(0,10).forEach(add);(dash||[]).filter(x=>x?.media_type==='movie').slice(0,10).forEach(add);const walk=v=>{if(!v)return;if(Array.isArray(v)){v.slice(0,18).forEach(walk);return}if(typeof v==='object'){add(v);Object.values(v).forEach(walk)}};walk(discover);return out.slice(0,56)}
function warmOne(path){return new Promise(resolve=>{if(!path)return resolve();const im=new Image();let done=false;const finish=()=>{if(done)return;done=true;resolve()};const t=setTimeout(finish,IMG_TIMEOUT);im.onload=()=>{clearTimeout(t);finish()};im.onerror=()=>{clearTimeout(t);finish()};im.decoding='async';im.fetchPriority='low';im.src=imageUrl(path)})}
async function warmImages(paths){const list=[...new Set(paths)].filter(Boolean);let idx=0;const workers=Array.from({length:Math.min(8,list.length)},async()=>{while(idx<list.length){const i=idx++;await warmOne(list[i])}});await Promise.all(workers)}
async function waitSession(){if(authenticated())return true;for(let i=0;i<80;i++){if(authenticated())return true;await sleep(50)}return authenticated()}

async function runWarm({show=true,force=false}={}){
  if(warmPromise&&!force)return warmPromise;
  const root=show?overlay():null;
  warmPromise=(async()=>{
    stage('Restaurando sua sessão…',10);
    const ok=await waitSession();if(!ok)throw new Error('Sessão não disponível');
    stage('Carregando Home e Perfil…',24);
    const homeJob=retry(()=>timeout(window.sbRpc(HOME_RPC,{}),12000,'Home demorou demais'),2);
    const dashJob=retry(()=>timeout(window.__ct991Preload?.(Boolean(force)),12000,'Perfil demorou demais'),2).catch(()=>[]);
    const remainingJob=timeout(window.sbRpc(REMAINING_RPC,{}),9000,'Métricas demoraram demais').catch(()=>null);
    const discoverJob=retry(()=>timeout(window.__ct991PreloadDiscover?.(Boolean(force)),14000,'Descobrir demorou demais'),2).catch(()=>null);
    const [home,dash,,discover]=await Promise.all([homeJob,dashJob,remainingJob,discoverJob]);
    window.__ct0994PreloadedHome=home||window.__ct0994PreloadedHome;
    stage('Pré-carregando capas e recomendações…',72);
    await timeout(warmImages(collectPosters(home,dash,discover)),6500,'Capas demoraram demais').catch(()=>null);
    stage('Finalizando interface…',94);
    return {home,dash,discover};
  })();
  try{return await timeout(warmPromise,BOOT_TIMEOUT,'Inicialização demorou demais')}
  finally{warmPromise=null}
}

async function release(){ready=true;window.__ct0994WarmReady=true;stage('Pronto',100);const target=['home','discover','profile','settings'].includes(queuedTarget)?queuedTarget:'home';try{await rawNav112?.(target)}catch{}await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));const root=document.getElementById('ct112-boot');if(root){root.classList.add('out');setTimeout(()=>root.remove(),220)}}
async function boot(){
  if(!persistedSession()&&!authenticated())return;
  overlay();
  try{await runWarm({show:true});await release()}
  catch(error){console.error('[CineTracker 0.99.4] warm boot',error);const root=overlay();stage('Não foi possível preparar tudo. Verifique a conexão.',35);root.querySelector('.ct112-spin').style.display='none';const retryBtn=root.querySelector('.ct112-retry');retryBtn.style.display='inline-flex';retryBtn.onclick=async()=>{retryBtn.style.display='none';root.querySelector('.ct112-spin').style.display='block';try{await runWarm({show:true,force:true});await release()}catch(e){console.error('[CineTracker 0.99.4] warm boot retry',e);retryBtn.style.display='inline-flex';root.querySelector('.ct112-spin').style.display='none'}}}
}

const rawNav112=window.__ct0994Navigate;
if(typeof rawNav112==='function'&&!rawNav112.__ct112Wrapped){const fn=async function(target){const t=String(target||'home');queuedTarget=t;if(!ready&&document.getElementById('ct112-boot'))return false;return rawNav112.apply(this,arguments)};fn.__ct112Wrapped=true;window.__ct0994Navigate=fn;window.ct0994Navigate=fn;window.ct0992Navigate=fn;window.ct991Navigate=fn;window.ct98Navigate=fn}

window.__ct0994WarmAll=()=>runWarm({show:false,force:false});
window.addEventListener('cinetracker:data-changed',()=>{window.__ct991InvalidateWarm?.();void runWarm({show:false,force:true}).catch(e=>console.warn('[CineTracker 0.99.4] rewarm silencioso',e))});
window.addEventListener('cinetracker:auth-state-change',e=>{if(e?.detail?.event==='SIGNED_IN'&&!ready)void boot()});
for(const d of [0,120,360])setTimeout(()=>{if(!ready&&!document.getElementById('ct112-boot')&&(persistedSession()||authenticated()))void boot()},d);
})();
