// r491 static gate complements the Chromium behavior gate.
import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [js,html,sw,releaseRaw,pkgRaw,rootPkgRaw]=await Promise.all([
 readFile(resolve(dist,'app-v491.js'),'utf8'),readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'package.json'),'utf8'),readFile(resolve(root,'../../package.json'),'utf8')
]);
const yes=(v,m)=>{if(!v)throw new Error('r491 regression: '+m)},release=JSON.parse(releaseRaw),pkg=JSON.parse(pkgRaw),rootPkg=JSON.parse(rootPkgRaw);
const region=anchor=>{const at=js.indexOf(anchor);yes(at>=0,'anchor '+anchor);const start=js.lastIndexOf('(()=>{',at),close=js.indexOf('\n})();',at);yes(start>=0&&close>=0,'bounds '+anchor);return js.slice(start,close+6)};
const fn=(source,name)=>{const m=new RegExp('(?:async\\s+)?function\\s+'+name+'\\s*\\(').exec(source);yes(m,'function '+name);const open=source.indexOf('{',m.index+m[0].length);let depth=0,mode='code',quote='',i=open;for(;i<source.length;i++){const c=source[i],n=source[i+1];if(mode==='line'){if(c==='\n')mode='code';continue}if(mode==='block'){if(c==='*'&&n==='/'){mode='code';i++}continue}if(mode==='string'){if(c==='\\'){i++;continue}if(c===quote)mode='code';continue}if(mode==='template'){if(c==='\\'){i++;continue}if(c.charCodeAt(0)===96)mode='code';continue}if(c==='/'&&n==='/'){mode='line';i++;continue}if(c==='/'&&n==='*'){mode='block';i++;continue}if(c==="'"||c==='"'){mode='string';quote=c;continue}if(c.charCodeAt(0)===96){mode='template';continue}if(c==='{')depth++;else if(c==='}'){depth--;if(depth===0){i++;break}}}yes(depth===0,'balanced '+name);return source.slice(m.index,i)};
yes(pkg.version==='0.3.18'&&rootPkg.version==='0.3.18','package versions');
yes(release.version==='0.3.18'&&release.revision==='r491-official-0.3.18','release');
yes(html.includes('app-v491.js')&&html.includes('app-v491.css')&&sw.includes("ct-media-r491"),'assets/sw');
yes(!sw.includes('app-v491.js')&&!sw.includes('index.html'),'service worker must not cache shell');
yes(js.includes("if(r==='home')return renderHome491(seq);"),'core Home dispatch');
yes(js.includes("if(r==='profile')return renderProfile491(seq);"),'core Profile dispatch');
const core=js.slice(js.indexOf('/* CT_R491_CORE_START */'),js.indexOf('/* CT_R491_CORE_END */')+'/* CT_R491_CORE_END */'.length);
yes(core.includes('window.__ctR388?.renderHome'),'Home direct owner');
yes(core.includes('cinetracker_profile_screen_v491'),'Profile atomic payload');
yes(core.includes("slice(0,12)"),'Profile exact 12');
const r464=region("window.__ctR464Marker='discover-foryou-visible-owner-v421';");
yes(fn(r464,'load').includes('cinetracker_foryou_payload_v490'),'Pra Você compact payload');
yes(!fn(r464,'load').includes('Promise.allSettled(specs'),'Pra Você six-call fanout retired');
const r471=region("window.__ctR471Marker='closure-core+home-r399-visible+discover-r464-core+profile-dashboard-13+history-v426';");
yes(!fn(r471,'scheduleHome').includes('setTimeout'),'r471 Home timer retired');yes(!fn(r471,'scheduleProfile').includes('setTimeout'),'r471 Profile timer retired');
const r472=region("if(window.__ctR472?.version==='1.0.262')return;");
yes(!fn(r472,'scheduleHome').includes('bounded('),'r472 Home ladder retired');yes(!fn(r472,'scheduleProfile').includes('bounded('),'r472 Profile ladder retired');yes(fn(r472,'scheduleForYou').includes('requestAnimationFrame'),'r472 one-frame ForYou entry');
const r476=region("if(window.__ctR476?.version==='1.0.266')return;");yes(fn(r476,'paintProfile').includes('return false'),'r476 visual Profile owner retired');
const r477=region("if(window.__ctR477?.version==='1.0.267')return;");yes(fn(r477,'bootHome').includes('return false'),'r477 Home owner retired');yes(fn(r477,'settleProfile').includes('return false'),'r477 Profile owner retired');
const r481=region("if(window.__ctR481?.version==='0.3.8')return;");yes(fn(r481,'prime').includes('return false'),'r481 delayed prime retired');
yes(js.includes("window.__ctR491Marker='core-render-boundary+home-r388+foryou-v490+profile-screen-v491+top10-2x3'"),'marker');
const own=js.slice(js.lastIndexOf('/* CineTracker Web 0.3.18 r491'));for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])yes(!own.includes(bad),'forbidden '+bad);
console.log('WEB_R491_REGRESSION_OK');
