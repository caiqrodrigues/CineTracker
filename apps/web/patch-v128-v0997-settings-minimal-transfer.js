(() => {
'use strict';
if(window.__ct0997SettingsMinimal128Loaded)return;
window.__ct0997SettingsMinimal128Loaded=true;
window.__ct0997SettingsMinimal128='v128-settings-minimal-import-export-only';

const $128=(s,r=document)=>r?.querySelector?.(s)||null;
const $$128=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
const norm128=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
let dialogMode128='';

const css128=document.createElement('style');
css128.id='ct0997-settings-minimal128-style';
css128.textContent=`
.ct127-data-hub{display:none!important}
.ct128-data-card{grid-column:1/-1;min-width:0;width:100%;box-sizing:border-box;border:1px solid #244b62;background:linear-gradient(145deg,rgba(7,22,31,.97),rgba(8,17,24,.95));border-radius:16px;padding:16px;box-shadow:0 14px 42px #0005,inset 0 1px 0 #ffffff09}
.ct128-data-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px}.ct128-data-head h2{margin:0;color:#f3f9ff;font-size:15px}.ct128-primary{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.ct128-main-btn{appearance:none;border:1px solid #315c73;background:#0a2230;color:#edf9ff;border-radius:12px;min-height:48px;padding:0 16px;font-size:13px;font-weight:850;cursor:pointer;transition:transform .12s ease,border-color .12s ease,background .12s ease}.ct128-main-btn:hover{border-color:#4aa4ce;background:#0d2b3b}.ct128-main-btn:active{transform:scale(.99)}
.ct128-vault{display:none!important}
.ct128-modal[hidden]{display:none!important}.ct128-modal{position:fixed;inset:0;z-index:2147482500;display:grid;place-items:center;padding:18px;background:#0009;backdrop-filter:blur(5px)}.ct128-sheet{width:min(440px,100%);max-height:min(78vh,680px);overflow:auto;box-sizing:border-box;border:1px solid #315a72;background:#07151e;border-radius:16px;box-shadow:0 24px 80px #000b;padding:14px}.ct128-sheet-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px}.ct128-sheet-head h3{margin:0;font-size:15px;color:#f2f9ff}.ct128-close{width:34px;height:34px;border:1px solid #29485f;background:#0a1d28;color:#cce8f5;border-radius:10px;font-size:18px;cursor:pointer}.ct128-format-list{display:grid;gap:8px}.ct128-format-btn{width:100%;min-height:44px;border:1px solid #294d61;background:#0a1b25;color:#eaf7ff;border-radius:11px;text-align:left;padding:0 14px;font-size:12px;font-weight:800;cursor:pointer}.ct128-format-btn:hover{border-color:#4aa4ce;background:#0d2836}.ct128-format-btn small{display:block;color:#88a7b7;font-weight:500;font-size:9px;margin-top:2px}
.ct128-csv-host{display:none;margin-top:10px}.ct128-csv-host.ct128-csv-mode{display:block}.ct128-csv-host #ct10-import-panel{margin:0!important;padding:0!important;width:100%!important;max-width:none!important;border:0!important;background:transparent!important;box-shadow:none!important}.ct128-csv-host #ct10-import-panel>h2:first-child,.ct128-csv-host #ct10-import-panel>p.ct10-muted:first-of-type,.ct128-csv-host .ct10-safe,.ct128-csv-host .ct11-package,.ct128-csv-host .ct11-sync{display:none!important}.ct128-csv-host .ct11-files{display:grid!important;grid-template-columns:1fr!important;gap:8px!important;margin:0 0 10px!important}.ct128-csv-host .ct11-file{min-width:0!important;border:1px solid #29485f!important;background:#081720!important;border-radius:11px!important;padding:11px!important}.ct128-csv-host .ct11-file>span.ct10-muted:first-of-type{display:none!important}.ct128-csv-host .ct11-file input{display:block!important;width:100%!important;max-width:100%!important;box-sizing:border-box!important;margin-top:7px!important}.ct128-csv-host .ct10-actions{display:grid!important;grid-template-columns:1fr!important;gap:8px!important}.ct128-csv-host .ct10-actions .ct10-btn{width:100%!important;margin:0!important}.ct128-csv-host .ct11-status{font-size:10px!important;margin-top:8px!important}
.ct128-settings-footer{grid-column:1/-1;text-align:center;color:#607987;font-size:8px;padding:0 4px 2px}.ct128-settings-footer b{color:#8ba7b6}
@media(max-width:850px){.ct128-data-card{padding:12px;border-radius:13px}.ct128-data-head{margin-bottom:10px}.ct128-data-head h2{font-size:14px}.ct128-primary{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.ct128-main-btn{min-height:44px;padding:0 10px;font-size:12px}.ct128-modal{align-items:end;padding:10px}.ct128-sheet{width:100%;max-height:82vh;border-radius:16px 16px 12px 12px}}
@media(max-width:390px){.ct128-primary{grid-template-columns:1fr}}
`;
document.getElementById(css128.id)?.remove();document.head.appendChild(css128);

function isSettings128(){
  const settings=$128('.ct91-settings');if(!settings)return false;
  const h=norm128($128('.content h1')?.textContent||'');
  let v='';try{v=String(typeof view!=='undefined'?view:(window.view||''))}catch{v=String(window.view||'')}
  return h.includes('configuracoes')||['settings','ct91-settings','ct92-settings'].includes(v);
}
function ensureMinimal128(settings){
  let card=$128(':scope > .ct128-data-card',settings);
  if(!card){
    card=document.createElement('section');card.className='ct128-data-card';
    card.innerHTML=`<div class="ct128-data-head"><h2>Dados</h2></div><div class="ct128-primary"><button type="button" class="ct128-main-btn" data-ct128-open="export">Exportar</button><button type="button" class="ct128-main-btn" data-ct128-open="import">Importar</button></div><div class="ct128-vault" data-ct128-vault></div>`;
    const old=$128(':scope > .ct127-data-hub',settings);if(old)settings.insertBefore(card,old);else settings.appendChild(card);
  }
  return card;
}
function ensureModal128(){
  let modal=$128('#ct128-transfer-dialog');
  if(!modal){
    modal=document.createElement('div');modal.id='ct128-transfer-dialog';modal.className='ct128-modal';modal.hidden=true;
    modal.innerHTML=`<section class="ct128-sheet" role="dialog" aria-modal="true" aria-labelledby="ct128-dialog-title"><div class="ct128-sheet-head"><h3 id="ct128-dialog-title">Selecionar formato</h3><button type="button" class="ct128-close" data-ct128-close aria-label="Fechar">×</button></div><div class="ct128-format-list" data-ct128-formats></div><div class="ct128-csv-host" data-ct128-csv-host></div></section>`;
    document.body.appendChild(modal);
    modal.addEventListener('click',e=>{if(e.target===modal||e.target.closest?.('[data-ct128-close]'))closeDialog128()});
  }
  return modal;
}
function closeDialog128(){const modal=$128('#ct128-transfer-dialog');if(modal)modal.hidden=true;dialogMode128='';}
function targetClick128(id){const target=document.getElementById(id);if(!target)return false;target.click();return true}
function showFormats128(mode){
  dialogMode128=mode;
  const modal=ensureModal128(),title=$128('#ct128-dialog-title',modal),list=$128('[data-ct128-formats]',modal),csv=$128('[data-ct128-csv-host]',modal);
  csv.classList.remove('ct128-csv-mode');
  const panel=$128('#ct10-import-panel');const vault=$128('[data-ct128-vault]');if(panel&&vault&&panel.parentElement!==vault)vault.appendChild(panel);
  title.textContent=mode==='export'?'Exportar dados':'Importar dados';
  list.innerHTML=mode==='export'
    ?`<button class="ct128-format-btn" type="button" data-ct128-target="ct91-exp-json">JSON</button><button class="ct128-format-btn" type="button" data-ct128-target="ct91-exp-zip">ZIP</button><button class="ct128-format-btn" type="button" data-ct128-target="ct106-exp-csv">CSV</button>`
    :`<button class="ct128-format-btn" type="button" data-ct128-target="ct91-imp-json">JSON</button><button class="ct128-format-btn" type="button" data-ct128-target="ct91-imp-zip">ZIP</button><button class="ct128-format-btn" type="button" data-ct128-csv>CSV<small>library.csv + watches.csv</small></button>`;
  list.onclick=e=>{
    const csvBtn=e.target.closest?.('[data-ct128-csv]');
    if(csvBtn){
      const p=$128('#ct10-import-panel');if(p)csv.appendChild(p);csv.classList.add('ct128-csv-mode');list.style.display='none';title.textContent='Importar CSV';return;
    }
    const btn=e.target.closest?.('[data-ct128-target]');if(!btn)return;
    if(targetClick128(btn.dataset.ct128Target))closeDialog128();
  };
  list.style.display='grid';modal.hidden=false;
}
function collectEngines128(card){
  const vault=$128('[data-ct128-vault]',card);if(!vault)return;
  for(const id of ['ct91-exp-json','ct91-exp-zip','ct106-exp-csv','ct91-imp-json','ct91-imp-zip','ct11-sync','ct91-file']){
    const el=document.getElementById(id);if(el&&el.parentElement!==vault)vault.appendChild(el);
  }
  const panel=$128('#ct10-import-panel');
  const csvHost=$128('[data-ct128-csv-host]');
  if(panel&&!(dialogMode128==='import'&&csvHost?.classList.contains('ct128-csv-mode'))&&panel.parentElement!==vault)vault.appendChild(panel);
}
function cleanFooter128(settings){
  $$128('.ct109-settings-version,.ct127-settings-footer,.ct128-settings-footer',settings).forEach(x=>x.remove());
  const content=settings.closest('.content');
  if(content)for(const el of $$128('small,span,div,p',content)){
    if(el.closest('.ct128-modal,.ct128-data-card'))continue;
    const t=norm128(el.textContent||'');
    if(t==='configuracoes da web pwa'||t==='cinetracker 0 99 7'||t==='cinetracker v 0 99 7')el.remove();
  }
  const footer=document.createElement('div');footer.className='ct128-settings-footer';footer.innerHTML='CineTracker <b>0.99.7</b>';settings.appendChild(footer);
}
function arrange128(){
  if(!isSettings128())return false;
  const settings=$128('.ct91-settings');if(!settings)return false;
  const card=ensureMinimal128(settings);collectEngines128(card);
  const old=$128(':scope > .ct127-data-hub',settings);if(old){old.hidden=true;old.setAttribute('aria-hidden','true')}
  for(const legacy of $$128(':scope > .ct91-setting',settings)){
    if($128('#ct91-email',legacy)||$128('#ct91-clear',legacy))continue;
    const dataLike=legacy.classList.contains('ct106-data-management')||legacy.classList.contains('ct109-data-management')||/backup|restaur|importar dados do bingers|gerenciamento de dados/i.test(legacy.textContent||'');
    if(dataLike){legacy.hidden=true;legacy.style.display='none'}
  }
  if(card.dataset.ct128Bound!=='1'){
    card.dataset.ct128Bound='1';
    card.addEventListener('click',e=>{const b=e.target.closest?.('[data-ct128-open]');if(b)showFormats128(b.dataset.ct128Open)});
  }
  cleanFooter128(settings);
  return true;
}
function schedule128(){for(const d of[0,80,180,360,700,1200,2000,3000])setTimeout(arrange128,d)}

const priorUpgrade128=window.ct11UpgradeImporter;
if(typeof priorUpgrade128==='function'&&!priorUpgrade128.__ct128Wrapped){const fn=function(){const out=priorUpgrade128.apply(this,arguments);schedule128();return out};fn.__ct128Wrapped=true;window.ct11UpgradeImporter=fn}
document.addEventListener('click',e=>{if(e.target?.closest?.('[data-view="settings"],[data-ct120-nav="settings"]'))schedule128()},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$128('#ct128-transfer-dialog')?.hidden)closeDialog128()});
window.addEventListener('cinetracker:data-changed',()=>{if(isSettings128())schedule128()});
window.addEventListener('focus',()=>{if(isSettings128())schedule128()});
schedule128();
})();
