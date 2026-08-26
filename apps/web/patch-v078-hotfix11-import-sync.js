(() => {
'use strict';
if(window.__ctHotfix11ImportSync)return;
window.__ctHotfix11ImportSync=true;

const $11=(s,r=document)=>r.querySelector(s);
let syncing11=false,lastSync11=0;

const css=document.createElement('style');
css.id='ct11-import-style';
css.textContent=`
.ct11-files{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:12px 0}.ct11-file{border:1px solid #29485f;background:#08131b;border-radius:12px;padding:12px}.ct11-file b{display:block;margin-bottom:5px}.ct11-file input{display:block;width:100%;max-width:100%;margin-top:8px}.ct11-ok{color:#9ee0b0}.ct11-warn{color:#f2c879}.ct11-package{border-top:1px solid #29485f;margin-top:14px;padding-top:12px}.ct11-sync{margin-left:auto}.ct11-status{margin-top:10px;white-space:pre-wrap}@media(max-width:650px){.ct11-files{grid-template-columns:1fr}.ct11-sync{margin-left:0}}
`;
document.head.appendChild(css);

function currentView11(){try{return String(view||'')}catch{return String(window.view||'')}}
function isSettings11(){return ['settings','ct91-settings','ct92-settings'].includes(currentView11())||/Configurações|Importar dados do Bingers/i.test($11('.content')?.textContent||'')}

function detectDelimiter11(text){
  const line=String(text||'').replace(/^\uFEFF/,'').split(/\r?\n/).find(x=>x.trim())||'';
  const counts={',':0,';':0,'\t':0};let q=false;
  for(let i=0;i<line.length;i++){
    const ch=line[i];
    if(ch==='"'&&line[i+1]==='"'&&q){i++;continue}
    if(ch==='"'){q=!q;continue}
    if(!q&&Object.prototype.hasOwnProperty.call(counts,ch))counts[ch]++;
  }
  return Object.entries(counts).sort((a,b)=>b[1]-a[1])[0]?.[1]>0?Object.entries(counts).sort((a,b)=>b[1]-a[1])[0][0]:',';
}

function parseDelimited11(text){
  text=String(text||'').replace(/^\uFEFF/,'');
  const sep=detectDelimiter11(text),rows=[],row=[];let cur='',q=false;
  for(let i=0;i<text.length;i++){
    const ch=text[i];
    if(q){if(ch==='"'&&text[i+1]==='"'){cur+='"';i++}else if(ch==='"')q=false;else cur+=ch}
    else if(ch==='"')q=true;
    else if(ch===sep){row.push(cur);cur=''}
    else if(ch==='\n'){row.push(cur.replace(/\r$/,''));rows.push([...row]);row.length=0;cur=''}
    else cur+=ch;
  }
  if(cur||row.length){row.push(cur.replace(/\r$/,''));rows.push(row)}
  const head=(rows.shift()||[]).map((x,i)=>String(x||'').trim().replace(i===0?/^\uFEFF/:/$^/,''));
  const data=rows.filter(r=>r.some(v=>String(v||'').trim())).map(r=>Object.fromEntries(head.map((h,i)=>[h,r[i]??''])));
  return {head,data,separator:sep};
}

function csvCell11(value){const s=String(value??'');return /[",\r\n]/.test(s)?`"${s.replace(/"/g,'""')}"`:s}
function toCommaCsv11(parsed){return [parsed.head.map(csvCell11).join(','),...parsed.data.map(r=>parsed.head.map(h=>csvCell11(r[h])).join(','))].join('\n')}
async function canonicalCsv11(file,expected){
  if(!file)throw new Error(`Selecione ${expected}.`);
  const parsed=parseDelimited11(await file.text());
  if(!parsed.head.length||!parsed.data.length)throw new Error(`${expected} está vazio ou não pôde ser lido.`);
  const body=toCommaCsv11(parsed);
  return new File([body],expected,{type:'text/csv',lastModified:file.lastModified||Date.now()});
}

async function syncCloud11(force=false){
  const now=Date.now();
  if(syncing11||(!force&&now-lastSync11<8000))return false;
  if(typeof loadCloudState!=='function')return false;
  syncing11=true;lastSync11=now;
  try{
    await loadCloudState();
    if(typeof render==='function')render();
    if(isSettings11())setTimeout(upgradeImporter11,80);
    return true;
  }catch(e){console.warn('CineTracker HOTFIX11: sincronização do Supabase não concluída.',e);return false}
  finally{syncing11=false}
}
window.ct11SyncCloud=()=>syncCloud11(true);

function upgradeImporter11(){
  const panel=$11('#ct10-import-panel');
  if(!panel||panel.dataset.ct11==='1')return;
  panel.dataset.ct11='1';
  panel.innerHTML=`<h2>Importar dados do Bingers</h2><p class="ct10-muted">No celular, escolha os arquivos <b>um de cada vez</b>. Na Web funciona da mesma forma. Depois selecione <b>library.csv</b> e <b>watches.csv</b> e abra a prévia.</p><div class="ct10-safe">Os arquivos são enviados para sua conta no Supabase. Web e Android usam os mesmos dados. Estados e decisões manuais do CineTracker continuam tendo prioridade.</div><div class="ct11-files"><label class="ct11-file"><b>1. library.csv</b><span class="ct10-muted">Biblioteca, Watchlist e séries acompanhadas.</span><input id="ct11-library" type="file" accept=".csv,text/csv,text/plain,application/vnd.ms-excel"><span id="ct11-library-name" class="ct10-muted">Nenhum arquivo selecionado.</span></label><label class="ct11-file"><b>2. watches.csv</b><span class="ct10-muted">Filmes e episódios assistidos.</span><input id="ct11-watches" type="file" accept=".csv,text/csv,text/plain,application/vnd.ms-excel"><span id="ct11-watches-name" class="ct10-muted">Nenhum arquivo selecionado.</span></label></div><div class="ct10-actions"><button class="ct10-btn" id="ct11-read-csv">Analisar os 2 CSVs e ver prévia</button><button class="ct10-btn ct11-sync" id="ct11-sync">Sincronizar agora</button></div><div class="ct11-package"><div class="ct10-muted"><b>Alternativa:</b> você também pode usar um ZIP ou JSON único.</div><input id="ct11-package" type="file" accept=".zip,.json,application/zip,application/x-zip-compressed,application/json"><button class="ct10-btn" id="ct11-read-package" style="margin-top:8px">Analisar ZIP/JSON</button></div><div id="ct11-status" class="ct10-muted ct11-status"></div>`;
  let libraryFile=null,watchesFile=null,packageFile=null;
  const status=$11('#ct11-status',panel),libName=$11('#ct11-library-name',panel),watName=$11('#ct11-watches-name',panel);
  $11('#ct11-library',panel).onchange=e=>{libraryFile=e.target.files?.[0]||null;libName.textContent=libraryFile?`✓ ${libraryFile.name}`:'Nenhum arquivo selecionado.';libName.className=libraryFile?'ct10-muted ct11-ok':'ct10-muted'};
  $11('#ct11-watches',panel).onchange=e=>{watchesFile=e.target.files?.[0]||null;watName.textContent=watchesFile?`✓ ${watchesFile.name}`:'Nenhum arquivo selecionado.';watName.className=watchesFile?'ct10-muted ct11-ok':'ct10-muted'};
  $11('#ct11-package',panel).onchange=e=>{packageFile=e.target.files?.[0]||null;status.textContent=packageFile?`Selecionado: ${packageFile.name}`:''};
  $11('#ct11-read-csv',panel).onclick=async()=>{
    try{
      if(typeof window.ct10ReadImportFiles!=='function')throw new Error('Motor de importação indisponível.');
      if(!libraryFile||!watchesFile)throw new Error('Selecione primeiro library.csv e watches.csv, um em cada campo.');
      status.textContent='Lendo e validando os dois CSVs…';
      const lib=await canonicalCsv11(libraryFile,'library.csv'),wat=await canonicalCsv11(watchesFile,'watches.csv');
      await window.ct10ReadImportFiles([lib,wat]);
      status.textContent='Prévia pronta. Nenhum dado foi alterado ainda.';
    }catch(e){status.textContent='Erro: '+(e?.message||e)}
  };
  $11('#ct11-read-package',panel).onclick=async()=>{
    try{
      if(!packageFile)throw new Error('Selecione um ZIP ou JSON.');
      if(typeof window.ct10ReadImportFiles!=='function')throw new Error('Motor de importação indisponível.');
      status.textContent='Lendo arquivo…';
      await window.ct10ReadImportFiles([packageFile]);
      status.textContent='Prévia pronta. Nenhum dado foi alterado ainda.';
    }catch(e){status.textContent='Erro: '+(e?.message||e)}
  };
  $11('#ct11-sync',panel).onclick=async e=>{
    const b=e.currentTarget,old=b.textContent;b.disabled=true;b.textContent='Sincronizando…';status.textContent='Buscando os dados mais recentes da sua conta…';
    const ok=await syncCloud11(true);status.textContent=ok?'Sincronização concluída.':'Não foi possível sincronizar agora.';
    setTimeout(()=>{const nb=$11('#ct11-sync');if(nb){nb.disabled=false;nb.textContent=old}},100);
  };
}

const old10=window.ct10Navigate;
if(typeof old10==='function')window.ct10Navigate=function(target){const out=old10.apply(this,arguments);if(String(target)==='settings')setTimeout(upgradeImporter11,120);return out};
const old95=window.ct95Navigate;
if(typeof old95==='function')window.ct95Navigate=function(target){const out=old95.apply(this,arguments);if(String(target)==='settings')setTimeout(upgradeImporter11,140);return out};

document.addEventListener('click',e=>{const b=e.target?.closest?.('[data-view="settings"]');if(b)setTimeout(upgradeImporter11,140)},true);
window.addEventListener('cinetracker:data-changed',()=>setTimeout(()=>void syncCloud11(true),80));
window.addEventListener('focus',()=>void syncCloud11(false));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)void syncCloud11(false)});
window.addEventListener('online',()=>void syncCloud11(false));
setTimeout(()=>{if(isSettings11())upgradeImporter11()},180);
})();
