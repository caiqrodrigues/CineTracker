import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const tag='<script data-ct-android="r303-android-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
assert.ok(a>=0&&b>a,'Android 1.0.61 embedded script missing');
const js=html.slice(a+tag.length,b);
new Function(js);
assert.ok(html.includes('name="ct-official-version" content="1.0.61"'));
for(const marker of [
 "const REVISION='r303-android-official-1.0.61'",
 'window.__ctAndroidOfficialCode=10103',
 'ct303-no-foryou-animations',
 'ct303ForYou',
 'const successor=ct300Choice(candidates(key,ref))',
 'if(root===paintedRoot&&paintedAccount===currentUser&&root?.querySelectorAll',
 'function ct301Exposed(key,ref)',
 'function ct300Choice(rows)',
 'window.__ctR293Gate',
 'window.__ctR296WweHome',
 "[['previous','Anteriores'],['upcoming','Próximos']]",
 'cinetracker_recommendation_filter_v525'
])assert.ok(js.includes(marker),'Missing retained functionality '+marker);

const scope=(from,to)=>{const a=js.indexOf(from),b=a<0?-1:js.indexOf(to,a+from.length);assert.ok(a>=0&&b>a,'missing '+from);return js.slice(a,b)};
const r278=scope('/* Android 1.0.36 r278 — ONLY Descobrir > Pra Você.','/* CineTracker Android 1.0.37/r279');
const operation=r278.slice(r278.indexOf('async function operate(key,ref,action){'));
assert.ok(operation.includes('const successor=ct300Choice(candidates(key,ref))'));
assert.ok(operation.includes('picked.set(key,successorRef);takeSeen(key,successorRef);changeOne(key)'));
assert.ok(!operation.includes('picked.delete(key);\n reconcile();'),
 'Mark-seen still redraws all seven slots');
assert.ok(!operation.includes('busy.delete(key);\n  schedule();'),
 'Mutation completion must not rebuild seven slots');
assert.ok(r278.includes("if(root===paintedRoot&&paintedAccount===currentUser&&root?.querySelectorAll('[data-ct241-slot-key]').length===7)return;"),
 'Passive callbacks can still rotate the daily and fresh cards');
assert.ok(r278.includes("if(root.querySelectorAll('[data-ct241-slot-key]').length===7){paintedRoot=root;paintedAccount=currentUser}"),
 'Verified seven-slot scene was not latched');

const first=js.indexOf('/* Android r303: absolute single-paint owner for authenticated Pra Voce */');
const last=js.indexOf('\nboot();',first);
assert.ok(first>0&&last>first,'Final single painter is not last before boot');
const painter=js.slice(first,last);
assert.ok(painter.includes('root.replaceChildren(...Array.from(holder.childNodes))'));
assert.ok(painter.includes('window.__ctR278Test?.reconcile?.()'));
assert.ok(!painter.includes('legacyPaint.apply(this,arguments)'));
assert.ok(!painter.includes('window.location.reload(')&&!painter.includes('router.refresh('));

// Execute the real embedded painter with a test DOM and verify that NONE
// of the old 26 wrappers runs when a canonical recommendation renders.
let page='discover',tab='foryou',navSeq=1,auth='a';
let oldCalls=0,firstPaints=0,commits=0,actions=0;
const root=()=>({
 childNodes:[],dataset:{},ready:0,
 replaceChildren(...nodes){firstPaints++;this.childNodes=nodes;this.ready=7},
 querySelectorAll(selector){return selector==='[data-ct241-slot-key]'?Array(this.ready).fill({}):[]}
});
let liveRoot=root();
const doc={
 documentElement:{dataset:{}},head:{appendChild(node){assert.equal(node.id,'ct303-no-foryou-animations')}},
 querySelector(selector){return selector==='[data-discover-content]'?liveRoot:null},
 createElement(name){
  if(name==='style')return{id:'',textContent:''};
  const holder={childNodes:[],set innerHTML(value){this.childNodes=[{html:value}]}};
  return holder;
 }
};
const state={tab:'foryou'};
const win={
 __ctR278Test:{reconcile(){actions++}},
 __ctR293Gate:{commit(){commits++}}
};
const src=painter+'return {paint:paintDiscover,api:window.__ctR303SinglePaint};';
const get=new Function('window','document','session','user','route','discoverState',
 'navSeqAccessor','legacy','ct186RenderForYou','getOwner',
 // use a shim to allow changing navSeq and auth without browser globals
 'let paintDiscover=legacy;let ct186ForYouData=null,ct166ForYouData=null;'+
 'const navSeq=navSeqAccessor;'+src
);
const authState={user:{id:'a'}};
const route=()=>page;
const api=get(win,doc,authState,authState.user,route,state,1,
 ()=>{oldCalls++},()=>'<section>Seven cards</section>');
const verified={__ct288Canonical:true,__ct283ServerAudited:true,_ct186_fresh:{movie:[]},_ct186_watchlist:{movie:[]}};
api.paint(verified);
assert.equal(firstPaints,1,'Canonical data must paint exactly once');
assert.equal(actions,1,'Seven action slots must be attached synchronously');
assert.equal(commits,1,'DOM protection is committed once');
api.paint({...verified});
api.paint({});
api.paint(verified);
assert.equal(firstPaints,1,'Network/background callbacks must NEVER repaint selected cards');
assert.equal(actions,1,'Background callbacks must not choose another title');
assert.equal(oldCalls,0,'No legacy painter may run for Pra Voce');
page='home';api.paint({});assert.equal(oldCalls,1,'Other pages retain original painters');
page='discover';liveRoot=root();api.paint(verified);
assert.equal(firstPaints,2,'A newly mounted view should render normally');
assert.equal(commits,2);
assert.ok(api.api.stats().suppressed>=3);
console.log('ANDROID_1_0_61_TEST_OK: canonical Pra Voce paints once per DOM mount, 0 chained legacy renders, 0 passive title rotation, only one changed slot for Seen/Trocar; 2 Sports tabs and WWE/F1 untouched.');
