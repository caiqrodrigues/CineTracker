(() => {
'use strict';
if(window.__ct0997SettingsUnified127Loaded)return;
window.__ct0997SettingsUnified127Loaded=true;
window.__ct0997SettingsUnified127='v127-settings-unified-data-hub-only';

const $127=(s,r=document)=>r?.querySelector?.(s)||null;
const $$127=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
const norm127=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();

const css127=document.createElement('style');
css127.id='ct0997-settings-unified127-style';
css127.textContent=`
.ct127-data-hub{grid-column:1/-1;min-width:0;width:100%;box-sizing:border-box;border:1px solid #244b62;background:linear-gradient(145deg,rgba(7,22,31,.97),rgba(8,17,24,.95));border-radius:16px;padding:18px;box-shadow:0 14px 42px #0005,inset 0 1px 0 #ffffff09}
.ct127-hub-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;padding-bottom:13px;margin-bottom:13px;border-bottom:1px solid #1c3d50}.ct127-hub-head h2{margin:0;color:#f3f9ff;font-size:16px}.ct127-hub-head p{margin:5px 0 0;color:#8fa8b8;font-size:10px;line-height:1.5}.ct127-hub-chip{flex:0 0 auto;border:1px solid #285a73;background:#09202d;color:#78d9ff;border-radius:999px;padding:5px 9px;font-size:9px;font-weight:800}
.ct127-hub-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.ct127-pane{min-width:0;border:1px solid #21485e;background:#081720;border-radius:13px;padding:14px}.ct127-pane-title{display:flex;align-items:center;gap:8px;margin-bottom:5px;color:#f0f8ff;font-size:13px;font-weight:850}.ct127-pane p{margin:0 0 12px;color:#8da4b3;font-size:10px;line-height:1.5}.ct127-actions{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px}.ct127-actions button{width:100%!important;min-height:38px!important;border-radius:10px!important;margin:0!important}
.ct127-bingers{margin-top:12px;border:1px solid #21485e;background:#081720;border-radius:13px;padding:14px;min-width:0}.ct127-bingers-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:10px}.ct127-bingers-head h3{margin:0;color:#f0f8ff;font-size:13px}.ct127-bingers-head p{margin:4px 0 0;color:#8da4b3;font-size:10px;line-height:1.45}.ct127-bingers-badge{flex:0 0 auto;border:1px solid #315a72;background:#0a1d28;color:#9edfff;border-radius:999px;padding:4px 8px;font-size:8px;font-weight:800}
.ct127-data-hub #ct10-import-panel{margin:0!important;padding:0!important;max-width:none!important;width:100%!important;border:0!important;background:transparent!important;box-shadow:none!important}.ct127-data-hub #ct10-import-panel>h2:first-child,.ct127-data-hub #ct10-import-panel>p.ct10-muted:first-of-type{display:none!important}.ct127-data-hub .ct11-files{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important;margin:10px 0!important}.ct127-data-hub .ct11-file{min-width:0!important;border:1px solid #29485f!important;background:#07131b!important;border-radius:11px!important;padding:11px!important}.ct127-data-hub .ct11-file input,.ct127-data-hub .ct11-package input{max-width:100%!important;width:100%!important;box-sizing:border-box!important}.ct127-data-hub .ct10-actions{display:grid!important;grid-template-columns:repeat(auto-fit,minmax(170px,1fr))!important;gap:8px!important}.ct127-data-hub .ct11-package{margin-top:12px!important;padding-top:12px!important}.ct127-data-hub .ct10-safe{border-radius:10px!important;margin-bottom:10px!important}.ct127-data-hub .ct11-status{margin-top:10px!important}
.ct127-retired-data{display:none!important}.ct127-settings-footer{grid-column:1/-1;display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;color:#708998;font-size:9px;padding:2px 4px}.ct127-settings-footer b{color:#9eb8c8}
@media(max-width:850px){.ct127-data-hub{padding:13px;border-radius:13px}.ct127-hub-grid{grid-template-columns:1fr}.ct127-hub-head{margin-bottom:11px;padding-bottom:10px}.ct127-hub-head h2{font-size:14px}.ct127-hub-chip,.ct127-bingers-badge{display:none}.ct127-actions{grid-template-columns:1fr}.ct127-data-hub .ct11-files,.ct127-data-hub .ct10-actions{grid-template-columns:1fr!important}.ct127-bingers{padding:12px}.ct127-data-hub input[type=file]{max-width:100%!important}}
`;
document.getElementById(css127.id)?.remove();document.head.appendChild(css127);

function isSettings127(){
  const settings=$127('.ct91-settings');if(!settings)return false;
  const h=norm127($127('.content h1')?.textContent||'');
  let v='';try{v=String(typeof view!=='undefined'?view:(window.view||''))}catch{v=String(window.view||'')}
  return h.includes('configuracoes')||['settings','ct91-settings','ct92-settings'].includes(v);
}
function buttonByText127(root,word){return $$127('button',root).find(b=>norm127(b.textContent).startsWith(word))||null}
function moveButton127(el,target,label){if(!el||!target)return;if(label)el.textContent=label;if(el.parentElement!==target)target.appendChild(el)}
function retireLegacy127(settings,hub){
  for(const card of $$127(':scope > .ct91-setting',settings)){
    if(card===hub)continue;
    if($127('#ct91-email',card)||$127('#ct91-clear',card))continue;
    const dataLike=$127('#ct91-exp-json,#ct91-exp-zip,#ct106-exp-csv,#ct91-imp-json,#ct91-imp-zip,#ct10-import-panel',card)||card.classList.contains('ct106-data-management')||card.classList.contains('ct109-data-management')||/backup|restaur|gerenciamento de dados|importar dados do bingers/i.test(card.textContent||'');
    if(!dataLike)continue;
    card.classList.remove('ct91-setting','ct106-data-management','ct109-data-management');card.classList.add('ct127-retired-data');card.hidden=true;
  }
}
function cleanSettingsVersion127(settings){
  $$127('.ct109-settings-version,.ct127-settings-footer',settings).forEach(x=>x.remove());
  const content=settings.closest('.content');
  if(content)for(const el of $$127('small,span,div,p',content)){
    if(el.closest('.ct127-data-hub'))continue;
    const t=String(el.textContent||'').trim();
    if(/^CineTracker\s+(?:v\s*)?0\.99\.[0-6](?:\b|$)/i.test(t)||/^Configurações da Web\/PWA$/i.test(t))el.remove();
  }
}
function ensureHub127(settings){
  let hub=$127(':scope > .ct127-data-hub',settings);
  if(!hub){
    hub=document.createElement('section');hub.className='ct127-data-hub';
    hub.innerHTML=`<div class="ct127-hub-head"><div><h2>Backup, importação e sincronização</h2><p>Exportação, restauração, Bingers e sincronização da nuvem reunidos em um único lugar.</p></div><span class="ct127-hub-chip">DADOS</span></div><div class="ct127-hub-grid"><section class="ct127-pane ct127-backup"><div class="ct127-pane-title">↧ Backup e exportação</div><p>Baixe uma cópia dos seus dados para guardar ou transferir.</p><div class="ct127-actions" data-ct127-export></div></section><section class="ct127-pane ct127-import"><div class="ct127-pane-title">↥ Importação e sincronização</div><p>Restaure backups ou atualize agora os dados da sua conta.</p><div class="ct127-actions" data-ct127-import></div></section></div><section class="ct127-bingers"><div class="ct127-bingers-head"><div><h3>Importar do Bingers</h3><p>Use library.csv + watches.csv, ou ZIP/JSON. A prévia continua obrigatória antes de gravar.</p></div><span class="ct127-bingers-badge">BINGERS</span></div><div data-ct127-bingers></div></section>`;
    const foot=$127(':scope > .ct109-settings-version',settings);if(foot)settings.insertBefore(hub,foot);else settings.appendChild(hub);
  }
  return hub;
}
function arrange127(){
  if(!isSettings127())return false;
  const settings=$127('.ct91-settings');if(!settings)return false;
  settings.classList.add('ct109-settings');settings.closest('.content')?.classList.add('ct109-settings-content');
  const hub=ensureHub127(settings),exp=$127('[data-ct127-export]',hub),imp=$127('[data-ct127-import]',hub),bing=$127('[data-ct127-bingers]',hub);
  const exportButtons=[['#ct91-exp-json','Exportar JSON'],['#ct91-exp-zip','Exportar ZIP'],['#ct106-exp-csv','Exportar CSV']];
  for(const [sel,label] of exportButtons)moveButton127($127(sel,document),exp,label);
  const legacyData=$127('.ct109-data-management,.ct106-data-management',document);
  if(exp&&!exp.children.length){const b=legacyData?buttonByText127(legacyData,'exportar'):null;moveButton127(b,exp,'Exportar backup')}
  for(const [sel,label] of [['#ct91-imp-json','Importar JSON'],['#ct91-imp-zip','Importar ZIP']])moveButton127($127(sel,document),imp,label);
  if(imp&&!$$127('#ct91-imp-json,#ct91-imp-zip',imp).length){const b=legacyData?buttonByText127(legacyData,'importar'):null;moveButton127(b,imp,'Importar backup')}
  const panel=$127('#ct10-import-panel',document);if(panel&&panel.parentElement!==bing)bing.appendChild(panel);
  const sync=$127('#ct11-sync',document);if(sync)moveButton127(sync,imp,'Sincronizar agora');
  const hiddenFile=$127('#ct91-file',document);if(hiddenFile){hiddenFile.hidden=true;if(hiddenFile.parentElement!==hub)hub.appendChild(hiddenFile)}
  retireLegacy127(settings,hub);cleanSettingsVersion127(settings);
  let footer=$127(':scope > .ct127-settings-footer',settings);if(!footer){footer=document.createElement('div');footer.className='ct127-settings-footer';footer.innerHTML='<span>Configurações da <b>Web/PWA</b></span><span>CineTracker <b>0.99.7</b></span>';settings.appendChild(footer)}
  return true;
}
function schedule127(){for(const d of[0,70,180,380,760,1250,2050,2850])setTimeout(arrange127,d)}

const baseUpgrade127=window.ct11UpgradeImporter;
if(typeof baseUpgrade127==='function'&&!baseUpgrade127.__ct127Wrapped){const fn=function(){const out=baseUpgrade127.apply(this,arguments);schedule127();return out};fn.__ct127Wrapped=true;window.ct11UpgradeImporter=fn}
document.addEventListener('click',e=>{if(e.target?.closest?.('[data-view="settings"],[data-ct120-nav="settings"]'))schedule127()},true);
window.addEventListener('cinetracker:data-changed',()=>{if(isSettings127())schedule127()});
window.addEventListener('focus',()=>{if(isSettings127())schedule127()});
schedule127();
})();
