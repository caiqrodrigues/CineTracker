(() => {
'use strict';
if (window.__ctHotfix13BingersSemantics) return;
window.__ctHotfix13BingersSemantics = true;

const $13=(s,r=document)=>r.querySelector(s);
const sleep13=ms=>new Promise(r=>setTimeout(r,ms));
const asText13=v=>String(v??'').trim();
function norm13(s){
  return String(s||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
}
function fnv13(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function stableId13(x){const real=Number(x.tmdb_id||0);if(real>0)return real;const t=x.type==='movie'?'movie':'tv';return -(1000000000+(fnv13(`${t}|${x.tvdb_id||''}|${x.title||''}|${x.year||''}`)%900000000))}
function mediaKind13(x){return x.type==='movie'?'movie':'show'}
function plays13(x){const n=Number(x?.plays||1);return Number.isFinite(n)&&n>0?Math.floor(n):1}
function isoMs13(v){const n=Date.parse(String(v||''));return Number.isFinite(n)?n:null}
function year13(v){const n=Number(v||0);return Number.isFinite(n)&&n>0?n:0}

function detectDelimiter13(text){
  const line=String(text||'').replace(/^\uFEFF/,'').split(/\r?\n/).find(x=>x.trim())||'';
  const counts={',':0,';':0,'\t':0};let q=false;
  for(let i=0;i<line.length;i++){
    const ch=line[i];
    if(ch==='"'&&line[i+1]==='"'&&q){i++;continue}
    if(ch==='"'){q=!q;continue}
    if(!q&&Object.prototype.hasOwnProperty.call(counts,ch))counts[ch]++;
  }
  const sorted=Object.entries(counts).sort((a,b)=>b[1]-a[1]);
  return sorted[0]?.[1]>0?sorted[0][0]:',';
}
function parseDelimited13(text){
  text=String(text||'').replace(/^\uFEFF/,'');
  const sep=detectDelimiter13(text),rows=[],row=[];let cur='',q=false;
  for(let i=0;i<text.length;i++){
    const ch=text[i];
    if(q){if(ch==='"'&&text[i+1]==='"'){cur+='"';i++}else if(ch==='"')q=false;else cur+=ch}
    else if(ch==='"')q=true;
    else if(ch===sep){row.push(cur);cur=''}
    else if(ch==='\n'){row.push(cur.replace(/\r$/,''));rows.push([...row]);row.length=0;cur=''}
    else cur+=ch;
  }
  if(cur||row.length){row.push(cur.replace(/\r$/,''));rows.push(row)}
  const head=(rows.shift()||[]).map(x=>String(x||'').trim().replace(/^\uFEFF/,''));
  return rows.filter(r=>r.some(v=>String(v||'').trim())).map(r=>Object.fromEntries(head.map((h,i)=>[h,r[i]??''])));
}
async function unzip13(file){
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
      else if(method===8){
        if(typeof DecompressionStream!=='function')throw new Error('Este navegador não suporta ZIP comprimido. Selecione library.csv e watches.csv diretamente.');
        const ds=new DecompressionStream('deflate-raw');text=await new Response(new Blob([bytes]).stream().pipeThrough(ds)).text();
      } else throw new Error('Compressão ZIP não suportada: '+method);
      out[name.toLowerCase().includes('library.csv')?'library':'watches']=text;
    }
    p+=46+nl+el+cl;
  }
  if(!out.library||!out.watches)throw new Error('O ZIP deve conter library.csv e watches.csv. ratings.csv e lists.csv são ignorados.');
  return out;
}

function prepareImport13(inputLibrary,inputWatches){
  const original=(inputLibrary||[]).map((x,i)=>({...x,import_key:String(i+1),ct13_original_list_status:asText13(x.list_status)}));
  const library=[...original];
  const byTmdb=new Map(),byTvdb=new Map(),byTitle=new Map(),byStable=new Map();
  const allocations=new Map();
  const index=(x)=>{
    const t=mediaKind13(x),sid=stableId13(x);
    if(x.tmdb_id)byTmdb.set(`${t}:${x.tmdb_id}`,x);
    if(x.tvdb_id)byTvdb.set(`${t}:${x.tvdb_id}`,x);
    const k=`${t}:${norm13(x.title)}`;if(!byTitle.has(k))byTitle.set(k,[]);if(!byTitle.get(k).includes(x))byTitle.get(k).push(x);
    byStable.set(`${t}:${sid}`,x);
  };
  original.forEach(index);

  const historyOnly=[];
  function synthesize(w,t){
    const type=t==='movie'?'movie':'show';
    const candidate={type,title:w.title||w.show_title||w.movie_title||'Sem título',original_title:w.original_title||'',year:w.year||w.release_year||'',tmdb_id:w.tmdb_id||'',tvdb_id:w.tvdb_id||'',list_status:'',ct13_original_list_status:'',history_only:true};
    const sk=`${t}:${stableId13(candidate)}`;
    if(byStable.has(sk))return byStable.get(sk);
    candidate.import_key=`history:${historyOnly.length+1}`;
    library.push(candidate);historyOnly.push(candidate);index(candidate);return candidate;
  }
  function chooseTitleCandidate(w,t,candidates){
    if(!candidates.length)return null;
    if(candidates.length===1)return candidates[0];
    const key=`${t}:${norm13(w.title)}`;
    const used=allocations.get(key)||new Set();
    const watchMs=isoMs13(w.first_watched_at)||isoMs13(w.last_watched_at);
    const watchYear=watchMs?new Date(watchMs).getUTCFullYear():0;
    const scored=candidates.map((x,idx)=>{
      const release=year13(x.year),added=isoMs13(x.added_at),unused=used.has(x)?1:0;
      const futurePenalty=watchYear&&release&&release>watchYear?1:0;
      const addedAfterPenalty=watchMs&&added&&added>watchMs+86400000?1:0;
      const distance=watchMs&&added?Math.abs(watchMs-added):Number.MAX_SAFE_INTEGER/4;
      const releaseDistance=watchYear&&release?Math.abs(watchYear-release):9999;
      return {x,idx,score:[unused,futurePenalty,addedAfterPenalty,distance,releaseDistance,idx]};
    }).sort((a,b)=>{for(let i=0;i<a.score.length;i++){if(a.score[i]!==b.score[i])return a.score[i]-b.score[i]}return 0});
    const chosen=scored[0].x;used.add(chosen);allocations.set(key,used);return chosen;
  }

  const mapped=[];
  const watches=inputWatches||[];
  for(let i=0;i<watches.length;i++){
    const w=watches[i],t=w.type==='movie'?'movie':'show';
    let m=(w.tmdb_id&&byTmdb.get(`${t}:${w.tmdb_id}`))||(w.tvdb_id&&byTvdb.get(`${t}:${w.tvdb_id}`));
    if(!m)m=chooseTitleCandidate(w,t,byTitle.get(`${t}:${norm13(w.title)}`)||[]);
    if(!m&&(w.title||w.show_title||w.movie_title||w.tmdb_id||w.tvdb_id))m=synthesize(w,t);
    if(!m)continue;
    mapped.push({...w,plays:plays13(w),source_history_id:i+1,media_tmdb_id:stableId13(m),media_type:m.type==='movie'?'movie':'tv'});
  }

  const watchedShowIds=new Set(mapped.filter(x=>x.type==='episode').map(x=>Number(x.media_tmdb_id)));
  for(const x of library){
    const originalStatus=asText13(x.ct13_original_list_status||x.list_status);
    x.ct13_watch_later=originalStatus==='for_later';
    x.ct13_added_to_watchlist=false;
    x.ct13_in_progress=false;
    if(x.type==='show'){
      const watched=watchedShowIds.has(Number(stableId13(x)));
      x.ct13_in_progress=watched;
      x.ct13_added_to_watchlist=!watched&&!x.history_only;
      x.ct13_derived_state=watched?'started':'not_started_watchlist';
    } else if(x.type==='movie'&&originalStatus==='for_later'){
      x.ct13_added_to_watchlist=true;
      x.ct13_derived_state='watch_later_movie';
    }
  }

  const movieRows=mapped.filter(x=>x.type==='movie');
  const episodeRows=mapped.filter(x=>x.type==='episode');
  const moviePlays=movieRows.reduce((n,x)=>n+plays13(x),0);
  const episodePlays=episodeRows.reduce((n,x)=>n+plays13(x),0);
  const movies=original.filter(x=>x.type==='movie').length;
  const series=original.filter(x=>x.type==='show').length;
  const watchMovies=original.filter(x=>x.type==='movie'&&x.ct13_added_to_watchlist).length;
  const watchSeries=original.filter(x=>x.type==='show'&&x.ct13_added_to_watchlist).length;
  const startedSeries=original.filter(x=>x.type==='show'&&x.ct13_in_progress).length;
  const watchLaterMovies=original.filter(x=>x.type==='movie'&&x.ct13_watch_later).length;
  const watchLaterSeries=original.filter(x=>x.type==='show'&&x.ct13_watch_later).length;
  return {library,watches:mapped,summary:{
    library_items:original.length,library_movies:movies,library_series:series,import_media_items:library.length,
    watch_records:mapped.length,raw_watch_records:watches.length,movie_watch_records:movieRows.length,episode_watch_records:episodeRows.length,
    movie_plays:moviePlays,episode_plays:episodePlays,total_plays:moviePlays+episodePlays,
    watched_movie_events:moviePlays,watched_episode_events:episodePlays,watch_events:moviePlays+episodePlays,
    watchlist_movies:watchMovies,watchlist_series:watchSeries,not_started_series:watchSeries,followed_series:startedSeries,started_series:startedSeries,
    watch_later_movies:watchLaterMovies,watch_later_series:watchLaterSeries,watch_later_total:watchLaterMovies+watchLaterSeries,
    history_only_media:historyOnly.length,unmatched_watch_events:Math.max(0,watches.length-mapped.length),
    ignored_ratings:true,ignored_lists:true
  }};
}
window.ct13PrepareImport=prepareImport13;
window.ct13ParseDelimited=parseDelimited13;

async function edge13(body){
  const r=await fetch(`${SUPABASE_URL}/functions/v1/ct-import-bingers-user`,{method:'POST',headers:{...authHeaders(),'Content-Type':'application/json'},body:JSON.stringify(body)}),d=await r.json().catch(()=>({}));
  if(!r.ok||!d.ok)throw new Error(d.error||`Importação ${r.status}`);
  return d;
}
let pending13=null;
function preview13(data,name){
  pending13={...data,name};
  $13('#ct10-preview')?.remove();
  const s=data.summary,o=document.createElement('div');o.id='ct10-preview';o.className='ct10-preview';
  const mismatch=s.unmatched_watch_events
    ?`<div class="ct10-safe" style="border-color:#7d5530;background:#28180b">Atenção: ${s.unmatched_watch_events} registro(s) do histórico não possuem identificação suficiente. A confirmação foi bloqueada para evitar perda.</div>`
    :`<div class="ct10-safe">Histórico reconhecido integralmente: ${s.raw_watch_records}/${s.raw_watch_records} registros. As reprises são preservadas pela coluna <b>plays</b>.</div>`;
  o.innerHTML=`<div class="ct10-preview-card"><h2>Prévia da importação</h2><p class="ct10-muted">Nenhum dado foi alterado. Confira os números antes de confirmar.</p>${mismatch}<div class="ct10-safe">Dados criados no CineTracker e decisões manuais têm prioridade e serão preservados.</div><div class="ct10-safe">Somente <b>library.csv</b> e <b>watches.csv</b> são importados. ratings.csv, avaliações, comentários e lists.csv são ignorados.</div><div class="ct10-preview-grid">
  <div class="ct10-metric"><b>${s.library_items}</b>Itens da biblioteca</div><div class="ct10-metric"><b>${s.library_movies}</b>Filmes na biblioteca</div><div class="ct10-metric"><b>${s.library_series}</b>Séries na biblioteca</div>
  <div class="ct10-metric"><b>${s.movie_plays}</b>Filmes vistos</div><div class="ct10-metric"><b>${s.episode_plays}</b>Episódios vistos</div><div class="ct10-metric"><b>${s.total_plays}</b>Visualizações totais</div>
  <div class="ct10-metric"><b>${s.watchlist_movies}</b>Watchlist filmes</div><div class="ct10-metric"><b>${s.watchlist_series}</b>Watchlist séries (não iniciadas)</div><div class="ct10-metric"><b>${s.started_series}</b>Séries com histórico</div>
  <div class="ct10-metric"><b>${s.watch_later_total}</b>Assistir mais tarde</div><div class="ct10-metric"><b>${s.movie_watch_records}</b>Registros de filme</div><div class="ct10-metric"><b>${s.episode_watch_records}</b>Registros de episódio</div>
  </div><p class="ct10-muted" style="margin-top:10px">${s.history_only_media} mídia(s) do histórico não estão mais na biblioteca atual e serão recriadas somente para preservar o histórico. Reprises não recebem datas inventadas: o CineTracker mantém first/last watched + plays.</p><div id="ct10-progress-wrap" hidden><div class="ct10-progress"><span></span></div><div class="ct10-progress-label">Preparando…</div></div><div class="ct10-actions"><button class="ct10-btn" data-close13>Cancelar</button><button class="ct10-btn" data-confirm13 ${s.unmatched_watch_events?'disabled':''}>Confirmar importação</button></div></div>`;
  document.body.appendChild(o);
  $13('[data-close13]',o).onclick=()=>o.remove();
  $13('[data-confirm13]',o).onclick=()=>run13();
}
function progress13(p,label){const w=$13('#ct10-progress-wrap');if(!w)return;w.hidden=false;$13('.ct10-progress span',w).style.width=`${Math.max(0,Math.min(100,p))}%`;$13('.ct10-progress-label',w).textContent=label}
async function run13(){
  const p=pending13;if(!p)return;const b=$13('[data-confirm13]');if(b)b.disabled=true;
  try{
    progress13(1,'Preparando importação sem perda de histórico…');
    const begin=await edge13({action:'begin',filename:p.name,file_type:p.name.toLowerCase().endsWith('.json')?'json':'zip',total_items:p.summary.import_media_items+p.summary.raw_watch_records}),id=begin.import_id,batch=150,total=Math.max(1,p.library.length+p.watches.length);let done=0;
    for(let i=0;i<p.library.length;i+=batch){const rows=p.library.slice(i,i+batch);await edge13({action:'library_batch',import_id:id,rows,cursor:done,progress:Math.round(done/total*100)});done+=rows.length;progress13(5+Math.round(done/total*85),`Importando biblioteca: ${Math.round((i+rows.length)/p.library.length*100)}%`);await sleep13(0)}
    for(let i=0;i<p.watches.length;i+=batch){const rows=p.watches.slice(i,i+batch);await edge13({action:'watches_batch',import_id:id,rows,cursor:done,progress:Math.round(done/total*100)});done+=rows.length;progress13(5+Math.round(done/total*85),`Importando histórico: ${Math.round((i+rows.length)/p.watches.length*100)}%`);await sleep13(0)}
    progress13(95,'Atualizando o CineTracker…');await edge13({action:'finish',import_id:id,summary:p.summary});progress13(100,'Importação concluída. Sincronizando…');
    window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'hotfix11-import',semantic_fix:'hotfix13'}}));
    if(typeof window.ct11SyncCloud==='function')await window.ct11SyncCloud().catch?.(()=>{});
    setTimeout(()=>{$13('#ct10-preview')?.remove();(window.ct10Navigate||window.ct95Navigate)?.('history')},650);
  }catch(e){progress13(0,'Erro: '+(e?.message||e));if(b)b.disabled=false}
}

