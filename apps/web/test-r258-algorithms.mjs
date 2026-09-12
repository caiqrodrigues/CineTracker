const A=(c,m)=>{if(!c)throw new Error(m)};
const n=v=>{const x=Number(v);return Number.isFinite(x)?x:0};
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const weekly=x=>/(^|\s)raw(\s|$)|smackdown/i.test(norm(x?.title||''));
const ep=(s,e)=>n(s)>0&&n(e)>0?n(s)*100000+n(e):0;
const missing=r=>Math.max(n(r.history_missing_episodes),n(r.released_episodes)-n(r.watched_episodes),n(r.missing_episodes));
function normalize(r){if(!r||weekly(r)||n(r.watched_episodes)<=0)return r;const m=missing(r),bucket=String(r.home_bucket||'');if(m>0&&(bucket==='up_to_date'||r.is_caught_up===true)){r.home_bucket='continue';r.is_caught_up=false;r.history_missing_episodes=m;r._ct258DisplayMissing=m}return r}
function applyWeekly(r,pending){const next=pending[0]||null,m=pending.length;r._ct258WeeklyResolved=true;r._ct258DisplayMissing=m;r.history_missing_episodes=m;if(next){r.home_bucket='continue';r.is_caught_up=false;r.next_season_number=n(next.season_number);r.next_episode_number=n(next.episode_number);r.released_episodes=n(r.watched_episodes)+m}else{r.home_bucket='up_to_date';r.is_caught_up=true;r.next_season_number=null;r.next_episode_number=null;r.released_episodes=n(r.watched_episodes)}return r}
const stuart=normalize({title:'Stuart Não Consegue Salvar o Universo',watched_episodes:6,released_episodes:8,total_episodes:10,history_missing_episodes:0,home_bucket:'up_to_date',is_caught_up:true});
A(stuart.home_bucket==='continue'&&stuart.history_missing_episodes===2,'Stuart released-watched deficit must win Em dia');
const lioness=normalize({title:'Lioness',watched_episodes:21,released_episodes:22,total_episodes:24,home_bucket:'up_to_date',is_caught_up:true});
A(lioness.home_bucket==='continue'&&lioness.history_missing_episodes===1,'Lioness must be Continue with one released episode missing');
const raw={title:'Raw',watched_episodes:245,released_episodes:1740,history_missing_episodes:1495,home_bucket:'continue',is_caught_up:false,next_season_number:1,next_episode_number:14};
normalize(raw);A(raw.history_missing_episodes===1495&&raw.next_season_number===1,'legacy historical backlog must not be normalized by aggregate counts');
applyWeekly(raw,[{season_number:34,episode_number:36}]);A(raw.home_bucket==='continue'&&raw.history_missing_episodes===1&&raw.next_season_number===34&&raw.next_episode_number===36&&raw.released_episodes===246,'Raw must collapse historical holes to one current pending episode');
const smack={title:'WWE Friday Night SmackDown',watched_episodes:232,released_episodes:1414,history_missing_episodes:1182,home_bucket:'continue'};applyWeekly(smack,[{season_number:28,episode_number:37}]);A(smack.history_missing_episodes===1&&smack.next_episode_number===37&&smack.released_episodes===233,'SmackDown must use current frontier, not S01E01');
A(ep(28,37)>ep(28,36)&&ep(1,1)<ep(28,36),'episode frontier ordering');
function eligible(x,k,{allowWatch=false}={}){const key=x.key;if(!x.id||!x.poster||x.score<7.5||x.year<=1990)return false;if(k.seen.has(key)||k.following.has(key)||k.blocked.has(key)||(!allowWatch&&k.watch.has(key)))return false;return true}
const k={seen:new Set(['tv:1']),following:new Set(['tv:2']),blocked:new Set(['movie:3']),watch:new Set(['movie:4'])};
A(!eligible({id:1,key:'tv:1',poster:1,score:8,year:2026},k),'seen excluded');
A(!eligible({id:2,key:'tv:2',poster:1,score:8,year:2026},k),'following excluded');
A(!eligible({id:3,key:'movie:3',poster:1,score:8,year:2026},k),'blocked excluded');
A(!eligible({id:4,key:'movie:4',poster:1,score:8,year:2026},k),'watchlist excluded outside Watchlist block');
A(eligible({id:4,key:'movie:4',poster:1,score:8,year:2026},k,{allowWatch:true}),'watchlist may appear only in its own block');
console.log('R258_ALGORITHMS_PASS');
