/* CineTracker Web 1.0.52 r261 — real-video ground truth: weekly frontier, first-class F1/Super Bowl series, Discover geometry and detail recovery. WEB ONLY. */
(()=>{
'use strict';
if(window.__ctR261)return;
window.__ctR261='video-ground-truth-series-discover-detail';
window.__ctR261Home='raw-smackdown-exact-frontier+synthetic-series-semantic-cards';
window.__ctR261Series='formula1-and-superbowl-first-class-imported-series';
window.__ctR261Discover='button-height-reset+poster-2x3-readable-copy';
window.__ctR261Detail='tmdb-cache-key-includes-params+nonblank-detail';
window.__ctR261Horizontal='special-series-and-native-detail-rails';

const q261=(s,r=document)=>r?.querySelector?.(s)||null;
const qa261=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const n261=v=>{const n=Number(v);return Number.isFinite(n)?n:0};
const norm261=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const esc261=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const DAY261=86400000;
const timeout261=(p,ms,fallback=null)=>Promise.race([Promise.resolve(p),new Promise(r=>setTimeout(()=>r(fallback),ms))]);
function day261(d=new Date()){try{return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(d)}catch{return d.toISOString().slice(0,10)}}
function title261(x){return x?.media_title||x?.title||x?.name||x?.raw_tmdb?.title||x?.raw_tmdb?.name||''}
function id261(x){return n261(x?.tmdb_id||x?.source_tmdb_id||x?.raw_tmdb?.source_tmdb_id||x?.raw_tmdb?.id)}
function mediaId261(x){return n261(x?.media_id||x?.id)}
function ep261(s,e){return n261(s)>0&&n261(e)>0?n261(s)*100000+n261(e):0}
function weekly261(x){const t=norm261(title261(x));return /(^| )raw( |$)|smackdown/.test(t)}
function specialKind261(x){const t=norm261(typeof x==='string'?x:title261(x));if(/(^| )formula 1( |$)|formula one/.test(t))return'f1';if(/super bowl|superbowl/.test(t))return'superbowl';return''}
function recent261(ds){const t=new Date(`${String(ds||'').slice(0,10)}T12:00:00`).getTime();return Number.isFinite(t)&&Date.now()-t<=30*DAY261}
function episodeLabel261(e){return e?`S${String(n261(e.season_number)).padStart(2,'0')}E${String(n261(e.episode_number)).padStart(2,'0')}`:''}

/* ---------------------------------------------------------------------
   RAW / SMACKDOWN: targeted exact-frontier authority.
   The real video still showed Raw S01E14 / Faltam 1495. Historical holes remain stored, but
   only already-aired episodes strictly AFTER the highest watched frontier count as current
   pending. A targeted DOM repair runs after paint so stale inherited text cannot win back. */
const stateCache261=new Map(),detailCache261=new Map(),seasonCache261=new Map();
async function episodeState261(id){const old=stateCache261.get(id);if(old&&Date.now()-old.at<90000)return old.data;const d=await timeout261(rpc('cinetracker_series_episode_state_v1',{p_tmdb_id:id,p_today:day261()}),6000,null);if(d)stateCache261.set(id,{at:Date.now(),data:d});return d}
async function tv261(id){const old=detailCache261.get(id);if(old&&Date.now()-old.at<180000)return old.data;const d=await timeout261(tmdb(`/tv/${id}`),6000,null);if(d)detailCache261.set(id,{at:Date.now(),data:d});return d}
async function season261(id,s){const k=`${id}:${s}`,old=seasonCache261.get(k);if(old&&Date.now()-old.at<180000)return old.data;const d=await timeout261(tmdb(`/tv/${id}/season/${s}`),6000,null);if(d)seasonCache261.set(k,{at:Date.now(),data:d});return d}
async function exactWeekly261(row){
  const id=id261(row);if(id<=0)return null;
  const [state,detail]=await Promise.all([episodeState261(id),tv261(id)]);if(!state||!detail)return null;
  const watched=new Set();let frontier=0;
  for(const x of state?.episodes||[]){const p=ep261(x?.season_number,x?.episode_number);if(p){watched.add(p);frontier=Math.max(frontier,p)}}
  if(!frontier)return null;
  const first=Math.floor(frontier/100000),last=Math.max(first,n261(detail?.last_episode_to_air?.season_number));
  const packs=await Promise.all(Array.from({length:Math.max(1,last-first+1)},(_,i)=>season261(id,first+i)));
  const pending=[];
  for(let i=0;i<packs.length;i++)for(const x of packs[i]?.episodes||[]){const s=n261(x?.season_number||first+i),e=n261(x?.episode_number),p=ep261(s,e),air=String(x?.air_date||'').slice(0,10);if(p>frontier&&air&&air<=day261()&&!watched.has(p))pending.push({...x,season_number:s,episode_number:e,_p:p})}
  pending.sort((a,b)=>a._p-b._p);return{frontier,pending,next:pending[0]||null,detail};
}
function applyWeekly261(row,seq){
  if(!row||!seq)return false;const next=seq.next,missing=seq.pending.length,before=`${row.home_bucket}|${row.history_missing_episodes}|${row.next_season_number}|${row.next_episode_number}`;
  row._ct261Weekly=true;row._ct261CurrentMissing=missing;row._ct261CurrentNext=next||null;row.history_missing_episodes=missing;row.released_episodes=n261(row.watched_episodes)+missing;row.is_caught_up=!next;
  if(next){row.home_bucket=(recent261(next.air_date)||recent261(row.last_watched_at))?'continue':'dust';row.next_season_number=n261(next.season_number);row.next_episode_number=n261(next.episode_number);row.next_episode_title=next.name||'';row.next_episode_air_date=next.air_date||'';row.next_episode={season_number:n261(next.season_number),episode_number:n261(next.episode_number),name:next.name||'',air_date:next.air_date||'',vote_average:n261(next.vote_average)};row.next_episode_to_watch=row.next_episode;row.next_unwatched_episode=row.next_episode}
  else{row.home_bucket=/ended|canceled|cancelled/.test(norm261(seq.detail?.status))?'completed':'up_to_date';row.next_season_number=null;row.next_episode_number=null;row.next_episode_title='';row.next_episode_air_date='';row.next_episode=null;row.next_episode_to_watch=null;row.next_unwatched_episode=null}
  return before!==`${row.home_bucket}|${row.history_missing_episodes}|${row.next_season_number}|${row.next_episode_number}`;
}
function homeRoot261(){return q261('[data-home]')}
function rowEl261(row){const root=homeRoot261();if(!root)return null;const id=id261(row),needle=norm261(title261(row));if(id){const hit=q261(`[data-media="tv:${id}"]`,root);if(hit)return hit.closest?.('.media-row,.home-card,article,li,.card')||hit}for(const el of qa261('.stack>* ,.media-row,.home-card,article',root)){if(needle&&norm261(el.textContent||'').includes(needle))return el}return null}
function targetSection261(bucket){const wanted=bucket==='continue'?'assistir a seguir':bucket==='dust'?'juntando poeira':bucket==='up_to_date'?'em dia':bucket==='completed'?'concluidas':'';if(!wanted)return null;return qa261('section.home-section,section',homeRoot261()).find(s=>norm261(q261('.panel-head h3,.panel-head h2,h3,h2',s)?.textContent||'')===wanted)||null}
function repairWeeklyRow261(row){
  if(!row?._ct261Weekly)return;const el=rowEl261(row);if(!el)return;const next=row._ct261CurrentNext,missing=n261(row._ct261CurrentMissing),watched=n261(row.watched_episodes),relevant=watched+missing,label=episodeLabel261(next);
  const small=q261('small',el);if(small)small.textContent=`${watched}/${relevant||watched||'?'} · ${missing?`Faltam ${missing}${label?` · próximo ${label}`:''}`:'Em dia'}`;
  const line=qa261('span,p,div,strong,b',el).filter(x=>x!==el&&x.children.length<=2).find(x=>/^(pr[oó]ximo|ep):/i.test(String(x.textContent||'').trim()));if(line)line.textContent=next?`Próximo: ${next.name||label}${next.air_date?` · ${new Date(`${next.air_date}T12:00:00`).toLocaleDateString('pt-BR')}`:''}`:'Ep: Em dia com os episódios exibidos';
  const sec=targetSection261(row.home_bucket),stack=sec&&q261('.stack',sec);if(stack&&el.parentElement!==stack)stack.append(el);
}
function repairWeekly261(){for(const r of homeCache?.series||[])repairWeeklyRow261(r)}
let weeklyToken261=0;
async function auditWeekly261(){const token=++weeklyToken261,rows=(homeCache?.series||[]).filter(r=>weekly261(r)&&id261(r)>0&&n261(r?.watched_episodes)>0);let changed=false;await Promise.all(rows.map(async r=>{try{const s=await exactWeekly261(r);if(token!==weeklyToken261)return;if(s&&applyWeekly261(r,s))changed=true}catch(_){}}));if(token!==weeklyToken261||route()!=='home')return;if(changed)paintHome();requestAnimationFrame(repairWeekly261);setTimeout(repairWeekly261,100);setTimeout(repairWeekly261,700)}

/* ---------------------------------------------------------------------
   IMPORTED SPECIAL SERIES: Formula 1 and NFL Super Bowls remain TV series even without a
   safe TMDB identity. Their stored episode progress is read by media_id through the r261 RPC.
   No historical episode is auto-marked just to make counts look good. */
const importedState261=new Map();
async function imported261(row){const mid=mediaId261(row);if(mid<=0)return null;const old=importedState261.get(mid);if(old&&Date.now()-old.at<120000)return old.data;const d=await timeout261(rpc('cinetracker_imported_series_state_v1',{p_media_id:mid}),6000,null);if(d?.media_id)importedState261.set(mid,{at:Date.now(),data:d});return d}
function specialRows261(){return(homeCache?.series||[]).filter(r=>specialKind261(r))}
function specialRowEl261(row){const needle=norm261(title261(row)),root=homeRoot261();if(!root)return null;return qa261('.stack>* ,.media-row,.home-card,article',root).find(el=>needle&&norm261(el.textContent||'').includes(needle))||null}
async function patchSpecialHome261(){
  for(const row of specialRows261()){
    const el=specialRowEl261(row);if(!el)continue;el.dataset.ct261SpecialSeries=specialKind261(row);el.dataset.ct261MediaId=String(mediaId261(row));el.style.cursor='pointer';
    try{const st=await imported261(row);if(!st||!el.isConnected)continue;const kind=specialKind261(row),season=kind==='f1'?(st.seasons||[]).map(x=>n261(x.season_number)).filter(x=>x>1900).sort((a,b)=>b-a)[0]:1,ss=(st.seasons||[]).find(x=>n261(x.season_number)===season),small=q261('small',el);if(small)small.textContent=kind==='f1'?`Série · ${row.release_year||1950} · Temporada ${season||new Date().getFullYear()} · ${n261(ss?.watched_episodes)} episódios vistos`:`Série · ${row.release_year||1967} · Temporada 1 · ${n261(ss?.watched_episodes)}/62 assistidos`;const line=qa261('span,p,div',el).filter(x=>x!==el&&x.children.length<=2).find(x=>/^(pr[oó]ximo|ep):/i.test(String(x.textContent||'').trim()));if(line)line.textContent='Em exibição · abrir como série';}catch(_){ }
  }
}

const f1SeasonCache261=new Map();
async function f1get261(year){const old=f1SeasonCache261.get(year);if(old&&Date.now()-old.at<300000)return old.data;const r=await timeout261(fetch(`https://api.jolpi.ca/ergast/f1/${year}.json`,{headers:{accept:'application/json'}}),8000,null);if(!r||!r.ok)throw new Error('Não foi possível carregar a temporada da Fórmula 1.');const d=await r.json(),races=d?.MRData?.RaceTable?.Races||[];f1SeasonCache261.set(year,{at:Date.now(),data:races});return races}
function f1time261(x){if(!x?.date)return'—';try{return new Intl.DateTimeFormat('pt-BR',{timeZone:'America/Sao_Paulo',day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(`${x.date}T${x.time||'00:00:00Z'}`))}catch{return x.date}}
function f1Episodes261(races,year){const defs=[['Practice 1','FirstPractice'],['Practice 2','SecondPractice'],['Practice 3','ThirdPractice'],['Sprint Shootout','SprintShootout'],['Sprint Qualifying','SprintQualifying'],['Sprint Race','Sprint'],['Qualifying','Qualifying'],['Race',null]],rows=[];for(const race of races||[])for(const[label,key]of defs){const x=key?race?.[key]:race;if(x?.date)rows.push({season_number:year,name:`${race.raceName} (${label})`,air_date:x.date,time:x.time||'',circuit:race?.Circuit?.circuitName||'',_ms:new Date(`${x.date}T${x.time||'00:00:00Z'}`).getTime()||0})}rows.sort((a,b)=>a._ms-b._ms);return rows.map((x,i)=>({...x,episode_number:i+1}))}
function roman261(num){const map=[[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];let n=Math.max(1,n261(num)),s='';for(const[v,r]of map)while(n>=v){s+=r;n-=v}return s}
function watchedSet261(st,season){return new Set((st?.episodes||[]).filter(x=>n261(x.season_number)===n261(season)).map(x=>n261(x.episode_number)).filter(Boolean))}
function specialShell261(row,kind){const title=kind==='f1'?'Formula 1':'NFL: Super Bowl',year=kind==='f1'?1950:1967;return shell(title,`Série · ${year} · Em exibição`,'series',`<div class="page ct261-special-series" data-ct261-special="${kind}"><button type="button" class="btn ct261-back" data-ct261-special-back>← Voltar</button><section class="panel ct261-series-hero"><div><span class="eyebrow">Série</span><h2>${esc261(title)}</h2><p>${kind==='f1'?'Campeonato mundial organizado por temporadas anuais. Cada sessão de fim de semana é tratada como episódio.':'A final anual da NFL tratada como uma série contínua desde 1967.'}</p></div><div class="ct261-series-status"><b>Em exibição</b><small>Progresso preservado da sua biblioteca importada</small></div></section><section class="panel"><div class="panel-head"><h2>Temporadas</h2><small data-ct261-season-count></small></div><div class="ct261-season-rail flex overflow-x-auto scrollbar-thin whitespace-nowrap touch-pan-x flex-nowrap" data-ct261-season-rail></div></section><section class="panel"><div class="panel-head"><h2 data-ct261-episodes-title>Episódios</h2><small data-ct261-progress></small></div><div data-ct261-episodes>${loading('Carregando episódios…')}</div></section></div>`)}
async function renderF1Season261(st,year){const host=q261('[data-ct261-episodes]');if(!host)return;host.innerHTML=loading(`Carregando temporada ${year}…`);try{const eps=f1Episodes261(await f1get261(year),year),watched=watchedSet261(st,year),released=eps.filter(e=>String(e.air_date)<=day261()).length;q261('[data-ct261-episodes-title]').textContent=`Episódios · Temporada ${year}`;q261('[data-ct261-progress]').textContent=`${watched.size}/${eps.length} assistidos · ${released} já exibidos`;host.innerHTML=`<div class="ct261-episode-list flex overflow-x-auto scrollbar-thin whitespace-nowrap touch-pan-x flex-nowrap">${eps.map(e=>`<article class="ct261-episode ${watched.has(e.episode_number)?'watched':''}"><small>E${String(e.episode_number).padStart(2,'0')} · ${esc261(f1time261(e))}</small><b>${esc261(e.name)}</b><span>${esc261(e.circuit||'Fórmula 1')}</span><em>${watched.has(e.episode_number)?'✓ Assistido':String(e.air_date)<=day261()?'Não assistido':'Em breve'}</em></article>`).join('')||'<div class="empty">Nenhum episódio encontrado.</div>'}</div>`}catch(e){host.innerHTML=`<div class="error">${esc261(e?.message||e)}</div>`}}
function superEpisodes261(season){const total=season===2?62:62,start=1967;return Array.from({length:total},(_,i)=>{const n=i+1,year=start+i;return{season_number:season,episode_number:n,name:season===2?`Super Bowl ${roman261(n)} Halftime Show`:`Super Bowl ${roman261(n)}`,year}})}
function renderSuperSeason261(st,season){const host=q261('[data-ct261-episodes]');if(!host)return;const eps=superEpisodes261(season),watched=watchedSet261(st,season);q261('[data-ct261-episodes-title]').textContent=season===1?'Episódios · Temporada 1':'Episódios · Halftime Shows';q261('[data-ct261-progress]').textContent=`${watched.size}/${eps.length} assistidos`;host.innerHTML=`<div class="ct261-episode-list flex overflow-x-auto scrollbar-thin whitespace-nowrap touch-pan-x flex-nowrap">${eps.map(e=>`<article class="ct261-episode ${watched.has(e.episode_number)?'watched':''}"><small>E${String(e.episode_number).padStart(2,'0')} · ${e.year}</small><b>${esc261(e.name)}</b><span>${season===1?'NFL Championship':'Halftime Show'}</span><em>${watched.has(e.episode_number)?'✓ Assistido':e.year<=new Date().getFullYear()?'Não assistido':'Em breve'}</em></article>`).join('')}</div>`}
async function renderSpecialSeries261(kind,row){
  const st=await imported261(row).catch(()=>null);setApp(specialShell261(row,kind));if(!st){const e=q261('[data-ct261-episodes]');if(e)e.innerHTML='<div class="error">Não foi possível ler o progresso importado desta série.</div>';return}
  const rail=q261('[data-ct261-season-rail]');if(kind==='f1'){const current=new Date().getFullYear(),years=Array.from({length:current-1950+1},(_,i)=>1950+i);q261('[data-ct261-season-count]').textContent=`${years.length} temporadas`;rail.innerHTML=years.map(y=>`<button type="button" class="chip ${y===current?'active':''}" data-ct261-season="${y}">${y}</button>`).join('');await renderF1Season261(st,current)}else{q261('[data-ct261-season-count]').textContent='2 temporadas';rail.innerHTML='<button type="button" class="chip active" data-ct261-season="1">Temporada 1</button><button type="button" class="chip" data-ct261-season="2">Halftime Shows</button>';renderSuperSeason261(st,1)}
  rail?.scrollTo?.({left:rail.scrollWidth,behavior:'instant'});
}

/* Targeted Home wrappers: no global DOM observer. */
const paintHome261Base=paintHome;
paintHome=function(...args){const out=paintHome261Base(...args);requestAnimationFrame(()=>{repairWeekly261();void patchSpecialHome261()});setTimeout(()=>{repairWeekly261();void patchSpecialHome261()},120);return out};
const renderHome261Base=renderHome;
renderHome=async function(seq){const out=await renderHome261Base(seq);if(seq===navSeq&&route()==='home'){setTimeout(()=>void auditWeekly261(),180);setTimeout(()=>void patchSpecialHome261(),40)}return out};

document.addEventListener('click',e=>{
  const special=e.target?.closest?.('[data-ct261-special-series]');if(special){const kind=special.dataset.ct261SpecialSeries,row=specialRows261().find(r=>specialKind261(r)===kind);if(row){e.preventDefault();e.stopImmediatePropagation();void renderSpecialSeries261(kind,row)}return}
  const back=e.target?.closest?.('[data-ct261-special-back]');if(back){e.preventDefault();e.stopImmediatePropagation();void renderHome(++navSeq);return}
  const seasonBtn=e.target?.closest?.('[data-ct261-season]');if(seasonBtn){const root=q261('[data-ct261-special]');if(!root)return;e.preventDefault();e.stopImmediatePropagation();qa261('[data-ct261-season]',root).forEach(x=>x.classList.toggle('active',x===seasonBtn));const season=n261(seasonBtn.dataset.ct261Season),kind=root.dataset.ct261Special,row=specialRows261().find(r=>specialKind261(r)===kind);if(!row)return;void imported261(row).then(st=>kind==='f1'?renderF1Season261(st,season):renderSuperSeason261(st,season));return}
},true);

window.addEventListener('cinetracker:data-changed',()=>{stateCache261.clear();detailCache261.clear();seasonCache261.clear();importedState261.clear();f1SeasonCache261.clear()});
window.__ctR261Test={specialKind261,ep261,applyWeekly261,f1Episodes261,roman261,watchedSet261};
})();
