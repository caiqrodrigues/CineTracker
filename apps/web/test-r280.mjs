import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r280-official.mjs');
const dist=resolve('dist');
const [js,css,release,runtime]=await Promise.all([
 readFile(resolve(dist,'app-v280.js'),'utf8'),
 readFile(resolve(dist,'app-v280.css'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve('runtime-r280-minimal-watch-check.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('R280_STATIC missing '+x)};
for(const x of[
 "window.__ctR280='minimal-watch-check+green-active'",
 "window.__ctR280Watch='check-only+muted-idle+green-on-click'",
 'class="ct266-watch-action ct279-watch-button ct280-watch-button"',
 'aria-pressed="false"',
 '<span class="ct279-watch-check" aria-hidden="true">✓</span></button>',
 'function ct280SetActive(action,on=true)',
 'async function ct280MarkWatched(action)',
 'ct279ExplicitWatchAction=ct280MinimalWatchAction;',
 'ct279MarkWatched=ct280MarkWatched;'
])must(js,x);
if(js.includes('<span class="ct279-watch-label">Marcar</span></button>')&&js.lastIndexOf('<span class="ct279-watch-label">Marcar</span></button>')>js.indexOf("window.__ctR280='minimal-watch-check+green-active'"))throw new Error('R280_STATIC label leaked into r280 runtime');
for(const x of[
 '[data-home] button.ct266-watch-action.ct279-watch-button.ct280-watch-button[data-ct279-watch]{position:static!important',
 'width:40px!important;min-width:40px!important;max-width:40px!important',
 'height:40px!important;min-height:40px!important;max-height:40px!important',
 'opacity:.64!important',
 'color:rgba(203,213,225,.58)!important',
 'background:rgba(16,185,129,.20)!important',
 'border-color:rgba(16,185,129,.40)!important',
 '[data-home] button.ct266-watch-action.ct279-watch-button.ct280-watch-button[data-ct279-watch] .ct279-watch-label{display:none!important}'
])must(css,x);
if((runtime.match(/new MutationObserver/g)||[]).length)throw new Error('R280_STATIC persistent observer introduced');
const meta=JSON.parse(release);if(meta.version!=='1.0.71'||meta.revision!=='r280-official-1.0.71'||meta.home_watch_action_control!=='minimal-check'||meta.home_watch_action_text!==false||meta.home_watch_action_idle!=='muted'||meta.home_watch_action_click_feedback!=='green'||meta.home_tabs_fixed!==true||meta.android!=='1.0.20/10062')throw new Error('R280_STATIC release flags');
console.log('R280_STATIC_OK minimal check muted idle green click fixed tabs preserved');
