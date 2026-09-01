import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root=resolve(process.cwd());
await import(pathToFileURL(resolve(root,'scripts/prepare-android-v09975.mjs')).href+`?mobile=${Date.now()}`);

const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');

const css=String.raw`
/* Android 0.99.7.6 — phone framing + real horizontal carousels. Web r173 remains untouched. */
:root{--ct-phone-gap:10px;--ct-phone-nav:70px}
*,*::before,*::after{box-sizing:border-box!important}
html,body{width:100%!important;max-width:100%!important;min-width:0!important;margin:0!important;overflow-x:hidden!important}
body{overscroll-behavior-x:none!important}
#app,.app,.content,.page,.panel,.home-section,.discover-section,.ct169-detail-page,.ct169-detail-section,.ct171-watch-section,[data-home],[data-profile],[data-sports],[data-discover]{width:100%!important;max-width:100%!important;min-width:0!important}
.content{padding:8px 8px calc(var(--ct-phone-nav) + env(safe-area-inset-bottom) + 12px)!important}
.header{min-width:0!important;padding:0 2px 4px!important}.header>div{min-width:0!important}.h1{font-size:23px!important;line-height:1.08!important;overflow-wrap:anywhere!important}.subtitle{font-size:10px!important;line-height:1.35!important}
.search-global{width:100%!important;max-width:100%!important;min-width:0!important;height:42px!important}.search-global input{min-width:0!important;width:100%!important;font-size:13px!important}

/* Vertical Home stays vertical and fully framed. */
.home-list,.stack{width:100%!important;min-width:0!important}.home-section{padding:8px!important;margin-bottom:9px!important}.media-row{width:100%!important;min-width:0!important;grid-template-columns:48px minmax(0,1fr) 34px!important;gap:8px!important;padding:7px!important}.media-row>div{min-width:0!important}.media-row b,.media-row small{overflow-wrap:anywhere!important}.media-row .thumb{width:48px!important;min-width:48px!important}.media-row .badge{width:32px!important;min-width:32px!important}

/* Every content strip becomes a local horizontal carousel, never page overflow. */
.row,.ct169-cast-row,.ct169-related-row,.ct169-season-row,.ct169-season-chart-carousel,.ct171-provider-row,.ct171-provider-tabs,.ct171-top-row,[data-page="discover"] .tabs,[data-sports] .tabs,[data-sports] .row,.home-tabs,.ct169-chart-tabs{
  display:flex!important;flex-wrap:nowrap!important;align-items:stretch!important;gap:8px!important;width:100%!important;max-width:100%!important;min-width:0!important;overflow-x:auto!important;overflow-y:hidden!important;-webkit-overflow-scrolling:touch!important;scroll-snap-type:x proximity!important;overscroll-behavior-inline:contain!important;padding-bottom:7px!important;scrollbar-width:thin!important
}
.row::-webkit-scrollbar,.ct169-cast-row::-webkit-scrollbar,.ct169-related-row::-webkit-scrollbar,.ct169-season-row::-webkit-scrollbar,.ct169-season-chart-carousel::-webkit-scrollbar,.ct171-provider-row::-webkit-scrollbar,.ct171-provider-tabs::-webkit-scrollbar,.ct171-top-row::-webkit-scrollbar,[data-page="discover"] .tabs::-webkit-scrollbar,[data-sports] .tabs::-webkit-scrollbar,[data-sports] .row::-webkit-scrollbar,.home-tabs::-webkit-scrollbar,.ct169-chart-tabs::-webkit-scrollbar{height:5px!important}
.row::-webkit-scrollbar-thumb,.ct169-cast-row::-webkit-scrollbar-thumb,.ct169-related-row::-webkit-scrollbar-thumb,.ct169-season-row::-webkit-scrollbar-thumb,.ct169-season-chart-carousel::-webkit-scrollbar-thumb,.ct171-provider-row::-webkit-scrollbar-thumb,.ct171-provider-tabs::-webkit-scrollbar-thumb,.ct171-top-row::-webkit-scrollbar-thumb,[data-page="discover"] .tabs::-webkit-scrollbar-thumb,[data-sports] .tabs::-webkit-scrollbar-thumb,[data-sports] .row::-webkit-scrollbar-thumb,.home-tabs::-webkit-scrollbar-thumb,.ct169-chart-tabs::-webkit-scrollbar-thumb{background:#315b72!important;border-radius:999px!important}
.row>* ,.ct169-cast-row>* ,.ct169-related-row>* ,.ct169-season-row>* ,.ct169-season-chart-carousel>* ,.ct171-provider-row>* ,.ct171-provider-tabs>* ,.ct171-top-row>*{scroll-snap-align:start!important;min-width:0}
.row>.card{flex:0 0 clamp(112px,36vw,148px)!important;width:auto!important;max-width:148px!important}
.ct169-cast-card{flex:0 0 112px!important;width:112px!important}.ct169-related-card{flex:0 0 138px!important;width:138px!important}.ct169-season-card{flex:0 0 124px!important;width:124px!important}.ct171-provider-card{flex:0 0 104px!important;width:104px!important}.ct171-top-card{flex:0 0 132px!important;width:132px!important}
.card,.ct169-cast-card,.ct169-related-card,.ct169-season-card,.ct171-provider-card,.ct171-top-card{max-width:calc(100vw - 28px)!important}
.poster{aspect-ratio:2/3!important;height:auto!important}.card-body{padding:7px!important}.card-body b{font-size:11px!important;line-height:1.25!important}.card-body small{font-size:9px!important;line-height:1.3!important}

/* Discover tabs/filter pills scroll sideways instead of compressing/clipping. */
[data-page="discover"] .tabs{position:sticky!important;top:48px!important;z-index:70!important;background:#041017f2!important;padding:6px 0 8px!important}.tabs .chip,.ct171-provider-tabs button,.home-tabs button,[data-sports] .tabs button{flex:0 0 auto!important;white-space:nowrap!important}
.discover-section{padding:8px!important}.foryou-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:6px!important}.ct166-slot{min-width:0!important;width:auto!important}.ct166-slot .card{width:100%!important;max-width:none!important}.ct166-slot .poster{min-height:0!important}
@media(max-width:380px){.foryou-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important}.ct166-slot .card-body{padding:5px!important}.ct166-slot .card-body b{font-size:9px!important}.ct166-slot .card-body small{font-size:8px!important}}

/* Film/series details: keep the left-window concept but truly fit a phone. */
.ct169-detail-backdrop{left:-8px!important;right:-8px!important;width:auto!important;max-width:none!important;height:300px!important;overflow:hidden!important}.ct169-detail-hero.ct173-detail-window{width:100%!important;max-width:100%!important;min-width:0!important;margin:10px 0 16px!important;padding:11px!important;border-radius:14px!important;grid-template-columns:96px minmax(0,1fr)!important;gap:11px!important;align-items:start!important;overflow:hidden!important}.ct169-poster-wrap,.ct169-detail-poster{width:96px!important;min-width:96px!important;max-width:96px!important}.ct169-detail-copy{min-width:0!important;width:100%!important;overflow:hidden!important}.ct169-detail-copy h1{font-size:clamp(22px,7vw,30px)!important;line-height:1.02!important;white-space:normal!important;overflow-wrap:anywhere!important;word-break:break-word!important;margin:3px 0 8px!important}.ct169-meta{display:flex!important;flex-wrap:wrap!important;gap:3px!important;white-space:normal!important;font-size:9px!important;line-height:1.35!important;overflow-wrap:anywhere!important}.ct169-detail-copy p{font-size:10px!important;line-height:1.4!important;margin:10px 0!important;display:-webkit-box!important;-webkit-line-clamp:5!important;-webkit-box-orient:vertical!important;overflow:hidden!important}.ct169-main-actions{display:flex!important;flex-wrap:wrap!important;gap:5px!important;margin-top:9px!important}.ct169-main-actions button{flex:0 1 auto!important;min-height:36px!important;padding:7px 8px!important;font-size:9px!important;white-space:normal!important}.ct171-watch-section,.ct169-detail-section{width:100%!important;max-width:100%!important;padding:10px 2px!important;overflow:hidden!important}.ct171-watch-section h2,.ct169-detail-section h2{font-size:18px!important}.ct171-provider-row{overflow-x:auto!important}
@media(max-width:350px){.ct169-detail-hero.ct173-detail-window{grid-template-columns:82px minmax(0,1fr)!important;padding:9px!important;gap:9px!important}.ct169-poster-wrap,.ct169-detail-poster{width:82px!important;min-width:82px!important;max-width:82px!important}.ct169-detail-copy h1{font-size:20px!important}.ct169-detail-copy p{-webkit-line-clamp:4!important}}

/* Drawer becomes a proper phone sheet with independent vertical flow. */
.ct169-drawer{width:100vw!important;max-width:100vw!important;min-width:0!important;padding:10px!important;border-left:0!important;overflow-x:hidden!important}.ct169-drawer-top{padding:10px 0!important}.ct169-drawer-body{width:100%!important;min-width:0!important}.ct169-drawer-ep{width:100%!important;min-width:0!important;grid-template-columns:98px minmax(0,1fr)!important;gap:8px!important;padding:8px!important}.ct169-drawer-still{width:98px!important;max-width:98px!important}.ct169-drawer-ep-copy{min-width:0!important}.ct169-drawer-ep-copy h4,.ct169-drawer-ep-copy p{overflow-wrap:anywhere!important}.ct169-drawer-ep-copy p{-webkit-line-clamp:3!important}

/* Charts: viewport stays framed; chart itself scrolls locally sideways. */
.ct169-season-chart-card{flex:0 0 calc(100vw - 28px)!important;width:calc(100vw - 28px)!important;max-width:calc(100vw - 28px)!important;min-width:0!important}.ct169-chart-scroll,.ct169-activity-scroll{width:100%!important;max-width:100%!important;overflow-x:auto!important;-webkit-overflow-scrolling:touch!important;scrollbar-width:thin!important}.ct169-chart-scroll svg{min-width:680px!important;max-width:none!important}.ct169-activity-track{min-width:900px!important;max-width:none!important}

/* Profile/statistics: two compact columns with no clipping. */
.stats-grid,.ct167-stats-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:7px!important}.stat,.stats-grid>*,.ct167-stats-grid>*{min-width:0!important;padding:8px!important}.stat b,.stats-grid b,.ct167-stats-grid b{font-size:13px!important;overflow-wrap:anywhere!important}.panel{padding:9px!important}.panel-head{gap:7px!important;align-items:center!important}.panel-head h2,.panel-head h3{min-width:0!important;overflow-wrap:anywhere!important}.panel-head button{flex:0 0 auto!important}

/* Sports/configs: controls reflow to phone width. */
.ct169-sports-tools{width:100%!important;min-width:0!important}.ct169-sports-tools .search{grid-template-columns:20px minmax(0,1fr)!important;width:100%!important}.ct169-sports-tools [data-sports-date]{grid-column:1/-1!important;border-left:0!important;border-top:1px solid #24485c!important;padding:8px 0 0!important}.ct169-sports-tools input{min-width:0!important;width:100%!important}.sports-card,[data-sports] .panel{width:100%!important;max-width:100%!important;min-width:0!important}.settings-grid,.form-grid{grid-template-columns:1fr!important;width:100%!important;min-width:0!important}input,select,textarea,button{max-width:100%!important}

/* Bottom navigation + Android safe area. */
html body .app .content .mobile-nav{height:auto!important;min-height:62px!important;padding:5px 4px calc(5px + env(safe-area-inset-bottom))!important}.mobile-nav a{min-width:0!important;font-size:9px!important;line-height:1.1!important;padding:7px 2px!important}
.toast{left:8px!important;right:8px!important;bottom:calc(var(--ct-phone-nav) + env(safe-area-inset-bottom) + 6px)!important;max-width:none!important}
.version{font-size:8px!important;text-align:center!important;padding:9px 0!important}
`;

html=html
  .replaceAll('android-v0.99.7.5-r173-parity-bootfix','android-v0.99.7.6-r173-mobile-frame')
  .replace('</head>',()=>`<style data-ct-android-mobile="0.99.7.6">${css}</style><meta name="ct-android-mobile" content="phone-framed-carousels-scroll-snap"></head>`);

for(const marker of['android-v0.99.7.6-r173-mobile-frame','phone-framed-carousels-scroll-snap','scroll-snap-type:x proximity','overflow-x:auto','ct169-detail-hero.ct173-detail-window','foryou-grid']){
  if(!html.includes(marker))throw new Error(`Android 0.99.7.6 missing mobile marker: ${marker}`);
}
await writeFile(indexPath,html,'utf8');
console.log('ANDROID_09976_MOBILE_OK web=r173 framed=true carousels=horizontal-swipe local-overflow=true');
