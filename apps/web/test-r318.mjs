import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R318_SKIP_BUILD!=='1')await import('./build-r318.mjs');
const [js,html,rRaw]=await Promise.all([
 readFile(resolve('dist/app-v318.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8')
]);
const r=JSON.parse(rRaw),ok=(v,m)=>{if(!v)throw new Error('R318_STATIC '+m)};
ok(r.version==='1.0.109'&&r.revision==='r318-official-1.0.109','identity');
ok(html.includes('app-v318.js')&&html.includes('app-v318.css'),'assets');
ok(js.includes("window.__ctR318='discover-foryou-filters+strict-all-public+strict-top10'"),'runtime marker');
ok(js.indexOf('window.__ctR318EarlyCapture=true')<js.indexOf('window.__ctR317EarlyCapture=true'),'r318 capture must be first');
ok(js.includes("['all','Todos'],['movie','Filmes'],['series','Séries'],['anime','Animes']"),'Pra Você filters missing');
ok(js.includes("STRICT=new Set(['trending','popular','new','releases','anticipated','top'])"),'strict six missing');
ok(js.includes("p?.blocked?.has(k)||p?.aliases?.has(a)"),'strict pre-markup barrier missing');
ok(js.includes("const movies=strict318(raw.movies,p,false).slice(0,10),series=strict318(raw.series,p,false).slice(0,10)"),'Top10 strict filtering missing');
ok(js.includes("'primary_release_date.gte':shift318(-30)")&&js.includes("'first_air_date.gte':shift318(-30)"),'Novidades window missing');
ok(js.includes("'primary_release_date.gte':shift318(-7)")&&js.includes("'primary_release_date.lte':shift318(30)"),'Lançamentos window missing');
ok(js.includes("'primary_release_date.gte':shift318(1)")&&js.includes("'primary_release_date.lte':shift318(365)"),'Mais Aguardados window missing');
ok(r.discover_foryou_filters==='all+movies+series+anime','release filters');
ok(r.discover_top10==='providers+series+movies+strict-personal-exclusion','release top10');
ok(r.discover_public_exclusion==='seen+watchlist+progress+up-to-date+alias-before-markup','release strict exclusion');
ok(r.discover_calendar==='watchlist-exception-preserved','calendar exception');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R318_STATIC_OK Discover-only rules');
