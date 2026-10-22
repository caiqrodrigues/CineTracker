import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const tag='<script data-ct-android="r319-android-stable-js">';
const start=html.indexOf(tag),end=start<0?-1:html.indexOf('</script>',start+tag.length);
assert.ok(start>0&&end>start,'Official 1.0/r319 embedded JS absent');
const js=html.slice(start+tag.length,end);
new Function(js);
for(const marker of [
 "const REVISION='r319-android-official-1.0'",
 'window.__ctAndroidOfficialCode=10120;',
 'const promise=window.__ctR319Discover.rows(tab);',
 "window.__ctR319Discover={rows,stats:",
 'window.__ctR316Discover={show,ensureTop10,restore,detailVisible,',
 'window.__ctR314ForYou={load,mount,swap,action,choose,paint,poolFor,stats:',
 'window.__ctR307Taste=',
 'window.__ctR308Home=',
 'window.__ctR303SinglePaint',
 'const previousDiscoverRows270=discoverRows;',
 "if(r==='discover'||!ct181CanSnapshot(r)||!page)return false;",
 "window.addEventListener('click',sportsClick304,true);",
 'if(events)events.remove();',
 'cinetracker_recommendation_filter_v525'
])assert.ok(js.includes(marker),'Lost existing 1.0 functionality: '+marker);
assert.ok(html.includes('name="ct-official-version" content="1.0"'));
const oldSource=await readFile('apps/android/runtime-r316-discover-critical.js','utf8');
assert.ok(oldSource.includes('const promise=discoverRows(tab);'),
 'Do not mutate old r316 source or other sections');
assert.equal(js.split('const promise=window.__ctR319Discover.rows(tab);').length-1,1);
assert.ok(!js.includes('const promise=discoverRows(tab);'),
 'Slow older chained data source still owns non-ForYou Discover');
const module=await readFile('apps/android/runtime-r319-discover-direct.js','utf8');
assert.ok(js.includes(module),'Committed r319 source must be installed byte-for-byte');
assert.ok(!module.includes('window.location.reload(')&&!module.includes('router.refresh('));
assert.ok(!module.includes('renderHome(')&&!module.includes('renderSports(')&&!module.includes('paintDiscover('));
const grade=await readFile('apps/android/app/build.gradle','utf8');
assert.ok(grade.includes("versionName '1.0'")&&grade.includes('versionCode 10120'));
assert.ok(grade.includes("applicationId 'com.cinetracker.app'"));
assert.ok(grade.includes('signingConfig signingConfigs.official'));

let session={access_token:'signed-token',user:{id:'user-a'}};
const requests=[],audits=[];
let allowAudit=true,failEndpoint='';
const fakeWindow={};
const fakeDoc={head:{appendChild(node){fakeDoc.lastCss=node.textContent}},createElement(type){assert.equal(type,'style');return {id:'',textContent:''}}};
const mk=(type,id)=>({id,tmdb_id:id,media_type:type,title:type+' '+id,poster_path:'/poster'+id+'.jpg',
 release_date:'2026-10-'+String(id%22+1).padStart(2,'0'),first_air_date:'2026-10-'+String(id%22+1).padStart(2,'0'),
 vote_average:6+id/20,popularity:100-id});
fakeWindow.__ctR265Test={allowed:item=>Boolean(item?.poster_path)};
fakeWindow.__ctR279Audit={
 async auditCandidates(items){audits.push(items);return allowAudit},
 permitted:item=>Number(item.id)!==3
};
let count=0;
const fakeTmdb=async(path,params)=>{
 count++;requests.push({path,params});
 if(path===failEndpoint)throw Error('simulated network unavailable');
 if(path.includes('trending'))return {results:[...Array(10)].map((_,i)=>mk(i%2?'tv':'movie',i+1))};
 const kind=path.includes('/tv')?'tv':'movie';
 return {results:[...Array(10)].map((_,i)=>mk(kind,i+1))};
};
const run=new Function('window','document','safeTmdb','setTimeout','clearTimeout','Date',
 'let session={access_token:"signed-token",user:{id:"user-a"}},user={id:"user-a"};'+module+
 'return {api:window.__ctR319Discover,setUser:id=>{session={access_token:"signed-token",user:{id}}},signout:()=>{session=null}};');
const app=run(fakeWindow,fakeDoc,fakeTmdb,setTimeout,clearTimeout,Date);
assert.ok(app.api&&app.api.rows);
for(const tab of ['trending','popular','new','releases','anticipated','top','calendar']){
 const result=await app.api.rows(tab);
 assert.ok(Array.isArray(result)&&result.length>=5,tab+' must show viable media');
 assert.ok(result.every(x=>Number(x.id)!==3),'Server blocked title leaked on '+tab);
 assert.ok(result.every(x=>['movie','tv'].includes(x.media_type)));
}
assert.equal(audits.length,7,'Every tab must be checked against server user state');
assert.equal(app.api.stats().successes,7);
assert.ok(requests.some(x=>x.path==='/trending/all/week'));
assert.ok(requests.some(x=>x.path==='/movie/top_rated'));
assert.ok(requests.some(x=>x.path==='/discover/movie'));
assert.ok(requests.every(x=>x.params.include_adult===false));
const before=count;
await app.api.rows('popular');
assert.equal(count,before,'A second visit must use short-lived, user-scoped cache');
app.setUser('user-b');
await app.api.rows('popular');
assert.ok(count>before,'A second signed-in account cannot reuse former account recommendations');
const beforeBad=count;
failEndpoint='/trending/all/week';
app.setUser('user-c');
await assert.rejects(()=>app.api.rows('trending'),/fontes.*não responderam/i);
assert.ok(count>beforeBad);
assert.ok(app.api.stats().lastError.includes('não responderam'));
allowAudit=false;failEndpoint='';
await assert.rejects(()=>app.api.rows('top'),/não confirmou todos os títulos/i,
 'A partial server audit MUST fail closed, not reveal unseen/unverified media');
assert.ok(fakeDoc.lastCss.includes('aspect-ratio:2/3!important'));
assert.ok(fakeDoc.lastCss.includes('clamp(130px,38vw,172px)'));
assert.ok(fakeDoc.lastCss.includes('.ct169-meta'));
assert.ok(fakeDoc.lastCss.includes('white-space:normal!important'));
assert.ok(fakeDoc.lastCss.includes('overflow-wrap:break-word!important'));
assert.ok(!fakeDoc.lastCss.includes('[data-home]')&&!fakeDoc.lastCss.includes('[data-sports]'));
console.log('ANDROID_1_0_R319_TEST_OK: 7 non-ForYou Discover tabs use independent bounded TMDB requests plus strict per-user v525 audit; cached results account-scoped; failures visible; cards limited to 2:3; genre wraps; Home, ForYou, Top10, Sports, Profile, F1 preserved.');
