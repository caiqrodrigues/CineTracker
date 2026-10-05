import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r475.mjs');

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v475.js'),'utf8'),
 readFile(resolve(dist,'app-v475.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8')
]);

function patchRuntime(source,anchor,patches,label){
 const at=source.indexOf(anchor);
 if(at<0)throw new Error('r476 missing '+label+' anchor');
 const start=source.lastIndexOf('(()=>{',at),close=source.indexOf('\n})();',at);
 if(start<0||close<0)throw new Error('r476 invalid '+label+' bounds');
 const end=close+6;let region=source.slice(start,end);
 for(const [needle,replacement,name] of patches){
  const count=region.split(needle).length-1;
  if(count!==1)throw new Error('r476 expected one '+label+' '+name+', found '+count);
  region=region.replace(needle,replacement);
 }
 return source.slice(0,start)+region+source.slice(end);
}
function patchGlobal(source,needle,replacement,label){
 const count=source.split(needle).length-1;
 if(count!==1)throw new Error('r476 expected one '+label+', found '+count);
 return source.replace(needle,replacement);
}

/* Presentation stays inside the lexical application closure. */
js=patchGlobal(js,'mediaCard:item=>mediaCard(item),',`mediaCard:item=>mediaCard(item),
 homeMovieCard:item=>mediaCard({...item,media_type:'movie'}),`,'core movie card bridge');

js=patchGlobal(
 js,
 "ensureHomeShell:()=>{setApp(shell('Home','Sua biblioteca sincronizada e organizada pelo seu progresso.','home','<div class=\"page\" data-home></div>'));return true},",
 "ensureHomeShell:()=>{setApp(shell('Home','Sua biblioteca sincronizada e organizada pelo seu progresso.','home','<div class=\"page\" data-home><div class=\"home-tabs ct476-home-skeleton-tabs\"><button type=\"button\" class=\"chip active\" data-home-tab=\"series\">Séries</button><button type=\"button\" class=\"chip\" data-home-tab=\"movies\">Filmes</button></div><div class=\"ct476-home-skeleton\" aria-hidden=\"true\"><div></div><div></div><div></div></div></div>'));return true},",
 'visible Home skeleton'
);

/* The old r424 gate is the source of the black/hidden Series entry. Keep its profile
   statistics, but retire only its Home visibility/scroll gate. */
js=patchRuntime(js,"if(window.__ctR424?.version==='1.0.215')return;",[
 [`function hideHomeSeries424(){
 const view=q('[data-home-view="series"]');if(!view)return false;
 view.dataset.ct424HomeGate='1';view.style.visibility='hidden';
 try{window.scrollTo({top:0,left:0,behavior:'auto'})}catch{}
 for(const el of homeScrollRoots424(view))try{el.scrollTop=0}catch{}
 return true;
}`,
 `function hideHomeSeries424(){
 const view=q('[data-home-view="series"]');if(!view)return false;
 view.style.removeProperty('visibility');view.removeAttribute('aria-hidden');view.dataset.ct424HomeGate='retired-r476';return true;
}`,'retire hidden Series gate'],
 [`async function gateHomeSeries424(){
 if(routeNow()!=='home'||activeHome()!=='series')return false;
 const token=++homeGate424;hideHomeSeries424();
 try{await timeout(Promise.resolve(window.__ctR399?.refreshSeries?.(true)),5200)}catch{}
 if(routeNow()==='home'&&activeHome()==='series')revealHomeSeries424(token);
 return true;
}`,
 `async function gateHomeSeries424(){
 if(routeNow()!=='home'||activeHome()!=='series')return false;
 hideHomeSeries424();try{void window.__ctR399?.refreshSeries?.(false)}catch{}return true;
}`,'retire delayed Series gate']
],'r424');

/* Home Movies: Watchlist is a standard 2:3 card grid. History remains untouched. */
js=patchRuntime(js,"window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';",[
 ["window.__ctCoreR471?.homeMovieRow?.(y)","window.__ctCoreR471?.homeMovieCard?.(y)",'movie card renderer'],
 ["stack.replaceChildren();stack.style.display='flex';stack.style.flexDirection='column';const frag=document.createDocumentFragment()",
  "stack.replaceChildren();stack.classList.add('ct476-movie-grid');stack.style.display='grid';stack.style.flexDirection='';const frag=document.createDocumentFragment()",
  'movie card grid']
],'r388');

