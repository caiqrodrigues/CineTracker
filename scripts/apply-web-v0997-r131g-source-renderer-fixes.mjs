import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const root=resolve(process.cwd());
const targets=[resolve(root,'dist'),resolve(root,'apps/web/dist')];

for(const dir of targets){
  // 1) Home 0.99.4 is still the stable renderer. Fix the renderer itself:
  // denominator = canonical total, while "Faltam" only counts already released episodes.
  const homePath=resolve(dir,'patch-v099-v0994-web.js');
  let home=await readFile(homePath,'utf8');
  const homePattern=/function rowSeries994\(x\)\{[\s\S]*?\n\}\nfunction rowMovie994/;
  if(!homePattern.test(home))throw new Error(`r131g: rowSeries994 source not found in ${homePath}`);
  home=home.replace(homePattern,`function rowSeries994(x){
  const rel=Math.max(0,Number(x.released_episodes||0)),seen=Math.max(0,Number(x.watched_episodes||0)),total=Math.max(rel,seen,Number(x.total_episodes||0)),missing=Math.max(0,rel-seen),last=x.last_watched_at?new Date(x.last_watched_at).toLocaleDateString('pt-BR'):'Sem atividade';
  const poster=x.poster_path?' style="background-image:url(\\''+img(x.poster_path)+'\\')"':'';
  const progress=seen+'/'+String(total||'?')+' · '+(missing>0?'Faltam '+missing:'Em dia');
  return '<div class="ct992-row" data-ct994-open="'+x.media_id+'"><div class="ct992-poster"'+poster+'></div><div class="ct992-info"><div class="ct992-title">'+esc(x.title)+'</div><div class="ct992-meta">'+progress+'</div><div class="ct992-sub">'+esc(last)+'</div></div></div>';
}
function rowMovie994`);
  if(home.includes("${seen}/${rel||'?'} · Faltam ${missing}"))throw new Error('r131g: legacy Home progress formatter survived');
  if(!home.includes("Number(x.total_episodes||0)")||!home.includes("missing>0?'Faltam '+missing:'Em dia'"))throw new Error('r131g: new Home progress formatter missing');
  await writeFile(homePath,home,'utf8');

  // 2) v126 repeatedly forced Profile back to 4 cards. Make that reconciliation itself use 10,
  // including favorite media and actors, so later bursts cannot undo the desired contract.
  const profilePath=resolve(dir,'patch-v126-v0997-video3124-recovery.js');
  let profile=await readFile(profilePath,'utf8');
  const profilePattern=/function applyFourMore\(name\)\{[^\n]*\}\nfunction cleanupProfile\(\)\{[^\n]*\}/;
  if(!profilePattern.test(profile))throw new Error(`r131g: applyFourMore source not found in ${profilePath}`);
  profile=profile.replace(profilePattern,`function applyTenMore(name){const sec=findProfileSection(name);if(!sec)return;const row=sec.querySelector('.ct120-row,.ct118-row');if(!row)return;row.classList.add('ct126-profile-grid');const cards=[...row.children].filter(x=>x.matches?.('.ct120-card,.ct118-card'));if(!cards.length)return;row.querySelectorAll(':scope > .ct124-more,:scope > .ct122-more-card,:scope > .ct126-more').forEach(x=>x.remove());cards.forEach((c,i)=>{c.hidden=i>=10});if(cards.length<=10)return;const more=document.createElement('button');more.type='button';more.className='ct126-more';more.innerHTML=\`<span><b>Ver mais</b><small>+\${cards.length-10}</small></span>\`;let open=false;more.onclick=()=>{open=!open;cards.forEach((c,i)=>{c.hidden=!open&&i>=10});more.querySelector('b').textContent=open?'Mostrar menos':'Ver mais';more.querySelector('small').textContent=open?'':\`+\${cards.length-10}\`};row.appendChild(more)}
function applyTenActors(){const sec=findProfileSection('Atores Favoritos');if(!sec)return;const row=sec.querySelector('.ct120-actors,.ct118-actors');if(!row)return;const cards=[...row.children].filter(x=>x.matches?.('.ct120-actor,.ct118-actor,.ct118-person'));if(!cards.length)return;row.querySelectorAll(':scope > .ct126-more').forEach(x=>x.remove());cards.forEach((c,i)=>{c.hidden=i>=10});if(cards.length<=10)return;const more=document.createElement('button');more.type='button';more.className='ct126-more';more.innerHTML=\`<span><b>Ver mais</b><small>+\${cards.length-10} atores</small></span>\`;let open=false;more.onclick=()=>{open=!open;cards.forEach((c,i)=>{c.hidden=!open&&i>=10});more.querySelector('b').textContent=open?'Mostrar menos':'Ver mais';more.querySelector('small').textContent=open?'':\`+\${cards.length-10} atores\`};row.appendChild(more)}
function cleanupProfile(){if(route()!=='profile')return;removeStandaloneHistory();applyTenMore('Séries');applyTenMore('Filmes');applyTenMore('Séries Favoritas');applyTenMore('Filmes Favoritos');applyTenActors()}`);
  if(profile.includes('applyFourMore(')||profile.includes('cards.length-4'))throw new Error('r131g: Profile four-card override survived');
  if(!profile.includes("applyTenMore('Séries Favoritas')")||!profile.includes('applyTenActors()'))throw new Error('r131g: Profile 10+ favorite/actor contract missing');
  await writeFile(profilePath,profile,'utf8');

  // 3) v124 has a MutationObserver that keeps reclaiming Discover. Once r131 is loaded,
  // v124 must yield instead of repainting the older six-tab contract.
  const discoverPath=resolve(dir,'patch-v124-v0997-video-smoke-authority.js');
  let discover=await readFile(discoverPath,'utf8');
  const oldEnsure="function ensureDiscover(){if(route()!=='discover')return;";
  const newEnsure="function ensureDiscover(){if(window.__ct0997MediaDiscover131Loaded)return;if(route()!=='discover')return;";
  if(!discover.includes(oldEnsure))throw new Error(`r131g: v124 ensureDiscover source not found in ${discoverPath}`);
  discover=discover.replace(oldEnsure,newEnsure);
  await writeFile(discoverPath,discover,'utf8');
}

console.log('WEB_R131G_APPLIED home=total+released profile=10-more discover=v124-yields-r131');
