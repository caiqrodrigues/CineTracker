/* Android 0.99.7.35 — profile first-tap shell + compact Sports tools */
(() => {
'use strict';
if(window.__ctAndroidR207Loaded)return;
window.__ctAndroidR207Loaded=true;
window.__ctAndroidR207='profile-first-tap-shell-compact-sports-tools';
window.__ctAndroidProfileNav='immediate-shell-then-existing-cache-first-loader';
window.__ctAndroidSportsTools='compact-mobile-search-panel';
window.__ctAndroidInputOwnership='no-new-global-touch-pointer-click-controller';
window.__ctAndroidPreload='profile-first-before-sports';

const sleepA35=ms=>new Promise(r=>setTimeout(r,ms));

/* Warm Profile before Sports. The previous r198 order loaded Sports first and only then
   started the two Profile RPCs, which made the first Profile open unnecessarily cold. */
try{
  let preloadA35=null,preloadStampA35='';
  ct163PreloadAll=async function(){
    if(!session||route()!=='home')return null;
    const stamp=String(session?.user?.id||'anon')+':'+String(localDay());
    if(preloadA35&&preloadStampA35===stamp)return preloadA35;
    preloadStampA35=stamp;
    preloadA35=(async()=>{
      let cached=null;try{cached=profileCache||ct163Read('profile')}catch{cached=profileCache||null}
      if(cached){try{profileCache=profileCache||cached}catch{}}
      else{
        await sleepA35(100);if(route()!=='home')return;
        try{
          const [quick,dash]=await Promise.all([
            rpc('cinetracker_profile_quick_stats_v1',{}),
            rpc('cinetracker_profile_media_dashboard_v0997_fast',{})
          ]);
          const p={...(quick||{}),dashboard:Array.isArray(dash)?dash:[],favorite_movies:Array.isArray(quick?.favorite_movies)?quick.favorite_movies:[],favorite_series:Array.isArray(quick?.favorite_series)?quick.favorite_series:[],favorite_actors:Array.isArray(quick?.favorite_actors)?quick.favorite_actors:[],activity:Array.isArray(quick?.activity)?quick.activity:[]};
          profileCache=p;try{ct163Write('profile',p)}catch{}
        }catch{}
      }
      await sleepA35(300);if(route()!=='home')return;
      try{await sportsPayload(false)}catch{}
    })().finally(()=>{preloadA35=null});
    return preloadA35;
  };
  ct163WarmOnIdle=function(){if(!session)return;setTimeout(()=>{try{void ct163PreloadAll()}catch{}},450)};
}catch{}

/* Keep the existing r193 cache-first Profile loader, but mount a real Profile shell before
   any RPC can delay visual feedback. This makes the first successful navigation visible
   immediately without adding a competing touch/click controller. */
try{
  const profileBaseA35=renderProfile;
  renderProfile=async function(seq){
    if(!document.querySelector('[data-profile]')){
      setApp(shell('Perfil','Estatísticas, biblioteca, favoritos e atividade.','profile',
        '<div class="page" data-profile><div class="ct207-profile-first-paint" aria-live="polite"><div class="loader">Carregando Perfil...</div></div></div>'));
    }
    return profileBaseA35.apply(this,arguments);
  };
}catch{}

const styleA35=document.createElement('style');
styleA35.id='ct-android-099735-profile-sports';
styleA35.textContent=`
/* Sports quick-search panel: same functionality, substantially less vertical space. */
[data-page="sports"] [data-sports-tools].ct169-sports-tools{padding:8px!important;border-radius:12px!important;margin-bottom:8px!important;box-shadow:0 7px 18px #0004!important}
[data-page="sports"] .ct169-sports-tools-head{margin-bottom:5px!important;min-height:0!important}
[data-page="sports"] .ct169-sports-tools-head small{font-size:7px!important;line-height:1.1!important}
[data-page="sports"] .ct169-sports-tools-head b{font-size:10px!important;line-height:1.2!important;margin-top:1px!important}
[data-page="sports"] .ct169-sports-tools-head>span{font-size:16px!important;line-height:1!important}
[data-page="sports"] [data-sports-tools] .search{grid-template-columns:16px minmax(0,1fr) minmax(105px,132px)!important;gap:5px!important;padding:4px 7px!important;border-radius:9px!important;min-height:34px!important}
[data-page="sports"] [data-sports-search]{height:30px!important;min-height:30px!important;padding:4px 2px!important;font-size:12px!important;line-height:1.2!important}
[data-page="sports"] [data-sports-date]{height:30px!important;min-height:30px!important;padding-top:3px!important;padding-bottom:3px!important;padding-left:7px!important;font-size:10px!important}
@media(max-width:520px){
  [data-page="sports"] [data-sports-tools] .search{grid-template-columns:14px minmax(0,1fr) minmax(92px,112px)!important}
  [data-page="sports"] .ct169-sports-tools-head b{font-size:9px!important}
}
`;
document.head.appendChild(styleA35);
})();
