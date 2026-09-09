import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url));
const [runtime,build,pkg]=await Promise.all([
 readFile(resolve(root,'runtime-r239-video-ground-truth.js'),'utf8'),
 readFile(resolve(root,'build-r239.mjs'),'utf8'),
 readFile(resolve(root,'package.json'),'utf8')
]);
const need=(s,x,label=x)=>{if(!s.includes(x))throw new Error('r239 invariant missing: '+label)};
need(runtime,"window.__ctR239='production-video-ground-truth'");
need(runtime,"window.__ctR239Profile='exact-four-column-reference-layout'");
need(runtime,'grid-template-columns:repeat(4,minmax(0,1fr))','Profile must be four columns on desktop');
need(runtime,'.ct239-profile-total{grid-column:span 2','Profile totals must each span half width');
for(const x of ['Indicação do dia','Da sua Watchlist','100% novos'])need(runtime,x,'Discover heading '+x);
need(runtime,'ct166RenderForYou(lastForYou239)','Discover must use semantic r166 renderer');
need(runtime,'width:200px!important','Discover recommendation width');
need(runtime,"desired=off?'↶ Desmarcar assistido':'✓ Assistido'",'Sports exact action');
need(runtime,'background:#0a1b25!important','Sports canonical dark button');
need(runtime,'border-radius:10px!important','Sports canonical radius');
for(const x of ['visao geral','ultimo gp','voltas','grid de largada'])need(runtime,x,'F1 legacy tab '+x);
need(runtime,"headerTop.after(shell)",'F1 canonical group must move directly below header');
need(runtime,"child.hidden=!open",'F1 collapse must hide complete body');
need(build,"window.__ctR239SetF1Open(card,card.dataset.ct236F1Open!=='0')",'old F1 capture handler must delegate to r239');
need(build,"patch=patch.replaceAll('globalThis.discoverState?.tab','discoverState?.tab')",'Discover must bind app lexical state');
const p=JSON.parse(pkg);if(p.version!=='1.0.31'||p.scripts?.build!=='node build-r239.mjs'||p.scripts?.verify!=='node build-r239.mjs && node test-r239.mjs')throw new Error('r239 package identity wrong');
for(const forbidden of ['Stuart','Lioness','WWE Raw'])if(runtime.includes(forbidden))throw new Error('r239 may not hardcode media title '+forbidden);
console.log('R239_STATIC_OK profile=reference discover=3-sections sports=canonical f1=single+collapse');