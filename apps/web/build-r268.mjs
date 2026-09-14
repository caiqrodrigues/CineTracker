import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r267-official.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v267.js'),'utf8'),
  readFile(resolve(dist,'app-v267.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8')
]);

const replaceOnce=(source,from,to,label)=>{
  const i=source.indexOf(from);
  if(i<0)throw new Error('r268 missing '+label);
  if(source.indexOf(from,i+from.length)>=0)throw new Error('r268 ambiguous '+label);
  return source.slice(0,i)+to+source.slice(i+from.length);
};
const patchRestore=(name)=>{
  const re=new RegExp('function '+name+'\\(\\)\\{[\\s\\S]*?\\n\\}');
  const block=js.match(re)?.[0]||'';
  if(!block)throw new Error('r268 missing '+name);
  const patched=replaceOnce(block,'return pack.data;','pack.data.__ctHistoryAuthoritative=false;pack.data.__ctFastHomeCache=true;return pack.data;',name+' return');
  js=js.replace(block,patched);
};

js=replaceOnce(js,"window.__ctWebBuild='1.0.58';window.__ctOfficialVersion='1.0.58';","window.__ctWebBuild='1.0.59';window.__ctOfficialVersion='1.0.59';",'web version');
js=replaceOnce(js,"const REVISION='r267-official-1.0.58';","const REVISION='r268-official-1.0.59';",'revision');
patchRestore('restoreHome260');
patchRestore('restoreHome261');
js=replaceOnce(js,'homeCache=prepareHome259(d||{});','homeCache=prepareHome259(d||{});if(homeCache)homeCache.__ctHistoryAuthoritative=true;','canonical r5 home assignment');

js+=String.raw`
/* CT268_HOME_FIX_START */
window.__ctR268='home-history-authority+inline-right-watch';
window.__ctR268Home='canonical-history+same-row-right-watch';
window.__ctR268Frozen='discover+detail+sports+android-r267-preserved';
function ct268Norm(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase()}
function ct268GuardFastHistory(){
  const root=document.querySelector('[data-home]');
  if(!root||homeCache?.__ctHistoryAuthoritative!==false)return false;
  let changed=false;
  for(const sec of root.querySelectorAll('.home-section')){
    const title=ct268Norm(sec.querySelector('.panel-head h2,.panel-head h3,h2,h3')?.textContent);
    if(title==='historico recente'||title==='filmes vistos'){
      sec.hidden=true;
      sec.classList.add('hidden');
      sec.dataset.ct268HistoryPending='1';
      changed=true;
    }
  }
  return changed;
}
function ct268FixWatchRows(){
  let changed=false;
  for(const row of document.querySelectorAll('[data-home] .media-row.ct266-home-watch-host')){
    const action=row.querySelector(':scope > .ct266-watch-action');
    if(!action)continue;
    row.dataset.ct268WatchInline='1';
    changed=true;
  }
  return changed;
}
const ct268PaintHomeBase=paintHome;
paintHome=function(...args){
  const out=ct268PaintHomeBase(...args);
  ct268GuardFastHistory();
  ct268FixWatchRows();
  return out;
};
/* CT268_HOME_FIX_END */
`;

css+='\n/* r268: cached Home history is hidden until canonical r5 payload; watched glyph stays inside its row. */\n[data-home] .media-row.ct266-home-watch-host{position:relative!important;padding-right:48px!important}\n[data-home] .media-row.ct266-home-watch-host>.ct266-watch-action{position:absolute!important;right:10px!important;left:auto!important;top:50%!important;bottom:auto!important;transform:translateY(-50%)!important;margin:0!important;grid-column:auto!important;grid-row:auto!important;place-self:auto!important;z-index:3!important}\n';
html=html.replaceAll('app-v267.js','app-v268.js').replaceAll('app-v267.css','app-v268.css');
sw=sw.replaceAll('ct-web-1.0.58-r267','ct-web-1.0.59-r268').replaceAll('app-v267.js','app-v268.js').replaceAll('app-v267.css','app-v268.css');

const release={version:'1.0.59',revision:'r268-official-1.0.59',base:'r267-production',home_history_authority:true,home_watch_inline_right:true,discover:'r267-preserved',detail:'r267-preserved',sports:'r267-preserved',r264:'rejected',r265:'rejected',android:'1.0.20/10062',generated_at:new Date().toISOString()};
await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),
  writeFile(resolve(dist,'app-v268.js'),js,'utf8'),
  writeFile(resolve(dist,'app-v268.css'),css,'utf8'),
  writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
  writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v267.js'),{force:true}),rm(resolve(dist,'app-v267.css'),{force:true})]);
console.log('WEB_R268_READY home-history=canonical-only home-watch=same-row-right frozen=r267');
