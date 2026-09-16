/* CineTracker Web 1.0.90 r299 — clickable sports history + simple stadium attendance. WEB ONLY. */
(()=>{
'use strict';
if(window.__ctR299)return;
window.__ctR299='profile-sports-history-clickable+stadium-presence-only';
window.__ctR299Profile='eventos-assistidos+jogos-no-estadio-clickable-history';
window.__ctR299Sports='tv-or-stadium-no-stadium-name';
window.__ctR299Android='preserved-1.0.20-10062';

const q=(s,r=document)=>r?.querySelector?.(s)||null,qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmtDate=v=>{if(!v)return'';const d=new Date(v);if(Number.isNaN(d.getTime()))return'';try{return new Intl.DateTimeFormat('pt-BR',{dateStyle:'short',timeStyle:'short'}).format(d)}catch{return d.toLocaleString('pt-BR')}};
function sportsPanel(root=document){const p=q('[data-profile]',root)||q('[data-profile]')||root;const h=qa('h1,h2,h3,h4,.panel-title,.section-title',p).find(x=>norm(x.textContent).includes('esportes assistidos'));return h?.closest?.('.panel,section,article')||h?.parentElement||null}
function statByLabel(panel,label){const wanted=norm(label);const labels=qa('small,label,[data-stat-label],.stat-label',panel);for(const x of labels){if(norm(x.textContent).includes(wanted)){const card=x.closest?.('.stat,[data-stat],button,a,.profile-stat');if(card)return card}}return qa('.stat,[data-stat],.profile-stat,button',panel).find(x=>norm(x.textContent).includes(wanted))||null}
function markClickable(card,kind,label){if(!card)return false;card.dataset.ct299History=kind;card.classList.add('ct299-clickable-stat');if(card.tagName!=='BUTTON'&&card.tagName!=='A'){card.setAttribute('role','button');card.setAttribute('tabindex','0')}card.setAttribute('aria-label',`Ver ${label}`);card.setAttribute('title',`Ver ${label}`);return true}
function scrubStadiumNames(){for(const b of qa('[data-ct298-stadium-badge]')){b.title='No Estádio';if(!norm(b.textContent).includes('no estadio'))b.textContent='🏟️ No Estádio'}}
function decorateProfile299(){const panel=sportsPanel();if(!panel)return false;const a=markClickable(statByLabel(panel,'eventos assistidos'),'all','eventos assistidos');const s=markClickable(statByLabel(panel,'jogos no estadio'),'stadium','jogos no estádio');scrubStadiumNames();return a||s}

function closeHistory(){q('[data-ct299-history-backdrop]')?.remove()}
function historyShell(kind){closeHistory();const stadium=kind==='stadium',back=document.createElement('div');back.className='ct299-history-backdrop';back.dataset.ct299HistoryBackdrop='1';back.innerHTML=`<section class="ct299-history-modal" role="dialog" aria-modal="true" aria-labelledby="ct299-history-title"><header><div><small>Perfil · Esportes</small><h2 id="ct299-history-title">${stadium?'Jogos no Estádio':'Eventos assistidos'}</h2><p>${stadium?'Eventos que você marcou como vistos presencialmente.':'Seu histórico de eventos esportivos assistidos.'}</p></div><button type="button" data-ct299-history-close aria-label="Fechar">×</button></header><div class="ct299-history-list" data-ct299-history-list><div class="ct299-history-loading">Carregando histórico…</div></div></section>`;document.body.appendChild(back);q('[data-ct299-history-close]',back)?.focus();return back}
function eventTitle(row){const direct=String(row?.title||'').trim();if(direct)return direct;const teams=[row?.home_name,row?.away_name].map(v=>String(v||'').trim()).filter(Boolean);return teams.length?teams.join(' × '):'Evento esportivo'}
function eventMeta(row){const parts=[];if(row?.competition_name)parts.push(String(row.competition_name));const date=fmtDate(row?.starts_at||row?.sport_watched_at);if(date)parts.push(date);return parts.join(' · ')}
function renderHistory(rows,kind,back=q('[data-ct299-history-backdrop]')){const list=q('[data-ct299-history-list]',back);if(!list)return false;const stadium=kind==='stadium',items=(Array.isArray(rows)?rows:[]).filter(x=>x&&x.is_watched!==false&&(!stadium||x.attended_in_person===true));if(!items.length){list.innerHTML=`<div class="ct299-history-empty">${stadium?'Nenhum jogo marcado como assistido no estádio.':'Nenhum evento assistido no histórico.'}</div>`;return true}list.innerHTML=items.map(row=>`<article class="ct299-history-row"><div><b>${esc(eventTitle(row))}</b>${eventMeta(row)?`<span>${esc(eventMeta(row))}</span>`:''}</div>${row.attended_in_person?'<small>🏟️ Presencial</small>':''}</article>`).join('');return true}
async function openHistory(kind){const back=historyShell(kind);try{const rows=await rpc('cinetracker_sports_watch_history_v296',{});if(!back.isConnected)return false;renderHistory(rows,kind,back);return true}catch(e){const list=q('[data-ct299-history-list]',back);if(list)list.innerHTML=`<div class="ct299-history-empty">Não foi possível carregar o histórico agora.<br><small>${esc(e?.message||'Tente novamente.')}</small></div>`;return false}}

function fallbackCardData(btn){const card=btn?.closest?.('.ct255-sport-card');return{card,provider:String(btn?.dataset?.provider||'unknown'),id:String(btn?.dataset?.ct255Watch||''),title:(q('h3',card)?.textContent||qa('.ct255-match strong',card).map(x=>x.textContent).filter(Boolean).join(' × ')||'Evento').trim(),venue:(q('.ct255-sport-card>small',card)?.textContent||'').split(' · ').slice(1).join(' · ').trim()||null}}
function cardData299(btn){try{return window.__ctR298Test?.cardData?.(btn)||fallbackCardData(btn)}catch{return fallbackCardData(btn)}}
function closeSportPop(){qa('.ct299-watch-popover').forEach(x=>x.remove())}
function openSportPop(btn){closeSportPop();qa('.ct298-watch-popover').forEach(x=>x.remove());const {card}=cardData299(btn);if(!card)return false;const box=document.createElement('div');box.className='ct299-watch-popover';box.innerHTML='<button type="button" data-ct299-choice="screen">📺 Assistido na TV / Tela</button><button type="button" data-ct299-choice="stadium">🏟️ Fui ao Estádio</button><button type="button" class="ct299-pop-close" data-ct299-pop-close aria-label="Fechar">×</button>';card.appendChild(box);return true}
function addGenericStadiumBadge(card){if(!card)return;let b=q('[data-ct298-stadium-badge]',card);if(!b){b=document.createElement('span');b.className='ct298-stadium-badge';b.dataset.ct298StadiumBadge='1';card.appendChild(b)}b.textContent='🏟️ No Estádio';b.title='No Estádio'}
async function saveSport299(btn,inPerson){const d=cardData299(btn);if(!d.id)throw new Error('Evento esportivo sem identificador');btn.disabled=true;try{await rpc('cinetracker_sports_watch_set_v296',{p_provider:d.provider,p_provider_event_id:d.id,p_sport_slug:null,p_competition_name:null,p_title:d.title,p_starts_at:null,p_attended_in_person:!!inPerson,p_stadium_name:null,p_watched:true,p_metadata:{venue:d.venue}});btn.dataset.watched='1';btn.classList.add('on');btn.textContent='↶ Desmarcar assistido';if(inPerson)addGenericStadiumBadge(d.card);document.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'r299-stadium-simple'}}));if(typeof render==='function')await render();return true}finally{btn.disabled=false;setTimeout(scrubStadiumNames,50)}}

