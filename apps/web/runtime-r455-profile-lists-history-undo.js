/* CineTracker Web 1.0.245 r455 — Profile 13 cards + half-card more button and daily-history undo. */
(()=>{'use strict';
if(window.__ctR455?.version==='1.0.245')return;
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const routeNow=()=>{try{return String(typeof route==='function'?route():'')}catch{return''}};
const PROFILE_LIMIT=13;
const wantedPanel=title=>{const t=norm(title);return t==='series'||t==='filmes'||t==='series favoritas'||t==='filmes favoritos'||t==='atores'||t==='atores favoritos'};
function panelTitle(panel){return q('.panel-head h2,.panel-head h3,:scope>h2,:scope>h3,h2,h3',panel)?.textContent||''}
function cardRow(panel){
 const rs=qa(':scope>.row,:scope>.ct424-profile-list,:scope>[class*="rail"],:scope>[class*="row"]',panel);
 return rs.find(r=>qa(':scope>*',r).some(el=>el.matches?.('.card,[data-media-id],[data-person-id],article')))||rs[0]||null;
}
function cardsIn(row){
 return qa(':scope>*',row).filter(el=>!el.matches?.('[data-ct455-more],[data-ct424-more]')&&(el.matches?.('.card,[data-media-id],[data-person-id],article')||q('.poster,img,[class*="poster"],[class*="avatar"]',el)));
}
function nativeMore(panel){return qa('button',panel).find(b=>!b.dataset.ct455More&&norm(b.textContent).includes('ver mais'))||null}
function applyPanel455(panel){
 if(!panel||!wantedPanel(panelTitle(panel)))return false;
 const row=cardRow(panel);if(!row)return false;
 qa('[data-ct455-more]',row).forEach(x=>x.remove());
 qa('[data-ct424-more]',panel).forEach(x=>x.remove());
 const cards=cardsIn(row);if(!cards.length)return false;
 cards.forEach((card,i)=>{card.hidden=i>=PROFILE_LIMIT;card.style.display=i>=PROFILE_LIMIT?'none':''});
 if(cards.length<=PROFILE_LIMIT){panel.dataset.ct455ProfileLimit='all';return true}
 const trigger=nativeMore(panel);
 const more=document.createElement('button');
 more.type='button';more.dataset.ct455More='1';more.className='ct455-profile-more';more.setAttribute('aria-label','Ver mais '+panelTitle(panel));
 more.innerHTML='<span class="ct455-profile-more-icon" aria-hidden="true">›</span><span>Ver mais</span>';
 more.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();if(trigger&&trigger.isConnected){trigger.click();return}cards.forEach(card=>{card.hidden=false;card.style.display=''});more.remove()});
 const first=cards[0],height=Math.round(first.getBoundingClientRect?.().height||0);if(height>80)more.style.height=height+'px';
 row.appendChild(more);panel.dataset.ct455ProfileLimit='13+more';return true;
}
let profileSeq455=0;
function applyProfile455(){
 if(routeNow()!=='profile')return false;const root=q('[data-profile]');if(!root)return false;
 let changed=false;for(const panel of qa('section.panel,.panel',root)){if(applyPanel455(panel))changed=true}
 root.dataset.ct455ProfileLists='13+half-more';return changed;
}
function scheduleProfile455(){const seq=++profileSeq455;for(const ms of[0,60,180,420,900,1800,3200,5400,6500])setTimeout(()=>{if(seq===profileSeq455&&routeNow()==='profile')applyProfile455()},ms)}
const baseProfileLoad455=window.__ctR424?.loadProfile?.bind(window.__ctR424)||null;
if(baseProfileLoad455)window.__ctR424.loadProfile=async function(){const out=await baseProfileLoad455(...arguments);if(routeNow()==='profile')applyProfile455();return out};

const historyOwner=()=>window.__ctR426;
async function openDay455(day){
 const owner=historyOwner();if(owner?.openDay)return owner.openDay(day);
 return false;
}
function bindHistory455(){
 const owner=historyOwner();
 if(owner?.openDay){try{ct171OpenActivityDay=openDay455}catch{};window.ct171OpenActivityDay=openDay455;document.documentElement.dataset.ct455HistoryUndo='r426'}
}
window.addEventListener('click',e=>{const t=e.target;if(!t?.closest)return;
 if(t.closest('[data-nav="profile"]'))scheduleProfile455();
 const undo=t.closest('[data-ct426-undo],[data-ct426-undo-sport]');
 if(undo&&historyOwner()?.undoHistory){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();void historyOwner().undoHistory(undo)}
},true);
window.addEventListener('popstate',()=>{if(routeNow()==='profile')scheduleProfile455()});
window.addEventListener('cinetracker:data-changed',()=>{if(routeNow()==='profile')scheduleProfile455()});
const style=document.createElement('style');style.id='ct455-style';style.textContent=`
[data-profile] .ct455-profile-more{box-sizing:border-box!important;display:flex!important;flex:0 0 75px!important;width:75px!important;min-width:75px!important;max-width:75px!important;min-height:180px;align-self:stretch!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:10px!important;padding:10px 6px!important;border:1px solid rgba(86,190,255,.42)!important;border-radius:12px!important;background:linear-gradient(180deg,rgba(16,43,58,.92),rgba(8,25,35,.96))!important;color:inherit!important;cursor:pointer!important;text-align:center!important;white-space:normal!important}
[data-profile] .ct455-profile-more:hover{border-color:rgba(86,190,255,.8)!important;background:linear-gradient(180deg,rgba(20,57,76,.98),rgba(10,31,43,.98))!important}
[data-profile] .ct455-profile-more-icon{font-size:32px!important;line-height:1!important}
[data-profile] .ct455-profile-more span:last-child{font-size:11px!important;line-height:1.15!important;writing-mode:vertical-rl;transform:rotate(180deg)}
.ct426-history-actions{display:flex!important;gap:6px!important;margin-top:7px!important}.ct426-undo{display:inline-flex!important;min-height:28px!important;padding:5px 9px!important;font-size:11px!important;pointer-events:auto!important}
`;
if(!q('#ct455-style'))document.head.appendChild(style);
window.__ctR455={version:'1.0.245',scope:'profile-13-cards-half-more+daily-history-undo',profileLimit:PROFILE_LIMIT,applyProfile:applyProfile455,openDay:openDay455};
queueMicrotask(()=>{bindHistory455();if(routeNow()==='profile')scheduleProfile455()});
})();