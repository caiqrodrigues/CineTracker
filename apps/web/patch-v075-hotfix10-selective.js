(() => {
'use strict';
if (window.__ctHotfix10Selective) return;
window.__ctHotfix10Selective = true;

const $10=(s,r=document)=>r.querySelector(s), $$10=(s,r=document)=>[...r.querySelectorAll(s)];
const sleep10=ms=>new Promise(r=>setTimeout(r,ms));
const esc10=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const css=document.createElement('style');
css.id='ct10-selective-style';
css.textContent=`
.ct10-import{border:1px solid #28455c;background:linear-gradient(145deg,#0b1218,#0d1922);border-radius:15px;padding:16px;margin-top:16px}.ct10-import h2{margin:0 0 8px}.ct10-drop{border:1px dashed #4b7593;border-radius:13px;padding:20px;text-align:center;background:#09131b}.ct10-drop input{margin-top:10px;max-width:100%}.ct10-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.ct10-btn{border:1px solid #31506a;background:#0b151d;color:#eef7ff;border-radius:9px;padding:8px 10px;cursor:pointer}.ct10-muted{color:#9aabb8;font-size:12px;line-height:1.45}.ct10-preview{position:fixed;inset:0;z-index:900000;background:#02070cf5;overflow:auto;padding:18px}.ct10-preview-card{width:min(760px,100%);margin:30px auto;border:1px solid #31506a;background:#0b151d;border-radius:16px;padding:18px}.ct10-preview-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}.ct10-metric{border:1px solid #274156;background:#09121a;border-radius:12px;padding:12px;text-align:center}.ct10-metric b{font-size:22px;display:block}.ct10-progress{height:10px;background:#17232c;border-radius:999px;overflow:hidden;margin:12px 0}.ct10-progress>span{display:block;height:100%;width:0;background:#4f9d69;transition:width .15s}.ct10-progress-label{text-align:center;color:#b9c8d3;font-size:12px}.ct10-safe{border:1px solid #285b3a;background:#0c2115;border-radius:10px;padding:10px;margin:12px 0;color:#c9f0d4;font-size:12px}@media(max-width:700px){.ct10-preview-grid{grid-template-columns:1fr}.ct10-preview-card{margin:8px auto}}
`;
document.head.appendChild(css);

function setView10(target){try{view=target}catch{}try{window.view=target}catch{}}

async function activateDiscover10(){
  for(let i=0;i<18;i++){
    const fy=$10('[data-ct95-tab="for-you"]');
    const tabs=$10('.ct92-tabs');
    if(fy&&tabs){
      const ordered=[fy,...$$10('[data-ct92-tab]',tabs),$10('[data-ct95-tab="calendar"]',tabs)].filter(Boolean);
      for(const b of ordered) tabs.appendChild(b);
      if(!fy.classList.contains('active')) fy.click();
      for(const delay of [40,180,500]) setTimeout(()=>{
        const heads=$$10('.ct95-section h3');
        if(heads[1]&&/Recomendações da Watchlist/i.test(heads[1].textContent||''))heads[1].textContent='Da Watchlist';
        if(heads[2]&&/Descobertas 100% Novas/i.test(heads[2].textContent||''))heads[2].textContent='100% Novos';
      },delay);
      return true;
    }
    await sleep10(50);
  }
  return false;
}

function injectImporter10(){
  const host=$10('.content');
  if(!host||$10('#ct10-import-panel'))return;
  const panel=document.createElement('section');
  panel.id='ct10-import-panel';
  panel.className='ct10-import';
  panel.innerHTML=`<h2>Importar dados do Bingers</h2><p class="ct10-muted">Use um ZIP contendo <b>library.csv</b> e <b>watches.csv</b>, selecione os dois CSVs juntos, ou use um JSON com as coleções <b>library</b> e <b>watches</b>.</p><div class="ct10-safe">A importação substitui somente dados de importações anteriores. Histórico criado no CineTracker e decisões manuais são preservados.</div><div class="ct10-drop"><b>ZIP, JSON ou library.csv + watches.csv</b><br><input id="ct10-files" type="file" multiple accept=".zip,.json,.csv,text/csv,application/json,application/zip"></div><div class="ct10-actions"><button class="ct10-btn" id="ct10-read">Analisar e visualizar prévia</button></div><div id="ct10-file-status" class="ct10-muted" style="margin-top:10px"></div>`;
  host.appendChild(panel);
  let selected=[];
  $10('#ct10-files',panel).onchange=e=>{selected=[...e.target.files];$10('#ct10-file-status',panel).textContent=selected.map(f=>f.name).join(', ')};
  $10('#ct10-read',panel).onclick=async()=>{
    const status=$10('#ct10-file-status',panel);
    try{
      if(!selected.length)throw new Error('Selecione o ZIP, o JSON ou os dois CSVs.');
      status.textContent='Lendo arquivos em memória…';
      await readImportFiles10(selected);
      status.textContent='Prévia pronta. Nenhum dado foi alterado.';
    }catch(e){status.textContent='Erro: '+(e?.message||e)}
  };
}

function route10(target){
  if(!['home','discover','history','profile','settings'].includes(target))return false;
  setView10(target);
  try{
    if(target==='home'){
      (window.ct95Navigate||window.ct94Navigate||window.ct92Navigate||window.ct91Navigate)?.('home');
    }else if(target==='discover'){
      (window.ct95Navigate||window.ct94Navigate||window.ct92Navigate)?.('discover');
      void activateDiscover10();
    }else if(target==='history'){
      (window.ct92Navigate||window.ct95Navigate||window.ct94Navigate)?.('history');
    }else if(target==='profile'){
      (window.ct95Navigate||window.ct94Navigate||window.ct92Navigate)?.('profile');
    }else if(target==='settings'){
      (window.ct92Navigate||window.ct94Navigate||window.ct91Navigate)?.('settings');
      setTimeout(injectImporter10,80);setTimeout(injectImporter10,260);
    }
  }catch(e){console.error('CineTracker HOTFIX10 navigation:',e);return false}
  window.scrollTo?.(0,0);
  return true;
}
window.ct10Navigate=route10;

window.addEventListener('click',e=>{
  const b=e.target?.closest?.('.nav button[data-view],.mobile-nav button[data-view],[data-view]');
  if(!b)return;
  const target=b.dataset.view;
  if(!['home','discover','history','profile','settings'].includes(target))return;
  e.preventDefault();
  e.stopImmediatePropagation();
  route10(target);
},true);

function parseCSV10(text){
  const rows=[],row=[];let cur='',q=false;
  for(let i=0;i<text.length;i++){
    const ch=text[i];
    if(q){if(ch==='"'&&text[i+1]==='"'){cur+='"';i++}else if(ch==='"')q=false;else cur+=ch}
    else if(ch==='"')q=true;
    else if(ch===','){row.push(cur);cur=''}
    else if(ch==='\n'){row.push(cur.replace(/\r$/,''));rows.push([...row]);row.length=0;cur=''}
    else cur+=ch;
  }
  if(cur||row.length){row.push(cur.replace(/\r$/,''));rows.push(row)}
  const head=(rows.shift()||[]).map(x=>x.trim());
  return rows.filter(r=>r.some(Boolean)).map(r=>Object.fromEntries(head.map((h,i)=>[h,r[i]??''])));
}

async function unzipCSV10(file){
  const ab=await file.arrayBuffer(),dv=new DataView(ab);let eocd=-1;
  for(let i=ab.byteLength-22;i>=Math.max(0,ab.byteLength-65557);i--)if(dv.getUint32(i,true)===0x06054b50){eocd=i;break}
  if(eocd<0)throw new Error('ZIP inválido.');
  const n=dv.getUint16(eocd+10,true),off=dv.getUint32(eocd+16,true),dec=new TextDecoder(),out={};let p=off;
  for(let i=0;i<n;i++){
    if(dv.getUint32(p,true)!==0x02014b50)break;
    const method=dv.getUint16(p+10,true),size=dv.getUint32(p+20,true),nl=dv.getUint16(p+28,true),el=dv.getUint16(p+30,true),cl=dv.getUint16(p+32,true),lo=dv.getUint32(p+42,true),name=dec.decode(new Uint8Array(ab,p+46,nl));
    if(/(^|\/)(library|watches)\.csv$/i.test(name)){
      const lnl=dv.getUint16(lo+26,true),lel=dv.getUint16(lo+28,true),start=lo+30+lnl+lel,bytes=new Uint8Array(ab,start,size);let text;
      if(method===0)text=dec.decode(bytes);
      else if(method===8){if(typeof DecompressionStream!=='function')throw new Error('Este navegador não suporta ZIP comprimido. Selecione library.csv e watches.csv diretamente.');const ds=new DecompressionStream('deflate-raw');text=await new Response(new Blob([bytes]).stream().pipeThrough(ds)).text()}
      else throw new Error('Compressão ZIP não suportada: '+method);
      out[name.toLowerCase().includes('library.csv')?'library':'watches']=text;
    }
    p+=46+nl+el+cl;
  }
  if(!out.library||!out.watches)throw new Error('O ZIP deve conter library.csv e watches.csv.');
  return out;
}

function fnv10(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function stableId10(x){const r=Number(x.tmdb_id||0);if(r>0)return r;const t=x.type==='movie'?'movie':'tv';return -(1000000000+(fnv10(`${t}|${x.tvdb_id||''}|${x.title||''}|${x.year||''}`)%900000000))}
function norm10(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}

function prepareImport10(library,watches){
  library=library.map((x,i)=>({...x,import_key:String(i+1)}));
  const byTmdb=new Map(),byTvdb=new Map(),byTitle=new Map();
  for(const x of library){const t=x.type==='movie'?'movie':'show';if(x.tmdb_id)byTmdb.set(`${t}:${x.tmdb_id}`,x);if(x.tvdb_id)byTvdb.set(`${t}:${x.tvdb_id}`,x);const k=`${t}:${norm10(x.title)}`;if(!byTitle.has(k))byTitle.set(k,[]);byTitle.get(k).push(x)}
  const mapped=[];
  for(let i=0;i<watches.length;i++){
    const w=watches[i],t=w.type==='movie'?'movie':'show';
    let m=(w.tmdb_id&&byTmdb.get(`${t}:${w.tmdb_id}`))||(w.tvdb_id&&byTvdb.get(`${t}:${w.tvdb_id}`));
    if(!m){const a=byTitle.get(`${t}:${norm10(w.title)}`)||[];m=a.length===1?a[0]:a.find(x=>Number(x.year)<=Number(String(w.first_watched_at||w.last_watched_at||'').slice(0,4)))||a[0]}
    if(!m)continue;
    mapped.push({...w,source_history_id:i+1,media_tmdb_id:stableId10(m),media_type:m.type==='movie'?'movie':'tv'});
  }
  const movies=library.filter(x=>x.type==='movie').length,series=library.filter(x=>x.type==='show').length,watchedMovies=mapped.filter(x=>x.type==='movie').length,episodes=mapped.filter(x=>x.type==='episode').length,watchMovies=library.filter(x=>x.type==='movie'&&x.list_status==='for_later').length,watchSeries=library.filter(x=>x.type==='show'&&x.list_status==='for_later').length,followed=library.filter(x=>x.type==='show'&&['following','watching'].includes(x.list_status)).length;
  return{library,watches:mapped,summary:{library_items:library.length,library_movies:movies,library_series:series,watch_events:mapped.length,watched_movie_events:watchedMovies,watched_episode_events:episodes,watchlist_movies:watchMovies,watchlist_series:watchSeries,followed_series:followed}};
}

async function edge10(body){
  const r=await fetch(`${SUPABASE_URL}/functions/v1/ct-import-bingers-user`,{method:'POST',headers:{...authHeaders(),'Content-Type':'application/json'},body:JSON.stringify(body)}),d=await r.json().catch(()=>({}));
  if(!r.ok||!d.ok)throw new Error(d.error||`Importação ${r.status}`);
  return d;
}

let pendingImport10=null;
function preview10(data,name){
  pendingImport10={...data,name};
  $10('#ct10-preview')?.remove();
  const o=document.createElement('div');o.id='ct10-preview';o.className='ct10-preview';const s=data.summary;
  o.innerHTML=`<div class="ct10-preview-card"><h2>Prévia da importação</h2><p class="ct10-muted">Nenhum dado foi alterado. Confira os números antes de confirmar.</p><div class="ct10-safe">Ao confirmar, somente uma importação anterior será substituída. Dados criados no CineTracker e decisões manuais têm prioridade e serão preservados.</div><div class="ct10-preview-grid"><div class="ct10-metric"><b>${s.library_items}</b>Títulos</div><div class="ct10-metric"><b>${s.library_movies}</b>Filmes</div><div class="ct10-metric"><b>${s.library_series}</b>Séries</div><div class="ct10-metric"><b>${s.watched_movie_events}</b>Filmes assistidos</div><div class="ct10-metric"><b>${s.watched_episode_events}</b>Episódios assistidos</div><div class="ct10-metric"><b>${s.watchlist_movies+s.watchlist_series}</b>Watchlist</div><div class="ct10-metric"><b>${s.watchlist_movies}</b>Watchlist filmes</div><div class="ct10-metric"><b>${s.watchlist_series}</b>Watchlist séries</div><div class="ct10-metric"><b>${s.followed_series}</b>Séries acompanhadas</div></div><div id="ct10-progress-wrap" hidden><div class="ct10-progress"><span></span></div><div class="ct10-progress-label">Preparando…</div></div><div class="ct10-actions"><button class="ct10-btn" data-close10>Cancelar</button><button class="ct10-btn" data-confirm10>Confirmar importação</button></div></div>`;
  document.body.appendChild(o);
  $10('[data-close10]',o).onclick=()=>o.remove();
  $10('[data-confirm10]',o).onclick=()=>runImport10();
}
function progress10(p,label){const w=$10('#ct10-progress-wrap');if(!w)return;w.hidden=false;$10('.ct10-progress span',w).style.width=`${Math.max(0,Math.min(100,p))}%`;$10('.ct10-progress-label',w).textContent=label}

async function runImport10(){
  const p=pendingImport10;if(!p)return;
  const confirmBtn=$10('[data-confirm10]');if(confirmBtn)confirmBtn.disabled=true;
  try{
    progress10(1,'Preparando importação segura…');
    const begin=await edge10({action:'begin',filename:p.name,file_type:p.name.toLowerCase().endsWith('.json')?'json':'zip',total_items:p.summary.library_items+p.summary.watch_events}),id=begin.import_id,batch=150,total=Math.max(1,p.library.length+p.watches.length);let done=0;
    for(let i=0;i<p.library.length;i+=batch){const rows=p.library.slice(i,i+batch);await edge10({action:'library_batch',import_id:id,rows,cursor:done,progress:Math.round(done/total*100)});done+=rows.length;progress10(5+Math.round(done/total*85),`Importando biblioteca: ${Math.round((i+rows.length)/p.library.length*100)}%`);await sleep10(0)}
    for(let i=0;i<p.watches.length;i+=batch){const rows=p.watches.slice(i,i+batch);await edge10({action:'watches_batch',import_id:id,rows,cursor:done,progress:Math.round(done/total*100)});done+=rows.length;progress10(5+Math.round(done/total*85),`Importando histórico: ${Math.round((i+rows.length)/p.watches.length*100)}%`);await sleep10(0)}
    progress10(95,'Atualizando o CineTracker…');
    await edge10({action:'finish',import_id:id,summary:p.summary});
    progress10(100,'Importação concluída.');
    window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'hotfix10-import'}}));
    setTimeout(()=>{$10('#ct10-preview')?.remove();route10('history')},650);
  }catch(e){progress10(0,'Erro: '+(e?.message||e));if(confirmBtn)confirmBtn.disabled=false}
}

