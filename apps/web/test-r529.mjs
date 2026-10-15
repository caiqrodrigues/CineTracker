import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r529.mjs');
const [js,css,html,relRaw,rootRaw,webRaw]=await Promise.all([readFile(resolve('dist/app-v529.js'),'utf8'),readFile(resolve('dist/app-v529.css'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('../../package.json'),'utf8'),readFile(resolve('package.json'),'utf8')]);
const ok=(v,m)=>{if(!v)throw new Error('r529 regression: '+m)},rel=JSON.parse(relRaw),rp=JSON.parse(rootRaw),wp=JSON.parse(webRaw);
function region(marker){const at=js.indexOf(marker);if(at<0)throw new Error('region '+marker);const start=js.lastIndexOf('(()=>{',at),end=js.indexOf('\n})();',at);if(start<0||end<0)throw new Error('region bounds '+marker);return js.slice(start,end+6)}
function extractNamed(source,name,needle=''){const re=new RegExp('(?:async\\s+)?function\\s+'+name+'\\s*\\(','g'),hits=[...source.matchAll(re)],out=[];for(const h of hits){const start=h.index,open=source.indexOf('{',start+h[0].length);let depth=0,mode='code',quote='',i=open;for(;i<source.length;i++){const c=source[i],n=source[i+1];if(mode==='line'){if(c==='\n')mode='code';continue}if(mode==='block'){if(c==='*'&&n==='/'){mode='code';i++}continue}if(mode==='string'){if(c==='\\'){i++;continue}if(c===quote)mode='code';continue}if(mode==='template'){if(c==='\\'){i++;continue}if(c.charCodeAt(0)===96)mode='code';continue}if(c==='/'&&n==='/'){mode='line';i++;continue}if(c==='/'&&n==='*'){mode='block';i++;continue}if(c==="'"||c==='"'){mode='string';quote=c;continue}if(c.charCodeAt(0)===96){mode='template';continue}if(c==='{')depth++;else if(c==='}'){depth--;if(depth===0){i++;break}}}if(depth===0){const src=source.slice(start,i);if(!needle||src.includes(needle))out.push(src)}}if(out.length!==1)throw new Error('extract '+name+' '+needle+' count='+out.length);return out[0]}
ok(rp.version==='0.3.56'&&wp.version==='0.3.56','versions');ok(rel.version==='0.3.56'&&rel.revision==='r529-official-0.3.56','release');ok(html.includes('app-v529.js')&&html.includes('app-v529.css'),'assets');
ok(js.includes("window.__ctR529Marker='home-normal-flow+main-anchor+single-f1-ufc-wwe-opener'"),'marker');
const r388=region("window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';");
const main=extractNamed(r388,'homeMain393','insertAdjacentElement');ok(main.includes("history.insertAdjacentElement('afterend',tabs)"),'tabs dock after hidden history');
const align=extractNamed(r388,'homeAlign507','ct529HomeStart');ok(!align.includes('tabsRect')&&align.includes('homeOffset500(target,root)-8'),'main target direct anchor');
const req=extractNamed(r388,'homeRequest507','ctR529HomeAnchor');ok(req.includes('homeMain393(k)'),'dock controls before anchor');
ok(css.includes('position:static!important')&&css.includes('[data-home] .home-tabs'),'tabs normal-flow');
ok(css.includes('.search-global{')&&css.includes('position:relative!important'),'search normal-flow');
ok(css.includes('[data-home]{padding-top:0!important}'),'legacy toolbar spacer removed');
ok(js.includes("window.__ctR513SeriesScreenMarker='r520-three-special-series-full-screen-owner'"),'canonical special screen');
ok(!js.includes("window.__ctR524SpecialOpenMarker='direct-special-card-owner-no-route-gate'"),'r524 opener retired');
ok(!js.includes("window.__ctR527Marker='home-v527-live-status+movies-real-renderer+discover-10x10-audited+special-pointerdown+f1-gp-detail'"),'r527 opener retired');
const tail=js.slice(js.lastIndexOf('/* CineTracker Web 0.3.56 r529'));for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])ok(!tail.includes(bad),'forbidden '+bad);
console.log('WEB_R529_REGRESSION_OK');
