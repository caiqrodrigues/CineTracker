import {readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd()),runtime=(await readFile(resolve(root,'apps/web/runtime-r249-single-authority.js'),'utf8')).replaceAll('</script>','<\\/script>');
if(runtime.includes('new MutationObserver'))throw new Error('r249 authority must be event-driven, not observer-driven');
const dir='/tmp/ct-r249-authority';await mkdir(dir,{recursive:true});let bin='';for(const c of ['google-chrome','chromium','chromium-browser'])try{execFileSync('which',[c],{stdio:'ignore'});bin=c;break}catch{}if(!bin)throw new Error('Chromium unavailable');
try{
 const html=resolve(dir,'index.html');
 await writeFile(html,`<!doctype html><html><body>
 <div id="p-discover" data-page="discover"><div data-discover-content id="discover-content"></div><div class="rail"><div class="card">card</div></div></div>
 <div id="p-sports" data-page="sports"><button id="legacy-events">Eventos</button></div>
 <div id="p-profile" data-page="profile"><div class="profile-main"><div class="ct248-profile-grid">main stats</div></div></div>
 <div class="ct248-f1hub"><button data-ct248-f1collapse>Minimizar</button><div class="ct248-f1body">F1</div></div>
 <div class="seasons">temporadas</div>
 <script>
 window.__probeErrors=[];addEventListener('error',e=>__probeErrors.push(String(e.message||e.error)));addEventListener('unhandledrejection',e=>__probeErrors.push(String(e.reason)));
 localStorage.setItem('ct:f1hub:collapsed:r249','1');
 window.discoverState={tab:'foryou',type:'all'};window.sportsState={tab:'next',page:0,events:[]};
 window.discoverRows=async function(tab){await new Promise(r=>setTimeout(r,tab==='foryou'?480:45));return [{title:tab}]};
 window.paintDiscover=function(rows){document.getElementById('discover-content').textContent=rows?.[0]?.title||'empty'};
 window.renderSports=async function(){return true};window.paintHome=function(){};window.homeCache={series:[]};
 </script><script>${runtime}</script><script>
 const old=discoverRows('foryou').then(rows=>paintDiscover(rows));
 setTimeout(()=>{discoverState.tab='new';discoverRows('new').then(rows=>paintDiscover(rows))},15);
 setTimeout(()=>{
   const p=document.getElementById('p-profile'),dup=document.createElement('section');dup.className='ct-r247-sports-stats';dup.innerHTML='<h3>Estatísticas de esporte</h3>';p.appendChild(dup);
   const legacy=document.createElement('button');legacy.textContent='Agenda';document.getElementById('p-sports').appendChild(legacy);
   document.querySelector('.ct248-f1body').hidden=false;document.querySelector('.ct248-f1hub').classList.remove('collapsed');
   document.dispatchEvent(new Event('cinetracker:data-changed'));
 },2150);
 setTimeout(()=>{
   const tabs=[...document.querySelectorAll('[data-ct249-sport-tab]')].map(x=>x.textContent.trim()).join('|');
   document.body.dataset.done='1';document.body.dataset.marker=String(window.__ctR249||'');document.body.dataset.discover=document.getElementById('discover-content').textContent.trim();document.body.dataset.dropped=String(window.__ctR249DiscoverDropped||0);document.body.dataset.tabs=tabs;
   document.body.dataset.legacy=String([...document.querySelectorAll('#p-sports button')].some(x=>/eventos|agenda/i.test(x.textContent)));
   document.body.dataset.profileDup=String(!!document.querySelector('.ct-r247-sports-stats'));
   document.body.dataset.f1Hidden=String(document.querySelector('.ct248-f1body').hidden);
   document.body.dataset.xrail=String(document.querySelector('.seasons').classList.contains('ct249-xrail'));
   document.body.dataset.errors=__probeErrors.join('|');
 },4250);
 </script></body></html>`,'utf8');
 const out=execFileSync(bin,['--headless','--no-sandbox','--disable-gpu','--disable-background-networking','--disable-component-update','--disable-sync','--no-first-run','--no-default-browser-check',`--user-data-dir=${resolve(dir,'profile')}`,'--virtual-time-budget=5200','--dump-dom','file://'+html],{encoding:'utf8',timeout:30000,stdio:['ignore','pipe','pipe']});
 const must=x=>{if(!out.includes(x))throw new Error('R249 authority missing '+x+' '+(out.match(/<body[^>]*>/)?.[0]||''))};
 for(const x of ['data-done="1"','data-marker="single-authority-current-ui"','data-discover="new"','data-tabs="Próximos|Anteriores|Favoritos|Assistidos"','data-legacy="false"','data-profile-dup="false"','data-f1-hidden="true"','data-xrail="true"'])must(x);
 const dropped=Number((out.match(/data-dropped="(\d+)"/)||[])[1]||0);if(dropped<1)throw new Error('R249 did not reject delayed stale Discover paint');
 const errors=(out.match(/data-errors="([^"]*)"/)||[])[1]||'';if(errors)throw new Error('R249 authority browser errors '+errors);
 console.log('R249_AUTHORITY_OK stale-discover=dropped sports=4-tabs delayed-overwrite=reconciled f1=persistent profile=single xrail=local');
}finally{await rm(dir,{recursive:true,force:true})}
