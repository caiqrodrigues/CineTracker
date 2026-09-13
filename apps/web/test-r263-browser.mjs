import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';

const root=dirname(fileURLToPath(import.meta.url));
const [runtime,css]=await Promise.all([
  readFile(resolve(root,'runtime-r263-home-list-discover-f1-watched.js'),'utf8'),
  readFile(resolve(root,'dist/app-v263.css'),'utf8')
]);
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
try{
  await page.setContent('<!doctype html><html><head></head><body><main id="app"></main></body></html>');
  await page.addStyleTag({content:css});
  await page.addScriptTag({content:`
    var navSeq=1;
    var __route='home';
    function route(){return __route}
    function img(){return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="342" height="513"><rect width="100%" height="100%" fill="#123247"/></svg>')}
    function shell(a,b,c,body){return body}
    function setApp(body){document.querySelector('#app').innerHTML=body}
    function paintHome(){return true}
    async function renderHome(){return true}
    async function renderDiscover(){return true}
    async function renderSports(){setApp('<div class="page" data-sports><section class="ct255-f1hub" data-ct255-f1><div class="ct255-f1-content">Hub F1</div></section></div>');return true}
    var __f1Watched=false;
    var __rpcCalls=[];
    async function rpc(name,args={}){
      __rpcCalls.push({name,args});
      if(name==='cinetracker_recommendation_state_v108') return {
        hard_excluded:[{media_type:'movie',id:999,poster_path:'/excluded.jpg'}],
        fresh_excluded:[],
        watchlist:[{media_type:'movie',id:998,title:'Watchlist Excluída',poster_path:'/watch.jpg',release_date:'2026-01-01',vote_average:8.4,genre_ids:[28]}]
      };
      if(name==='cinetracker_sports_payload_v1'){
        const starts=new Date(Date.now()-86400000).toISOString();
        return {events:[{sport_slug:'formula_1',provider:'jolpica:f1',provider_event_id:'2026:14:race',title:'Spanish Grand Prix · Corrida',starts_at:starts,status:'finished',season:2026,round:14,venue:'Madring',is_watched:__f1Watched}],watch_history:__f1Watched?[{sport_slug:'formula_1',provider:'jolpica:f1',provider_event_id:'2026:14:race',title:'Spanish Grand Prix · Corrida',starts_at:starts,status:'finished',watched_at:new Date().toISOString()}]:[]};
      }
      if(name==='cinetracker_sport_mark_watched_v1'){__f1Watched=!!args.p_watched;return {ok:true}}
      return {};
    }
    function result(id,type='movie'){
      const isTv=type==='tv';
      return {id,media_type:type,title:isTv?undefined:'Título '+id,name:isTv?'Série '+id:undefined,poster_path:'/p'+id+'.jpg',release_date:isTv?undefined:'2026-09-01',first_air_date:isTv?'2026-09-01':undefined,vote_average:8.1,popularity:10000-id,genre_ids:[28,12]};
    }
    async function tmdb(path,params={}){
      if(path.endsWith('/watch/providers'))return {results:{BR:{flatrate:[{provider_id:8,provider_name:'Netflix',logo_path:'/netflix.png'},{provider_id:337,provider_name:'Disney Plus',logo_path:'/disney.png'}]}}};
      if(/^\\/(movie|tv)\\/\\d+$/.test(path)){const m=path.match(/^\\/(movie|tv)\\/(\\d+)$/);return result(Number(m[2]),m[1])}
      const page=Number(params.page||1), rows=[];
      if(page===1){rows.push(result(999,'movie'),result(998,'movie'))}
      for(let i=0;i<18;i++){const id=page*100+i+(path.includes('/tv')?5000:0);rows.push(result(id,path.includes('/tv')?'tv':(i%3===0?'tv':'movie')))}
      return {results:rows};
    }
  `});
  await page.addScriptTag({content:runtime});

  // HOME: the r262 horizontal authority must be gone and existing r262 classes must be stripped.
  await page.evaluate(()=>{
    __route='home';
    document.querySelector('#app').innerHTML='<div data-home><section class="home-section"><div class="stack ct262-xrail ct262-home-rail" data-ct262-rail="home"><article style="height:90px">A</article><article style="height:90px">B</article><article style="height:90px">C</article></div></section></div>';
    paintHome();
  });
  await page.waitForTimeout(220);
  const home=await page.evaluate(()=>{
    const row=document.querySelector('[data-home] .stack'),cs=getComputedStyle(row),kids=[...row.children];
    return {display:cs.display,classes:row.className,scrollWidth:row.scrollWidth,clientWidth:row.clientWidth,widths:kids.map(x=>x.getBoundingClientRect().width),rowWidth:row.getBoundingClientRect().width,doc:document.documentElement.scrollWidth,inner:innerWidth};
  });
  if(home.display!=='grid')throw new Error('R263_BROWSER Home is not vertical grid: '+JSON.stringify(home));
  if(home.classes.includes('ct262-xrail')||home.classes.includes('ct262-home-rail'))throw new Error('R263_BROWSER r262 Home rail classes survived');
  if(home.scrollWidth>home.clientWidth+2)throw new Error('R263_BROWSER Home still scrolls horizontally');
  if(home.widths.some(w=>Math.abs(w-home.rowWidth)>3))throw new Error('R263_BROWSER Home cards are still compact carousel cards');
  if(home.doc>home.inner+2)throw new Error('R263_BROWSER document overflows horizontally on Home');

  // DISCOVER: all nine tabs exist; Top10 gets streaming and local scroll; personal exclusions stay out.
  await page.evaluate(async()=>{__route='discover';navSeq=11;await renderDiscover(11)});
  await page.waitForSelector('[data-ct263-discover-tab="top10"]');
  const tabsCount=await page.locator('[data-ct263-discover-tab]').count();
  if(tabsCount!==9)throw new Error('R263_BROWSER Discover expected 9 tabs, got '+tabsCount);
  await page.click('[data-ct263-discover-tab="top10"]');
  await page.waitForFunction(()=>document.querySelectorAll('.ct263-media-card').length===10 && document.querySelector('.ct263-streaming:not(.pending)'));
  const top10=await page.evaluate(()=>{
    const rail=document.querySelector('.ct263-media-rail'),poster=document.querySelector('.ct263-media-poster'),cards=[...document.querySelectorAll('.ct263-media-card')],media=cards.map(x=>x.querySelector('[data-media]')?.dataset.media),stream=document.querySelector('.ct263-streaming')?.innerText||'',pr=poster?.getBoundingClientRect();
    return {scrollWidth:rail?.scrollWidth||0,clientWidth:rail?.clientWidth||0,count:cards.length,media,stream,ratio:pr?pr.width/pr.height:0,doc:document.documentElement.scrollWidth,inner:innerWidth};
  });
  if(top10.count!==10||top10.scrollWidth<=top10.clientWidth+10)throw new Error('R263_BROWSER Top10 is not a horizontal local rail: '+JSON.stringify(top10));
  if(top10.media.includes('movie:999')||top10.media.includes('movie:998'))throw new Error('R263_BROWSER personal exclusions leaked into Top10');
  if(!/Netflix/.test(top10.stream))throw new Error('R263_BROWSER Top10 streaming provider missing: '+top10.stream);
  if(Math.abs(top10.ratio-(2/3))>.03)throw new Error('R263_BROWSER Discover poster is not 2:3: '+top10.ratio);
  if(top10.doc>top10.inner+2)throw new Error('R263_BROWSER Discover caused global horizontal scroll');

  for(const tab of ['new','releases','anticipated']){
    await page.click('[data-ct263-discover-tab="'+tab+'"]');
    await page.waitForFunction(t=>document.querySelector('[data-ct263-discover-tab="'+t+'"]')?.classList.contains('active')&&document.querySelectorAll('.ct263-media-card').length>=12,tab);
    const shape=await page.evaluate(()=>{const r=document.querySelector('.ct263-media-rail');return {sw:r?.scrollWidth||0,cw:r?.clientWidth||0,count:document.querySelectorAll('.ct263-media-card').length,doc:document.documentElement.scrollWidth,inner:innerWidth}});
    if(shape.count<12||shape.sw<=shape.cw+10)throw new Error('R263_BROWSER '+tab+' lost local horizontal scroll: '+JSON.stringify(shape));
    if(shape.doc>shape.inner+2)throw new Error('R263_BROWSER '+tab+' caused global horizontal scroll');
  }

  // SPORTS/F1: a canonical F1 event must expose the same watched RPC semantics as other sports.
  await page.evaluate(async()=>{__route='sports';await renderSports()});
  await page.waitForSelector('[data-ct263-f1-watch="2026:14:race"]');
  let f1Text=await page.locator('[data-ct263-f1-watch="2026:14:race"]').innerText();
  if(!/Marcar como assistido/.test(f1Text))throw new Error('R263_BROWSER F1 mark watched control missing: '+f1Text);
  await page.click('[data-ct263-f1-watch="2026:14:race"]');
  await page.waitForFunction(()=>window.__f1Watched===true && /Desmarcar assistido/.test(document.querySelector('[data-ct263-f1-watch="2026:14:race"]')?.textContent||''));
  const f1=await page.evaluate(()=>({watched:__f1Watched,calls:__rpcCalls.filter(x=>x.name==='cinetracker_sport_mark_watched_v1'),doc:document.documentElement.scrollWidth,inner:innerWidth}));
  if(!f1.watched||f1.calls.length!==1)throw new Error('R263_BROWSER F1 watched RPC not called once: '+JSON.stringify(f1));
  const call=f1.calls[0]?.args||{};
  if(call.p_provider!=='jolpica:f1'||call.p_provider_event_id!=='2026:14:race'||call.p_watched!==true)throw new Error('R263_BROWSER F1 watched RPC arguments wrong: '+JSON.stringify(call));
  if(f1.doc>f1.inner+2)throw new Error('R263_BROWSER Sports caused global horizontal scroll');

  console.log('R263_BROWSER_OK Home vertical; Discover 9 tabs/rails/providers/exclusions; F1 watched control');
} finally {
  await browser.close();
}