js=patchRuntime(js,"window.__ctR399Marker='startup-auth-current-rpc+home+direct-foryou';",[
 ["window.__ctCoreR471?.homeMovieRow?.(y)","window.__ctCoreR471?.homeMovieCard?.(y)",'movie card renderer'],
 ["stack.replaceChildren();stack.style.display='flex';stack.style.flexDirection='column';sec.dataset.ct397Owned='1';sec.dataset.ct399Owned='1';",
  "stack.replaceChildren();stack.classList.add('ct476-movie-grid');stack.style.display='grid';stack.style.flexDirection='';sec.dataset.ct397Owned='1';sec.dataset.ct399Owned='1';",
  'paged movie grid']
],'r399');

/* Pra Você: fresh/daily are strictly unknown; Watchlist uses recent-consumption affinity. */
js=patchRuntime(js,"window.__ctR464Marker='discover-foryou-visible-owner-v421';",[
 ["const name=group==='watch'?'cinetracker_discover_watch_unseen_v421':'cinetracker_discover_fresh_v475';",
  "const name=group==='watch'?'cinetracker_discover_watch_smart_v476':'cinetracker_discover_fresh_v476';",
  'v476 pool authorities'],
 ["try{return rows(unwrap(await timeout(rpcCall(name,{p_kind:kind,p_limit:limit}),7000)))}catch{return[]}",
  "try{return rows(unwrap(await timeout(rpcCall(name,{p_kind:kind,p_limit:limit}),6000))).filter(x=>!/(^|\\b)(wwe|nxt|monday night raw|friday night smackdown|smackdown|wrestlemania|royal rumble|summerslam|survivor series)(\\b|$)/i.test(String(x?.title||x?.name||'')))}catch{return[]}",
  'defensive WWE filter'],
 ["const item=eligible[Math.floor(Math.random()*eligible.length)],key=keyOf(item);ex.add(key);",
  "const windowed=slot.startsWith('watch:')?eligible.slice(0,Math.min(12,eligible.length)):eligible;const item=windowed[Math.floor((slot.startsWith('watch:')?Math.pow(Math.random(),2):Math.random())*windowed.length)],key=keyOf(item);ex.add(key);",
  'smart weighted Watchlist swap'],
 [`function activate(){
 setForYouState();qa('[data-ct319-tab],[data-ct315-tab],[data-ct263-discover-tab],[data-discover-tab]').forEach(b=>{if(isForYouControl(b))b.classList.add('active')});
 renderLoading();void load(true);return true;
}`,
 `function activate(){
 setForYouState();qa('[data-ct319-tab],[data-ct315-tab],[data-ct263-discover-tab],[data-discover-tab]').forEach(b=>{if(isForYouControl(b))b.classList.add('active')});
 const warm=['movie','series','anime'].some(k=>state.watch[k].length||state.fresh[k].length);if(warm)render();else renderLoading();void load(true);return true;
}`,'instant warm repaint']
],'r464');

/* r472 Profile data owner is retired; r476 below is the only list/More owner.
   Daily history/undo in r471/v426 is left unchanged. */
js=patchRuntime(js,'/* CineTracker Web 1.0.262 r472',[
 ["function scheduleProfile(force=false){\n const token=++profileToken;\n bounded(()=>{if(token!==profileToken||routeNow()!=='profile')return;void applyProfile(force)},[80,220,520,1100,2200,4200,7000,10000]);\n}",
  "function scheduleProfile(){return false}",
  'retire r472 profile scheduler']
],'r472');

/* Prevent older Profile limiters from recreating large inline More controls. */
js=patchRuntime(js,"if(window.__ctR457?.version==='1.0.247')return;",[
 ['const PROFILE_LIMIT_457=13;','const PROFILE_LIMIT_457=999999;','retire r457 More']
],'r457');
js=patchRuntime(js,"window.__ctR460Marker='movies-sticky+watchlist-v405+foryou-7-swap+profile-13-half+daily-undo+f1-75-of-77-no-reconcile';",[
 ['const PROFILE_LIMIT_460=13;','const PROFILE_LIMIT_460=999999;','retire r460 More']
],'r460');

