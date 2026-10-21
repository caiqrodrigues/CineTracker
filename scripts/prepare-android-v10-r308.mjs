import {readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
// Official 1.0/r308; certified r307 baseline, strictly Android Home-only.
// Sports, Discover personalized v525-audited r307, F1, Web and SQL untouched.
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v10-r307-taste-home.mjs')],{cwd:root,stdio:'inherit'});
const file=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(file,'utf8');
const tag='<script data-ct-android="r307-android-stable-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
if(a<0||b<a)throw Error('Official 1.0/r307 baseline missing');
let js=html.slice(a+tag.length,b);
function one(from,to,label){
 const count=js.split(from).length-1;
 if(count!==1)throw Error('1.0/r308 '+label+' expected one anchor, found '+count);
 js=js.replace(from,to);
}
one("const REVISION='r307-android-official-1.0';","const REVISION='r308-android-official-1.0';",'revision');
one("window.__ctAndroidOfficialCode=10108;","window.__ctAndroidOfficialCode=10109;",'native update code');

// Permanent removal, including across older async history painters, is
// guaranteed by filtering all merge inputs against a local confirmed undo.
one("const joined=[...fresh,...list(items)].filter(valid);",
 "const joined=[...fresh,...list(items)].filter(x=>valid(x)&&!window.__ctR308Home?.blockedMovie?.(x));",
 'film history undo authority');
one("window.__ctR305MovieHistory={refresh,merge,latestRows:()=>fresh,restore:",
 "window.__ctR305MovieHistory={refresh,merge,latestRows:()=>fresh,drop:(id,tmdb)=>{fresh=fresh.filter(x=>Number(x.media_id)!==Number(id)&&!(Number(tmdb)>0&&Number(x.tmdb_id)===Number(tmdb)))},restore:",
 'remove locally confirmed deleted movie from the v542 fresh cache');
one("if(!n(x.media_id)||!n(x.season_number)||!n(x.episode_number)||!clock(x.watched_at))continue;",
 "if(!n(x.media_id)||!n(x.season_number)||!n(x.episode_number)||!clock(x.watched_at)||window.__ctR308Home?.blockedEpisode?.(x))continue;",
 'episode history no stale resurrection');
one("window.__ctR306Home={classify,consolidateSeries,recentEpisodes,refresh,normalize,",
 "window.__ctR306Home={classify,consolidateSeries,recentEpisodes,refresh,normalize,dropEpisode:(id,tmdb,s,e)=>{verifiedEpisodes=verifiedEpisodes.filter(x=>!((n(x.media_id)===n(id)||(n(tmdb)>0&&n(x.tmdb_id)===n(tmdb)))&&n(x.season_number)===n(s)&&n(x.episode_number)===n(e)));lastEpisodePaint=''},",
 'remove confirmed episode from older authenticated history snapshots');
const module=await readFile(resolve(root,'apps/android/runtime-r308-home-actions.js'),'utf8');
if(!module.includes('window.__ctR308Home=')||!module.includes('cinetracker_unmark_episode_v1')||
 !module.includes('cinetracker_unmark_history_item_v426'))throw Error('History undo and Home owner missing');
one('boot();\n})();',module+'\nboot();\n})();','install newest Home-only controller');
new Function(js);
html=html.slice(0,a)+'<script data-ct-android="r308-android-stable-js">'+js+'</script>'+html.slice(b+'</script>'.length);
await writeFile(file,html,'utf8');
console.log('CINETRACKER_1_0_R308_READY: one-click 52px action, equal-height UFC, history Desmarcar with confirmed RPC, no movie flicker once verified; all other runtime intact.');
