(() => {
'use strict';
if(window.__ct0997R151Loaded)return;
window.__ct0997R151Loaded=true;
window.__ct0997R151='r151-library-identity-reconcile';
window.__ct151Scope='seen+watchlist+progress';
window.__ctWebRevision='r151';

const VERSION='r151',ENDPOINT=()=>`${SUPABASE_URL}/functions/v1/ct-reconcile-library-user`;
const state={running:false,manual:false,cancel:false,cursor:0,batches:0,processed:0,resolved:0,corrected_identity:0,promoted:0,covers_fixed:0,ambiguous:0,failed:0,conflicts:0,last:null,done:false};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function session(){try{if(typeof ctSession!=='undefined'&&ctSession?.access_token)return ctSession}catch{}try{return JSON.parse(localStorage.getItem('cinetracker_session')||'null')}catch{return null}}
function uid(){const s=session();try{return String((typeof currentUser!=='undefined'&&currentUser?.id)||s?.user?.id||'')}catch{return String(s?.user?.id||'')}}
function headers(){try{if(typeof authHeaders==='function')return{...authHeaders(),'content-type':'application/json'}}catch{}const s=session();return s?.access_token?{'content-type':'application/json','authorization':`Bearer ${s.access_token}`}:{'content-type':'application/json'}}
function reset(force=false){Object.assign(state,{running:true,manual:force,cancel:false,cursor:0,batches:0,processed:0,resolved:0,corrected_identity:0,promoted:0,covers_fixed:0,ambiguous:0,failed:0,conflicts:0,last:null,done:false})}
function accumulate(x){for(const k of['processed','resolved','corrected_identity','promoted','covers_fixed','ambiguous','failed','conflicts'])state[k]+=Number(x?.[k]||0);state.last=x;state.cursor=Number(x?.next_cursor||state.cursor);state.batches++}
async function callBatch(body,attempt=0){
  const c=new AbortController(),timer=setTimeout(()=>c.abort(),55000);
  try{
    const r=await fetch(ENDPOINT(),{method:'POST',headers:headers(),body:JSON.stringify(body),signal:c.signal});
    let d={};try{d=await r.json()}catch{}
    if(!r.ok)throw new Error(d?.error||`Sincronização ${r.status}`);return d;
  }catch(e){if(attempt<2){await sleep(700*(attempt+1));return callBatch(body,attempt+1)}throw e}finally{clearTimeout(timer)}
}
function clearCaches(){
  try{for(let i=localStorage.length-1;i>=0;i--){const k=localStorage.key(i)||'';if(/ct0997|ct0994|home|profile|discover|poster|media/i.test(k)&&!/session|locale/i.test(k))localStorage.removeItem(k)}}catch{}
  try{for(let i=sessionStorage.length-1;i>=0;i--){const k=sessionStorage.key(i)||'';if(/home|profile|discover|poster|media|detail/i.test(k))sessionStorage.removeItem(k)}}catch{}
  try{window.__ct0994PreloadedHome=null;window.__ct0997PreloadedHomeLive=null;window.__ct0997PreloadedProfile=null}catch{}
}
function announce(reason='library-reconcile'){clearCaches();window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'r151',reason,stats:{...state}}}));try{window.__ct150bRealtime?.revalidate?.('r151-library')}catch{}}

async function run({force=false,auto=false,maxBatches=Infinity}={}){
  if(state.running)return state;const s=session();if(!s?.access_token)return state;
  reset(force);render();let hasMore=true;
  try{
    while(hasMore&&!state.cancel&&state.batches<maxBatches){
      if(auto&&(document.hidden||!navigator.onLine))break;
      const d=await callBatch({cursor:state.cursor,limit:auto?30:40,force});accumulate(d);hasMore=Boolean(d?.has_more);render();
      if(state.batches%3===0||!hasMore)announce();if(hasMore)await sleep(auto?750:250);
    }
    state.done=!hasMore;if(state.done){announce('library-reconcile-complete');try{localStorage.setItem(`ct151:done:${uid()}`,JSON.stringify({at:Date.now(),version:VERSION,stats:{processed:state.processed,resolved:state.resolved,corrected_identity:state.corrected_identity,covers_fixed:state.covers_fixed,ambiguous:state.ambiguous,failed:state.failed}}))}catch{}}
  }catch(e){state.failed++;state.last={error:e?.message||String(e)};render()}
  finally{state.running=false;render()}
  return state;
}

let autoTimer=0;
function scheduleAuto(delay=1800){clearTimeout(autoTimer);autoTimer=setTimeout(async()=>{
  if(state.running||document.hidden||!navigator.onLine||!session()?.access_token)return;
  await run({force:false,auto:true,maxBatches:24});
  if(!state.done&&!document.hidden)scheduleAuto(4500);
},delay)}

