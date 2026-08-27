(() => {
'use strict';
if (window.__ct0994DataUiFixLoaded) return;
window.__ct0994DataUiFixLoaded = true;
window.__ct0994DataUiFix = 'v107-history-settings-cache';

const style=document.createElement('style');
style.id='ct0994-v107-style';
style.textContent=`
/* Histórico fica escondido acima da Home, então o item mais recente precisa estar fisicamente no fim do bloco para ser o primeiro revelado ao puxar para baixo. */
.ct992-history .ct992-stack{display:flex!important;flex-direction:column-reverse!important;gap:8px!important}
.ct992-history .ct992-row{width:100%!important;flex:0 0 auto!important}
.ct106-data-management{display:grid!important;gap:12px!important}
.ct106-data-management>.ct106-data-grid{margin-top:0!important;padding-top:14px!important}
.ct106-data-management #ct10-import-panel{border:1px solid #244b62!important;border-radius:13px!important;background:#07141d!important;padding:12px!important;margin-top:10px!important}
.ct106-data-management #ct10-import-panel>h2{font-size:14px!important;margin:0 0 6px!important}
.ct106-data-management #ct10-import-panel .muted{color:#839aaa!important}
#ct991-import-menu{display:none!important}
`;
document.getElementById(style.id)?.remove();document.head.appendChild(style);

const BUILD_MARK='ct0994-v107-datafix-20260827';
try{
  if(localStorage.getItem(BUILD_MARK)!=='1'){
    localStorage.removeItem('ct0994_home_preload_v1');
    localStorage.setItem(BUILD_MARK,'1');
    window.__ct0994PreloadedHome=null;
  }
}catch{}

function finishSettings107(){
  const settings=document.querySelector('.ct91-settings');if(!settings)return false;
  const card=settings.querySelector('.ct106-data-management')||[...settings.querySelectorAll(':scope > .ct91-setting')].find(x=>/Gerenciamento de Dados|Backup e restauração/i.test(String(x.querySelector('b')?.textContent||'')));
  if(!card)return false;
  card.classList.add('ct106-data-management');
  const heading=card.querySelector(':scope > b');if(heading)heading.textContent='Gerenciamento de Dados';
  const intro=card.querySelector(':scope > .ct91-muted');if(intro)intro.textContent='Backup, restauração e importação da biblioteca em um único lugar. Restaurações exibem uma prévia antes de alterar seus dados.';
  const panel=card.querySelector('#ct10-import-panel');
  if(panel){
    const title=panel.querySelector('h2');if(title)title.textContent='Importar biblioteca e histórico';
    const description=[...panel.querySelectorAll('p,.muted,.small')].find(x=>/celular|arquivos|library|watches|import/i.test(String(x.textContent||'')));
    if(description)description.textContent='Importe library.csv + watches.csv, ou use um arquivo ZIP/JSON. A prévia é obrigatória antes da sincronização.';
  }
  document.querySelector('#ct991-import-menu')?.remove();
  return true;
}

const rawNavigate=window.__ct0994Navigate;
if(typeof rawNavigate==='function'&&!rawNavigate.__ct107Wrapped){
  const wrapped=async function(target,...args){
    const result=await rawNavigate(target,...args);
    if(target==='settings')for(const d of [30,120,320])setTimeout(finishSettings107,d);
    return result;
  };
  wrapped.__ct107Wrapped=true;wrapped.__ct107Raw=rawNavigate;
  window.__ct0994Navigate=wrapped;
}
for(const d of [60,250,700])setTimeout(()=>{if(String(window.view||'')==='settings')finishSettings107()},d);
})();
