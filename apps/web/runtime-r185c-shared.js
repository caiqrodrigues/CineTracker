/* r185C shared — Home always enters at the top; no business/data authority changes */
window.__ctR185CShared='home-entry-top-anchor';
window.__ct185CHomeScroll='reset-only-when-entering-home';

let ct185CLastRoute=null;
let ct185CResetHomePending=false;

function ct185CResetHomeTop(){
  if(route()!=='home')return;
  const root=document.querySelector('[data-home]');if(!root)return;
  requestAnimationFrame(()=>{
    try{window.scrollTo({top:0,left:0,behavior:'auto'})}catch{window.scrollTo(0,0)}
    try{if(document.scrollingElement)document.scrollingElement.scrollTop=0}catch{}
    try{const content=document.querySelector('.content');if(content&&content.scrollTop)content.scrollTop=0}catch{}
  });
}

const ct185CRenderRouteBase=render;
render=async function(){
  const next=route();
  ct185CResetHomePending=next==='home'&&ct185CLastRoute!=='home';
  ct185CLastRoute=next;
  const out=await ct185CRenderRouteBase();
  if(ct185CResetHomePending&&route()==='home')ct185CResetHomeTop();
  return out;
};

const ct185CRenderHomeScrollBase=renderHome;
renderHome=async function(seq){
  const reset=ct185CResetHomePending;
  const out=await ct185CRenderHomeScrollBase(seq);
  if(reset&&route()==='home')ct185CResetHomeTop();
  return out;
};
