import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r312.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v312.js'),'utf8'),
  readFile(resolve(dist,'app-v312.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(dist,'release.json'),'utf8'),
  readFile(resolve(root,'runtime-r313-discover-sports-profile.js'),'utf8')
]);

const count=(s,x)=>s.split(x).length-1;
const once=(s,from,to,label=from)=>{const n=count(s,from);if(n!==1)throw new Error('r313 expected one '+label+', found '+n);return s.replace(from,()=>to)};
const must=(s,x)=>{if(!s.includes(x))throw new Error('r313 missing '+x)};
function replaceFunction(src,name,replacement){
  const sig='function '+name+'(';const start=src.indexOf(sig);if(start<0)throw new Error('r313 missing function '+name);
  const open=src.indexOf('{',start);if(open<0)throw new Error('r313 missing body '+name);
  let depth=0,quote='',esc=false;
  for(let i=open;i<src.length;i++){
    const ch=src[i];
    if(quote){
      if(esc){esc=false;continue}
      if(ch==='\\'){esc=true;continue}
      if(ch===quote){quote='';continue}
      continue;
    }
    if(ch==="'"||ch==='"'||ch==='`'){quote=ch;continue}
    if(ch==='{')depth++;
    else if(ch==='}'&&--depth===0)return src.slice(0,start)+replacement+src.slice(i+1);
  }
  throw new Error('r313 unterminated function '+name);
}

for(const x of[
  "window.__ctWebBuild='1.0.103';window.__ctOfficialVersion='1.0.103';",
  "const REVISION='r312-official-1.0.103';",
  "window.__ctR312='discover-single-shell+auth-refresh+profile-live-favorites+stadium-button+sports-inline-filters'",
  "window.__ctR312EarlyCapture=true",
  "function card312(x,saved=false){",
  "function paintSports255(){",
  "const version='1.0.103',revision='r312-official-1.0.103';",
  "\nboot();"
])must(js,x);

js=replaceFunction(js,'card312',`function card312(x,saved=false){
 const k=keyOf(x),media=typeof ct288Card==='function'?ct288Card(x,{watch:false,add:false}):'';
 return '<article class="ct313-item ct313-r312-fallback" data-ct313-item="'+esc(k)+'">'+media+'<div class="ct313-actions"><button type="button" class="chip ct313-watch '+(saved?'active':'')+'" data-ct313-action="watchlist" data-media="'+esc(k)+'" '+(saved?'disabled':'')+'>'+(saved?'✓ Watchlist':'+ Watchlist')+'</button><button type="button" class="chip ct313-seen" data-ct313-action="seen" data-media="'+esc(k)+'">✓ Visto</button></div></article>';
}`);

js=replaceFunction(js,'paintSports255',`function paintSports255(){
 const h=q255('[data-ct255-sports]');if(!h)return;cleanupLegacySports255();
 const p=sport255.payload||{},rows=sportRows255(p),stats=p.stats||{},sports=Array.isArray(p.sports)?p.sports:[],label=SPORT_TABS255.find(([k])=>k===sport255.tab)?.[1]||'Esportes';
 const inline=['next','previous'].includes(sport255.tab)?'<div class="ct313-sport-filter" data-ct313-sport-filter><button type="button" class="chip '+(sport255.sport==='all'?'active':'')+'" data-ct255-sport-filter="all">Todos</button>'+sports.map(s=>'<button type="button" class="chip '+(sport255.sport===s.slug?'active':'')+'" data-ct255-sport-filter="'+esc255(s.slug)+'">'+esc255(s.icon||'🏆')+' '+esc255(s.name||s.slug)+'</button>').join('')+'</div>':'';
 h.innerHTML='<section class="ct255-f1hub" data-ct255-f1></section><div class="ct255-sports-tabs">'+SPORT_TABS255.map(([k,l])=>'<button type="button" class="ct255-sports-tab '+(sport255.tab===k?'active':'')+'" data-ct255-sport-tab="'+k+'">'+l+'</button>').join('')+'</div><section class="panel ct255-sports-feed"><div class="panel-head"><div class="ct313-feed-title"><h2>'+label+'</h2>'+inline+'</div><small>'+(sport255.tab==='watched'?n255(stats.watched_events||rows.length)+' assistidos':rows.length)+'</small></div><div class="ct255-sport-grid">'+(rows.map(e=>sportCard255(e,p)).join('')||'<div class="empty">Nenhum evento disponível neste filtro.</div>')+'</div></section>';
 void paintF1255();setTimeout(cleanupLegacySports255,0);setTimeout(cleanupLegacySports255,180);
}`);

const early313=String.raw`(()=>{if(window.__ctR313EarlyCapture)return;window.__ctR313EarlyCapture=true;window.addEventListener('click',e=>{try{const fn=window.__ctR313EarlyHandle;if(typeof fn!=='function')return;if(fn(e.target,e)){e.preventDefault();e.stopImmediatePropagation()}}catch{}},true)})();`;
js=once(js,
  "const version='1.0.103',revision='r312-official-1.0.103';",
  "const version='1.0.104',revision='r313-official-1.0.104';",
  'footer identity'
);
js=once(js,'\nboot();','\n'+runtime+'\nboot();','r313 insertion');
js=early313+'\n'+js;
js=once(js,
  "window.__ctWebBuild='1.0.103';window.__ctOfficialVersion='1.0.103';",
  "window.__ctWebBuild='1.0.104';window.__ctOfficialVersion='1.0.104';",
  'Web version'
);
js=once(js,"const REVISION='r312-official-1.0.103';","const REVISION='r313-official-1.0.104';",'revision');

html=html.replaceAll('app-v312.js','app-v313.js').replaceAll('app-v312.css'','app-v313.css').replaceAll('v1.0.103','v1.0.104').replaceAll('r312-official-1.0.103','r313-official-1.0.104');
sw=sw.replaceAll('ct-web-1.0.103-r312','ct-web-1.0.104-r313').replaceAll('app-v312.js','app-v313.js').replaceAll('app-v312.css'','app-v313.css');
css+='\n