const css=document.createElement('style');css.id='ct151-library-style';css.textContent=`
#ct151-library-card{grid-column:1/-1;border:1px solid #28536b;background:#071821;border-radius:14px;padding:13px;margin-top:10px}#ct151-library-card h3{margin:0 0 5px;font-size:14px}#ct151-library-card p{margin:0;color:#8ca5b5;font-size:10px;line-height:1.45}.ct151-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:10px}.ct151-actions button{border:1px solid #315f78;background:#0a1b25;color:#e8f8ff;border-radius:9px;padding:8px 10px;cursor:pointer}.ct151-actions button:disabled{opacity:.5}.ct151-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;margin-top:10px}.ct151-stat{border:1px solid #203f51;background:#081820;border-radius:9px;padding:7px;text-align:center}.ct151-stat b{display:block;font-size:12px}.ct151-stat small{display:block;color:#7892a4;font-size:8px;margin-top:2px}@media(max-width:520px){.ct151-stats{grid-template-columns:repeat(2,minmax(0,1fr))}}
`;document.getElementById(css.id)?.remove();document.head.appendChild(css);
function settingsRoot(){return document.querySelector('.ct91-settings,.ct109-settings,#ct120-settings,[data-ct-settings-root]')}
function ensureCard(){
  const root=settingsRoot();if(!root)return null;let card=document.getElementById('ct151-library-card');if(card)return card;
  card=document.createElement('section');card.id='ct151-library-card';card.innerHTML=`<h3>Sincronização e correção da biblioteca</h3><p data-ct151-msg>Valida filmes e séries vistos/Watchlist contra o TMDB, corrige identidade e recupera capas sem escolher resultados ambíguos.</p><div class="ct151-stats"><div class="ct151-stat"><b data-ct151-p>0</b><small>Processados</small></div><div class="ct151-stat"><b data-ct151-c>0</b><small>IDs corrigidos</small></div><div class="ct151-stat"><b data-ct151-cover>0</b><small>Capas recuperadas</small></div><div class="ct151-stat"><b data-ct151-a>0</b><small>Ambíguos preservados</small></div></div><div class="ct151-actions"><button type="button" data-ct151-sync>Sincronizar pendentes</button><button type="button" data-ct151-force>Revalidar tudo</button><button type="button" data-ct151-cancel hidden>Cancelar</button></div>`;
  root.appendChild(card);card.querySelector('[data-ct151-sync]').onclick=()=>void run({force:false,auto:false});card.querySelector('[data-ct151-force]').onclick=()=>void run({force:true,auto:false});card.querySelector('[data-ct151-cancel]').onclick=()=>{state.cancel=true;render()};return card;
}
function render(){
  const card=ensureCard();if(!card)return;for(const [sel,val]of[['[data-ct151-p]',state.processed],['[data-ct151-c]',state.corrected_identity],['[data-ct151-cover]',state.covers_fixed],['[data-ct151-a]',state.ambiguous]]){const e=card.querySelector(sel);if(e)e.textContent=String(val)}
  const msg=card.querySelector('[data-ct151-msg]');if(msg){msg.textContent=state.running?`Sincronizando… lote ${state.batches+1}. Pode continuar usando o CineTracker.`:state.done?`Sincronização concluída. ${state.resolved} mídias validadas; ${state.corrected_identity} identidades corrigidas; ${state.covers_fixed} capas recuperadas; ${state.ambiguous} itens ficaram preservados por ambiguidade.`:state.last?.error?`Falha temporária: ${state.last.error}`:'Valida todos os filmes e séries vistos/Watchlist e corrige somente correspondências seguras.'}
  for(const b of card.querySelectorAll('[data-ct151-sync],[data-ct151-force]'))b.disabled=state.running;const cancel=card.querySelector('[data-ct151-cancel]');if(cancel)cancel.hidden=!state.running;
}

// Safety bridge: surrogate/negative IDs must never be sent to TMDB as real IDs.
const rawFetch=window.fetch.bind(window),surrogateCache=new Map();
async function resolveSurrogate(type,id){const key=`${type}:${id}`;if(surrogateCache.has(key))return surrogateCache.get(key);let source=0;try{const q=`media?select=raw_tmdb&media_type=eq.${encodeURIComponent(type)}&tmdb_id=eq.${encodeURIComponent(id)}&limit=1`;const rows=typeof sbApi==='function'?await sbApi(q):[];source=Number(rows?.[0]?.raw_tmdb?.source_tmdb_id||0);if(!(source>0))source=0}catch{}surrogateCache.set(key,source);return source}
window.fetch=async function(input,init){
  try{
    const url=new URL(typeof input==='string'?input:input?.url,location.href);
    if(url.pathname.endsWith('/functions/v1/tmdb-proxy')){
      const path=url.searchParams.get('path')||'',m=path.match(/^\/(movie|tv)\/(-\d+)(\/.*)?$/);
      if(m){const real=await resolveSurrogate(m[1],Number(m[2]));if(real>0){url.searchParams.set('path',`/${m[1]}/${real}${m[3]||''}`);return rawFetch(url.toString(),init)}return new Response(JSON.stringify({status_code:34,status_message:'CineTracker: identidade TMDB pendente de reconciliação'}),{status:404,headers:{'content-type':'application/json'}})}
    }
  }catch{}
  return rawFetch(input,init)
};
window.__ct151RawFetch=rawFetch;
window.__ct151SyncLibrary=opts=>run(opts||{});
window.__ct151ResolveMedia=async mediaId=>{const d=await callBatch({requested_media_ids:[Number(mediaId)],limit:1,force:true});announce('single-media-reconcile');return d};
window.__ct151LibraryState=state;

const observer=new MutationObserver(()=>{if(settingsRoot()&&!document.getElementById('ct151-library-card')){ensureCard();render()}});observer.observe(document.body,{childList:true,subtree:true});
window.addEventListener('focus',()=>{ensureCard();render();scheduleAuto(500)});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)scheduleAuto(500)});
window.addEventListener('online',()=>scheduleAuto(300));
for(const name of['cinetracker:auth-state-change','cinetracker:auth-state-changed'])window.addEventListener(name,()=>scheduleAuto(700));
for(const d of[100,500,1400,3000])setTimeout(()=>{ensureCard();render();if(d===1400)scheduleAuto(100)},d);
})();
