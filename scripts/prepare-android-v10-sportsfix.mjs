import {readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
// Official 1.0, Sports-only hotfix. No updates to F1, Web, DB or other pages.
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v10-official.mjs')],{cwd:root,stdio:'inherit'});
const path=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(path,'utf8');
const tag='<script data-ct-android="r303-android-stable-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
if(a<0||b<=a)throw Error('Stable Android 1.0 baseline missing');
let js=html.slice(a+tag.length,b);
function one(oldValue,newValue,label){
 const hits=js.split(oldValue).length-1;
 if(hits!==1)throw Error('Sports r304 '+label+': expected 1 match, got '+hits);
 js=js.replace(oldValue,newValue);
}
one("const REVISION='r303-android-official-1.0';","const REVISION='r304-android-official-1.0';",'revision only');
one("window.__ctWebBuild='1.0';window.__ctOfficialVersion='1.0';window.__ctAndroidOfficialVersion='1.0';window.__ctAndroidOfficialCode=10104;",
 "window.__ctWebBuild='1.0';window.__ctOfficialVersion='1.0';window.__ctAndroidOfficialVersion='1.0';window.__ctAndroidOfficialCode=10105;",'versionCode only');
one("function canonicalSport120(card){if(!card||card.dataset.ct120Busy==='1')return;",
 "function canonicalSport120(card){if(!card||card.dataset.ct304Stable==='1'||card.dataset.ct120Busy==='1')return;",
 'prevent old Sports-only DOM action normalization');
const newHandler=[
 'const originalSportsClick271=sportsClick271;',
 'function sportsClick304(event){',
 ' const button=event.target?.closest?.(buttonSelector271);',
 " if(!button||route()!=='sports')return;",
 ' const id=Number(button.dataset.sportWatch||button.dataset.sportWatched||button.dataset.ct263SportWatch||0);',
 ' const row=Number.isSafeInteger(id)&&id>0?watchState271(id):null;',
 " if(row?.sport_slug==='formula_1')return originalSportsClick271(event);",
 ' event.preventDefault();event.stopImmediatePropagation();',
 " if(!session?.access_token){toast('Sua sessão expirou. Entre novamente para marcar o evento.');return}",
 " if(!Number.isSafeInteger(id)||id<=0){toast('Evento sem identificação válida para marcar assistido.');return}",
 ' if(sportsLocks271.has(id))return;',
 " const before=row?Boolean(row.is_watched):(button.dataset.on==='1'||button.dataset.watched==='1');",
 ' const next=!before;',
 ' sportsLocks271.add(id);',
 ' const buttons=setWatch271(id,next);',
 ' for(const b of buttons)b.disabled=true;',
 " Promise.resolve().then(()=>rpc('cinetracker_sport_mark_watched_v1',{",
 '  p_event_id:id,p_watched:next,p_duration_minutes:null,p_watched_at:new Date().toISOString()',
 ' })).then(result=>{',
 "  if(!result||typeof result.is_watched!=='boolean'||Number(result.event_id)!==id)",
 "   throw new Error('Servidor não confirmou o evento marcado.');",
 '  setWatch271(id,result.is_watched);',
 '  if(sportsCache){',
 '   if(result.sports_stats)sportsCache.stats=result.sports_stats;',
 '   const hist=Array.isArray(sportsCache.watch_history)?sportsCache.watch_history:[];',
 '   if(result.is_watched){',
 '    const original=(sportsCache.events||[]).find(x=>Number(x.id)===id)||row;',
 '    if(original&&!hist.some(x=>Number(x.id)===id))hist.unshift({...original,is_watched:true,sport_watched_at:result.watched_at||new Date().toISOString(),watched_duration_minutes:result.duration_minutes||null});',
 '   }else sportsCache.watch_history=hist.filter(x=>Number(x.id)!==id);',
 "   try{ct163Write('sports',sportsCache);window.__ctA26PersistSports?.()}catch{}",
 '  }',
 "  profileCache=null;try{localStorage.removeItem('cinetracker:preload:r163:profile')}catch{}",
 "  toast(result.is_watched?'Evento marcado como assistido.':'Evento removido dos assistidos.');",
 ' }).catch(error=>{',
 '  setWatch271(id,before);',
 "  toast('Não foi possível salvar o evento: '+String(error?.message||error));",
 ' }).finally(()=>{',
 '  sportsLocks271.delete(id);',
 '  for(const b of buttons)if(b.isConnected)b.disabled=false;',
 ' });',
 '}',
 "window.addEventListener('click',sportsClick304,true);"
].join('\n');
one("window.addEventListener('click',sportsClick271,true);",newHandler,'single Sports event listener');
const css=[
 '[data-sports] .event-grid>article.live,[data-sports] .event-grid>.event.live{border-color:#275063!important;box-shadow:none!important;outline-color:#275063!important}',
 '[data-sports] .event-grid .status.live{color:#9cbfcc!important;background:#0b202b!important;border-color:#275063!important}',
 '[data-sports] .event-grid .ct304-sports-actions{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important;width:100%!important;margin-top:9px!important}',
 '[data-sports] .event-grid .ct304-sports-actions>button{box-sizing:border-box!important;display:flex!important;align-items:center!important;justify-content:center!important;width:100%!important;max-width:100%!important;min-width:0!important;height:42px!important;min-height:42px!important;max-height:42px!important;margin:0!important;padding:0 7px!important;border-radius:10px!important;font-size:11px!important;font-weight:600!important;line-height:1.12!important;text-align:center!important;white-space:normal!important;overflow:hidden!important;transition:none!important}',
 '[data-sports] .tabs [data-sports-tab]{flex:1 1 0!important;min-height:40px!important;height:40px!important;min-width:0!important;display:flex!important;align-items:center!important;justify-content:center!important}',
 '.ct263-sports-detail .ct263-sport-detail-event>[data-ct263-sport-watch]{min-height:42px!important;height:42px!important;width:100%!important;box-sizing:border-box!important;border-radius:10px!important}',
 '[data-sports] .event-grid [data-ct304-stable="1"] .ct123-actions:empty,[data-sports] .event-grid [data-ct304-stable="1"] .ct120-sport-actions:empty{display:none!important}'
];
const patch=[
 '/* r304: scoped official 1.0 Sports appearance and action geometry */',
 "(()=>{'use strict';",
 'if(window.__ctR304Sports)return;',
 'const qa=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];',
 'let normalized=0;',
 'function normalizeCard(card){',
 " if(!card||card.dataset.ct304Stable==='1'||card.closest('#ct-f1-v111,[data-ct111-f1],.ct263-sports-detail'))return;",
 " const buttons=qa('button',card);",
 " const watch=buttons.find(b=>b.matches('[data-sport-watched]'))||buttons.find(b=>b.matches('[data-sport-watch]'));",
 " const events=buttons.find(b=>!b.matches('[data-sport-fav],[data-ct255-fav]')&&/^(ver )?eventos$/i.test(String(b.textContent||'').trim()));",
 ' if(!watch&&!events)return;',
 " const bar=document.createElement('div');bar.className='ct304-sports-actions';",
 " for(const duplicate of qa('[data-sport-watch],[data-sport-watched]',card))if(duplicate!==watch)duplicate.remove();",
 ' if(events)bar.appendChild(events);',
 ' if(watch)bar.appendChild(watch);',
 " card.appendChild(bar);card.dataset.ct304Stable='1';normalized++;",
 '}',
 'function normalize(){',
 " if(route()!=='sports')return;",
 " const root=document.querySelector('[data-sports]');if(!root)return;",
 " for(const grid of qa('.event-grid',root))for(const card of [...grid.children])",
 "  if(card.matches?.('article,.event,.ct120-event-card,.ct123-sports-card'))normalizeCard(card);",
 '}',
 'const oldPaint=paintSports;',
 'paintSports=function(...args){const result=oldPaint.apply(this,args);queueMicrotask(normalize);return result};',
 "const style=document.createElement('style');style.id='ct304-sports-only';",
 'style.textContent='+JSON.stringify(css.join('\n'))+';',
 'document.head.appendChild(style);',
 'window.__ctR304Sports={normalize,stats:()=>({normalized}),scope:"Sports-only"};',
 '})();'
].join('\n')+'\n';
one('boot();\n})();',patch+'boot();\n})();','Sports-only final runtime patch');
new Function(js);
html=html.slice(0,a)+'<script data-ct-android="r304-android-stable-js">'+js+'</script>'+html.slice(b+'</script>'.length);
await writeFile(path,html,'utf8');
console.log('CINETRACKER_1_0_R304_READY: Sports neutral borders, uniform 42px event actions, authenticated watched confirmation; F1 owner and all other pages unchanged.');
