import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

if(process.env.CT_R309_SKIP_BUILD!=='1')await import('./build-r309.mjs');
const [js,css,html,releaseRaw]=await Promise.all([
 readFile(resolve('dist/app-v309.js'),'utf8'),
 readFile(resolve('dist/app-v309.css'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8')
]);
const release=JSON.parse(releaseRaw);
const ok=(v,m)=>{if(!v)throw new Error('R309_STATIC '+m)};

ok(release.version==='1.0.100','release version');
ok(release.revision==='r309-official-1.0.100','release revision');
ok(html.includes('app-v309.js')&&html.includes('app-v309.css'),'r309 assets');
ok(js.includes("window.__ctWebBuild='1.0.100';window.__ctOfficialVersion='1.0.100';"),'runtime version');
ok(js.includes("const REVISION='r309-official-1.0.100';"),'runtime revision');
ok(js.includes("window.__ctR309='video-truth-discover-first-paint-f1-stable-profile'"),'r309 runtime');

const tabs8="const DTABS263=[['foryou','Pra você'],['top10','Top 10'],['trending','Em alta'],['popular','Populares'],['new','Novidades'],['anticipated','Mais Aguardados'],['top','Mais bem avaliados'],['calendar','Calendário']];";
ok(js.includes(tabs8),'canonical eight Discover tabs');
ok(!js.includes("const DTABS263=[['foryou','Pra você'],['top10','Top 10'],['trending','Em alta'],['popular','Populares'],['new','Novidades'],['releases','Lançamentos']"),'Lançamentos survived DTABS263');
ok(!js.includes("const DTABS257=[['foryou','Pra você'],['top10','Top 10'],['trending','Em alta'],['popular','Populares'],['new','Novidades'],['releases','Lançamentos']"),'Lançamentos survived DTABS257');
ok(!js.includes("releases:'Lançamentos'"),'Lançamentos survived r288 labels');

ok(js.includes("const authorityP=Promise.resolve(M.authority?.(!!force));")&&js.includes("const sourceP=sourceRows(tab,!!force);")&&js.includes("const [a,raw]=await Promise.all([authorityP,sourceP]);"),'browse authority/source not parallel');
ok(js.includes('function dedupeVisual(')&&js.includes('visual.has(id.visual)'),'visual dedupe missing');
ok(js.includes("data-ct309-action=\"watchlist\"")&&js.includes("data-ct309-action=\"seen\""),'two Discover actions missing');
ok(js.includes("grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important"),'action visibility grid missing');

ok(js.includes("const F1TABS257=[['overview','Visão geral'],['calendar','Calendário'],['standings','Classificações'],['circuits','Circuitos']];"),'r257 four-tab producer');
ok(!js.includes("const F1TABS257=[['overview','Visão geral'],['calendar','Calendário'],['standings','Classificações'],['drivers','Pilotos']"),'r257 six-tab producer survived');
ok(js.includes("function repairF1257(){return false}"),'r257 repair still active');
ok(!js.includes("for(const ms of[0,180,700,1800])setTimeout(()=>{if(route()==='sports')void paintF1257()"),'r257 delayed repaint survived');

ok(js.includes('const ct309ProfileBound='),'canonical Profile gate missing');
ok(!js.includes("ct168PaintProfile(cached,'Atualizando estatísticas...')"),'cached Profile visible paint survived');
ok(!js.includes("ct168PaintProfile(merged,'Carregando biblioteca detalhada...')"),'quick Profile visible paint survived');
ok(!js.includes("setTimeout(()=>{if(seq===navSeq&&route()==='profile')void ct168RefreshFullProfile(seq)},220)"),'delayed full Profile refresh survived');
ok(!js.includes("setTimeout(apply,120)")&&!js.includes("setTimeout(apply,450)"),'r255 delayed Profile patch survived');
ok(!js.includes('<span class="ct117-stat-chevron" aria-hidden="true">›</span>'),'Watchlist producer chevron survived');
ok(js.includes("window.__ctR296Test?.injectStadiumMetric296?.(count)"),'stadium metric not part of canonical paint');
ok(js.includes('.ct309-profile-stable .ct309-actor-rail'),'actor rail CSS missing');

ok(release.discover_releases_tab===false,'release Lançamentos false');
ok(release.discover_parallel_personal_and_catalog===true,'release parallel loading');
ok(release.discover_visual_dedupe===true,'release visual dedupe');
ok(release.f1_r257_delayed_repaint===false,'release F1 delayed repaint');
ok(release.profile_canonical_single_paint===true,'release single Profile paint');
ok(release.profile_watchlist_chevron===false,'release Profile chevron');
ok(release.android==='1.0.20/10062','Android changed');

console.log('R309_STATIC_OK video regressions retired at producer level');
