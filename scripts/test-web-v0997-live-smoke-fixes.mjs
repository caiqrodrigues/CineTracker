import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const src=await readFile(resolve(root,'apps/web/patch-v122-v0997-live-smoke-fixes.js'),'utf8');
const html=await readFile(resolve(root,'dist/index.html'),'utf8');
const pkg=JSON.parse(await readFile(resolve(root,'package.json'),'utf8'));
const must=(ok,msg)=>{if(!ok)throw new Error(msg)};

must(pkg.version==='0.99.7','0.99.7 live smoke: version bump proibido');
must(src.includes("HOME_RPC_122='cinetracker_profile_home_payload_v0994'"),'Home fast fallback ausente');
must(src.includes('mapHomeFallback122')&&src.includes('1800'),'Home deve abandonar espera longa e usar fallback rápido');
must(src.includes('data-ct122-watch')&&src.includes("action:'watchlist'"),'Descobrir sem ação de Watchlist');
must(src.includes('Minha Watchlist')&&src.includes('watchlistCalendarItems122'),'Calendário sem filtro Minha Watchlist');
must(src.includes('cinetracker_discovery_exclusions_v0994')&&src.includes('knownContext122'),'Exclusões robustas do Descobrir ausentes');
must(src.includes("cards.forEach((c,i)=>c.hidden=i>=10)")&&src.includes('data-ct122-profile-more'),'Perfil deve mostrar 10 + Ver mais');
must(src.includes("t!=='tempo de tela'&&t!=='historico'"),'Limpeza de Tempo de Tela/Histórico ausente');
must(src.includes('.content>.mobile-nav,#ct120-page .mobile-nav{display:none!important}'),'Menu inferior deve ficar oculto no desktop');
must(src.includes('max-width:calc(100vw - 180px)'),'Enquadramento desktop ausente');
const a=html.indexOf('<script src="/patch-v121-v0997-functional-polish.js"></script>');
const b=html.indexOf('<script src="/patch-v122-v0997-live-smoke-fixes.js"></script>');
must(a>=0&&b>a,'v122 deve ser emitida depois da v121');
must((html.match(/patch-v122-v0997-live-smoke-fixes\.js/g)||[]).length===1,'v122 duplicada no HTML final');
console.log('CineTracker 0.99.7 live smoke fixes: PASS');
