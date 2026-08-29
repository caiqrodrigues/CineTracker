import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const root=resolve(process.cwd());
const source=resolve(root,'apps/web/patch-v132-v0997-deeplink-pages.js');
const name='patch-v134c-v0997-deeplink-details.js';
let js=await readFile(source,'utf8');
js=js.replaceAll('__ct0997DeepLink132Loaded','__ct0997DeepLink134Loaded').replaceAll('__ct0997DeepLink132','__ct0997DeepLink134').replaceAll('v132-url-router-fullscreen-details-profile-10-more','v134-deeplink-fullscreen-details-profile-10-more').replaceAll('ct0997-deeplink132-style','ct0997-deeplink134-style');
const anchor="document.getElementById(style.id)?.remove();document.head.appendChild(style);";
const extra=`\n#ct120-profile [data-ct120-slot=\"series\"] .ct132-profile-preview>.ct120-card:nth-child(-n+10),#ct120-profile [data-ct120-slot=\"movies\"] .ct132-profile-preview>.ct120-card:nth-child(-n+10),#ct120-profile [data-ct120-slot=\"series-favorites\"] .ct132-profile-preview>.ct120-card:nth-child(-n+10),#ct120-profile [data-ct120-slot=\"movie-favorites\"] .ct132-profile-preview>.ct120-card:nth-child(-n+10){display:block!important}\n#ct120-profile [data-ct120-slot=\"series\"] .ct132-profile-preview>.ct120-card:nth-child(n+11),#ct120-profile [data-ct120-slot=\"movies\"] .ct132-profile-preview>.ct120-card:nth-child(n+11),#ct120-profile [data-ct120-slot=\"series-favorites\"] .ct132-profile-preview>.ct120-card:nth-child(n+11),#ct120-profile [data-ct120-slot=\"movie-favorites\"] .ct132-profile-preview>.ct120-card:nth-child(n+11){display:none!important}\n#ct120-profile [data-ct120-slot=\"actors\"] .ct132-one-line>.ct120-actor:nth-child(-n+10){display:block!important}#ct120-profile [data-ct120-slot=\"actors\"] .ct132-one-line>.ct120-actor:nth-child(n+11){display:none!important}\n#ct120-profile .ct132-more-card{display:grid!important}\n#ct120-page[data-ct120-route=\"settings\"] .content,#ct120-page[data-ct120-route=\"settings\"] .ct91-settings,#ct120-page[data-ct120-route=\"settings\"] .ct127-settings,#ct120-page[data-ct120-route=\"settings\"] .ct128-settings{width:100%!important;max-width:none!important;min-width:0!important;box-sizing:border-box!important}\n@media(min-width:851px){#ct120-page[data-ct120-route=\"settings\"] .ct91-settings,#ct120-page[data-ct120-route=\"settings\"] .ct127-settings,#ct120-page[data-ct120-route=\"settings\"] .ct128-settings{grid-template-columns:repeat(2,minmax(0,1fr))!important}}\n`;
if(!js.includes(anchor))throw new Error('r134 routes style anchor missing');
js=js.replace(anchor,`style.textContent+=${JSON.stringify(extra)};\n${anchor}`);
const oldBoot="normalizeNav();for(const d of[0,100,350,900,1800])setTimeout(()=>{normalizeNav();void routeCurrent(d>0)},d);";
const newBoot="normalizeNav();setTimeout(()=>{normalizeNav();const r=parseRoute(),dom=$('#ct120-page')?.dataset?.ct120Route||'';if(r.kind==='primary'){if(dom!==r.key)void routeCurrent(true);else if(r.key==='profile'){watchProfile();enhanceProfilePreview()}}else void routeCurrent(true)},180);";
if(!js.includes(oldBoot))throw new Error('r134 repeated primary boot block missing');
js=js.replace(oldBoot,newBoot);
const oldAuth="window.addEventListener('cinetracker:auth-state-change',()=>setTimeout(()=>void routeCurrent(true),120));";
const newAuth="window.addEventListener('cinetracker:auth-state-change',()=>setTimeout(()=>{const r=parseRoute(),dom=$('#ct120-page')?.dataset?.ct120Route||'';if(r.kind!=='primary'||dom!==r.key)void routeCurrent(true);else if(r.key==='profile'){watchProfile();enhanceProfilePreview()}},140));";
if(js.includes(oldAuth))js=js.replace(oldAuth,newAuth);
if(!js.includes("mMovie=p.match(/^\\/movie\\/(\\d+)"))throw new Error('r134 deep-link route parser missing');
for(const dir of [resolve(root,'dist'),resolve(root,'apps/web/dist')]){
  await writeFile(resolve(dir,name),js,'utf8');
  const p=resolve(dir,'index.html');let html=await readFile(p,'utf8');const tag=`<script src="/${name}"></script>`;html=html.replaceAll(tag,'');
  html=html.replace('</body>',`${tag}</body>`);await writeFile(p,html,'utf8');
}
console.log('WEB_R134_ROUTES full-screen media/person routes + Profile 10+ fresh runtime emitted');