/* This listener is intentionally registered before r298 in the final bundle. */
window.addEventListener('click',e=>{
 const stat=e.target?.closest?.('[data-ct299-history]');if(stat){e.preventDefault();e.stopImmediatePropagation();void openHistory(stat.dataset.ct299History==='stadium'?'stadium':'all');return}
 const choice=e.target?.closest?.('[data-ct299-choice]');if(choice){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();const box=choice.closest('.ct299-watch-popover'),card=box?.closest('.ct255-sport-card'),btn=q('[data-ct255-watch]',card),stadium=choice.dataset.ct299Choice==='stadium';closeSportPop();if(btn)void saveSport299(btn,stadium).catch(err=>{try{toast(err?.message||err)}catch{}});return}
 if(e.target?.closest?.('[data-ct299-pop-close]')){e.preventDefault();e.stopImmediatePropagation();closeSportPop();return}
 if(e.target?.closest?.('[data-ct299-history-close]')){e.preventDefault();e.stopImmediatePropagation();closeHistory();return}
 if(e.target?.matches?.('[data-ct299-history-backdrop]')){e.preventDefault();closeHistory();return}
 const btn=e.target?.closest?.('[data-ct255-watch]');if(btn&&btn.dataset.watched!=='1'){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();openSportPop(btn)}
},true);
window.addEventListener('keydown',e=>{const stat=e.target?.closest?.('[data-ct299-history]');if(stat&&(e.key==='Enter'||e.key===' ')){e.preventDefault();void openHistory(stat.dataset.ct299History==='stadium'?'stadium':'all');return}if(e.key==='Escape'){closeHistory();closeSportPop()}},true);

try{if(typeof renderProfile==='function'){const base=renderProfile;renderProfile=async function(){const out=await base.apply(this,arguments);queueMicrotask(decorateProfile299);for(const ms of[160,420,900])setTimeout(decorateProfile299,ms);return out}}}catch{}
function reconcile299(){for(const ms of[0,180,500,1100,2200])setTimeout(()=>{decorateProfile299();scrubStadiumNames()},ms)}
document.addEventListener('cinetracker:data-changed',reconcile299);window.addEventListener('popstate',reconcile299);for(const ms of[0,350,1200])setTimeout(reconcile299,ms);

window.__ctR299Test={sportsPanel,statByLabel,decorateProfile299,renderHistory,eventTitle,eventMeta,openSportPop,cardData299,scrubStadiumNames};
})();