js+=`
/* CineTracker Web 1.0.266 r476 — immediate Home, intelligent Pra Você and complete Profile lists. */
(()=>{
'use strict';
if(window.__ctR476?.version==='1.0.266')return;
const core=window.__ctCoreR471;if(!core)throw new Error('r476 core unavailable');
const q=(s,r=document)=>r?.querySelector?.(s)||null,qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const rows=v=>Array.isArray(v)?v:[];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const routeNow=()=>{try{return String(core.route?.()||'')}catch{return''}};

/* HOME */
let homeToken=0,homeUserMoved=false;
function homeTarget(kind){
 const view=q('[data-home-view="'+(kind==='movies'?'movies':'series')+'"]');if(!view)return null;
 if(kind==='movies')return q('[data-ct388-movie-watch]',view);
 return qa(':scope > .home-section,:scope > [data-ct399-series-section],:scope > [data-ct388-series-section]',view).find(x=>norm(q('h3',x)?.textContent)==='assistir a seguir')||null;
}
function anchorHome(kind,token){
 if(token!==homeToken||homeUserMoved||routeNow()!=='home')return false;
 const target=homeTarget(kind);if(!target)return false;
 target.style.scrollMarginTop='8px';try{target.scrollIntoView({block:'start',inline:'nearest',behavior:'auto'})}catch{target.scrollIntoView?.(true)}
 document.documentElement.dataset.ct476HomeAnchor=kind;return true;
}
function primeHome(kind='series'){
 if(routeNow()!=='home')return false;const k=kind==='movies'?'movies':'series';
 homeUserMoved=false;const token=++homeToken;
 try{if(!q('[data-home]'))core.ensureHomeShell?.()}catch{}
 try{if(!q('[data-home-view="series"]')||!q('[data-home-view="movies"]'))void window.__ctR388?.renderHome?.()}catch{}
 try{window.__ctR399?.enterHome?.(k)}catch{}
 for(const ms of [0,70,180,360,650,1000])setTimeout(()=>anchorHome(k,token),ms);
 return true;
}
function intentKind(target){
 const tab=target?.closest?.('[data-home-tab],.home-tabs button');if(!tab)return null;
 return String(tab.dataset.homeTab||'series')==='movies'||norm(tab.textContent).includes('filme')?'movies':'series';
}
window.addEventListener('pointerdown',e=>{
 const k=intentKind(e.target);if(k){for(const ms of [0,30,90])setTimeout(()=>primeHome(k),ms);return}
 if(e.target?.closest?.('[data-nav="home"]'))for(const ms of [0,30,90,180])setTimeout(()=>primeHome('series'),ms);
},{capture:true,passive:true});
for(const ev of ['wheel','touchmove'])window.addEventListener(ev,()=>{if(routeNow()==='home'){homeUserMoved=true;homeToken++}},{capture:true,passive:true});
window.addEventListener('keydown',e=>{if(routeNow()==='home'&&['PageUp','PageDown','ArrowUp','ArrowDown','Home','End',' '].includes(e.key)){homeUserMoved=true;homeToken++}},true);
window.addEventListener('popstate',()=>setTimeout(()=>{if(routeNow()==='home')primeHome('series')},0));

/* PROFILE */
const LIMIT=12;
const labels={series:'Séries',movies:'Filmes',seriesFav:'Séries Favoritas',movieFav:'Filmes Favoritos',actors:'Atores Favoritos'};
const moreLabels={series:'Ver mais séries',movies:'Ver mais filmes',seriesFav:'Ver mais séries favoritas',movieFav:'Ver mais filmes favoritos',actors:'Ver mais atores'};
let profile=null,profileTask=null,profileSeq=0,allSeq=0;
const panelFor=key=>{const wanted=norm(labels[key]);return qa('section.panel,.panel',q('[data-profile]')).find(p=>norm(q('.panel-head h2,.panel-head h3,:scope>h2,:scope>h3,h2,h3',p)?.textContent||'')===wanted)||null};
const listFor=key=>key==='series'?rows(profile?.series):key==='movies'?rows(profile?.movies):key==='seriesFav'?rows(profile?.series_favorites):key==='movieFav'?rows(profile?.movie_favorites):rows(profile?.actors);
function actorCard(a){
 const id=Number(a?.tmdb_person_id||0),name=esc(a?.actor_name||'Ator'),p=String(a?.profile_path||''),src=p?(p.startsWith('http')?p:core.image?.(p,'w185')):'';
 return '<article class="card ct476-profile-card"><button type="button" data-person="'+id+'"><div class="poster"'+(src?' style="background-image:url(\\''+esc(src)+'\\')"':'')+'></div><div class="card-body"><b>'+name+'</b><small>Ator favorito</small></div></button></article>';
}
function mediaCard(x){
 try{const h=core.mediaCard?.(x);if(typeof h==='string'&&h.trim())return h}catch{}
 const type=String(x?.media_type||'tv')==='movie'?'movie':'tv',id=Number(x?.tmdb_id||0),p=String(x?.poster_path||''),src=p?(p.startsWith('http')?p:core.image?.(p,'w342')):'';
 return '<article class="card ct476-profile-card"><button type="button" data-media="'+type+':'+id+'"><div class="poster"'+(src?' style="background-image:url(\\''+esc(src)+'\\')"':'')+'></div><div class="card-body"><b>'+esc(x?.title||'Sem título')+'</b></div></button></article>';
}
const renderCard=(key,x)=>key==='actors'?actorCard(x):mediaCard(x);
function removeLargeMore(panel){
 qa('[data-ct424-more],[data-ct455-more],[data-ct457-more],[data-ct459-more],[data-ct460-more],[data-ct471-more],[data-ct472-more],.ct455-profile-more,.ct457-profile-more,.ct460-profile-more,.ct472-more-card',panel).forEach(x=>x.remove());
}
function ensureHeaderMore(panel,key,total){
 const head=q('.panel-head',panel)||panel;let b=qa('button,a,[role="button"]',head).find(x=>norm(x.textContent).includes('ver mais'))||null;
 if(!b){b=document.createElement('button');b.type='button';b.className='chip ct476-header-more';head.appendChild(b)}
 b.dataset.ct476HeaderMore=key;b.textContent=moreLabels[key];b.hidden=total===0;b.style.removeProperty('display');b.removeAttribute('aria-hidden');b.tabIndex=0;b.setAttribute('aria-label',moreLabels[key]);return b;
}
function renderPanel(key){
 const panel=panelFor(key);if(!panel)return false;const row=q(':scope > .row,:scope > .ct424-profile-list,:scope > [class*="rail"],:scope > [class*="row"]',panel);if(!row)return false;
 const data=listFor(key);removeLargeMore(panel);row.innerHTML=data.slice(0,LIMIT).map(x=>renderCard(key,x)).join('')||'<div class="empty">Nenhum item nesta seção.</div>';
 row.dataset.ct476ProfileRow=key;const count=q('.panel-head small',panel);if(count)count.textContent=data.length.toLocaleString('pt-BR');ensureHeaderMore(panel,key,data.length);return true;
}
function paintProfile(){
 if(routeNow()!=='profile'||!profile)return false;for(const key of Object.keys(labels))renderPanel(key);const root=q('[data-profile]');if(root)root.dataset.ct476Profile='12+header-more-full';return true;
}
async function loadProfile(force=false){
 if(profileTask)return profileTask;if(profile&&!force){paintProfile();return profile}
 profileTask=(async()=>{try{const raw=await core.rpc('cinetracker_profile_lists_v476',{});if(raw&&typeof raw==='object'&&!Array.isArray(raw))profile=raw;paintProfile();return profile}catch(e){document.documentElement.dataset.ct476ProfileError=String(e?.message||e);return profile}finally{profileTask=null}})();return profileTask;
}
function closeAll(){q('[data-ct476-all-screen]')?.remove();allSeq++}
function openAll(key){
 const data=listFor(key);closeAll();const seq=++allSeq,back=document.createElement('div');back.className='ct476-all-screen';back.dataset.ct476AllScreen=key;
 back.innerHTML='<section class="ct476-all-panel" role="dialog" aria-modal="true"><header><div><small>PERFIL</small><h2>'+esc(labels[key])+'</h2><p>'+data.length.toLocaleString('pt-BR')+' itens</p></div><button type="button" class="btn" data-ct476-all-close>✕ Fechar</button></header><div class="ct476-all-grid" data-ct476-all-grid></div></section>';
 document.body.appendChild(back);const grid=q('[data-ct476-all-grid]',back);let i=0;
 const paint=()=>{if(seq!==allSeq||!back.isConnected)return;const end=Math.min(data.length,i+36),frag=document.createDocumentFragment();for(;i<end;i++){const t=document.createElement('template');t.innerHTML=renderCard(key,data[i]).trim();if(t.content.firstElementChild)frag.appendChild(t.content.firstElementChild)}grid.appendChild(frag);if(i<data.length)requestAnimationFrame(paint)};
 requestAnimationFrame(paint);q('[data-ct476-all-close]',back)?.focus();return true;
}
function scheduleProfile(force=false){
 const seq=++profileSeq;for(const ms of [40,140,320,700,1400,2600,4600,7200])setTimeout(()=>{if(seq!==profileSeq||routeNow()!=='profile')return;if(profile&&!force)paintProfile();else void loadProfile(force)},ms);
}
window.addEventListener('click',e=>{
 const b=e.target?.closest?.('[data-ct476-header-more]');if(b){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();openAll(String(b.dataset.ct476HeaderMore||''));return}
 if(e.target?.closest?.('[data-ct476-all-close]')||e.target?.matches?.('[data-ct476-all-screen]')){e.preventDefault();closeAll();return}
 if(e.target?.closest?.('[data-nav="profile"]')){profile=null;setTimeout(()=>scheduleProfile(true),0)}
},true);
window.addEventListener('keydown',e=>{if(e.key==='Escape')closeAll()});
window.addEventListener('cinetracker:data-changed',()=>{if(routeNow()==='profile'){profile=null;scheduleProfile(true)}});
window.addEventListener('popstate',()=>setTimeout(()=>{if(routeNow()==='profile')scheduleProfile(false)},0));

const style=document.createElement('style');style.id='ct476-style';style.textContent=\`
.ct476-home-skeleton{display:grid;gap:12px;padding:12px 0}.ct476-home-skeleton>div{height:86px;border-radius:14px;background:linear-gradient(90deg,rgba(255,255,255,.04),rgba(255,255,255,.09),rgba(255,255,255,.04))}
.ct476-movie-grid{grid-template-columns:repeat(auto-fill,minmax(150px,150px))!important;gap:16px!important;align-items:start!important}.ct476-movie-grid>.card{width:150px!important;min-width:150px!important;max-width:150px!important}.ct476-movie-grid .poster{aspect-ratio:2/3!important}.ct476-movie-grid .card-body b{display:block!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
[data-profile] [data-ct476-profile-row]{display:flex!important;flex-flow:row wrap!important;gap:16px!important;align-items:stretch!important;max-height:none!important;overflow:visible!important}[data-profile] [data-ct476-profile-row]>.card{flex:0 0 150px!important;width:150px!important;min-width:150px!important;max-width:150px!important}[data-profile] [data-ct476-profile-row] .poster{aspect-ratio:2/3!important}[data-profile] [data-ct476-profile-row] .card-body b{display:block!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
.ct476-header-more{margin-left:auto!important;min-height:28px!important;height:28px!important;padding:4px 9px!important;font-size:11px!important;line-height:1!important}
.ct476-all-screen{position:fixed;inset:0;z-index:2147482500;background:rgba(3,10,15,.88);backdrop-filter:blur(14px);overflow:auto;padding:24px}.ct476-all-panel{max-width:1240px;margin:0 auto;background:rgba(10,25,34,.98);border:1px solid rgba(255,255,255,.14);border-radius:18px;padding:18px;box-shadow:0 24px 80px rgba(0,0,0,.5)}.ct476-all-panel>header{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:18px}.ct476-all-panel h2{margin:2px 0}.ct476-all-panel p{margin:0;opacity:.7}.ct476-all-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,150px));gap:16px;align-items:start}.ct476-all-grid>.card{width:150px!important;min-width:150px!important;max-width:150px!important}.ct476-all-grid .poster{aspect-ratio:2/3!important}.ct476-all-grid .card-body b{display:block!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
@media(max-width:720px){.ct476-movie-grid,.ct476-all-grid{grid-template-columns:repeat(auto-fill,minmax(132px,1fr))!important;gap:10px!important}.ct476-movie-grid>.card,.ct476-all-grid>.card{width:100%!important;min-width:0!important;max-width:none!important}.ct476-all-screen{padding:10px}.ct476-all-panel{padding:12px}}
\`;document.head.appendChild(style);

if(routeNow()==='home')primeHome(q('[data-home-tab].active')?.dataset?.homeTab==='movies'?'movies':'series');
if(routeNow()==='profile')scheduleProfile(true);
window.__ctR476Marker='home-visible-card-watchlist+foryou-v476-strict-smart+profile-12-header-more-full';
window.__ctR476={version:'1.0.266',scope:'home+discover-foryou+profile-lists',primeHome,loadProfile,paintProfile,openAll};
})();
`;

