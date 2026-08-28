import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const dirs=[resolve(root,'dist'),resolve(root,'apps/web/dist')];
const patch='patch-v126-v0997-video3124-recovery.js';
const source=resolve(root,'apps/web',patch);

const oldCss='#ct120-profile [data-ct120-slot="series"] .ct120-row,#ct120-profile [data-ct120-slot="movies"] .ct120-row,.ct126-profile-grid{display:grid!important;grid-template-columns:repeat(auto-fill,minmax(128px,1fr))!important;grid-auto-flow:row!important;grid-auto-columns:auto!important;max-width:100%!important;width:100%!important;overflow-x:hidden!important;gap:10px!important}.ct126-more{';
const newCss=`#ct43-profile{display:none!important}
#ct120-profile [data-ct120-slot="series"] .ct120-card:nth-child(n+5),#ct120-profile [data-ct120-slot="movies"] .ct120-card:nth-child(n+5),#ct120-profile [data-ct120-slot="series-favorites"] .ct120-card:nth-child(n+5),#ct120-profile [data-ct120-slot="movie-favorites"] .ct120-card:nth-child(n+5),#ct120-profile [data-ct120-slot="actors"] .ct120-actor:nth-child(n+5),#ct118-profile .ct118-section .ct118-card:nth-child(n+5),#ct118-profile .ct118-actors .ct118-actor:nth-child(n+5){display:none!important}
#ct120-profile .ct126-profile-grid.ct126-expanded .ct120-card:nth-child(n+5),#ct120-profile .ct126-profile-grid.ct126-expanded .ct120-actor:nth-child(n+5),#ct118-profile .ct126-profile-grid.ct126-expanded .ct118-card:nth-child(n+5),#ct118-profile .ct126-profile-grid.ct126-expanded .ct118-actor:nth-child(n+5){display:block!important}
.ct126-profile-grid{display:grid!important;grid-template-columns:repeat(auto-fill,minmax(128px,1fr))!important;grid-auto-flow:row!important;grid-auto-columns:auto!important;max-width:100%!important;width:100%!important;overflow-x:hidden!important;gap:10px!important}.ct126-more{`;
const oldMobile='@media(max-width:720px){#ct120-profile [data-ct120-slot="series"] .ct120-row,#ct120-profile [data-ct120-slot="movies"] .ct120-row,.ct126-profile-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}}';
const newMobile='@media(max-width:720px){.ct126-profile-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}}';
const oldRemove="function removeStandaloneHistory(){if(route()!=='profile')return;const content=$$('.content').filter(visible).at(-1);";
const newRemove="function removeStandaloneHistory(){if(route()!=='profile')return;document.getElementById('ct43-profile')?.remove();const content=$$('.content').filter(visible).at(-1);";
const oldApply="function applyFourMore(name){const sec=findProfileSection(name);if(!sec)return;const row=sec.querySelector('.ct120-row,.ct118-row');if(!row)return;row.classList.add('ct126-profile-grid');const cards=[...row.children].filter(x=>x.matches?.('.ct120-card,.ct118-card'));if(!cards.length)return;row.querySelectorAll(':scope > .ct124-more,:scope > .ct122-more-card,:scope > .ct126-more').forEach(x=>x.remove());cards.forEach((c,i)=>{c.hidden=i>=4});if(cards.length<=4)return;const more=document.createElement('button');more.type='button';more.className='ct126-more';more.innerHTML=`<span><b>Ver mais</b><small>+${cards.length-4}</small></span>`;let open=false;more.onclick=()=>{open=!open;cards.forEach((c,i)=>{c.hidden=!open&&i>=4});more.querySelector('b').textContent=open?'Mostrar menos':'Ver mais';more.querySelector('small').textContent=open?'':`+${cards.length-4}`};row.appendChild(more)}";
const newApply="function applyFourMore(name){const sec=findProfileSection(name);if(!sec)return;const row=sec.querySelector('.ct120-row,.ct118-row,.ct120-actors,.ct118-actors');if(!row)return;row.classList.add('ct126-profile-grid');const cards=[...row.children].filter(x=>x.matches?.('.ct120-card,.ct118-card,.ct120-actor,.ct118-actor'));if(!cards.length)return;const signature=String(cards.length);const existing=row.querySelector(':scope > .ct126-more');if(row.dataset.ct126Four===signature&&(cards.length<=4||existing))return;row.querySelectorAll(':scope > .ct124-more,:scope > .ct122-more-card,:scope > .ct126-more').forEach(x=>x.remove());row.classList.remove('ct126-expanded');cards.forEach((c,i)=>{c.hidden=i>=4});row.dataset.ct126Four=signature;if(cards.length<=4)return;const actorMode=cards.some(x=>x.matches?.('.ct120-actor,.ct118-actor'));const more=document.createElement('button');more.type='button';more.className='ct126-more'+(actorMode?' ct126-more-actor':'');more.innerHTML=`<span><b>Ver mais</b><small>+${cards.length-4}</small></span>`;let open=false;more.onclick=()=>{open=!open;row.classList.toggle('ct126-expanded',open);cards.forEach((c,i)=>{c.hidden=!open&&i>=4});more.querySelector('b').textContent=open?'Mostrar menos':'Ver mais';more.querySelector('small').textContent=open?'':`+${cards.length-4}`};row.appendChild(more)}";
const oldCleanup="function cleanupProfile(){if(route()!=='profile')return;removeStandaloneHistory();applyFourMore('Séries');applyFourMore('Filmes')}";
const newCleanup="function cleanupProfile(){if(route()!=='profile')return;removeStandaloneHistory();applyFourMore('Séries');applyFourMore('Filmes');applyFourMore('Séries Favoritas');applyFourMore('Filmes Favoritos');applyFourMore('Atores Favoritos')}";
const legacyRun="function run(){if(!currentUser)return;insertProfileBlocks();hydrateAll();if(typeof view!=='undefined'&&view==='settings')document.body.classList.add('ct43-settings-fix');else document.body.classList.remove('ct43-settings-fix')}";
const fixedLegacyRun="function run(){if(!currentUser)return;document.getElementById('ct43-profile')?.remove();hydrateAll();if(typeof view!=='undefined'&&view==='settings')document.body.classList.add('ct43-settings-fix');else document.body.classList.remove('ct43-settings-fix')}";

