import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const raw=await readFile('apps/android/runtime-r316-discover-critical.js','utf8');
new Function(raw);
const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const tag='<script data-ct-android="r316-android-stable-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
assert.ok(a>0&&b>a,'Official r316 APK WebView runtime missing');
const js=html.slice(a+tag.length,b);
new Function(js);
for(const mark of ["const REVISION='r316-android-official-1.0';",
 'window.__ctAndroidOfficialCode=10117',
 'window.__ctR316Discover=',
 'window.__ctR314ForYou=',
 'window.__ctR315DiscoverCards=',
 'window.__ctR303SinglePaint',
 'window.__ctR308Home=',
 'window.__ctR311Movies=',
 'window.addEventListener(\'click\',sportsClick304,true);',
 'window.ctR217RenderTop10',
 'data-ct316-results',
 'data-ct316-duration',
 'window.__ctR315DiscoverCards?.setRows?.(capped)'
])assert.ok(js.includes(mark),'A required working module or r316 marker is missing: '+mark);
assert.ok(html.includes('name="ct-official-version" content="1.0"'));
const gradle=await readFile('apps/android/app/build.gradle','utf8');
assert.ok(gradle.includes("versionName '1.0'")&&gradle.includes('versionCode 10117'));
assert.ok(gradle.includes("applicationId 'com.cinetracker.app'"));
assert.ok(gradle.includes('signingConfig signingConfigs.official'));
for(const term of ['window.location.reload(', 'router.refresh(', 'renderHome=', 'paintHome=',
 'renderSports=', 'paintSports=', 'renderProfile=', 'paintProfile=',
 'cinetracker_home_', 'cinetracker_sport_']){
 assert.ok(!raw.includes(term),'r316 changed unrelated app scope: '+term);
}
assert.ok(raw.includes('if(wanted===\'top10\')'));
assert.ok(raw.includes('if(wanted===\'foryou\')'));
assert.ok(raw.includes('const oldSetApp=setApp,oldRender=renderDiscover,oldPaint=paintDiscover;'));
assert.ok(raw.includes('discoverRows(tab)'));
assert.ok(raw.includes("discoverCache.delete(tab+':'+localDay())"));
assert.ok(raw.includes('await window.ctR217RenderTop10(navSeq)'));
assert.ok(raw.includes("event.stopImmediatePropagation()"));
assert.ok(raw.includes('const detailCache=new Map()'));
assert.ok(raw.includes("safeTmdb('/'+type+'/'+id,{language:'pt-BR'})"));

let page='discover',mounted='',painted='',oldFY=0,top10=0,oldPainter=0,navSeq=11;
const clicks=[],sets=[],jobs=[],query=[],rowUpdates=[];
const discoverState={tab:'new',type:'all'};
const results=Array.from({length:10},(_,i)=>({id:500+i,media_type:i%2?'tv':'movie',title:'Título '+i,poster_path:'/p.jpg'}));
const rootContent={innerHTML:''};
const rail={querySelector(sel){return mounted.includes('data-discover-tab="top10"')?{dataset:{discoverTab:'top10'}}:null},
 insertBefore(b){mounted+='<button data-discover-tab="top10">Top 10</button>'},
 get firstChild(){return null}};
