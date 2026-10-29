import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const tag='<script data-ct-android="r328-android-stable-js">';
const begin=html.indexOf(tag),end=html.indexOf('</script>',begin+tag.length);
assert.ok(begin>=0&&end>begin,'Official Android r328 must be assembled');
const js=html.slice(begin+tag.length,end);
new Function(js);
assert.match(js,/const REVISION='r328-android-official-1\.0'/);
assert.ok(js.includes('window.__ctAndroidOfficialCode=10129'));
for(const marker of ['window.__ctR327HomeSearch=', 'window.__ctR326MediaExport=',
 'window.__ctR325Series=', 'window.__ctR325Profile=', 'window.__ctR314ForYou=',
 'window.__ctR323PoolSources=', 'cinetracker_foryou_payload_v498',
 'cinetracker_recommendation_filter_v525','window.__ctR322Top10=']){
 // __ctR323 pool source tracking is a document dataset, not a global object.
 if(marker==='window.__ctR323PoolSources=')assert.ok(js.includes('dataset.ct323PoolSources='));
 else assert.ok(js.includes(marker),'Missing preserved Android module '+marker);
}

// Production bug: a 24-minute anime *TV* episode is valid; a 24-minute film is
// a prohibited short film. All other forbidden-origin and genre rules remain.
const allowedStart=js.indexOf('function allowed(x){');
const allowedEnd=js.indexOf('function filterBag(b)',allowedStart);
assert.ok(allowedStart>0&&allowedEnd>allowedStart);
const restrictions=js.slice(allowedStart,allowedEnd);
const env={
 mediaTmdb:x=>x.tmdb_id,
 norm:x=>String(x??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase(),
 rows:x=>Array.isArray(x)?x:[],
 restricted:/\b(wwe|smackdown|raw|wrestling|ufc|mma|stand[\s-]?up|reality show|reality tv)\b/i
};
const allowed=new Function('ctx','with(ctx){'+restrictions+';return allowed;}')(env);
const media={tmdb_id:312359,media_type:'tv',media_kind:'anime',title:'Dragon Ball Super: Beerus',poster_path:'/p.jpg',runtime_minutes:24};
assert.equal(allowed(media),true,'Anime TV with 24-minute episodes must not be rejected as a short film');
assert.equal(allowed({...media,media_type:'movie',media_kind:'movie'}),false,'24-minute movies stay excluded');
assert.equal(allowed({...media,production_companies:[{name:'YouTube Originals'}]}),false,'YouTube originals stay excluded');
assert.equal(allowed({...media,title:'Reality Show'}),false,'Realities stay excluded');
assert.equal(allowed({...media,title:'Live stand-up'}),false,'Stand-up stays excluded');
assert.equal(allowed({...media,genre_ids:[10764]}),false,'Reality genre stays excluded');

assert.match(js,/Math\.min\(2,selected\.length\)\},worker\)/,
 'Home TMDB premieres must use no more than two concurrent background requests');
assert.ok(js.includes('laterA26(()=>ct163PreloadAll(),1700)'),
 'Home background prefetch must not stampede the first screen');

// Verify fast tab reentry uses only the same-user, same-day audited pool.
const foryou=js.indexOf("const KINDS=['movie','series','anime'];");
const mountStart=js.indexOf('function mount(){',foryou);
const mountEnd=js.indexOf('// Wrap only the ForYou route.',mountStart);
assert.ok(foryou>0&&mountStart>foryou&&mountEnd>mountStart);
const mountCode=js.slice(mountStart,mountEnd);
let paints=0,loads=0,chosen=0,now=Date.now();
const ctx={
 userId:()=> 'signed-in-user',reset:()=>{},session:{access_token:'token'},
 navSeq:23,visit:22,serial:7,request:'older-job',model:{cached:true},
 complete:()=>true,ct328CacheAt:now-14000,ct328CacheDay:'2026-10-29',
 localDay:()=> '2026-10-29',Date,
 SLOTS:['daily','fresh:anime'],current:()=>({id:999,media_type:'tv'}),
 choose:()=>({id:888,media_type:'tv'}),identity:x=>'tv:'+x?.id,
 setCurrent:()=>{chosen++},paint:()=>{paints++},load:()=>{loads++},
 blank:()=>({}),message:()=>{},document:{documentElement:{dataset:{}}}
};
const mount=new Function('ctx','with(ctx){'+mountCode+';return mount;}')(ctx);
assert.equal(mount(),true);
assert.equal(paints,1,'Cached personally audited ForYou shows instantly');
assert.equal(loads,0,'Revisiting ForYou should not fire the whole v498/v525 pipeline again');
assert.equal(chosen,2,'Cached slots rotate rather than repeating same cards');
assert.equal(ctx.document.documentElement.dataset.ct328ForYouLoad,'verified-memory');
assert.equal(ctx.request,null,'Stale in-flight requests are superseded on navigation');
ctx.navSeq=24;ctx.ct328CacheDay='2026-10-28';
assert.equal(mount(),true);
assert.equal(loads,1,'Previous-day cache must be discarded and refreshed');
assert.equal(ctx.document.documentElement.dataset.ct328ForYouLoad,'authenticated-refresh');
assert.ok(js.includes('ct328CacheAt=0;\n if(active()&&!locks.size&&complete())'),
 'Watched and Watchlist events must invalidate the cached recommendation authority');
for(const forbidden of ['window.location.reload(', 'router.refresh(', 'while(true)'])
 assert.ok(!js.slice(mountStart,mountEnd).includes(forbidden),'ForYou may not reload or spin');
const gradle=await readFile('apps/android/app/build.gradle','utf8');
assert.match(gradle,/versionName '1\.0'/);
assert.match(gradle,/versionCode 10129/);
console.log('CINETRACKER_ANDROID_1_0_R328_TEST_OK: anime TV 24m allowed, short movies/YouTube/reality/stand-up excluded, ForYou verified cache, no stale user, Home requests paced; Web frozen.');
