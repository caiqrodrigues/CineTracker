import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

const files={
  discover:'dist/patch-v134a-v0997-discover-final.js',
  live:'dist/patch-v134b-v0997-live-home-calendar.js',
  routes:'dist/patch-v134c-v0997-deeplink-details.js',
  authority:'dist/patch-v135-v0997-final-primary-authority.js',
  v120:'dist/patch-v120-v0997-structural-authority.js',
  v126:'dist/patch-v126-v0997-video3124-recovery.js'
};
for(const p of Object.values(files))execFileSync(process.execPath,['--check',p],{stdio:'pipe'});
const [discover,live,routes,authority,v120,v126,html]=await Promise.all([
  readFile(files.discover,'utf8'),readFile(files.live,'utf8'),readFile(files.routes,'utf8'),readFile(files.authority,'utf8'),readFile(files.v120,'utf8'),readFile(files.v126,'utf8'),readFile('dist/index.html','utf8')
]);
for(const x of ['window.__ct135RenderDiscover=renderDiscover','window.__ct135EnsureDiscover=ensureDiscover',"['new','Novidades']"])if(!discover.includes(x))throw new Error('r135 discover missing '+x);
for(const x of ['window.__ct135RepairHome=repairHome','window.__ct135EnsureCalendar=ensureCalendar',"cinetracker_home_live_v0997_r2"])if(!live.includes(x))throw new Error('r135 live missing '+x);
for(const x of ['window.__ct135RenderPrimary=renderPrimary','window.__ct135EnhanceProfile=enhanceProfilePreview','window.__ct135Go=go'])if(!routes.includes(x))throw new Error('r135 routes missing '+x);
for(const x of ['__ct0997FinalAuthority135Loaded','profileNeedsRepair','__ct135RepairHome','__ct135RenderDiscover','__ct135EnsureCalendar','__ct135EnhanceProfile',"p==='/configs'"])if(!authority.includes(x))throw new Error('r135 authority missing '+x);
if(!v120.includes("if(window.__ct0997FinalAuthority135Loaded&&(r==='profile'||r==='discover'))return"))throw new Error('r135 v120 hardClean must yield');
if(!v120.includes('if(window.__ct0997FinalAuthority135Loaded)return'))throw new Error('r135 v120 data-change rerender must yield');
for(const x of ["function cleanupProfile(){if(window.__ct0997FinalAuthority135Loaded)return", "function cleanupDiscover(){if(window.__ct0997FinalAuthority135Loaded)return"])if(!v126.includes(x))throw new Error('r135 v126 must yield '+x);
const name='patch-v135-v0997-final-primary-authority.js';
if((html.match(new RegExp(name,'g'))||[]).length!==1)throw new Error('r135 authority script must appear exactly once');
const p134=html.indexOf('patch-v134c-v0997-deeplink-details.js'),p135=html.indexOf(name);if(!(p134>=0&&p135>p134))throw new Error('r135 must load after r134c');
console.log('WEB_R135_OK legacy-yield + final authority + Home r2 + Profile 10 + Discover Novidades/Calendar + Config route repair');