async function readImportFiles13(files){
  const a=[...files];let library,watches,name=a.map(x=>x.name).join(' + ');
  const zip=a.find(f=>f.name.toLowerCase().endsWith('.zip'));
  const json=a.find(f=>f.name.toLowerCase().endsWith('.json'));
  if(zip){const z=await unzip13(zip);library=parseDelimited13(z.library);watches=parseDelimited13(z.watches);name=zip.name}
  else if(json){const d=JSON.parse(await json.text());library=Array.isArray(d?.library)?d.library:Array.isArray(d?.library_items)?d.library_items:null;watches=Array.isArray(d?.watches)?d.watches:Array.isArray(d?.watch_events)?d.watch_events:null;if(!library||!watches)throw new Error('JSON inválido: esperado { library: [...], watches: [...] }.');name=json.name}
  else{const l=a.find(f=>f.name.toLowerCase()==='library.csv'),w=a.find(f=>f.name.toLowerCase()==='watches.csv');if(!l||!w)throw new Error('Selecione library.csv e watches.csv.');const texts=await Promise.all([l.text(),w.text()]);library=parseDelimited13(texts[0]);watches=parseDelimited13(texts[1])}
  const data=prepareImport13(library||[],watches||[]);
  if(!data.library.length)throw new Error('library.csv/JSON não contém títulos válidos.');
  if(!data.watches.length)throw new Error('watches.csv/JSON não contém histórico válido.');
  preview13(data,name);
}
window.ct10ReadImportFiles=readImportFiles13;
window.ct13ReadImportFiles=readImportFiles13;
})();