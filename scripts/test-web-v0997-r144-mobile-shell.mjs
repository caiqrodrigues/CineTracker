import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const dirs=[resolve(root,'dist'),resolve(root,'apps/web/dist')];
const name='patch-v144-v0997-mobile-shell.js';
const navName='patch-v143-v0997-nav-gate.js';
const must=(ok,msg)=>{if(!ok)throw new Error('r144: '+msg)};
const count=(s,n)=>s.split(n).length-1;

for(const dir of dirs){
  const html=await readFile(resolve(dir,'index.html'),'utf8');
  const js=await readFile(resolve(dir,name),'utf8');
  must(js.includes("window.__ct0997MobileShell144='r144-mobile-pwa-shell'"),'marker missing');
  must(js.includes("meta.setAttribute('content','width=device-width, initial-scale=1, viewport-fit=cover')"),'viewport enforcement missing');
  must(js.includes("document.documentElement.classList.toggle('ct144-phone',isPhoneSurface())"),'phone class missing');
  must(js.includes('html.ct144-phone .sidebar{display:none!important'),'sidebar hard-hide missing');
  must(js.includes('html.ct144-phone .mobile-nav{display:grid!important'),'mobile nav force missing');
  must(js.includes('position:fixed!important'),'mobile nav must be fixed');
  must(js.includes('grid-template-columns:repeat(4,minmax(0,1fr))!important'),'four mobile nav columns missing');
  must(js.includes("addEventListener('orientationchange'"),'orientation refresh missing');
  const navAt=html.indexOf(navName),mobileAt=html.indexOf(name),appAt=html.indexOf('<div id="app">');
  must(navAt>0&&mobileAt>navAt&&appAt>mobileAt,'early order must be nav -> mobile shell -> app');
  must(count(html,name)===1,'mobile shell must execute exactly once');
}
console.log('WEB_R144_OK pwa=phone-shell viewport=device-width sidebar=never mobile-nav=4 fixed');