async function readImportFiles10(files){
  const a=[...files];let library,watches,name=a.map(x=>x.name).join(' + ');
  const zip=a.find(f=>f.name.toLowerCase().endsWith('.zip'));
  const json=a.find(f=>f.name.toLowerCase().endsWith('.json'));
  if(zip){const z=await unzipCSV10(zip);library=parseCSV10(z.library);watches=parseCSV10(z.watches);name=zip.name}
  else if(json){const d=JSON.parse(await json.text());library=Array.isArray(d?.library)?d.library:Array.isArray(d?.library_items)?d.library_items:null;watches=Array.isArray(d?.watches)?d.watches:Array.isArray(d?.watch_events)?d.watch_events:null;if(!library||!watches)throw new Error('JSON inválido: esperado { library: [...], watches: [...] }.');name=json.name}
  else{const l=a.find(f=>f.name.toLowerCase()==='library.csv'),w=a.find(f=>f.name.toLowerCase()==='watches.csv');if(!l||!w)throw new Error('Selecione library.csv e watches.csv juntos.');const texts=await Promise.all([l.text(),w.text()]);library=parseCSV10(texts[0]);watches=parseCSV10(texts[1])}
  const data=prepareImport10(library||[],watches||[]);
  if(!data.library.length)throw new Error('library.csv/JSON não contém títulos válidos.');
  if(!data.watches.length)throw new Error('watches.csv/JSON não contém eventos que puderam ser associados à biblioteca.');
  preview10(data,name);
}
window.ct10ReadImportFiles=readImportFiles10;

setTimeout(()=>{let v='';try{v=String(view||'')}catch{};if(v==='discover')void activateDiscover10();if(v==='settings')injectImporter10()},120);
})();
