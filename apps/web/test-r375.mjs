import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
if(process.env.CT_R375_SKIP_BUILD!=='1')await import('./build-r375.mjs');
const [html,js,sw,rel,owner,src]=await Promise.all([
 readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/app-v375.js'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('runtime-r374-home-tab-scroll-reset.js'),'utf8'),readFile(resolve('runtime-r375-home-semantic-start.js'),'utf8')
]);
const r=JSON.parse(rel),ok=(v,m)=>{if(!v)throw new Error(m)};
ok(js.includes("window.__ctR375Marker='home-tab-semantic-start+history-preserved-above+no-absolute-zero'"),'r375 marker missing');
ok(r.home_tab_scroll==='first-non-history-section-under-tabs','release home_tab_scroll mismatch');
for(const x of ["function homeAnchor(","!x.matches('[data-ct274-history],[data-ct275-history],[data-ct276-history]')","target.getBoundingClientRect().top-targetTop()"])ok(owner.includes(x),'owner missing '+x);
ok(!owner.includes("document.scrollingElement.scrollTop=0")&&!owner.includes("document.body.scrollTop=0"),'absolute document zero still present');
ok(html.includes('app-v375.js')&&sw.includes('ct-web-1.0.166-r375'),'asset identity');
ok(r.version==='1.0.166'&&r.revision==='r375-official-1.0.166','release identity');
console.log('WEB_R375_TEST_OK');