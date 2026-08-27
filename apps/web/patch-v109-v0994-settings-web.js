(() => {
'use strict';
if (window.__ct0994SettingsWebLoaded) return;
window.__ct0994SettingsWebLoaded = true;
window.__ct0994SettingsWeb = 'v109-browser-settings-complete';

const $109=(s,r=document)=>r.querySelector(s);
const $$109=(s,r=document)=>[...r.querySelectorAll(s)];

const css=document.createElement('style');
css.id='ct0994-settings-v109-style';
css.textContent=`
.ct109-settings-content{min-width:0!important}
.ct91-settings.ct109-settings{display:grid!important;gap:16px!important;width:100%!important;max-width:none!important;min-width:0!important;margin:0!important}
.ct109-settings .ct91-setting{min-width:0!important;border:1px solid #244b62!important;background:linear-gradient(145deg,rgba(7,22,31,.96),rgba(8,17,24,.94))!important;border-radius:16px!important;padding:18px!important;box-shadow:0 14px 42px #0005,inset 0 1px 0 #ffffff09!important}
.ct109-card-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid #1c3d50}
.ct109-card-title{font-size:16px;font-weight:850;color:#f2f9ff;line-height:1.2}
.ct109-card-sub{margin-top:4px;color:#8fa8b8;font-size:11px;line-height:1.45}
.ct109-chip{flex:0 0 auto;border:1px solid #285a73;background:#09202d;color:#78d9ff;border-radius:999px;padding:5px 9px;font-size:9px;font-weight:800;letter-spacing:.02em}
.ct109-settings .ct91-grid2{gap:12px!important}
.ct109-settings label{min-width:0!important}
.ct109-settings input,.ct109-settings select{min-width:0!important;box-sizing:border-box!important}
.ct109-settings input:focus,.ct109-settings select:focus{outline:none!important;border-color:#4dbce9!important;box-shadow:0 0 0 3px #39bfff1b!important}
.ct109-settings .ct90-setting-actions{display:flex;gap:9px;flex-wrap:wrap;align-items:center;margin-top:12px}
.ct109-settings .ct91-btn,.ct109-settings .ct10-btn{min-height:38px;border-radius:10px!important}
.ct109-settings #ct91-save{background:#0d3041!important;border-color:#397b9a!important;color:#eafaff!important;font-weight:800}
.ct109-maintenance-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:12px}
.ct109-maintenance-item{border:1px solid #1e4155;background:#081720;border-radius:12px;padding:12px;min-width:0}
.ct109-maintenance-item b{display:block;font-size:12px;margin-bottom:4px}.ct109-maintenance-item span{display:block;color:#8da4b3;font-size:10px;line-height:1.45;margin-bottom:10px}
.ct109-data-intro{display:flex;align-items:flex-start;gap:10px;border:1px solid #245a73;background:#071b26;border-radius:12px;padding:11px 12px;margin-bottom:12px;color:#9db6c5;font-size:10px;line-height:1.45}
.ct109-data-intro strong{color:#dff6ff}
.ct109-data-columns{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;min-width:0}
.ct109-data-box{border:1px solid #21485e;background:#081720;border-radius:13px;padding:13px;min-width:0}
.ct109-data-box h3{font-size:13px;margin:0 0 4px;color:#f0f8ff}.ct109-data-box p{font-size:10px;color:#8da4b3;line-height:1.45;margin:0 0 10px}
.ct109-data-box .ct90-setting-actions{margin:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(155px,1fr));gap:8px}
.ct109-import-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-top:14px;padding-top:14px;margin-bottom:10px;border-top:1px solid #21465d}
.ct109-import-head h3{font-size:13px;margin:0 0 4px}.ct109-import-head p{font-size:10px;color:#8da4b3;margin:0;line-height:1.45}
.ct109-settings #ct10-import-panel{min-width:0!important;max-width:100%!important;margin:0!important;padding:12px!important;border:1px solid #1e4155!important;border-radius:13px!important;background:#081720!important;box-shadow:none!important}
.ct109-settings #ct10-import-panel>h2:first-child,.ct109-settings #ct10-import-panel>p.ct10-muted:first-of-type{display:none!important}
.ct109-settings .ct11-files{min-width:0!important}
.ct109-settings .ct11-file{min-width:0!important}
.ct109-settings input[type=file]{max-width:100%!important;min-width:0!important;overflow:hidden}
.ct109-settings .ct10-safe{border-radius:10px!important}
.ct109-settings .ct11-package{min-width:0!important}
.ct109-settings .ct11-package input{width:100%!important;box-sizing:border-box!important}
.ct109-settings .ct10-actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.ct109-settings .ct11-sync{margin-left:auto}
.ct109-settings-version{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;color:#708998;font-size:9px;padding:2px 4px}
.ct109-settings-version b{color:#9eb8c8}
@media (min-width:1100px){
 .ct91-settings.ct109-settings{grid-template-columns:minmax(0,1fr) minmax(340px,.58fr)!important;align-items:start}
 .ct109-account{grid-column:1/2}.ct109-maintenance{grid-column:2/3}.ct109-data-management{grid-column:1/-1}
}
@media (max-width:850px){
 .ct109-settings-content{padding:16px 12px 42px!important;overflow-x:hidden!important}
 .ct91-settings.ct109-settings{gap:12px!important}
 .ct109-settings .ct91-setting{padding:13px!important;border-radius:13px!important}
 .ct109-card-head{margin-bottom:11px;padding-bottom:10px}.ct109-card-title{font-size:14px}.ct109-chip{display:none}
 .ct109-settings .ct91-grid2{grid-template-columns:1fr!important}
 .ct109-maintenance-grid,.ct109-data-columns{grid-template-columns:1fr!important}
 .ct109-data-box .ct90-setting-actions{grid-template-columns:1fr!important}
 .ct109-settings .ct90-setting-actions{display:grid!important;grid-template-columns:1fr!important;width:100%}
 .ct109-settings .ct91-btn,.ct109-settings .ct10-btn{width:100%!important;max-width:100%!important}
 .ct109-settings .ct11-files{grid-template-columns:1fr!important}
 .ct109-settings .ct10-actions{display:grid!important;grid-template-columns:1fr!important;width:100%}
 .ct109-settings .ct11-sync{margin-left:0!important}
}
`;
document.getElementById(css.id)?.remove();document.head.appendChild(css);

function currentSettings109(){
  let v='';try{v=String(typeof view!=='undefined'?view:(window.view||''))}catch{v=String(window.view||'')}
  return ['settings','ct91-settings','ct92-settings'].includes(v)||Boolean($109('.ct91-settings'));
}
function head109(card,title,sub,chip){
  let h=$109(':scope > .ct109-card-head',card);
  if(!h){h=document.createElement('div');h.className='ct109-card-head';card.insertBefore(h,card.firstChild)}
  h.innerHTML=`<div><div class="ct109-card-title">${title}</div><div class="ct109-card-sub">${sub}</div></div>${chip?`<span class="ct109-chip">${chip}</span>`:''}`;
  const legacy=[...card.children].find(x=>x.tagName==='B');if(legacy)legacy.style.display='none';
  const muted=[...card.children].find(x=>x.classList?.contains('ct91-muted'));if(muted)muted.style.display='none';
}
function account109(card){
  card.classList.add('ct109-account');
  head109(card,'Conta e preferências','Dados da sua conta e preferências usadas pela versão Web.','SINCRONIZADO');
  const email=$109('#ct91-email',card),phone=$109('#ct91-phone',card),country=$109('#ct91-country',card),lang=$109('#ct91-lang',card),notify=$109('#ct91-notify',card),save=$109('#ct91-save',card);
  if(email){email.autocomplete='email';email.spellcheck=false}
  if(phone){phone.type='tel';phone.inputMode='tel';phone.autocomplete='tel'}
  if(country)country.setAttribute('aria-label','País');if(lang)lang.setAttribute('aria-label','Idioma');if(notify)notify.setAttribute('aria-label','Ativar notificações');
  if(save)save.textContent='Salvar conta e preferências';
}
function maintenance109(card){
  card.classList.add('ct109-maintenance');
  head109(card,'Manutenção e sincronização','Ferramentas seguras para corrigir cache e atualizar informações de mídia.','WEB');
  const clear=$109('#ct91-clear',card),refresh=$109('#ct91-refresh',card),oldActions=$109(':scope > .ct90-setting-actions',card);
  let grid=$109(':scope > .ct109-maintenance-grid',card);if(!grid){grid=document.createElement('div');grid.className='ct109-maintenance-grid';card.appendChild(grid)}
  const ensure=(cls,title,desc,btn)=>{let box=$109(`.${cls}`,grid);if(!box){box=document.createElement('div');box.className=`ct109-maintenance-item ${cls}`;grid.appendChild(box)}box.innerHTML=`<b>${title}</b><span>${desc}</span>`;if(btn)box.appendChild(btn)};
  ensure('ct109-cache','Cache do navegador','Remove somente arquivos temporários da Web. Histórico, listas e progresso permanecem no Supabase.',clear);
  ensure('ct109-meta','Metadados TMDB','Solicita atualização de pôsteres, runtimes e demais metadados disponíveis.',refresh);
  if(oldActions&&!oldActions.children.length)oldActions.remove();
}
function data109(card){
  card.classList.add('ct109-data-management','ct106-data-management');
  head109(card,'Gerenciamento de Dados','Backup, restauração e importação reunidos em uma única área.','BACKUP + IMPORTAÇÃO');
  let intro=$109(':scope > .ct109-data-intro',card);if(!intro){intro=document.createElement('div');intro.className='ct109-data-intro';intro.innerHTML='<span>↕</span><div><strong>Seus dados principais ficam no Supabase.</strong><br>Exportações criam uma cópia. Restaurações só alteram dados depois da prévia e confirmação.</div>';const h=$109(':scope > .ct109-card-head',card);h.insertAdjacentElement('afterend',intro)}
  let columns=$109(':scope > .ct109-data-columns',card);if(!columns){columns=document.createElement('div');columns.className='ct109-data-columns';intro.insertAdjacentElement('afterend',columns)}
  let exp=$109('.ct109-export',columns);if(!exp){exp=document.createElement('section');exp.className='ct109-data-box ct109-export';exp.innerHTML='<h3>Exportar dados</h3><p>Baixe uma cópia da conta para armazenamento ou transferência.</p><div class="ct90-setting-actions"></div>';columns.appendChild(exp)}
  let res=$109('.ct109-restore',columns);if(!res){res=document.createElement('section');res.className='ct109-data-box ct109-restore';res.innerHTML='<h3>Restaurar backup</h3><p>JSON ou ZIP passam pela prévia antes de qualquer restauração.</p><div class="ct90-setting-actions"></div>';columns.appendChild(res)}
  const expActions=$109('.ct90-setting-actions',exp),resActions=$109('.ct90-setting-actions',res);
  ['ct91-exp-json','ct91-exp-zip','ct106-exp-csv'].forEach(id=>{const b=$109(`#${id}`,card);if(b&&b.parentElement!==expActions)expActions.appendChild(b)});
  ['ct91-imp-json','ct91-imp-zip'].forEach(id=>{const b=$109(`#${id}`,card);if(b&&b.parentElement!==resActions)resActions.appendChild(b)});
  const loose=$109(':scope > .ct90-setting-actions',card);if(loose&&!loose.children.length)loose.remove();
  const importPanel=$109('#ct10-import-panel',card)||$109('#ct10-import-panel');
  let importHead=$109(':scope > .ct109-import-head',card);if(!importHead){importHead=document.createElement('div');importHead.className='ct109-import-head';importHead.innerHTML='<div><h3>Importar dados externos</h3><p>Bingers: library.csv + watches.csv, ou pacote ZIP/JSON. A análise abre uma prévia antes da sincronização.</p></div>';card.appendChild(importHead)}
  if(importPanel&&importPanel.parentElement!==card)card.appendChild(importPanel);
  if(importPanel&&importHead.nextElementSibling!==importPanel)importHead.insertAdjacentElement('afterend',importPanel);
  const oldGrid=$109(':scope > .ct106-data-grid',card);if(oldGrid){if(importPanel&&oldGrid.contains(importPanel))importHead.insertAdjacentElement('afterend',importPanel);oldGrid.remove()}
  const file=$109('#ct91-file',card);if(file&&!file.parentElement?.classList?.contains('ct109-hidden-file')){let holder=$109(':scope > .ct109-hidden-file',card);if(!holder){holder=document.createElement('div');holder.className='ct109-hidden-file';holder.style.display='none';card.appendChild(holder)}holder.appendChild(file)}
}
function enhance109(){
  if(!currentSettings109())return false;
  const settings=$109('.ct91-settings');if(!settings)return false;
  settings.classList.add('ct109-settings');settings.closest('.content')?.classList.add('ct109-settings-content');
  const cards=$$109(':scope > .ct91-setting',settings);
  const account=cards.find(c=>$109('#ct91-email',c));
  const maintenance=cards.find(c=>$109('#ct91-clear',c));
  const data=cards.find(c=>$109('#ct91-exp-json',c)||c.classList.contains('ct106-data-management'));
  if(account)account109(account);if(maintenance)maintenance109(maintenance);if(data)data109(data);
  let foot=$109(':scope > .ct109-settings-version',settings);if(!foot){foot=document.createElement('div');foot.className='ct109-settings-version';foot.innerHTML='<span>Configurações da <b>Web/PWA</b></span><span>CineTracker <b>0.99.4</b></span>';settings.appendChild(foot)}
  const menu=$109('#ct991-import-menu');if(menu)menu.style.display='none';
  return Boolean(account&&maintenance&&data);
}
function schedule109(){for(const d of [30,120,320,700,1200,1900])setTimeout(enhance109,d)}
const rawNav109=window.__ct0994Navigate;
if(typeof rawNav109==='function'&&!rawNav109.__ct109Wrapped){const fn=async function(target){const r=await rawNav109(target);if(String(target)==='settings')schedule109();return r};fn.__ct109Wrapped=true;window.__ct0994Navigate=fn;window.ct0994Navigate=fn;window.ct0992Navigate=fn;window.ct991Navigate=fn;window.ct98Navigate=fn}
document.addEventListener('click',e=>{if(e.target?.closest?.('[data-view="settings"]'))schedule109()},true);
window.addEventListener('cinetracker:data-changed',()=>{if(currentSettings109())schedule109()});
schedule109();
})();
