/* CineTracker Web 1.0.32 r240 — Sports: Próximos, Anteriores, Favoritos, Assistidos. */
(()=>{
'use strict';
if(window.__ctR240)return;
window.__ctR240='sports-four-semantic-tabs';
window.__ctR240Sports='proximos-today-upcoming+anteriores-3-days+favorites+watched';
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const OLD=new Set(['hoje','ontem','recentes','ao vivo','calendario','favoritos','assistidos']);
const tabs=[['next','Próximos'],['previous','Anteriores'],['favorites','Favoritos'],['watched','Assistidos']];
const sources={next:['calendario','hoje'],previous:['recentes','ontem'],favorites:['favoritos'],watched:['assistidos']};
let active240='next',timer240=0,sourceBusy240=false;

function localStart(d=new Date()){return new Date(d.getFullYear(),d.getMonth(),d.getDate())}
function keyDate(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function shift(d,n){const x=localStart(d);x.setDate(x.getDate()+n);return x}
function inferYear(day,month,now){let y=now.getFullYear(),d=new Date(y,month-1,day);if(d-now>1000*60*60*24*180)d=new Date(y-1,month-1,day);else if(now-d>1000*60*60*24*180)d=new Date(y+1,month-1,day);return d.getFullYear()}
function eventDate240(card,now=new Date()){
 for(const el of [card,...qa('[datetime],[data-date],[data-start],[data-starts-at],[data-start-at],[data-kickoff],[data-event-date]',card)]){
  const vals=[el?.getAttribute?.('datetime'),el?.dataset?.date,el?.dataset?.start,el?.dataset?.startsAt,el?.dataset?.startAt,el?.dataset?.kickoff,el?.dataset?.eventDate].filter(Boolean);
  for(const raw of vals){const d=new Date(raw);if(!Number.isNaN(d.getTime()))return d}
 }
 const text=card?.textContent||'';
 let m=text.match(/(?:^|\D)(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?[^\d]{0,16}(\d{1,2}):(\d{2})(?:\D|$)/);
 if(m){let y=m[3]?Number(m[3]):inferYear(Number(m[1]),Number(m[2]),now);if(y<100)y+=2000;return new Date(y,Number(m[2])-1,Number(m[1]),Number(m[4]),Number(m[5]))}
 m=text.match(/(?:^|\D)(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?(?:\D|$)/);
 if(m){let y=m[3]?Number(m[3]):inferYear(Number(m[1]),Number(m[2]),now);if(y<100)y+=2000;return new Date(y,Number(m[2])-1,Number(m[1]),23,59,59)}
 return null;
}
function ended240(card){const t=norm(card?.textContent||'');return ['encerrado','finalizado','fim de jogo','cancelado','adiado'].some(x=>t.includes(x))||/(^|\s)final($|\s)/.test(t)||t.includes('ao vivo')}
function keep240(card,tab=active240,now=new Date()){
 if(tab==='favorites'||tab==='watched')return true;
 const d=eventDate240(card,now);if(!d)return false;
 const today=keyDate(localStart(now)),dk=keyDate(localStart(d));
 if(tab==='next')return dk===today&&d.getTime()>now.getTime()&&!ended240(card);
 if(tab==='previous')return d>=shift(now,-3)&&d<localStart(now);
 return true;
}
window.__ctR240EventDate=eventDate240;window.__ctR240KeepEvent=keep240;

function oldRail240(root){
 const candidates=qa('button,[role="tab"]',root).filter(b=>OLD.has(norm(b.textContent||'')));
 const groups=new Map();for(const b of candidates){const p=b.parentElement;if(p)groups.set(p,(groups.get(p)||0)+1)}
 return [...groups.entries()].sort((a,b)=>b[1]-a[1])[0]?.[0]||null;
}
function oldButton240(rail,names){return qa('button,[role="tab"]',rail).find(b=>names.includes(norm(b.textContent||'')))||null}
function activeOld240(rail){return norm(qa('button,[role="tab"]',rail).find(b=>b.classList.contains('active')||b.getAttribute('aria-selected')==='true')?.textContent||'')}
function newRail240(root,legacy){
 let rail=q('[data-ct240-sports-tabs]',root);if(rail)return rail;
 rail=document.createElement('div');rail.className='tabs ct240-sports-tabs';rail.setAttribute('data-ct240-sports-tabs','1');
 rail.innerHTML=tabs.map(([k,l])=>`<button type="button" class="chip ${active240===k?'active':''}" data-ct240-sports-tab="${k}">${l}</button>`).join('');
 legacy.before(rail);return rail;
}
function heading240(root){
 const grid=q('.event-grid',root);if(!grid)return;
 const panel=grid.closest('section,.panel,article')||grid.parentElement;const h=q('h1,h2,h3',panel);if(!h)return;
 const names={next:'Próximos de hoje',previous:'Anteriores · últimos 3 dias',favorites:'Jogos dos favoritos',watched:'Assistidos'};h.textContent=names[active240];
}
function filter240(root){
 const grid=q('.event-grid',root);if(!grid)return;
 const cards=[...grid.children].filter(x=>!x.matches('[data-ct240-empty]'));
 let visible=0;for(const card of cards){const show=keep240(card,active240,new Date());card.hidden=!show;card.classList.toggle('ct240-filtered-out',!show);if(show)visible++}
 q('[data-ct240-empty]',grid)?.remove();
 if(!visible&&cards.length){const e=document.createElement('div');e.className='empty ct240-empty';e.setAttribute('data-ct240-empty','1');e.textContent=active240==='next'?'Nenhum próximo jogo para hoje.':active240==='previous'?'Nenhum jogo nos últimos 3 dias.':active240==='favorites'?'Nenhum jogo dos favoritos neste período.':'Nenhum evento marcado como assistido.';grid.appendChild(e)}
 root.dataset.ct240Visible=String(visible);root.dataset.ct240Tab=active240;
 heading240(root);
}
function source240(root,legacy){
 const desired=sources[active240]||[];const current=activeOld240(legacy);if(desired.includes(current))return;
 const b=oldButton240(legacy,desired);if(!b||sourceBusy240)return;
 sourceBusy240=true;try{b.click()}finally{setTimeout(()=>{sourceBusy240=false;queue240()},0)}
}
function reconcile240(){
 const root=q('[data-sports]');if(!root)return;
 const legacy=oldRail240(root);if(!legacy)return;
 legacy.classList.add('ct240-legacy-sports-tabs');legacy.setAttribute('aria-hidden','true');
 const rail=newRail240(root,legacy);for(const b of qa('[data-ct240-sports-tab]',rail))b.classList.toggle('active',b.dataset.ct240SportsTab===active240);
 source240(root,legacy);filter240(root);
 root.dataset.ct240Sports='four-tabs';
}
function queue240(){clearTimeout(timer240);timer240=setTimeout(reconcile240,55)}
document.addEventListener('click',e=>{const b=e.target.closest?.('[data-ct240-sports-tab]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();active240=b.dataset.ct240SportsTab||'next';queue240()},true);
try{const prior=paintSports;paintSports=function(...a){const out=prior.apply(this,a);setTimeout(reconcile240,0);return out}}catch{}
try{new MutationObserver(queue240).observe(q('#app')||document.documentElement,{subtree:true,childList:true,characterData:true})}catch{}
window.addEventListener('popstate',queue240);window.addEventListener('cinetracker:data-changed',queue240);
const st=document.createElement('style');st.id='ct-r240-sports-four-tabs';st.textContent=`
[data-sports] .ct240-legacy-sports-tabs{display:none!important}
[data-sports] .ct240-sports-tabs{display:flex!important;gap:8px!important;flex-wrap:wrap!important;margin:14px 0!important}
[data-sports] .ct240-sports-tabs>.chip{display:inline-flex!important;align-items:center!important;justify-content:center!important;min-height:38px!important;padding:8px 16px!important;border-radius:10px!important}
[data-sports] .ct240-filtered-out{display:none!important}
[data-sports] .ct240-empty{grid-column:1/-1!important;padding:20px!important}
`;document.getElementById(st.id)?.remove();document.head.appendChild(st);
window.__ctR240Reconcile=reconcile240;window.__ctR240SetTab=t=>{if(tabs.some(([k])=>k===t)){active240=t;queue240()}};
queue240();
})();