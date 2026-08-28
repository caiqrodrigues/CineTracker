(() => {
'use strict';
if(window.__ct0994FluidityLoaded)return;
window.__ct0994FluidityLoaded=true;
window.__ct0994Fluidity='v114-cache-first-posters-stable-enrichment';

const ENRICH_KEY='ct0994_catalog_enrich_v3';
const ENRICH_TTL=6*60*60*1000;
const POSTER_LIMIT=140;

const css=document.createElement('style');
css.id='ct0994-fluidity-v113-style';
css.textContent=`
.ct114-rec-slot{min-width:0}.ct114-rec-slot>small{display:block;margin:0 0 7px;color:#7f99aa;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.06em}.ct114-rec-rule{margin:-4px 0 10px;color:#7892a4;font-size:10px}.ct991-timeline{scroll-behavior:auto!important}.ct991-day.today{outline:1px solid #60b9e8;outline-offset:-2px}
`;
document.getElementById(css.id)?.remove();document.head.appendChild(css);

function current113(){let v='';try{v=String(typeof view!=='undefined'?view:(window.view||''))}catch{}return v==='history'?'profile':v}
function uid113(){try{if(currentUser?.id)return String(currentUser.id)}catch{}try{if(ctSession?.user?.id)return String(ctSession.user.id)}catch{}return ''}
function readJson113(key){try{return JSON.parse(localStorage.getItem(key)||'null')}catch{return null}}
function collectPosters113(value,set,depth=0){
  if(depth>6||value==null)return;
  if(Array.isArray(value)){for(const x of value)collectPosters113(x,set,depth+1);return}
  if(typeof value!=='object')return;
  if(typeof value.poster_path==='string'&&value.poster_path.startsWith('/'))set.add(value.poster_path);
  for(const [k,v] of Object.entries(value)){if(k==='raw_tmdb'&&depth>3)continue;if(v&&typeof v==='object')collectPosters113(v,set,depth+1)}
}
function posterUrl113(path,size='w342'){try{return `${SUPABASE_URL}/functions/v1/tmdb-image?path=${encodeURIComponent(path)}&size=${size}`}catch{return ''}}
function preloadPosters113(){
  const paths=new Set();
  for(const key of ['ct0994_home_preload_v1','ct0994_profile_snapshot_v4','ct0994_discover_snapshot_v4']){const saved=readJson113(key);collectPosters113(saved?.data||saved,paths)}
  document.querySelectorAll('[style*="background-image"]').forEach(el=>{const m=String(el.style.backgroundImage||'').match(/url\(["']?([^"')]+)["']?\)/);if(m?.[1]){const img=new Image();img.decoding='async';img.src=m[1]}});
  let n=0;for(const p of paths){if(n++>=POSTER_LIMIT)break;const img=new Image();img.decoding='async';img.src=posterUrl113(p)}
}
async function enrichCatalog113(){
  const uid=uid113();if(!uid)return null;
  try{const last=JSON.parse(localStorage.getItem(ENRICH_KEY)||'null');if(last?.uid===uid&&Date.now()-Number(last.at||0)<ENRICH_TTL)return null}catch{}
  try{
    const headers=typeof authHeaders==='function'?{...authHeaders()}:{},token=(()=>{try{return ctSession?.access_token||''}catch{return ''}})();
    if(token&&!headers.Authorization)headers.Authorization=`Bearer ${token}`;
    if(!headers.Authorization)return null;
    headers['content-type']='application/json';
    const r=await fetch(`${SUPABASE_URL}/functions/v1/ct-enrich-media-user?limit=80&priority=home`,{method:'POST',headers,body:'{}'});
    if(!r.ok)throw new Error(`enrichment ${r.status}`);
    const data=await r.json();
    localStorage.setItem(ENRICH_KEY,JSON.stringify({uid,at:Date.now(),processed:Number(data.processed||0),ok:Number(data.ok||0)}));
    if(Number(data.ok||0)>0){
      // Atualiza snapshots em segundo plano sem apagar a tela/cache que já está visível.
      Promise.allSettled([
        window.__ct991Preload?.(true),
        window.__ct991PreloadDiscover?.(true),
        window.__ct0994PreloadCore?.({target:current113()||'home',force:true})
      ]).then(()=>preloadPosters113());
    }
    return data;
  }catch(e){console.warn('[CineTracker 0.99.4] enriquecimento de catálogo em segundo plano',e);return null}
}

const rawNav113=window.__ct0994Navigate;
if(typeof rawNav113==='function'&&!rawNav113.__ct113Wrapped){
  const fn=async function(target){const result=await rawNav113.apply(this,arguments);queueMicrotask(preloadPosters113);return result};
  fn.__ct113Wrapped=true;window.__ct0994Navigate=fn;window.ct0994Navigate=fn;window.ct0992Navigate=fn;window.ct991Navigate=fn;window.ct98Navigate=fn;
}
window.__ct113PreloadPosters=preloadPosters113;
window.__ct113EnrichCatalog=enrichCatalog113;
window.addEventListener('cinetracker:data-changed',()=>setTimeout(preloadPosters113,80));
for(const d of [20,90,260,700,1600])setTimeout(preloadPosters113,d);
setTimeout(()=>void enrichCatalog113(),1200);
})();
