(() => {
'use strict';
if(window.__ct0997SettingsMetadata129Loaded)return;
window.__ct0997SettingsMetadata129Loaded=true;
window.__ct0997SettingsMetadata129='v129-settings-real-metadata-refresh-only';

const $129=(s,r=document)=>r?.querySelector?.(s)||null;
const norm129=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const cleanTitle129=v=>String(v||'').replace(/\s*\((?:18|19|20)\d{2}\)\s*$/,'').trim();
const sleep129=ms=>new Promise(r=>setTimeout(r,ms));
let busy129=false,cancel129=false;

const css129=document.createElement('style');
css129.id='ct0997-settings-metadata129-style';
css129.textContent=`
.ct129-progress[hidden]{display:none!important}.ct129-progress{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;padding:18px;background:#000a;backdrop-filter:blur(5px)}
.ct129-card{width:min(520px,100%);box-sizing:border-box;border:1px solid #315a72;background:#07151e;border-radius:16px;padding:16px;box-shadow:0 24px 80px #000c}.ct129-card h3{margin:0 0 5px;font-size:16px}.ct129-card p{margin:0;color:#8fa8b8;font-size:10px;line-height:1.5}.ct129-bar{height:8px;margin:15px 0 9px;border-radius:999px;overflow:hidden;background:#0d2633;border:1px solid #24475a}.ct129-fill{height:100%;width:0;background:linear-gradient(90deg,#2c82ae,#61c5ef);transition:width .15s ease}.ct129-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;margin-top:12px}.ct129-stat{border:1px solid #203f51;background:#081820;border-radius:10px;padding:8px;text-align:center}.ct129-stat b{display:block;font-size:13px}.ct129-stat small{display:block;color:#7e98a8;font-size:8px;margin-top:2px}.ct129-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:13px}.ct129-actions button{border:1px solid #315a72;background:#0a1d28;color:#e7f7ff;border-radius:9px;padding:8px 11px;cursor:pointer}.ct129-actions button[hidden]{display:none!important}
@media(max-width:520px){.ct129-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.ct129-card{padding:13px}}
`;
document.getElementById(css129.id)?.remove();document.head.appendChild(css129);

function isSettings129(){
  const h=norm129($129('.content h1')?.textContent||'');
  let v='';try{v=String(typeof view!=='undefined'?view:(window.view||''))}catch{v=String(window.view||'')}
  return h.includes('configuracoes')||['settings','ct91-settings','ct92-settings'].includes(v);
}
function ensureProgress129(){
  let o=$129('#ct129-progress');if(o)return o;
  o=document.createElement('div');o.id='ct129-progress';o.className='ct129-progress';o.hidden=true;
  o.innerHTML=`<section class="ct129-card" role="dialog" aria-modal="true"><h3>Atualizando metadados</h3><p data-ct129-message>Preparando biblioteca…</p><div class="ct129-bar"><div class="ct129-fill" data-ct129-fill></div></div><p data-ct129-count>0 / 0</p><div class="ct129-stats"><div class="ct129-stat"><b data-ct129-updated>0</b><small>Atualizados</small></div><div class="ct129-stat"><b data-ct129-corrected>0</b><small>IDs corrigidos</small></div><div class="ct129-stat"><b data-ct129-skipped>0</b><small>Ignorados com segurança</small></div><div class="ct129-stat"><b data-ct129-failed>0</b><small>Falhas</small></div></div><div class="ct129-actions"><button type="button" data-ct129-cancel>Cancelar</button><button type="button" data-ct129-close hidden>Fechar</button></div></section>`;
  document.body.appendChild(o);
  $129('[data-ct129-cancel]',o).onclick=()=>{cancel129=true;$129('[data-ct129-message]',o).textContent='Cancelando após as requisições atuais…'};
  $129('[data-ct129-close]',o).onclick=()=>{o.hidden=true};
  return o;
}
function resetProgress129(){const o=ensureProgress129();$129('[data-ct129-cancel]',o).hidden=false;$129('[data-ct129-close]',o).hidden=true;return o}
function updateUi129(state,message){
  const o=ensureProgress129(),total=Math.max(0,state.total||0),done=Math.min(total,state.done||0),pct=total?Math.round(done*100/total):0;
  o.hidden=false;$129('[data-ct129-message]',o).textContent=message||'Atualizando…';$129('[data-ct129-fill]',o).style.width=`${pct}%`;$129('[data-ct129-count]',o).textContent=`${done} / ${total} · ${pct}%`;
  for(const k of ['updated','corrected','skipped','failed'])$129(`[data-ct129-${k}]`,o).textContent=String(state[k]||0);
}
function detailYear129(d){return Number(String(d?.release_date||d?.first_air_date||'').slice(0,4))||0}
function aliases129(d){return [d?.title,d?.name,d?.original_title,d?.original_name].map(norm129).filter(Boolean)}
function type129(row){const t=String(row?.media_type||'').toLowerCase();return t==='movie'?'movie':'tv'}
function rowYear129(row){return Number(row?.release_year||String(row?.raw_tmdb?.release_date||row?.raw_tmdb?.first_air_date||'').slice(0,4))||0}
function exact129(row,d){
  if(!d)return false;
  const local=norm129(cleanTitle129(row?.title||''));if(!local||/^tmdb \d+$/.test(local))return true;
  if(!aliases129(d).includes(local))return false;
  const y=rowYear129(row),dy=detailYear129(d);return !y||(dy>0&&y===dy);
}
async function api129(path,params={}){
  let last;
  for(let attempt=0;attempt<3;attempt++){
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),12000);
    try{
      const u=new URL(`${SUPABASE_URL}/functions/v1/tmdb-proxy`);u.searchParams.set('path',path);u.searchParams.set('language',localStorage.getItem('cinetracker_locale')==='en-US'?'en-US':'pt-BR');for(const[k,v]of Object.entries(params))if(v!=null&&v!=='')u.searchParams.set(k,String(v));
      const r=await fetch(u,{headers:typeof authHeaders==='function'?authHeaders():{},signal:controller.signal});if(!r.ok){last=new Error(`TMDB ${r.status}`);if(r.status===429||r.status>=500){await sleep129(500*(attempt+1));continue}throw last}return await r.json();
    }catch(e){last=e;if(attempt<2)await sleep129(400*(attempt+1))}finally{clearTimeout(timer)}
  }
  throw last||new Error('TMDB indisponível');
}
async function resolve129(row){
  const type=type129(row),id=Number(row?.tmdb_id||0);if(!id)return null;
  let d=await api129(`/${type}/${id}`);
  if(exact129(row,d))return{detail:d,type,corrected:false};
  const q=cleanTitle129(row?.title||'');if(!q)return null;
  const y=rowYear129(row);let candidates=[];
  for(const page of [1,2]){const s=await api129(`/search/${type}`,{query:q,page});candidates.push(...(s?.results||[]));if((s?.results||[]).length===0)break}
  const local=norm129(q);const c=candidates.find(x=>aliases129(x).includes(local)&&(!y||(detailYear129(x)>0&&detailYear129(x)===y)));if(!c?.id)return null;
  d=await api129(`/${type}/${Number(c.id)}`);if(!exact129(row,d))return null;
  return{detail:d,type,corrected:Number(c.id)!==id};
}
async function clearMetadataCaches129(){
  try{for(let i=localStorage.length-1;i>=0;i--){const k=localStorage.key(i)||'';if(k.startsWith('ct45w:')||k.startsWith('ct53w:'))localStorage.removeItem(k)}}catch{}
  try{for(let i=sessionStorage.length-1;i>=0;i--){const k=sessionStorage.key(i)||'';if(k.startsWith('ct121safe:'))sessionStorage.removeItem(k)}}catch{}
  try{const ks=await caches.keys();await Promise.all(ks.filter(k=>k.includes('-meta')||k.includes('tmdb-meta')).map(k=>caches.delete(k)))}catch{}
}
async function refreshOne129(row,state){
  try{
    const resolved=await resolve129(row);if(!resolved){state.skipped++;return}
    const d=resolved.detail,type=resolved.type,newId=Number(d.id||row.tmdb_id),body={tmdb_id:newId,media_type:type,title:d.title||d.name||row.title,poster_path:d.poster_path||row.poster_path||null,release_year:detailYear129(d)||row.release_year||null,raw_tmdb:d};
    await sbApi(`media?id=eq.${encodeURIComponent(row.id)}`,{method:'PATCH',body:JSON.stringify(body)});
    state.updated++;if(resolved.corrected)state.corrected++;
  }catch{state.failed++}
}
async function realRefresh129(){
  if(busy129)return;busy129=true;cancel129=false;resetProgress129();
  const btn=$129('#ct91-refresh'),oldText=btn?.textContent||'Atualizar metadados';if(btn){btn.disabled=true;btn.textContent='Atualizando…'}
  const state={total:0,done:0,updated:0,corrected:0,skipped:0,failed:0};
  try{
    updateUi129(state,'Limpando caches antigos do TMDB…');await clearMetadataCaches129();
    updateUi129(state,'Lendo sua biblioteca…');const rows=(await sbApi('media?select=id,tmdb_id,media_type,title,release_year,poster_path,raw_tmdb&order=id.asc'))||[];const work=rows.filter(x=>x?.id&&Number(x?.tmdb_id||0)>0);state.total=work.length;updateUi129(state,work.length?'Atualizando biblioteca com dados atuais do TMDB…':'Nenhuma mídia com TMDB ID encontrada.');
    let next=0;const workers=Array.from({length:Math.min(4,Math.max(1,work.length))},async()=>{while(true){if(cancel129)return;const i=next++;if(i>=work.length)return;await refreshOne129(work[i],state);state.done++;if(state.done===state.total||state.done%5===0)updateUi129(state,'Atualizando biblioteca com dados atuais do TMDB…')}});await Promise.all(workers);
    await clearMetadataCaches129();try{await window.ct53Refresh?.()}catch{}try{window.ct53RebootCovers?.()}catch{}window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'metadata-refresh',version:'0.99.7'}}));
    const message=cancel129?'Atualização cancelada. O que já foi atualizado foi mantido.':`Concluído: ${state.updated} atualizados${state.corrected?`, ${state.corrected} IDs corrigidos`:''}.`;
    updateUi129(state,message);const o=ensureProgress129();$129('[data-ct129-cancel]',o).hidden=true;$129('[data-ct129-close]',o).hidden=false;
  }catch(e){state.failed++;updateUi129(state,`Falha ao atualizar metadados: ${e?.message||'erro desconhecido'}`);const o=ensureProgress129();$129('[data-ct129-cancel]',o).hidden=true;$129('[data-ct129-close]',o).hidden=false}
  finally{busy129=false;if(btn){btn.disabled=false;btn.textContent=oldText}}
}
function label129(){const b=$129('#ct91-refresh');if(b)b.textContent='Atualizar metadados'}
function schedule129(){for(const d of[0,80,180,360,700,1200,2000])setTimeout(()=>{if(isSettings129())label129()},d)}

document.addEventListener('click',e=>{const b=e.target?.closest?.('#ct91-refresh');if(!b||!isSettings129())return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();void realRefresh129()},true);
document.addEventListener('click',e=>{if(e.target?.closest?.('[data-view="settings"],[data-ct120-nav="settings"]'))schedule129()},true);
window.addEventListener('focus',()=>{if(isSettings129())schedule129()});
schedule129();
})();
