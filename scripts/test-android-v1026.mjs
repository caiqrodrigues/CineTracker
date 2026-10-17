import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import vm from 'node:vm';
const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const marker='<script data-ct-android="r268-android-js">',a=html.indexOf(marker),b=html.indexOf('</script>',a+marker.length);
assert.ok(a>=0&&b>a,'1.0.26 embedded JS absent');
const js=html.slice(a+marker.length,b);
new Function(js);
for(const m of ["const REVISION='r268-android-official-1.0.26'","window.__ctAndroidOfficialCode=10068","__ctR268AndroidV1026","ct186SaveDaily268","ct268-f1-overview","cinetracker_special_series_counts_v540","cinetracker_recommendation_filter_v525","cinetracker_sports_stadium_summary_v296","__ctR267AndroidV1025","__ctR266AndroidV1024","__ctR265AndroidV1023","__ctR243Fix=","__ctR226V120="]){
 assert.ok(js.includes(m),'missing preserved or new '+m);
}
assert.ok(html.includes('name="ct-official-version" content="1.0.26"'));
assert.ok(js.includes("ct186Slot('Filme',s.daily,'daily:movie',f.movie?.length||0)"),'Trocar daily count must reflect actual pool, not forced 1');
assert.ok(js.includes("Sem alternativa elegível nesta categoria"),'inactive swaps must remain visible with explanation');
const authority=await readFile('apps/android/runtime-r268-v1026-direct-authority.js','utf8');
const patch=await readFile('apps/android/runtime-r268-v1026-consolidated.js','utf8');
for(const bad of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])assert.ok(!authority.includes(bad)&&!patch.includes(bad),'forbidden operation '+bad);
const select=(a,b)=>authority.slice(authority.indexOf(a),authority.indexOf(b,authority.indexOf(a)));
const daily=select('function ct186History268(){','//__CT268_DAILY_END__');
const swap=select('function pick237(key,current){','//__CT268_SWAP_END__');
const f1=select('function bodyF111(d,tab){','//__CT268_F1_END__');
const store=new Map();
const movie=(id,title)=>({id,title,media_type:'movie'});
const pool=[movie(101,'Filme A'),movie(102,'Filme B'),movie(103,'Filme C'),movie(104,'Filme D')];
const ctx={
 localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,String(v))},
 user:{id:'u1'},session:{user:{id:'u1'}},localDay:()=>ctx.day,
 day:'2026-10-17',ct186Key:x=>x?'movie:'+x.id:'',ct186Hash:s=>s.length%100,
 ct186LocalBlocked:new Set(),Set,JSON,Math,Number,Array,String,
 ct186DailyStorage:()=> 'ct:r186:daily:u1:'+ctx.day,
 ct166SwapIndex:{},ct166Pick:(items,key)=>items[ctx.ct166SwapIndex[key]%items.length],ct186ForYouData:{},
 ct186Select:()=>({daily:pool[0]}),pool237:()=>pool,
};
vm.createContext(ctx);
vm.runInContext(daily+'\n'+swap,ctx);
const first=ctx.ct186DailyPick(pool,new Set());
assert.ok(pool.includes(first));assert.equal(ctx.ct186DailyPick(pool,new Set()).id,first.id,'daily pick should remain stable within a day');
const next=ctx.pick237('daily:movie',first.id);
assert.ok(next&&next.id!==first.id,'Trocar must choose another movie');
assert.equal(ctx.ct186DailyPick(pool,new Set()).id,next.id,'Trocar must persist after repaint/navigation');
ctx.day='2026-10-18';
const tomorrow=ctx.ct186DailyPick(pool,new Set());
assert.ok(tomorrow.id!==next.id,'new day must not repeat last shown movie while alternatives exist');
const f1ctx={f111Stand:()=>Array.from({length:20},(_,i)=>({position:i+1,points:20-i,Driver:{givenName:'X',familyName:String(i)},Constructor:{name:'Team'}})),f111Race:x=>x,f111Driver:x=>String(x?.familyName||''),f111Date:x=>x,rowsF111:(r)=>r.map(x=>'row'+x.position).join('|'),resultsF111:r=>(r?.Results||[]).map(x=>'result'+x.position).join('|'),e111:String};
vm.createContext(f1ctx);vm.runInContext(f1,f1ctx);
const input={races:[],results:{Results:Array.from({length:20},(_,i)=>({position:i+1}))},drivers:{},constructors:{},next:{raceName:'Próximo'},last:{raceName:'Último'}};
const overview=f1ctx.bodyF111(input,'overview');
assert.ok(overview.includes('Próximo GP')&&overview.includes('Último GP · Pódio'));
assert.ok(overview.includes('result3')&&!overview.includes('result4'),'overview must only show podium, not 20 lines');
assert.ok(overview.includes('row3')&&!overview.includes('row4'),'overview must show top3, not a 20-line ranking');
assert.ok(f1ctx.bodyF111(input,'drivers').includes('row20'),'complete ranking remains in Drivers tab');
assert.ok(f1ctx.bodyF111(input,'constructors').includes('row20'),'complete ranking remains in Constructors tab');
assert.ok(patch.includes('grid-template-columns:repeat(2,minmax(0,1fr))'));
console.log('ANDROID_1_0_26_VALIDATED Daily unique+Trocar persists+new day rotates+real eligible pool count+compact podium+full rankings+no regressions');