for(const dir of dirs){
  const legacy43=resolve(dir,'patch-v043.js');
  let legacyJs=await readFile(legacy43,'utf8');
  if(!legacyJs.includes(legacyRun))throw new Error(`Profile no-flicker: legacy v043 run hook missing in ${legacy43}`);
  legacyJs=legacyJs.replace(legacyRun,fixedLegacyRun);
  await writeFile(legacy43,legacyJs,'utf8');

  const out=resolve(dir,patch);
  await copyFile(source,out);
  let js=await readFile(out,'utf8');
  for(const [from,to,label] of [[oldCss,newCss,'profile immediate css'],[oldMobile,newMobile,'mobile grid css'],[oldRemove,newRemove,'legacy profile removal'],[oldApply,newApply,'idempotent four-plus-more function'],[oldCleanup,newCleanup,'all profile card sections']]){
    if(!js.includes(from))throw new Error(`Video3124 profile transform missing: ${label}`);
    js=js.replace(from,to);
  }
  await writeFile(out,js,'utf8');

  const indexPath=resolve(dir,'index.html');
  let html=await readFile(indexPath,'utf8');
  html=html.replace(new RegExp(`<script src="/${patch.replaceAll('.','\\.')}"></script>`,'g'),'');
  const anchor='<script src="/patch-v125-v0997-restore-foryou-contract.js"></script>';
  if(!html.includes(anchor))throw new Error(`Video3124 recovery: v125 anchor missing in ${indexPath}`);
  html=html.replace(anchor,`${anchor}<script src="/${patch}"></script>`);
  await writeFile(indexPath,html,'utf8');
}
console.log('CineTracker Web 0.99.7: Perfil sem flicker, 4+Ver mais idempotente e legado Histórico/Tempo de Tela desativado na origem.');
