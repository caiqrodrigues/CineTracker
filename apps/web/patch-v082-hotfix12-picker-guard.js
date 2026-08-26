(() => {
'use strict';
if (window.__ctHotfix12PickerGuard) return;
window.__ctHotfix12PickerGuard = true;

const state = window.__ct12ImportState || (window.__ct12ImportState = { library:null, watches:null, package:null });
let pickerUntil = 0;
const isPickerInput = el => !!el && ['ct11-library','ct11-watches','ct11-package'].includes(el.id);
function currentView12(){ try { return String(view || ''); } catch { return String(window.view || ''); } }
function inSettings12(){ return ['settings','ct91-settings','ct92-settings'].includes(currentView12()) || /Configurações|Importar dados do Bingers/i.test(document.querySelector('.content')?.textContent || ''); }
function armPicker12(ms=300000){ pickerUntil = Date.now() + ms; }
function guarded12(){ return Date.now() < pickerUntil && inSettings12(); }
function settlePicker12(){ if (guarded12()) setTimeout(()=>{ pickerUntil = 0; },1500); }

// Mobile browsers emit focus/visibilitychange when the OS document picker closes.
// HOTFIX11 listened to those events and rebuilt Settings. Suppress only the picker-return window.
const baseLoadCloudState12 = window.loadCloudState;
if (typeof baseLoadCloudState12 === 'function' && !window.__ctHotfix12LoadCloudStateBase) {
  window.__ctHotfix12LoadCloudStateBase = baseLoadCloudState12;
  window.loadCloudState = async function(...args) {
    if (guarded12()) return false;
    return window.__ctHotfix12LoadCloudStateBase.apply(this, args);
  };
}
const baseRender12 = window.render;
if (typeof baseRender12 === 'function' && !window.__ctHotfix12RenderBase) {
  window.__ctHotfix12RenderBase = baseRender12;
  window.render = function(...args) {
    if (guarded12() && document.querySelector('#ct10-import-panel')) return;
    return window.__ctHotfix12RenderBase.apply(this, args);
  };
}

function detectDelimiter12(text){
  const line=String(text||'').replace(/^\uFEFF/,'').split(/\r?\n/).find(x=>x.trim())||'';
  const counts={',':0,';':0,'\t':0};let q=false;
  for(let i=0;i<line.length;i++){
    const ch=line[i];
    if(ch==='"'&&line[i+1]==='"'&&q){i++;continue}
    if(ch==='"'){q=!q;continue}
    if(!q&&Object.prototype.hasOwnProperty.call(counts,ch))counts[ch]++;
  }
  const sorted=Object.entries(counts).sort((a,b)=>b[1]-a[1]);
  return sorted[0]?.[1]>0?sorted[0][0]:',';
}
function parseDelimited12(text){
  text=String(text||'').replace(/^\uFEFF/,'');
  const sep=detectDelimiter12(text),rows=[],row=[];let cur='',q=false;
  for(let i=0;i<text.length;i++){
    const ch=text[i];
    if(q){if(ch==='"'&&text[i+1]==='"'){cur+='"';i++}else if(ch==='"')q=false;else cur+=ch}
    else if(ch==='"')q=true;
    else if(ch===sep){row.push(cur);cur=''}
    else if(ch==='\n'){row.push(cur.replace(/\r$/,''));rows.push([...row]);row.length=0;cur=''}
    else cur+=ch;
  }
  if(cur||row.length){row.push(cur.replace(/\r$/,''));rows.push(row)}
  const head=(rows.shift()||[]).map(x=>String(x||'').trim().replace(/^\uFEFF/,''));
  const data=rows.filter(r=>r.some(v=>String(v||'').trim())).map(r=>Object.fromEntries(head.map((h,i)=>[h,r[i]??''])));
  return {head,data};
}
function csvCell12(value){const s=String(value??'');return /[",\r\n]/.test(s)?`"${s.replace(/"/g,'""')}"`:s}
async function canonical12(file,expected){
  if(!file)throw new Error(`Selecione ${expected}.`);
  const parsed=parseDelimited12(await file.text());
  if(!parsed.head.length||!parsed.data.length)throw new Error(`${expected} está vazio ou não pôde ser lido.`);
  const body=[parsed.head.map(csvCell12).join(','),...parsed.data.map(r=>parsed.head.map(h=>csvCell12(r[h])).join(','))].join('\n');
  return new File([body],expected,{type:'text/csv',lastModified:file.lastModified||Date.now()});
}

function showRemembered12(panel){
  const libName=panel.querySelector('#ct11-library-name'),watName=panel.querySelector('#ct11-watches-name'),status=panel.querySelector('#ct11-status');
  if(libName&&state.library){libName.textContent=`✓ ${state.library.name}`;libName.className='ct10-muted ct11-ok'}
  if(watName&&state.watches){watName.textContent=`✓ ${state.watches.name}`;watName.className='ct10-muted ct11-ok'}
  if(status&&state.package&&!status.textContent)status.textContent=`Selecionado: ${state.package.name}`;
}

function bindImporter12(){
  const panel=document.querySelector('#ct10-import-panel');
  if(!panel||!panel.querySelector('#ct11-library')||!panel.querySelector('#ct11-watches'))return false;
  showRemembered12(panel);
  const status=panel.querySelector('#ct11-status');
  const readCsv=panel.querySelector('#ct11-read-csv');
  if(readCsv){
    readCsv.onclick=async()=>{
      try{
        if(typeof window.ct10ReadImportFiles!=='function')throw new Error('Motor de importação indisponível.');
        if(!state.library||!state.watches)throw new Error('Selecione primeiro library.csv e watches.csv, um em cada campo.');
        if(status)status.textContent='Lendo e validando os dois CSVs…';
        const lib=await canonical12(state.library,'library.csv');
        const wat=await canonical12(state.watches,'watches.csv');
        await window.ct10ReadImportFiles([lib,wat]);
        if(status)status.textContent='Prévia pronta. Nenhum dado foi alterado ainda.';
      }catch(e){if(status)status.textContent='Erro: '+(e?.message||e)}
    };
  }
  const readPackage=panel.querySelector('#ct11-read-package');
  if(readPackage){
    readPackage.onclick=async()=>{
      try{
        if(!state.package)throw new Error('Selecione um ZIP ou JSON.');
        if(typeof window.ct10ReadImportFiles!=='function')throw new Error('Motor de importação indisponível.');
        if(status)status.textContent='Lendo arquivo…';
        await window.ct10ReadImportFiles([state.package]);
        if(status)status.textContent='Prévia pronta. Nenhum dado foi alterado ainda.';
      }catch(e){if(status)status.textContent='Erro: '+(e?.message||e)}
    };
  }
  panel.dataset.ct12Bound='1';
  return true;
}
window.ct12BindImporter = bindImporter12;

for (const eventName of ['pointerdown','mousedown','touchstart','click']) {
  document.addEventListener(eventName, event => {
    if (isPickerInput(event.target)) armPicker12();
  }, true);
}
document.addEventListener('change', event => {
  const input=event.target;
  if(!isPickerInput(input))return;
  pickerUntil=Date.now()+1500;
  const file=input.files?.[0]||null;
  if(input.id==='ct11-library')state.library=file;
  if(input.id==='ct11-watches')state.watches=file;
  if(input.id==='ct11-package')state.package=file;
  setTimeout(bindImporter12,0);
}, true);
window.addEventListener('focus',settlePicker12);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)settlePicker12()});
window.addEventListener('cinetracker:data-changed',event=>{
  if(String(event.detail?.source||'').includes('import'))pickerUntil=0;
});

const previous92=window.ct92Navigate;
if(typeof previous92==='function')window.ct92Navigate=function(target){
  const out=previous92.apply(this,arguments);
  if(String(target)==='settings')for(const d of [120,260,440,700])setTimeout(bindImporter12,d);
  return out;
};
setTimeout(bindImporter12,500);
})();