import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
await import('./build-r537.mjs');
const [js,css,html,releaseRaw,rootPkgRaw,webPkgRaw]=await Promise.all([
 readFile(resolve('dist/app-v537.js'),'utf8'),readFile(resolve('dist/app-v537.css'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('../../package.json'),'utf8'),readFile(resolve('package.json'),'utf8')
]);
const release=JSON.parse(releaseRaw),rootPkg=JSON.parse(rootPkgRaw),webPkg=JSON.parse(webPkgRaw),yes=(v,m)=>{if(!v)throw new Error('r537 regression: '+m)};
yes(rootPkg.version==='0.3.64'&&webPkg.version==='0.3.64','versions');
yes(release.version==='0.3.64'&&release.revision==='r537-official-0.3.64','release');
yes(html.includes('app-v537.js')&&html.includes('app-v537.css'),'assets');
yes(js.includes("window.__ctR537Marker='movies-canonical-list+special-r399-remount+special-screen-immediate-owner'"),'marker');
yes(js.includes("stack.className='stack ct388-movie-stack ct537-movie-list'"),'r388 movie list');
yes(js.includes("return ct274Row(y,{meta:ct274MovieMeta(y),action:ct274MovieWatchAction(y),attrs:ct274MovieAttrs(y)})"),'canonical movie row');
yes(js.includes("document.documentElement.dataset.ct537SpecialRemount='r399'"),'r399 special remount');
yes(js.includes("if(typeof screen?.open==='function')return screen"),'special owner waits only screen');
yes(!js.includes("if(typeof screen?.open==='function'&&typeof special?.loadSeason==='function')return screen"),'obsolete special dependency removed');
yes(!css.includes('.ct536-movie-card')&&!css.includes('.ct536-movie-rail'),'obsolete rail css removed');
yes(css.includes('.ct537-movie-list>.media-row')&&css.includes('flex-flow:column nowrap!important'),'vertical list css');
const tail=js.slice(js.lastIndexOf('/* CineTracker Web 0.3.64 r537'));
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])yes(!tail.includes(bad),'forbidden '+bad);
console.log('WEB_R537_REGRESSION_OK');
