import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root=resolve(process.cwd());
await import(pathToFileURL(resolve(root,'scripts/prepare-android-v09976.mjs')).href+`?composition=${Date.now()}`);

const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');

const css=String.raw`
/* Android 0.99.7.7 — true phone composition. Web r173 remains frozen. */
:root{--ct-mobile-pad:12px;--ct-mobile-radius:14px}
html,body,#app,.app{width:100%!important;max-width:100%!important;overflow-x:hidden!important}
.content{padding-left:var(--ct-mobile-pad)!important;padding-right:var(--ct-mobile-pad)!important}
.header{margin-bottom:8px!important}.header .h1{font-size:24px!important;letter-spacing:-.02em!important}.header .subtitle{font-size:11px!important;max-width:95%!important}
.panel,.home-section,.discover-section,.ct169-detail-section,.ct171-watch-section{border-radius:var(--ct-mobile-radius)!important}

/* Home: readable rows, no desktop-like empty width. */
.media-row{grid-template-columns:54px minmax(0,1fr) 40px!important;gap:9px!important;min-height:74px!important;padding:8px!important;border-radius:12px!important}.media-row .thumb{width:54px!important;min-width:54px!important;border-radius:8px!important}.media-row b{font-size:12px!important;line-height:1.25!important}.media-row small{font-size:9.5px!important;line-height:1.3!important}.media-row .badge{width:38px!important;min-width:38px!important;height:38px!important}.home-section h2{font-size:17px!important;margin:0 0 8px!important}

/* Phone detail hero: stop squeezing text beside a desktop poster. */
.ct169-detail-hero.ct173-detail-window{display:block!important;width:100%!important;max-width:100%!important;padding:12px!important;margin:10px 0 14px!important;border-radius:16px!important;overflow:hidden!important}.ct169-poster-wrap{width:min(46vw,154px)!important;min-width:0!important;max-width:154px!important;margin:0 auto 12px!important}.ct169-detail-poster{width:100%!important;min-width:0!important;max-width:100%!important;height:auto!important;border-radius:12px!important}.ct169-detail-copy{width:100%!important;max-width:100%!important;overflow:visible!important;text-align:left!important}.ct169-detail-copy h1{font-size:clamp(25px,8vw,34px)!important;line-height:1.04!important;margin:2px 0 8px!important;letter-spacing:-.025em!important}.ct169-meta{font-size:10px!important;line-height:1.45!important;gap:4px 6px!important}.ct169-detail-copy p{font-size:11px!important;line-height:1.48!important;margin:10px 0 12px!important;display:block!important;overflow:visible!important;-webkit-line-clamp:unset!important}.ct169-main-actions{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:7px!important;width:100%!important}.ct169-main-actions button{width:100%!important;min-width:0!important;min-height:42px!important;padding:7px 5px!important;font-size:9.5px!important;line-height:1.2!important;border-radius:10px!important}.ct169-detail-backdrop{height:250px!important;opacity:.34!important}.ct169-detail-section,.ct171-watch-section{padding:12px!important;margin:10px 0!important}.ct169-detail-section h2,.ct171-watch-section h2{font-size:18px!important;margin-bottom:9px!important}

/* Where to watch: cards big enough to read but still swipeable. */
.ct171-provider-row{gap:9px!important;padding:2px 0 8px!important}.ct171-provider-card{flex:0 0 132px!important;width:132px!important;min-height:118px!important;padding:10px!important;border-radius:12px!important}.ct171-provider-card img{max-width:62px!important;max-height:42px!important}.ct171-provider-card b{font-size:10px!important;line-height:1.25!important}.ct171-provider-card small{font-size:9px!important}

/* Real carousels: ~2.2 cards visible instead of tiny desktop strips. */
.row{gap:9px!important}.row>.card{flex:0 0 min(42vw,158px)!important;width:min(42vw,158px)!important;max-width:158px!important;border-radius:12px!important}.ct169-related-card{flex:0 0 min(43vw,164px)!important;width:min(43vw,164px)!important;max-width:164px!important}.ct169-cast-card{flex:0 0 min(31vw,126px)!important;width:min(31vw,126px)!important;max-width:126px!important}.ct169-season-card{flex:0 0 min(39vw,150px)!important;width:min(39vw,150px)!important;max-width:150px!important}.ct171-top-card{flex:0 0 min(42vw,160px)!important;width:min(42vw,160px)!important;max-width:160px!important}.card-body{padding:8px!important}.card-body b,.ct169-related-card b{font-size:11px!important;line-height:1.25!important}.card-body small,.ct169-related-card small{font-size:9px!important;line-height:1.3!important}

/* Discover: use full phone width and keep tabs/carousels local. */
.discover-section{padding:10px!important;margin-bottom:10px!important}.discover-section h2{font-size:17px!important}.foryou-grid{width:100%!important;gap:7px!important}.ct166-slot{min-width:0!important}.ct166-slot .card{min-width:0!important;width:100%!important}.ct166-slot .card-body b{font-size:9.5px!important}.ct166-slot .card-body small{font-size:8.5px!important}.tabs,.home-tabs,.ct171-provider-tabs{padding-left:1px!important;padding-right:1px!important;gap:7px!important}.tabs .chip,.home-tabs button,.ct171-provider-tabs button{min-height:36px!important;padding:7px 11px!important;font-size:10px!important}

/* Season drawer: readable mobile sheet. */
.ct169-drawer{padding:12px!important}.ct169-drawer-top{gap:8px!important}.ct169-drawer-top select{min-height:40px!important;font-size:12px!important}.ct169-drawer-ep{grid-template-columns:110px minmax(0,1fr)!important;gap:9px!important;padding:9px!important;border-radius:12px!important}.ct169-drawer-still{width:110px!important;max-width:110px!important;border-radius:8px!important}.ct169-drawer-ep-copy h4{font-size:11px!important;line-height:1.25!important}.ct169-drawer-ep-copy small{font-size:9px!important}.ct169-drawer-ep-copy p{font-size:9px!important;line-height:1.35!important;-webkit-line-clamp:4!important}.ct169-drawer-ep button{min-height:36px!important;font-size:9px!important}

/* Profile: cards large enough to scan, still two columns. */
.stats-grid,.ct167-stats-grid{gap:8px!important}.stat,.stats-grid>*,.ct167-stats-grid>*{min-height:68px!important;padding:9px!important;border-radius:11px!important}.stat small,.stats-grid small,.ct167-stats-grid small{font-size:9px!important}.stat b,.stats-grid b,.ct167-stats-grid b{font-size:14px!important;line-height:1.2!important}.panel-head button{min-height:38px!important;font-size:10px!important}

/* Sports/configs: phone controls, no desktop compression. */
.ct169-sports-tools,.sports-card,[data-sports] .panel{border-radius:13px!important}.ct169-sports-tools input,.settings-grid input,.settings-grid select,.form-grid input,.form-grid select{min-height:42px!important;font-size:12px!important}.settings-grid,.form-grid{gap:9px!important}

/* Charts remain local scrollers, but use a comfortable viewport card. */
.ct169-season-chart-card{flex-basis:calc(100vw - 34px)!important;width:calc(100vw - 34px)!important;max-width:calc(100vw - 34px)!important;border-radius:13px!important}.ct169-chart-scroll,.ct169-activity-scroll{border-radius:10px!important;padding-bottom:5px!important}

/* Bottom nav: readable without stealing content width. */
.mobile-nav{gap:2px!important}.mobile-nav a{font-size:9.5px!important;padding:8px 2px!important}.mobile-nav a span,.mobile-nav a small{font-size:9px!important}

/* Very narrow phones. */
@media(max-width:360px){.content{padding-left:9px!important;padding-right:9px!important}.ct169-main-actions{grid-template-columns:1fr 1fr!important}.ct169-main-actions button:last-child{grid-column:1/-1!important}.ct169-poster-wrap{width:min(48vw,145px)!important}.ct169-detail-copy h1{font-size:24px!important}.row>.card{flex-basis:46vw!important;width:46vw!important}.ct169-related-card{flex-basis:46vw!important;width:46vw!important}.ct169-drawer-ep{grid-template-columns:96px minmax(0,1fr)!important}.ct169-drawer-still{width:96px!important;max-width:96px!important}}
`;

html=html
  .replaceAll('android-v0.99.7.6-r173-mobile-frame','android-v0.99.7.7-r173-mobile-composition')
  .replace('</head>',()=>`<style data-ct-android-mobile="0.99.7.7">${css}</style><meta name="ct-android-mobile-composition" content="stacked-hero-readable-carousels-phone-panels"></head>`);

for(const marker of['android-v0.99.7.7-r173-mobile-composition','stacked-hero-readable-carousels-phone-panels','display:block!important','grid-template-columns:repeat(3,minmax(0,1fr))','flex:0 0 min(43vw,164px)']){
  if(!html.includes(marker))throw new Error(`Android 0.99.7.7 missing composition marker: ${marker}`);
}
await writeFile(indexPath,html,'utf8');
console.log('ANDROID_09977_COMPOSITION_OK web=r173 hero=stacked carousels=readable panels=phone-native');
