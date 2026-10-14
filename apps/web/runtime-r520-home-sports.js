/* CineTracker Web 0.3.47 r520 — sticky Home chrome + team/league sports detail. */
(()=>{
'use strict';
if(window.__ctR520HomeSports?.version==='0.3.47')return;
const core=()=>window.__ctCoreR471||null,q=(s,r=document)=>r?.querySelector?.(s)||null,qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])],rows=v=>Array.isArray(v)?v:[],esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),norm=v=>String(v??'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim(),route=()=>String(core()?.route?.()||'');
let detail=null,detailToken=0;const watchLocks=new Set();
function pinHome(){
 if(route()!=='home')return false;const root=q('[data-home]'),tabs=q('.home-tabs',root),search=q('[data-page="home"] .search-global');if(!root||!tabs)return false;
 const left=Math.max(0,Math.round(root.getBoundingClientRect().left)),searchHeight=Math.max(42,Math.ceil(search?.getBoundingClientRect?.().height||42));
 root.style.setProperty('--ct520-tabs-left',left+'px');root.style.setProperty('--ct520-tabs-top',(8+searchHeight+7)+'px');document.documentElement.dataset.ct520HomePinned='1';return true
}
function applyHomeIntent(kind){
 if(route()!=='home')return false;const wanted=kind==='movies'?'movies':'series';
 window.__ctR504UserTab=wanted;window.__ctR502UserTab=wanted;document.documentElement.dataset.ct504HomeKind=wanted;document.documentElement.dataset.ct502HomeKind=wanted;document.documentElement.dataset.ct495HomeKind=wanted;
 try{window.__ctR371?.selectByUser?.(wanted)}catch{try{window.__ctR371?.applyTab?.(wanted)}catch{}}
 if(wanted==='movies')void Promise.resolve(window.__ctR388?.loadMovies?.(false)).then(()=>{try{window.__ctR371?.applyTab?.('movies');window.__ctR388?.renderMoviesAll?.()}catch{}});
 requestAnimationFrame(pinHome);return true
}
function entityIdFor(card,label,index){
 const want=norm(label),favs=qa('[data-ct255-fav]',card);
 const byLabel=favs.find(b=>{const t=norm(b.textContent||'').replace(/^(favorito )?/,'');return want&&t.includes(want)});
 if(byLabel)return Number(byLabel.dataset.ct255Fav||0)||0;
 return Number(favs[index]?.dataset?.ct255Fav||0)||0
}
function eventDate(v){try{return new Intl.DateTimeFormat('pt-BR',{dateStyle:'short',timeStyle:'short',timeZone:'America/Sao_Paulo'}).format(new Date(v))}catch{return String(v||'')}}
function detailEvent(x){
 const watched=!!x?.is_watched,score=(x?.home_score!=null||x?.away_score!=null)?esc(x?.home_score??'–')+' : '+esc(x?.away_score??'–'):'×';
 return '<article class="ct520-detail-event" data-ct520-detail-event="'+Number(x?.id||0)+'"><div class="ct520-detail-league">'+(x?.competition_logo?'<img src="'+esc(x.competition_logo)+'" alt="">':'')+'<span>'+esc(x?.competition_name||'Esporte')+'</span><small>'+esc(eventDate(x?.starts_at))+'</small></div><div class="ct520-detail-match"><div>'+(x?.home_logo?'<img src="'+esc(x.home_logo)+'" alt="">':'')+'<b>'+esc(x?.home_name||'')+'</b></div><strong>'+score+'</strong><div>'+(x?.away_logo?'<img src="'+esc(x.away_logo)+'" alt="">':'')+'<b>'+esc(x?.away_name||'')+'</b></div></div><button type="button" class="chip ct520-detail-watch '+(watched?'on':'')+'" data-ct520-detail-watch="'+Number(x?.id||0)+'" data-watched="'+(watched?'1':'0')+'">'+(watched?'↶ Desmarcar assistido':'✓ Marcar como assistido')+'</button></article>'
}
function renderDetail(){
 let back=q('[data-ct520-sports-detail]');if(!detail){back?.remove();document.documentElement.classList.remove('ct520-detail-open');return false}
 if(!back){back=document.createElement('div');back.className='ct520-detail-backdrop';back.dataset.ct520SportsDetail='1';document.body.appendChild(back)}
 const e=detail.entity||{},title=detail.kind==='team'?'Últimos 5 jogos':'Última rodada',sub=detail.kind==='team'?String(e.name||'Time'):(String(e.name||'Liga')+(detail.round?' · '+detail.round:'')),events=rows(detail.events);
 back.innerHTML='<section class="ct520-detail-dialog" role="dialog" aria-modal="true"><header><div>'+(e.logo_url?'<img src="'+esc(e.logo_url)+'" alt="">':'')+'<div><small>'+esc(title)+'</small><h2>'+esc(sub)+'</h2></div></div><button type="button" class="btn" data-ct520-detail-close>✕ Fechar</button></header><div class="ct520-detail-list">'+(detail.loading?'<div class="loader">Carregando jogos…</div>':events.length?events.map(detailEvent).join(''):'<div class="empty">Nenhum jogo encontrado.</div>')+'</div></section>';document.documentElement.classList.add('ct520-detail-open');return true
}
async function openDetail(kind,id,label=''){
 const token=++detailToken;detail={kind,entity:{id,name:label},events:[],loading:true};renderDetail();
 try{
  const raw=await core()?.rpc?.(kind==='team'?'cinetracker_sports_team_recent_v520':'cinetracker_sports_league_latest_round_v520',kind==='team'?{p_team_id:Number(id),p_limit:5}:{p_competition_id:Number(id)});
  if(token!==detailToken||!detail)return false;detail={kind,...(raw||{}),loading:false};renderDetail();return true
 }catch(e){if(token===detailToken&&detail){detail.loading=false;detail.events=[];renderDetail();const box=q('.ct520-detail-list');if(box)box.innerHTML='<div class="error">Não foi possível carregar os jogos.</div>';document.documentElement.dataset.ct520SportsDetailError=String(e?.message||e)}return false}
}
function closeDetail(){detail=null;detailToken++;renderDetail();return true}
async function toggleDetail(btn){
 if(!detail||!btn)return false;const id=Number(btn.dataset.ct520DetailWatch||0);if(!id||watchLocks.has(id))return false;const ev=rows(detail.events).find(x=>Number(x.id)===id);if(!ev)return false;
 const before=!!ev.is_watched,next=!before,at=new Date().toISOString();watchLocks.add(id);ev.is_watched=next;renderDetail();
 try{
  const out=await core()?.rpc?.('cinetracker_sport_mark_watched_v1',{p_event_id:id,p_watched:next,p_duration_minutes:null,p_watched_at:at});
  window.dispatchEvent(new CustomEvent('cinetracker:sports-watched-changed',{detail:{source:'sports-detail-r520',event_id:id,watched:next,stats:out?.sports_stats||null}}));
  document.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'sports-detail-r520',type:'sports',event_id:id,watched:next}}));return true
 }catch(e){ev.is_watched=before;renderDetail();document.documentElement.dataset.ct520SportsWatchError=String(e?.message||e);return false}
 finally{watchLocks.delete(id)}
}
window.addEventListener('pointerdown',e=>{const tab=e.target?.closest?.('[data-home-tab]');if(tab&&route()==='home'){const wanted=String(tab.dataset.homeTab||'series')==='movies'?'movies':'series';applyHomeIntent(wanted)}},true);
document.addEventListener('click',e=>{
 const close=e.target?.closest?.('[data-ct520-detail-close]');if(close||e.target?.matches?.('[data-ct520-sports-detail]')){e.preventDefault();e.stopImmediatePropagation();closeDetail();return}
 const watch=e.target?.closest?.('[data-ct520-detail-watch]');if(watch){e.preventDefault();e.stopImmediatePropagation();void toggleDetail(watch);return}
 if(route()!=='sports')return;
 const card=e.target?.closest?.('.ct255-sport-card');if(!card)return;
 const side=e.target?.closest?.('.ct255-match>div');if(side&&(e.target?.matches?.('img,strong')||e.target?.closest?.('img,strong'))){const sides=qa(':scope > div',q('.ct255-match',card)),idx=sides.indexOf(side),name=q('strong',side)?.textContent||'',id=entityIdFor(card,name,idx===0?1:2);if(id){e.preventDefault();e.stopImmediatePropagation();void openDetail('team',id,name);return}}
 const league=e.target?.closest?.('.ct255-sport-top span');if(league){const name=String(league.textContent||'').replace(/^S+s+/,'').trim(),id=entityIdFor(card,name,0);if(id){e.preventDefault();e.stopImmediatePropagation();void openDetail('league',id,name);return}}
},true);
window.addEventListener('resize',()=>requestAnimationFrame(pinHome),{passive:true});
window.addEventListener('popstate',()=>requestAnimationFrame(pinHome));
document.addEventListener('click',e=>{if(e.target?.closest?.('[data-nav="home"]'))requestAnimationFrame(()=>requestAnimationFrame(pinHome))},true);
requestAnimationFrame(()=>requestAnimationFrame(pinHome));
window.__ctR520HomeSportsMarker='sticky-search+tabs+deterministic-movies+team-last5+league-latest-round';
window.__ctR520HomeSports={version:'0.3.47',pinHome,applyHomeIntent,openDetail,closeDetail,get detail(){return detail}};
})();