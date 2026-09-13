import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const src=await readFile(new URL('./runtime-r262-real-video-regressions.js',import.meta.url),'utf8');
const noop=()=>{};
const document={querySelector:()=>null,querySelectorAll:()=>[],documentElement:{scrollLeft:0},body:{scrollLeft:0},addEventListener:noop,scrollingElement:{scrollLeft:0}};
class MO{observe(){}}
const context={window:{addEventListener:noop},document,location:{pathname:'/'},MutationObserver:MO,requestAnimationFrame:fn=>fn(),setTimeout,clearTimeout,console,Date,Promise,Symbol,Number,String,Math,history:{length:1,back:noop}};
context.window.window=context.window;context.window.document=document;vm.createContext(context);vm.runInContext(src,context,{filename:'runtime-r262-real-video-regressions.js'});
await new Promise(r=>setTimeout(r,60));
const t=context.window.__ctR262Test;if(!t)throw new Error('r262 test exports missing');
const now=new Date(),today=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
const yesterday=new Date(now);yesterday.setDate(yesterday.getDate()-1);const y=`${yesterday.getFullYear()}-${String(yesterday.getMonth()+1).padStart(2,'0')}-${String(yesterday.getDate()).padStart(2,'0')}`;
const row={media_title:'WWE Raw',watched_episodes:245,last_watched_at:now.toISOString()};
const old={season_number:1,episode_number:14,air_date:'1993-04-26',watched:false};const recent={season_number:34,episode_number:36,air_date:y,watched:false};
let c=t.computeWeekly262(row,[old,recent],'Returning Series',today);if(c.pending.length!==1||c.next?.episode_number!==36||c.bucket!=='continue')throw new Error('r262 recent weekly frontier failed '+JSON.stringify(c));
c=t.computeWeekly262({...row,last_watched_at:'2000-01-01'},[old,recent],'Returning Series',today);if(c.bucket!=='dust')throw new Error('r262 stale weekly bucket failed '+JSON.stringify(c));
c=t.computeWeekly262(row,[old],'Returning Series',today);if(c.pending.length!==0||c.bucket!=='up_to_date')throw new Error('r262 historical backlog was not ignored '+JSON.stringify(c));
const s={media_title:'SmackDown',watched_episodes:100,home_bucket:'dust',history_missing_episodes:1495,next_episode_number:14,next_episode_air_date:'1993-04-26'};t.sanitizeWeekly262(s);if(s.home_bucket!=='up_to_date'||s.history_missing_episodes!==0||'next_episode_number' in s)throw new Error('r262 weekly sanitize failed '+JSON.stringify(s));
console.log('R262_ALGORITHMS_OK');
