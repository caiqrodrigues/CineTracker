/* CineTracker Web 1.0.39 r248 — single current UI authority. */
(()=>{'use strict';
if(window.__ctR248)return;
window.__ctR248='single-current-ui-authority';
window.__ctR248Home='released-unwatched-fast+series-like-sports';
window.__ctR248Discover='atomic-no-shell-rebuild+canonical-exclusions';
window.__ctR248Sports='four-tabs-id-bound-watched';
window.__ctR248F1='persistent-real-data-six-scopes';
window.__ctR248Profile='single-stable-statistics';
window.__ctR248Overflow='vertical-page-local-horizontal-only';
const Q=(s,r=document)=>r?.querySelector?.(s)||null,QA=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
const N=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const NUM=v=>{v=Number(v);return Number.isFinite(v)?v:0},DAY=v=>{try{return new Date(v).toLocaleDateString('sv-SE')}catch{return''}};
const TODAY=()=>localDay(),SHIFT=n=>shiftDays(n),E=v=>esc(v),now=()=>Date.now();

/* HOME: keep cards visible while canonical episode authority runs; promote released-unwatched immediately. */
function homeFix(){
 const root=Q('[data-home]');if(!root)return;
 root.dataset.ct248Home='canonical-fast';
 QA('.ct236-home-episode-pending',root).forEach(x=>{x.classList.remove('ct236-home-episode-pending');x.dataset.ct248EpisodeVisible='1'});
 const head=QA('h1,h2,h3,h4,.panel-head',root).find(x=>N(x.textContent).startsWith('assistir a seguir'));
 const sec=head?.closest?.('section,.panel,.home-section');if(sec?.parentElement)for(const sib of [...sec.parentElement.children]){if(sib===sec)break;const t=N(sib.textContent);if(t.includes('historico')||t.includes('recentes')||t.includes('ultimo assistido'))sib.hidden=true}
 sportsNext(root,sec);
}
function mergeCurrent(mid,c){
 const row=(homeCache?.series||[]).find(x=>NUM(x.media_id||x.mediaId)===NUM(mid));if(!row||!c)return;
 const s=NUM(c.season_number??c.season??c.current_season),e=NUM(c.episode_number??c.episode??c.current_episode);
 if(s){row.season_number=s;row.current_season=s;row.next_season_number=s} if(e){row.episode_number=e;row.current_episode=e;row.next_episode_number=e}
 row.next_episode_name=c.name||c.episode_name||c.title||row.next_episode_name;row.next_air_date=c.air_date||c.release_date||row.next_air_date;
 row.home_bucket='continue';row.is_caught_up=false;row.history_missing_episodes=Math.max(1,NUM(row.history_missing_episodes));
}
try{if(typeof ct176SetQueue==='function'){const b=ct176SetQueue;ct176SetQueue=function(mid,queue){const p=b.apply(this,arguments);if(p?.current){mergeCurrent(mid,p.current);queueMicrotask(()=>{if(location.pathname.startsWith('/home')){paintHome();homeFix()}})}return p}}}catch{}
const PH=paintHome;paintHome=function(){const o=PH.apply(this,arguments);homeFix();return o};
const RH=renderHome;renderHome=async function(){const o=await RH.apply(this,arguments);homeFix();return o};
let sfCache=[],sfAt=0;
async function sportsSeries(){
 if(now()-sfAt<300000)return sfCache;
 try{const p=await rpc('cinetracker_sports_payload_v1',{p_from:new Date(`${TODAY()}T00:00:00`).toISOString(),p_to:new Date(`${SHIFT(30)}T23:59:59`).toISOString()});
  sfCache=(p?.events||[]).filter(x=>new Date(x.starts_at).getTime()>=now()).filter(x=>{const s=N(x.sport_slug),t=N([x.title,x.competition_name].join(' '));return s==='formula 1'||s==='formula_1'||t.includes('formula 1')||t.includes('super bowl')}).sort((a,b)=>new Date(a.starts_at)-new Date(b.starts_at)).slice(0,3);sfAt=now();return sfCache}catch{return[]}
}
function sportsNext(root,sec){if(!sec||Q('[data-ct248-sports-next]',sec))return;void sportsSeries().then(rows=>{if(!rows.length||!sec.isConnected||Q('[data-ct248-sports-next]',sec))return;const d=document.createElement('div');d.dataset.ct248SportsNext='1';d.innerHTML=rows.map(x=>`<button type="button" class="media-row ct248-sports-next" data-ct248-open-sports><span class="ct248-flag">🏁</span><span><b>${E(x.title||x.competition_name||'Esporte')}</b><small>Novo evento · ${new Date(x.starts_at).toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})}</small></span><span class="badge">›</span></button>`).join('');(Q('.stack',sec)||sec).prepend(d)})}

/* DISCOVER: no whole-shell rebuild on tab changes; stale promises cannot repaint current tab. */
let dseq=0,gmap=null;
async function genres(){if(gmap)return gmap;const[m,t]=await Promise.all([safeTmdb('/genre/movie/list'),safeTmdb('/genre/tv/list')]);gmap=new Map([...(m.genres||[]),...(t.genres||[])].map(x=>[NUM(x.id),x.name]));return gmap}
async function exclusions(){
 const c=await exclusionContext().catch(()=>({dash:[],movieIds:new Set(),tvIds:new Set(),aliases:new Set()}));
 for(const x of c.dash||[]){if(!(x.is_watchlist||x.is_seen||x.is_completed||x.is_in_progress||x.is_up_to_date||x.is_not_interested||x.not_interested||x.disliked||x.watch_later||x.added_to_watchlist||NUM(x.watched_episodes)>0||x.last_watched_at))continue;
  const type=mediaType(x),id=NUM(x.tmdb_id||x.raw_tmdb?.source_tmdb_id||x.id);if(id)(type==='movie'?c.movieIds:c.tvIds).add(id);
  for(const v of[x.title,x.name,x.raw_tmdb?.title,x.raw_tmdb?.name,x.raw_tmdb?.original_title,x.raw_tmdb?.original_name]){const z=N(v);if(z)c.aliases.add(`${type}:${z}`)}
 }return c
}
function ok(x,c){const t=mediaType(x),id=NUM(x.id||x.tmdb_id||x.raw_tmdb?.source_tmdb_id);if(id&&(t==='movie'?c.movieIds:c.tvIds).has(id))return false;return ![x.title,x.name,x.original_title,x.original_name].map(N).filter(Boolean).some(z=>c.aliases.has(`${t}:${z}`))}
async function rows248(tab){
 const c=await exclusions(),clean=a=>(a||[]).filter(x=>x&&NUM(x.id||x.tmdb_id)>0&&mediaPoster(x)&&ok(x,c));
 if(tab==='foryou'){const w=new Map();for(const x of c.dash||[])if(x.is_favorite||x.is_seen||x.is_in_progress)for(const g of x.genre_ids||x.raw_tmdb?.genre_ids||[])w.set(NUM(g),(w.get(NUM(g))||0)+(x.is_favorite?4:1));
  const wg=[...w.entries()].sort((a,b)=>b[1]-a[1]).slice(0,5).map(x=>x[0]).join('|')||undefined;
  const[m,t,a]=await Promise.all([pages('/discover/movie',{sort_by:'popularity.desc',with_genres:wg,include_adult:false},'movie',4),pages('/discover/tv',{sort_by:'popularity.desc',with_genres:wg},'tv',4),pages('/discover/tv',{with_origin_country:'JP',with_genres:'16',sort_by:'popularity.desc'},'tv',3)]);
  const pools=[clean(m),clean(t),clean(a)],out=[],seen=new Set();for(let i=0;i<40;i++)for(const p of pools){const x=p[i];if(!x)continue;const k=`${mediaType(x)}:${x.id}`;if(!seen.has(k)){seen.add(k);out.push(x)}}return out.slice(0,42)
 }
 const out=clean(await discoverRows(tab));if(tab!=='new')return out;const lo=SHIFT(-30),hi=TODAY();return out.filter(x=>{const d=String(mediaType(x)==='movie'?x.release_date:x.first_air_date||'').slice(0,10);return d&&d>=lo&&d<=hi})
}
function dcard(x,gm){const t=mediaType(x),id=NUM(x.id||x.tmdb_id),p=mediaPoster(x),yr=String(x.release_date||x.first_air_date||'').slice(0,4),gs=(x.genre_ids||x.raw_tmdb?.genre_ids||[]).map(i=>gm.get(NUM(i))).filter(Boolean).slice(0,3);return `<article class="card ct248-discover-card"><button type="button" data-media="${t}:${id}"><div class="poster"${p?` style="background-image:url('${img(p,'w342')}')"`:''}></div><div class="card-body"><b>${E(mediaTitle(x))}</b><small>${[yr,...gs].filter(Boolean).join(' · ')|| (t==='movie'?'Filme':'Série')}</small></div></button></article>`}
async function dpaint(rows){const h=Q('[data-discover-content]');if(!h)return;let a=rows||[];if(discoverState.type!=='all')a=a.filter(x=>mediaType(x)===discoverState.type);if(discoverState.tab==='calendar'){paintDiscover(a);h.classList.add('ct248-discover-content');h.removeAttribute('aria-busy');return}const gm=await genres().catch(()=>new Map());h.innerHTML=`<div class="ct248-discover-track">${a.slice(0,120).map(x=>dcard(x,gm)).join('')||'<div class="empty">Nenhum título elegível.</div>'}</div>`;h.classList.add('ct248-discover-content');h.removeAttribute('aria-busy');localScroll(h)}
renderDiscover=async function(seq){const same=Boolean(Q('[data-discover]')&&location.pathname.startsWith('/discover')),token=++dseq;if(!same){setApp(shell('Descobrir','Recomendações, tendências, novidades e calendário.','discover',`<div class="page" data-discover><div class="tabs">${[['foryou','Pra você'],['trending','Em alta'],['popular','Populares'],['new','Novidades'],['anticipated','Mais Aguardados'],['top','Mais bem avaliados'],['calendar','Calendário']].map(([k,l])=>`<button class="chip ${discoverState.tab===k?'active':''}" data-discover-tab="${k}">${l}</button>`).join('')}</div><div class="filters">${[['all','Todos'],['movie','Filmes'],['tv','Séries']].map(([k,l])=>`<button class="chip ${discoverState.type===k?'active':''}" data-discover-type="${k}">${l}</button>`).join('')}</div><div data-discover-content class="ct248-discover-content">${loading('Carregando títulos...')}</div></div>`))}else{QA('[data-discover-tab]').forEach(b=>b.classList.toggle('active',b.dataset.discoverTab===discoverState.tab));QA('[data-discover-type]').forEach(b=>b.classList.toggle('active',b.dataset.discoverType===discoverState.type));Q('[data-discover-content]')?.setAttribute('aria-busy','true')}
 try{const rows=await rows248(discoverState.tab);if(token===dseq&&location.pathname.startsWith('/discover'))await dpaint(rows)}catch(e){if(token===dseq){const h=Q('[data-discover-content]');if(h)h.innerHTML=fail(`Falha ao carregar Descobrir: ${e?.message||e}`,'discover')}}};

/* SPORTS: exact four views; source fetch includes previous 3 days while UI scopes remain exact. */
const ST=[['upcoming','Próximos'],['previous','Anteriores'],['favorites','Favoritos'],['watched','Assistidos']];
sportsState.tab=ST.some(x=>x[0]===sportsState.tab)?sportsState.tab:'upcoming';
sportsPayload=async function(force=false){if(!force&&sportsCache)return sportsCache;sportsCache=await rpc('cinetracker_sports_payload_v1',{p_from:new Date(`${SHIFT(-3)}T00:00:00`).toISOString(),p_to:new Date(`${SHIFT(30)}T23:59:59`).toISOString()});return sportsCache||{sports:[],events:[],favorites:[],preferences:{}}};
function fav(e,p){if(e.has_favorite||e.is_favorite)return true;const ids=new Set((p.favorites||[]).map(x=>NUM(x.entity_id)));return[e.competition_id,e.home_id,e.away_id].some(x=>ids.has(NUM(x)))}
function seen(e){return Boolean(e.is_watched||e.user_watched||e.watched||e.watched_at||e.seen_at)}
sportsFiltered=function(p){let a=[...(p?.events||[])],td=TODAY(),lo=SHIFT(-3);if(sportsState.sport!=='all')a=a.filter(x=>x.sport_slug===sportsState.sport);if(sportsState.tab==='upcoming')a=a.filter(x=>DAY(x.starts_at)===td&&new Date(x.starts_at).getTime()>=now()&&x.status!=='finished');else if(sportsState.tab==='previous')a=a.filter(x=>DAY(x.starts_at)>=lo&&DAY(x.starts_at)<td);else if(sportsState.tab==='favorites')a=a.filter(x=>fav(x,p));else if(sportsState.tab==='watched')a=a.filter(seen);return a.sort((a,b)=>new Date(a.starts_at)-new Date(b.starts_at))};
function eid(e,i){return String(e.id||e.event_id||e.provider_event_id||e.external_id||`${e.sport_slug||'sport'}-${new Date(e.starts_at).getTime()}-${i}`)}
function scard(e,p,i){let h=sportsEvent(e,p),id=E(eid(e,i)),on=seen(e),b=`<div class="ct248-sport-actions"><button type="button" class="ct248-sport-watch${on?' on':''}" data-ct248-sport-watch="${id}" data-ct248-watch-on="${on?'1':'0'}">${on?'↶ Desmarcar assistido':'✓ Assistido'}</button></div>`;h=h.replace('<article class="event',`<article data-ct248-event-id="${id}" class="event`);return h.replace('</article>',b+'</article>')}
const PS=paintSports;paintSports=function(p=sportsCache||{}){const out=PS.call(this,p),root=Q('[data-sports]');if(!root)return out;root.dataset.ct248Sports='four-tabs';
 for(const panel of QA('section.panel,.panel',root)){const t=N(Q('.panel-head h2,h2',panel)?.textContent);if(t==='central esportiva'||t==='favoritos')panel.remove()}
 let tabs=Q('.tabs',root);if(!tabs){tabs=document.createElement('div');tabs.className='tabs';root.prepend(tabs)}tabs.innerHTML=ST.map(([k,l])=>`<button class="chip ${sportsState.tab===k?'active':''}" data-sports-tab="${k}">${l}</button>`).join('');
 const a=sportsFiltered(p);let ep=QA('section.panel,.panel',root).find(x=>Q('.event-grid',x));if(!ep){ep=document.createElement('section');ep.className='panel';root.appendChild(ep)}
 const title=sportsState.tab==='upcoming'?'Próximos de hoje':sportsState.tab==='previous'?'Últimos 3 dias':sportsState.tab==='favorites'?'Jogos dos favoritos':'Assistidos';
 ep.innerHTML=`<div class="panel-head"><h2>${title}</h2><small>${a.length}</small></div><div class="event-grid ct248-events">${a.map((e,i)=>scard(e,p,i)).join('')||'<div class="empty">Nenhum jogo neste filtro.</div>'}</div>`;f1fix();localScroll(root);return out};
async function toggleSeen(id,on){const p=sportsCache||{},e=(p.events||[]).find((x,i)=>eid(x,i)===id);if(!e)return;const idv=e.id||e.event_id||e.provider_event_id||e.external_id;for(const fn of['cinetracker_sport_toggle_watched_v1','cinetracker_sports_toggle_watched_v1'])try{await rpc(fn,{p_event_id:idv,p_watched:on});break}catch{}e.is_watched=e.user_watched=e.watched=on;e.watched_at=on?new Date().toISOString():null;paintSports(p)}

/* F1: persistent collapse, one tab group, actual legacy/canonical data bridged into six requested scopes. */
const FK='cinetracker:f1-hub-collapsed',fopen=()=>{try{return localStorage.getItem(FK)!=='1'}catch{return true}};
function fset(card,open){try{localStorage.setItem(FK,open?'0':'1')}catch{}if(!card)return;card.dataset.ct236F1Open=open?'1':'0';const body=Q('.f1Body,[data-f1-body]',card);if(body)body.hidden=!open;const b=Q('[data-ct236-f1-toggle]',card);if(b){b.textContent=open?'−':'+';b.setAttribute('aria-expanded',String(open));b.setAttribute('aria-label',open?'Minimizar F1 Hub':'Expandir F1 Hub')}}
window.__ctR239SetF1Open=fset;
function fmeta(card,which){try{const rows=typeof raceCandidates236==='function'?raceCandidates236(card):[],n=now(),d=rows.map(el=>({el,t:dateValue236(el)})).filter(x=>x.t>0).sort((a,b)=>a.t-b.t),p=which==='next'?(d.find(x=>x.t>=n)||d[0]):([...d].reverse().find(x=>x.t<n)||d.at(-1));if(!p)return'';const diff=p.t-n,status=diff>0?'Próxima':diff>-10800000?'Em andamento':'Encerrada',cd=diff>0?`${Math.floor(diff/86400000)}d ${Math.floor(diff%86400000/3600000)}h ${Math.floor(diff%3600000/60000)}m`:'';return `<div class="ct248-f1-meta"><span class="badge">${status}</span><b>${new Date(p.t).toLocaleString('pt-BR',{timeZone:'America/Sao_Paulo',day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})}</b>${cd?`<small>Faltam ${cd}</small>`:''}</div>`}catch{return''}}
function fselect(card,key){const panel=Q('[data-ct236-f1-panel]',card);if(!panel)return;QA('[data-ct248-f1-tab]',card).forEach(b=>{const on=b.dataset.ct248F1Tab===key;b.classList.toggle('active',on);b.setAttribute('aria-selected',String(on))});if(key==='qualifying'){const old=QA('button,[role="tab"]',card).find(b=>/grid|qualifica/i.test(b.textContent||'')&&!b.hasAttribute('data-ct248-f1-tab'));old?.click();setTimeout(()=>{const x=QA('.f1Body > *',card).find(el=>!el.classList.contains('ct236-f1-shell')&&!el.hidden&&/grid|qualifica/i.test(el.textContent||''));panel.innerHTML=x?x.cloneNode(true).outerHTML:'<div class="empty">Grid/qualificação ainda não publicado para a etapa atual.</div>'},0);return}if(typeof showF1Tab236==='function')showF1Tab236(card,key);setTimeout(()=>{if((key==='next'||key==='last')&&panel.isConnected)panel.insertAdjacentHTML('afterbegin',fmeta(card,key==='next'?'next':'last'))},0)}
function f1fix(){const card=Q('[data-ct236-f1-card],.f1Hub,.f1-hub,[data-f1-hub]');if(!card)return;fset(card,fopen());const shell=Q('.ct236-f1-shell',card),panel=Q('[data-ct236-f1-panel]',card),tabs=shell&&Q('.ct236-f1-tabs',shell);if(!shell||!panel||!tabs)return;tabs.innerHTML=[['next','Próximo GP'],['calendar','Calendário'],['drivers','Pilotos'],['constructors','Construtores'],['last','Último GP'],['qualifying','Grid / Qualificação']].map(([k,l],i)=>`<button type="button" role="tab" data-ct248-f1-tab="${k}" aria-selected="${i===0}">${l}</button>`).join('');if(!Q('.ct248-f1-season',shell)){const s=document.createElement('div');s.className='ct248-f1-season';s.textContent=`Temporada ${new Date().getFullYear()}`;shell.prepend(s)}fselect(card,'next');localScroll(shell)}

/* Profile: exactly one statistics group. */
function pfix(){const root=Q('[data-profile]');if(!root)return;const ps=QA('section.panel,.panel',root).filter(p=>{const t=N(Q('.panel-head h2,h2',p)?.textContent);return t==='estatisticas'||t==='estatisticas de esporte'||t==='estatisticas de esportes'}),main=ps.find(p=>N(Q('.panel-head h2,h2',p)?.textContent)==='estatisticas')||ps[0];if(!main)return;const grid=Q('.stats,.ct-r180-stats-grid,.ct-r238-profile-grid,.ct239-profile-grid',main);for(const x of ps)if(x!==main){const g=Q('.stats,.ct-r180-stats-grid,.ct-r238-profile-grid,.ct239-profile-grid',x);if(grid&&g)for(const c of [...g.children]){const label=N(Q('small',c)?.textContent);if(!QA(':scope > .stat',grid).some(y=>N(Q('small',y)?.textContent)===label))grid.appendChild(c)}x.remove()}Q('.panel-head h2,h2',main).textContent='Estatísticas';grid?.classList.add('ct248-profile-grid');root.dataset.ct248Profile='single-statistics'}
const RP=renderProfile;renderProfile=async function(){const o=await RP.apply(this,arguments);pfix();return o};

/* Only local rails scroll horizontally; page remains vertical. */
const LS='.ct169-season-row,.ct169-related-row,.ct169-season-chart-carousel,.ct169-chart-scroll,.ct-r244-horizontal-scroll,.ct248-discover-track,.ct236-f1-tabs,.tabs,.filters';
function localScroll(root=document){if(root?.matches?.(LS))root.classList.add('ct248-local-scroll');QA(LS,root).forEach(x=>x.classList.add('ct248-local-scroll'))}
new MutationObserver(ms=>{for(const m of ms)for(const x of m.addedNodes)if(x?.nodeType===1)localScroll(x)}).observe(document.documentElement,{subtree:true,childList:true});localScroll();
document.addEventListener('click',e=>{const os=e.target.closest?.('[data-ct248-open-sports]');if(os){e.preventDefault();go('/sports');return}const w=e.target.closest?.('[data-ct248-sport-watch]');if(w){e.preventDefault();e.stopImmediatePropagation();w.classList.remove('ct248-watch-pop');void w.offsetWidth;w.classList.add('ct248-watch-pop');void toggleSeen(w.dataset.ct248SportWatch,w.dataset.ct248WatchOn!=='1');return}const ft=e.target.closest?.('[data-ct248-f1-tab]');if(ft){e.preventDefault();e.stopImmediatePropagation();const card=ft.closest('[data-ct236-f1-card],.f1Hub,.f1-hub,[data-f1-hub]');if(card)fselect(card,ft.dataset.ct248F1Tab)}},true);
window.addEventListener('pageshow',()=>{homeFix();pfix();f1fix();localScroll()});
})();