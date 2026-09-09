import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url));
const [src,build]=await Promise.all([readFile(resolve(root,'runtime-r240-sports-four-tabs.js'),'utf8'),readFile(resolve(root,'build-r240.mjs'),'utf8')]);
const need=(s,x)=>{if(!s.includes(x))throw new Error('r240 invariant missing: '+x)};
for(const x of ["window.__ctR240='sports-four-semantic-tabs'","['next','Próximos']","['previous','Anteriores']","['favorites','Favoritos']","['watched','Assistidos']","previous:['recentes','ontem']","next:['calendario','hoje']","d>=shift(now,-3)&&d<localStart(now)","dk===today&&d.getTime()>now.getTime()&&!ended240(card)","window.__ctR240KeepEvent=keep240"])need(src,x);
for(const x of ["const REVISION='r240-official-1.0.32'","app-v240.js","version:'1.0.32'","sports_tabs:['Próximos','Anteriores','Favoritos','Assistidos']"])need(build,x);
console.log('R240_STATIC_OK sports=four-tabs+today-upcoming+three-days');