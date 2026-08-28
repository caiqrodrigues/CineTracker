(() => {
'use strict';
if(window.__ct0994WarmBootLoaded)return;
window.__ct0994WarmBootLoaded=true;
window.__ct0994WarmBoot='v113-cache-first-fast-boot';

const HOME_RPC='cinetracker_profile_home_payload_v0994';
const REMAINING_RPC='cinetracker_profile_remaining_v0994';
const COLD_HOME_TIMEOUT=6500;
let ready=false;
let warming=null;
let booting=null;

const style=document.createElement('style');
style.id='ct0994-warm-boot-style';
style.textContent=`
#ct112-boot{position:fixed;inset:0;z-index:2147483000;background:#05080b;display:grid;place-items:center;color:#eefaff;font-family:inherit;transition:opacity .14s ease;overscroll-behavior:none}#ct112-boot.out{opacity:0;pointer-events:none}.ct112-box{width:min(330px,80vw);display:grid;justify-items:center;gap:14px;text-align:center}.ct112-logo{font-size:25px;font-weight:950;letter-spacing:.08em;color:#7bd8ff;text-shadow:0 0 22px #28b8ff55}.ct112-sub{font-size:10px;color:#7897a8;min-height:14px}.ct112-spin{width:24px;height:24px;border:3px solid #173140;border-top-color:#64ceff;border-radius:50%;animation:ct112spin .7s linear infinite}.ct112-retry{display:none;border:1px solid #2c6079;background:#0b1c25;color:#eaf9ff;border-radius:10px;padding:9px 14px;cursor:pointer}@keyframes ct112spin{to{transform:rotate(360deg)}}
`;
document.getElementById(style.id)?.remove();document.head.appendChild(style);

function persistedSession(){try{const x=JSON.parse(localStorage.getItem('cinetracker_session')||'null');return Boolean(x?.access_token||x?.refresh_token)}catch{return false}}
function authenticated(){try{return Boolean(ctSession?.access_token)}catch{return false}}
function hasHomeCache(){return Boolean(window.__ct0994PreloadedHome)}
function sleep(ms){return new Promise(r=>setTimeout(r,ms))}
function timeout(p,ms,label){return new Promise((resolve,reject)=>{let settled=false;const t=setTimeout(()=>{if(settled)return;settled=true;reject(new Error(label||'Tempo limite'))},ms);Promise.resolve(p).then(v=>{if(settled)return;settled=true;clearTimeout(t);resolve(v)},e=>{if(settled)return;settled=true;clearTimeout(t);reject(e)})})}
function overlay(){let root=document.getElementById('ct112-boot');if(root)return root;root=document.createElement('div');root.id='ct112-boot';root.innerHTML='<div class="ct112-box"><div class="ct112-logo">CINETRACKER</div><div class="ct112-spin"></div><div class="ct112-sub">Abrindo sua biblioteca…</div><button type="button" class="ct112-retry">Tentar novamente</button></div>';document.body.appendChild(root);return root}
function removeOverlay(){const root=document.getElementById('ct112-boot');if(!root)return;root.classList.add('out');setTimeout(()=>root.remove(),170)}
async function waitSession(max=2800){if(authenticated())return true;const end=Date.now()+max;while(Date.now()<end){if(authenticated())return true;await sleep(45)}return authenticated()}
function imageUrl(path,size='w342'){try{return path?`${SUPABASE_URL}/functions/v1/tmdb-image?path=${encodeURIComponent(path)}&size=${size}`:''}catch{return ''}}
function warmImages(data){const paths=[],seen=new Set(),add=x=>{const p=x?.poster_path||x?.profile_path;if(!p||seen.has(p))return;seen.add(p);paths.push(p)};(data?.series||[]).slice(0,14).forEach(add);(data?.movie_watchlist||[]).slice(0,14).forEach(add);for(const p of paths.slice(0,24)){try{const im=new Image();im.decoding='async';im.fetchPriority='low';im.src=imageUrl(p)}catch{}}}

async function backgroundWarm(force=false){
  if(warming&&!force)return warming;
  warming=(async()=>{
    const jobs=[];
    jobs.push(Promise.resolve(window.sbRpc?.(HOME_RPC,{})).then(x=>{if(x){window.__ct0994PreloadedHome=x;warmImages(x)}return x}).catch(e=>console.warn('[CineTracker 0.99.4] refresh Home',e)));
    jobs.push(Promise.resolve(window.__ct991Preload?.(Boolean(force))).catch(e=>console.warn('[CineTracker 0.99.4] refresh Perfil',e)));
    jobs.push(Promise.resolve(window.sbRpc?.(REMAINING_RPC,{})).catch(()=>null));
    jobs.push(Promise.resolve(window.__ct991PreloadDiscover?.(Boolean(force))).catch(e=>console.warn('[CineTracker 0.99.4] refresh Descobrir',e)));
    await Promise.allSettled(jobs);
    return true;
  })().finally(()=>{warming=null});
  return warming;
}
window.__ct0994WarmAll=()=>backgroundWarm(false);
window.__ct0994WarmReady=()=>ready;

const rawNav112=window.__ct0994Navigate;
async function openNow(target='home'){
  if(typeof rawNav112!=='function')return false;
  return rawNav112(target==='history'?'profile':target);
}
if(typeof rawNav112==='function'&&!rawNav112.__ct112FastWrapped){const fn=async function(target){return openNow(String(target||'home'))};fn.__ct112FastWrapped=true;window.__ct0994Navigate=fn;window.ct0994Navigate=fn;window.ct0992Navigate=fn;window.ct991Navigate=fn;window.ct98Navigate=fn}

async function boot(){
  if(booting)return booting;
  booting=(async()=>{
    if(!persistedSession()&&!authenticated())return false;
    const sessionOk=await waitSession();if(!sessionOk)return false;
    if(hasHomeCache()){
      ready=true;
      removeOverlay();
      void backgroundWarm(false);
      return true;
    }
    const root=overlay();
    try{
      const home=await timeout(Promise.resolve(window.sbRpc(HOME_RPC,{})),COLD_HOME_TIMEOUT,'Home demorou demais');
      if(home){window.__ct0994PreloadedHome=home;warmImages(home)}
      ready=true;
      removeOverlay();
      void backgroundWarm(false);
      return true;
    }catch(error){
      console.error('[CineTracker 0.99.4] cold boot',error);
      const sub=root.querySelector('.ct112-sub');if(sub)sub.textContent='Não foi possível abrir a biblioteca agora.';
      root.querySelector('.ct112-spin').style.display='none';const retry=root.querySelector('.ct112-retry');retry.style.display='inline-flex';retry.onclick=()=>{retry.style.display='none';root.querySelector('.ct112-spin').style.display='block';booting=null;void boot()};
      return false;
    }
  })().finally(()=>{booting=null});
  return booting;
}
window.addEventListener('cinetracker:data-changed',()=>{void backgroundWarm(true)});
window.addEventListener('cinetracker:auth-state-change',e=>{if(e?.detail?.event==='SIGNED_IN')void boot()});
for(const d of [0,100,300])setTimeout(()=>{if(!ready&&(persistedSession()||authenticated()))void boot()},d);
})();
