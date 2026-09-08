import {readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd()),patch=(await readFile(resolve(root,'apps/web/runtime-r218-v112-foryou-f1-profile.js'),'utf8')).replaceAll('</script>','<\\/script>');
const dir='/tmp/ct-v112-browser';await mkdir(dir,{recursive:true});const file=resolve(dir,'index.html');
const pre=`<script>
let discoverCache=new Map();const mediaTmdb=x=>Number(x?.tmdb_id||x?.id||0),mediaType=x=>x?.media_type==='movie'?'movie':'tv';const ensureMedia=async(type,id)=>({id:id+1000});
const dashboard=[
 {tmdb_id:10,media_type:'movie',title:'Seen Movie',is_seen:true},
 {tmdb_id:20,media_type:'tv',title:'In Progress',is_in_progress:true,watched_episodes:3},
 {tmdb_id:30,media_type:'movie',title:'WL Movie',is_watchlist:true},
 {tmdb_id:40,media_type:'tv',title:'WL Series',is_watchlist:true},
 {tmdb_id:50,media_type:'tv',title:'WL Started',is_watchlist:true,watched_episodes:2}
];
const memory=[
 {tmdb_id:70,slot:'fresh:movie',shown_at:'2025-01-01T00:00:00Z'},
 {tmdb_id:30,slot:'watchlist:movie',shown_at:new Date(Date.now()-10*86400000).toISOString()},
 {tmdb_id:40,slot:'watchlist:series',shown_at:new Date(Date.now()-40*86400000).toISOString()}
];
const rpc=async(name)=>name==='cinetracker_profile_media_dashboard_v0991'?dashboard:name==='cinetracker_discovery_exclusions_v0994'?{}:name==='cinetracker_recommendation_memory_v101'?memory:name==='cinetracker_recommendation_record_v101'?{}:{};
let discoverData={daily:{id:10,media_type:'movie',title:'Seen Movie'},_ct186_fresh:{movie:[{id:10,media_type:'movie',title:'Seen Movie'},{id:70,media_type:'movie',title:'Old Suggestion'},{id:80,media_type:'movie',title:'Fresh Movie'}],series:[{id:20,media_type:'tv',title:'In Progress'},{id:60,media_type:'tv',title:'K Drama',origin_country:['KR']},{id:90,media_type:'tv',title:'Fresh Series',origin_country:['US']}],anime:[{id:100,media_type:'tv',title:'Fresh Anime',origin_country:['JP'],genre_ids:[16]}]},_ct186_watchlist:{movie:[{id:30,media_type:'movie',title:'WL Movie'}],series:[{id:40,media_type:'tv',title:'WL Series'},{id:50,media_type:'tv',title:'WL Started'}],anime:[]}};
async function discoverRows(){return structuredClone(discoverData)} function ct186Select(d){return d} function paintDiscover(){} function swapNow237(){return true}
</script>`;
const post=`<script>(async()=>{try{
 const d=await discoverRows('foryou');
 const ids=a=>(a||[]).map(x=>Number(x.id||x.tmdb_id)).join(',');
 document.body.dataset.freshMovie=ids(d._ct186_fresh.movie);document.body.dataset.freshSeries=ids(d._ct186_fresh.series);document.body.dataset.freshAnime=ids(d._ct186_fresh.anime);document.body.dataset.watchMovie=ids(d._ct186_watchlist.movie);document.body.dataset.watchSeries=ids(d._ct186_watchlist.series);document.body.dataset.daily=String(d.daily?.id||0);
 await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
 const row=document.querySelector('[data-profile] .row'),cards=[...row.children],rr=row.getBoundingClientRect(),c1=cards[0].getBoundingClientRect(),c2=cards[1].getBoundingClientRect(),c3=cards[2].getBoundingClientRect();
 document.body.dataset.profileThirdFull=String(c3.right<=rr.right+0.5);document.body.dataset.profileWidths=[c1.width,c2.width,c3.width].map(x=>Math.round(x)).join(',');document.body.dataset.profileEqual=String(Math.max(c1.width,c2.width,c3.width)-Math.min(c1.width,c2.width,c3.width)<0.6);
 }catch(e){document.body.dataset.err=String(e.message||e)}finally{document.body.dataset.done='1'}})()</script>`;
const cards='<article class="card"><div class="poster"></div><div class="card-body"><b>A</b><small>X</small></div></article>'.repeat(4);
const html=`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0}[data-profile]{width:360px}.row{display:grid;grid-auto-flow:column;grid-auto-columns:42%;gap:10px;overflow:auto}.poster{aspect-ratio:2/3}</style></head><body><div data-profile><div class="row">${cards}</div></div>${pre}<script>${patch}</script>${post}</body></html>`;await writeFile(file,html);
let out='';for(const bin of ['google-chrome','chromium','chromium-browser']){try{out=execFileSync(bin,['--headless','--no-sandbox','--disable-gpu','--window-size=390,900','--virtual-time-budget=1800','--dump-dom','file://'+file],{encoding:'utf8',stdio:['ignore','pipe','pipe']});if(out)break}catch{}}
await rm(dir,{recursive:true,force:true});if(!out)throw new Error('Chromium unavailable');
for(const must of ['data-done="1"','data-fresh-movie="80"','data-fresh-series="90"','data-fresh-anime="100"','data-watch-movie=""','data-watch-series="40"','data-daily="0"','data-profile-third-full="true"','data-profile-equal="true"'])if(!out.includes(must))throw new Error('V112 contract missing '+must+'\n'+out.slice(-5000));
if(out.includes('data-err='))throw new Error('V112 browser runtime error');console.log('V112_BROWSER_OK foryou=strict seen+progress+watchlist+memory+dorama profile=3-complete');
