import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

if(process.env.CT_R310_SKIP_BUILD!=='1')await import('./build-r310.mjs');
const [js,html,releaseRaw]=await Promise.all([
 readFile(resolve('dist/app-v310.js'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8')
]);
const r=JSON.parse(releaseRaw),ok=(v,m)=>{if(!v)throw new Error('R310_STATIC '+m)};

ok(r.version==='1.0.101'&&r.revision==='r310-official-1.0.101','release identity');
ok(html.includes('app-v310.js')&&html.includes('app-v310.css'),'assets');
ok(js.includes("window.__ctWebBuild='1.0.101';window.__ctOfficialVersion='1.0.101';"),'runtime version');
ok(js.includes("const REVISION='r310-official-1.0.101';"),'revision');
ok(js.includes("window.__ctR310='delayed-authorities-retired+canonical-watchlist+profile-sports-truth+actor-bottom-scroll'"),'r310 runtime');

ok(js.includes("function ensureDiscoverTabs252(){return false}"),'r252 tab injector not retired');
ok(!js.includes("add('releases','Lançamentos','anticipated')"),'r252 can recreate Lançamentos');
ok(js.includes("function guardBrowse300(){return false}"),'r300 guard not retired');
ok(!js.includes("function guardBrowse300(tab,delay=2200)"),'r300 delayed recovery survived');
ok(js.includes("function queueRefresh(){return false}"),'r293 queued repaint not retired');
ok(!js.includes("setTimeout(()=>void refresh(true),180)"),'r293 click repaint survived');

ok(js.includes("cinetracker_watchlist_full_v119"),'canonical Watchlist RPC missing');
ok(js.includes("if(watch?.keys?.has?.(k))return true"),'canonical Watchlist exclusion missing');
ok(js.includes("data-ct310-action=\"watchlist\"")&&js.includes("data-ct310-action=\"seen\""),'two canonical card actions missing');
ok(js.includes("saved?'✓ Watchlist':'+ Watchlist'"),'state-aware Watchlist label missing');

ok(js.includes("const historyP=ct309ProfileBound(rpc('cinetracker_sports_watch_history_v296'"),'canonical sports history not first-paint input');
ok(js.includes("history.filter(x=>x?.is_watched!==false).length"),'exact sports history count missing');
ok(js.includes("merged.sports_stats={...(sports||{}),...(merged.sports_stats||{})}"),'full sports payload does not override legacy fallback');
ok(!js.includes("merged.sports_stats=sports||merged.sports_stats||{}"),'legacy sports overwrite survived');

ok(js.includes("staleLive=String(e?.status||'').toLowerCase()==='live'"),'stale live normalization missing');
ok(js.includes("finished=['finished','ended','final'].includes(String(e?.status||'').toLowerCase())||staleLive"),'stale live does not render ended');

ok(js.includes('ct310-actor-scroll')&&js.includes("rail.after(proxy)"),'bottom actor scroll proxy missing');
ok(js.includes(".ct310-actor-section>*:not(.ct310-actor-scroll){scrollbar-width:none!important}"),'old actor scrollbars not hidden');
ok(js.includes('CineTracker • v1.0.101'),'footer version not updated');
ok(!js.includes('CineTracker • v1.0.57'),'stale footer still shipped');

ok(r.discover_r252_tab_injector===false,'release r252 flag');
ok(r.discover_r300_delayed_recovery===false,'release r300 flag');
ok(r.discover_watchlist_excluded_before_paint===true,'release Watchlist exclusion');
ok(r.profile_sports_count==='cinetracker_sports_watch_history_v296','release sports source');
ok(r.profile_actor_scroll==='bottom-proxy-only','release actor scroll');
ok(r.sports_stale_live_normalized===true,'release stale live');
ok(r.android==='1.0.20/10062','Android changed');
console.log('R310_STATIC_OK new-video delayed authority and canonical-state regressions locked');