html=html.replaceAll('app-v475.js','app-v476.js').replaceAll('app-v475.css','app-v476.css').replaceAll('v1.0.265','v1.0.266').replaceAll('r475-official-1.0.265','r476-official-1.0.266');
css+='\n/* CineTracker Web 1.0.266 r476 — visible Home, card Watchlist, intelligent discovery, Profile 12 + header More. */\n';
sw=sw.replaceAll('app-v475.js','app-v476.js').replaceAll('app-v475.css','app-v476.css').replaceAll('ct-web-1.0.265-r475','ct-web-1.0.266-r476');

const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'1.0.266',revision:'r476-official-1.0.266',base:'r475+r476-home-discover-profile',
 scope:'home-visible+movie-card-watchlist+discover-strict-smart+profile-header-more',
 home_series:'r424 delayed black gate retired; visible skeleton/frame paints immediately and r399/v452 remains data authority',
 home_movies:'history preserved; v405 Watchlist renders as standard 2:3 cards and is the semantic anchor on Filmes entry',
 discover_foryou:'daily/100% New use strict v476 seen/watchlist/favorite/alias/WWE exclusions; Watchlist uses recent-consumption genre affinity with weighted non-sequential swaps',
 profile_lists:'structured v476 authority; exactly 12 summary cards; only compact header More remains and opens all category items in a separate progressively-painted screen',
 history:'daily activity and undo v426 preserved',
 sports:'preserved',f1:'preserved',android:'unchanged-1.0.20/10062'
});

