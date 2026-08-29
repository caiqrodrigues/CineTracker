import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const index=await readFile(resolve(root,'dist/index.html'),'utf8');
const runtime=await readFile(resolve(root,'dist/patch-v139-v0997-cache-buttons.js'),'utf8');
const gate=await readFile(resolve(root,'dist/patch-v138-v0997-network-gate.js'),'utf8');
const proxy=await readFile(resolve(root,'supabase/functions/tmdb-proxy/index.ts'),'utf8');

const must=(ok,msg)=>{if(!ok)throw new Error('r139: '+msg)};
const count=(s,n)=>s.split(n).length-1;

must(runtime.includes('r139-cache-buttons-primary'),'runtime marker missing');
must(runtime.includes("'X-CT-Primary':'r139'"),'primary header missing');
must(runtime.includes('function validHomePayload'),'home payload validator missing');
must(runtime.includes('!v._ct138LegacySuppressed'),'suppressed payload rejection missing');
must(runtime.includes("sessionStorage.removeItem('ct139:home')"),'invalid cache eviction missing');
must(runtime.includes("if(validHomePayload(cached)){homeData=cached;homeAt=0}"),'home stale-while-revalidate missing');
must(runtime.includes("if(!profileData){profileData=readPrimaryCache('profile');if(profileData)profileAt=0}"),'profile stale-while-revalidate missing');
must(runtime.includes("const nextHome=await rpcDirect('cinetracker_home_live_v0997_r2',{})"),'fresh Home fetch missing');
must(runtime.includes("await rpcDirect('cinetracker_mark_watch_v0994'"),'mark movie must use primary RPC');
must(!runtime.includes("await window.sbRpc?.('cinetracker_mark_watch_v0994'"),'legacy mark RPC survived');
const markPos=runtime.indexOf("const mark=e.target.closest?.('[data-ct136-mark-movie]')");
const mediaPos=runtime.indexOf("const media=e.target.closest?.('[data-ct136-media]')");
must(markPos>0&&mediaPos>0&&markPos<mediaPos,'movie action must be handled before card navigation');
must(runtime.includes("e.stopImmediatePropagation();if(mark.dataset.ct139Busy==='1')return"),'double-click guard missing');
must(runtime.includes('movie_watchlist:(homeData.movie_watchlist||[]).filter'),'optimistic watchlist update missing');

must(gate.includes('/^r13[89]$/i'),'network gate does not accept r139');
must(count(index,'patch-v139-v0997-cache-buttons.js')===1,'r139 runtime must be emitted once');
must(!index.includes('patch-v138-v0997-resilient-primary.js'),'r138 primary still executes');
const gatePos=index.indexOf('patch-v138-v0997-network-gate.js');
const runtimePos=index.indexOf('patch-v139-v0997-cache-buttons.js');
must(gatePos>index.indexOf('<body>')&&gatePos<runtimePos,'network gate must load before r139 runtime');

must(proxy.includes('const TOKEN_TTL=15*60*1000'),'TMDB token TTL missing');
must(proxy.includes('let tokenInflight:Promise<string>|null=null'),'TMDB token coalescing missing');
must(proxy.includes("sb.rpc('cinetracker_tmdb_token')"),'TMDB token source changed unexpectedly');

console.log('WEB_R139_OK home-cache=validated+revalidate movie-button=action-first tmdb-token=15m+coalesced');
