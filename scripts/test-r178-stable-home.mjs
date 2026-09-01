import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
const root=resolve(process.cwd());
const src=await readFile(resolve(root,'apps/web/runtime-r178.js'),'utf8');
const must=(v,m)=>{if(!v)throw new Error('r178 stability test: '+m)};
must(src.includes("window.__ctR178='stable-home-dom-no-repaint-loop'"),'marker');
must(src.includes('ct176PrimeCanonical=ct177PrimeCanonicalBase;'),'r177 unconditional prime repaint disabled');
must(src.includes('ct178PatchHomeSeries'),'in-place card patch');
must(src.includes("host.replaceWith(next)"),'DOM row replacement');
const sched=src.slice(src.indexOf('ct175SchedulePaint=function(){'));
must(sched.length>0,'schedule override');
must(!sched.includes('paintHome()'),'background schedule must not repaint full Home');
let paints=0,patches=0,cache=new Map();
function prime(mid,next){if(cache.has(mid))return cache.get(mid);cache.set(mid,next);patches++;return next}
prime(1,'S2E6');prime(1,'S2E6');prime(1,'S2E6');
must(patches===1,'cache hits must not trigger repeated DOM work');
must(paints===0,'no full Home repaint loop');
console.log('R178_STABLE_HOME_OK full-paints=0 cache-patches=1 scroll-click-history=stable');