await Promise.all([
 writeFile(resolve(dist,'app-v476.js'),js),writeFile(resolve(dist,'app-v476.css'),css),
 writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v475.js'),{force:true}),rm(resolve(dist,'app-v475.css'),{force:true})]);

const region=anchor=>{const at=js.indexOf(anchor),start=js.lastIndexOf('(()=>{',at),close=js.indexOf('\n})();',at);if(at<0||start<0||close<0)throw new Error('r476 missing runtime '+anchor);return js.slice(start,close+6)};
const r424=region("if(window.__ctR424?.version==='1.0.215')return;");
const r388=region("window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';");
const r399=region("window.__ctR399Marker='startup-auth-current-rpc+home+direct-foryou';");
const r464=region("window.__ctR464Marker='discover-foryou-visible-owner-v421';");
if(!r424.includes("ct424HomeGate='retired-r476'")||r424.includes("view.style.visibility='hidden'"))throw new Error('r476 Home black gate active');
if(!js.includes('homeMovieCard:item=>mediaCard')||!r388.includes("classList.add('ct476-movie-grid')")||!r399.includes("classList.add('ct476-movie-grid')"))throw new Error('r476 movie card grid missing');
if(!r464.includes('cinetracker_discover_watch_smart_v476')||!r464.includes('cinetracker_discover_fresh_v476')||!r464.includes('nxt|monday night raw'))throw new Error('r476 Discover authority missing');
for(const need of ['cinetracker_profile_lists_v476','data-ct476-header-more','data-ct476-all-screen','const LIMIT=12','i+36','cinetracker_activity_items_by_day_v426'])if(!js.includes(need))throw new Error('r476 missing '+need);
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval('])if(js.slice(js.lastIndexOf('/* CineTracker Web 1.0.266 r476')).includes(bad))throw new Error('r476 forbidden '+bad);
console.log('WEB_R476_READY Home + smart PraVoce + Profile header More');