const dom={
 hidden:false,documentElement:{},head:{appendChild(){}},
 createElement(tag){return{tagName:tag,dataset:{},set textContent(x){this._text=x},get textContent(){return this._text},setAttribute(){},appendChild(){}}},
 addEventListener(){},
 querySelector(sel){
  if(sel==='#app')return this.documentElement;
  if(sel==='[data-discover] .tabs')return mounted.includes('data-discover')?rail:null;
  if(sel==='[data-discover-content]')return mounted.includes('data-discover-content')?rootContent:null;
  if(sel.startsWith('[data-ct316-discover='))return mounted.includes(sel.slice(1,-1).replaceAll('\\',''))?{querySelector(){return null}}:null;
  if(sel.startsWith('[data-discover-tab="top10"]'))return mounted.includes('data-discover-tab="top10"')?{}:null;
  return null;
 },
 querySelectorAll(){return []}
};
const host={
 addEventListener(event,fn,capture){if(event==='click'&&capture)clicks.push(fn)},
 ctR217RenderTop10:async()=>{top10++;mounted='<div data-discover><div class="tabs"><button data-discover-tab="top10">Top 10</button></div><div class="ct171-top10-shell"></div></div>'},
 __ctR315DiscoverCards:{setRows(rows){rowUpdates.push(rows)},schedule(){}},
 __ctR314ForYou:{}
};
const world={window:host,document:dom,MutationObserver:class{observe(){}},
 setApp(html){mounted=html;sets.push(html)},
 shell:(title,desc,active,body)=>'<div data-page="'+active+'">'+body+'</div>',
 renderDiscover:async()=>{oldFY++;mounted='<div data-discover><div class="tabs"><button data-discover-tab="foryou">Pra você</button></div><div data-discover-content></div></div>'},
 paintDiscover:()=>{oldPainter++},route:()=>page,discoverState,
 discoverRows:async(tab)=>{query.push(tab);return results},discoverCarousel158:rows=>'<div class="discover-carousel">'+rows.map(x=>'<article>'+x.title+'</article>').join('')+'</div>',
 mediaType:x=>x.media_type,localDay:()=> '2026-10-22',discoverCache:new Map(),
 safeTmdb:async()=>({id:501,runtime:110}),navSeq,
 Promise,Array,Map,Set,Date,Math,Number,String,
 setTimeout:()=>9,clearTimeout:()=>{},queueMicrotask:fn=>Promise.resolve().then(fn),
 console};
vm.runInNewContext(raw,world,{filename:'r316-Discover-critical'});
const api=host.__ctR316Discover;
assert.ok(api,'Scoped r316 controller not registered');
await api.show('new');
await new Promise(setImmediate);
assert.ok(mounted.includes('data-discover-tab="top10"'),'Top 10 missing from navigation');
assert.ok(rootContent.innerHTML.includes('Título 0'),'Non-ForYou cards did not display after authenticated rows');
assert.equal(rowUpdates.at(-1).length,10,'Card detail enricher not given the render rows');
assert.equal(api.stats().loading,false);
const before=mounted;
world.setApp('<div data-discover><div>Carregando títulos...</div></div>');
assert.equal(mounted,before,'Stale legacy render must not erase the current Discover cards');
world.paintDiscover(results);
assert.equal(oldPainter,0,'Legacy painter must not overwrite the new Discover cards');
await api.show('top10');
assert.equal(top10,1,'Existing provider-specific Top 10 renderer must be used');
assert.ok(mounted.includes('ct171-top10-shell'),'Provider Top 10 screen missing');
await api.show('foryou');
assert.equal(oldFY,1,'The existing seven-slot ForYou owner must remain in charge');
assert.ok(mounted.includes('data-discover-tab="top10"'),'Top 10 must also appear in ForYou rail');
assert.equal(api.stats().tab,'foryou');
const btn={dataset:{discoverTab:'popular'},closest(s){return s==='[data-discover]'?{}:this}};
const click={target:{closest:()=>btn},preventDefault(){this.prevented=true},
 stopImmediatePropagation(){this.stopped=true}};
clicks.at(-1)(click);
await new Promise(setImmediate);
assert.ok(click.prevented&&click.stopped,'Old navigation event chains must be stopped');
assert.equal(api.stats().tab,'popular');
assert.ok(query.includes('popular'));
assert.ok(rootContent.innerHTML.includes('Título 0'));
assert.ok(api.stats().loads>=2);
console.log('ANDROID_R316_CRITICAL_TEST_OK: official 1.0 identity unchanged; Top10 restored across routes; old renders cannot erase cards; all tabs select independently; original ForYou preserved; latest non-ForYou real metadata enrichment and bounded recovery; other screens untouched.');
