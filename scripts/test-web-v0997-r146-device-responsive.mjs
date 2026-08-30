import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const must=(ok,msg)=>{if(!ok)throw new Error('r146: '+msg)};
const index=await readFile(resolve(root,'dist/index.html'),'utf8');
const nav=await readFile(resolve(root,'dist/patch-v143-v0997-nav-gate.js'),'utf8');
const primary=await readFile(resolve(root,'dist/patch-v143-v0997-primary-router.js'),'utf8');

must(index.includes('@media(max-width:850px), (max-device-width:850px)'),'index responsive bridge missing');
must(nav.includes('@media(max-width:850px), (max-device-width:850px)'),'nav responsive bridge missing');
must(primary.includes('(max-device-width:850px)'),'primary component responsive bridge missing');
must(index.includes('.app{min-height:100vh;display:grid;grid-template-columns:180px 1fr}'),'desktop Web layout was removed');
must(index.includes('.sidebar{display:none!important}')||nav.includes('.sidebar{display:none!important}'),'shared responsive sidebar rule missing');
must(index.includes('.mobile-nav{display:grid')||nav.includes('.mobile-nav{display:grid!important}'),'shared responsive bottom nav rule missing');
for(const bad of ['ct144-phone','userAgent','maxTouchPoints'])must(!nav.includes(bad),`rejected special phone mode returned: ${bad}`);
for(const asset of ['patch-v1196-v0997-persistent-preload.js?r146','patch-v134c-v0997-deeplink-details.js?r146','patch-v143-v0997-nav-gate.js?r146','patch-v143-v0997-primary-router.js?r146'])must(index.includes(asset),`fresh runtime URL missing: ${asset}`);

console.log('WEB_R146_OK one-web=true desktop-preserved=true responsive=viewport-or-device-width cache-bust=r146');
