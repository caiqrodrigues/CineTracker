/* CineTracker Web 1.0.69 / r278 — effective TMDB watched actions and permanently fixed Home media tabs. */
window.__ctR278='effective-tmdb-watch-action+fixed-home-tabs';
window.__ctR278Watch='effective-tmdb+data-media-fallback+continue+dust+movie-watchlist';
window.__ctR278Tabs='series-movies-fixed-top';
window.__ctR278Frozen='r277-sidebar+r276-history+episode-meta+dedupe+rewatch+discover+detail+sports+android-preserved';
const ct278BaseEpisodeWatchAction=ct274EpisodeWatchAction;
const ct278BaseEpisodeAttrs=ct274EpisodeAttrs;
const ct278BaseMovieWatchAction=ct274MovieWatchAction;
const ct278BaseMovieAttrs=ct274MovieAttrs;
function ct278EffectiveTmdb(x){try{const n=Number(typeof ct275Tmdb==='function'?ct275Tmdb(x):0);if(n>0)return n}catch{}try{const n=Number(typeof mediaTmdb==='function'?mediaTmdb(x):0);if(n>0)return n}catch{}return Number(x?.tmdb_id||0)>0?Number(x.tmdb_id):0}
function ct278EpisodeWatchAction(x){const tmdb=ct278EffectiveTmdb(x),s=Number(x?.next_season_number??x?.season_number??0),e=Number(x?.next_episode_number??x?.episode_number??0);return tmdb>0&&s>0&&e>0&&typeof ct266WatchAction==='function'?ct266WatchAction('episode',tmdb,s,e,x?.next_episode_title||x?.episode_title||x?.title||x?.media_title||''):''}
function ct278EpisodeAttrs(x,context){const tmdb=ct278EffectiveTmdb(x),s=Number(x?.season_number??x?.next_season_number??0),e=Number(x?.episode_number??x?.next_episode_number??0);return 'data-ct274-episode-card="1" data-ct274-context="'+context+'" data-ct274-tmdb="'+tmdb+'" data-ct274-season="'+s+'" data-ct274-episode="'+e+'" data-ct274-fallback-title="'+esc(x?.episode_title||x?.cached_episode_title||x?.next_episode_title||'')+'" data-ct274-fallback-rating="'+esc(x?.episode_rating??x?.next_episode_rating??'')+'" data-ct274-fallback-date="'+esc(x?.episode_air_date||x?.next_episode_air_date||x?.watched_at||'')+'"';}
function ct278MovieWatchAction(x){const tmdb=ct278EffectiveTmdb(x);return tmdb>0&&typeof ct266WatchAction==='function'?ct266WatchAction('movie',tmdb,0,0,x?.title||x?.media_title||''):''}
function ct278MovieAttrs(x){const tmdb=ct278EffectiveTmdb(x);return 'data-ct274-movie-card="1" data-ct274-tmdb="'+tmdb+'" data-ct274-year="'+esc(x?.release_year||'')+'" data-ct274-runtime="'+esc(x?.runtime_minutes||'')+'" data-ct274-rating="'+esc(x?.vote_average??'')+'"';}
ct274EpisodeWatchAction=ct278EpisodeWatchAction;
ct274EpisodeAttrs=ct278EpisodeAttrs;
ct274MovieWatchAction=ct278MovieWatchAction;
ct274MovieAttrs=ct278MovieAttrs;
function ct278TmdbFromCard(card){const direct=Number(card?.dataset?.ct274Tmdb||0);if(direct>0)return direct;const raw=String(card?.dataset?.media||'');const m=raw.match(/^(?:tv|movie):(\d+)$/);return m?Number(m[1]):0}
function ct278EnsureWatchActions(root=document){const home=root?.matches?.('[data-home]')?root:root?.querySelector?.('[data-home]');if(!home)return 0;let changed=typeof ct277EnsureWatchActions==='function'?ct277EnsureWatchActions(home):0;for(const card of home.querySelectorAll('.ct274-media-card')){const context=card.dataset.ct274Context||'',isEpisode=context==='continue'||context==='dust';let action=card.querySelector(':scope > [data-ct266-watch]');if(!action&&isEpisode&&typeof ct266WatchAction==='function'){const tmdb=ct278TmdbFromCard(card),s=Number(card.dataset.ct274Season||0),e=Number(card.dataset.ct274Episode||0),title=card.dataset.ct274FallbackTitle||card.querySelector('b,strong')?.textContent||'';if(tmdb>0&&s>0&&e>0){card.insertAdjacentHTML('beforeend',ct266WatchAction('episode',tmdb,s,e,title));action=card.querySelector(':scope > [data-ct266-watch]');if(action)changed++}}if(action&&!card.classList.contains('ct266-home-watch-host')){card.classList.add('ct266-home-watch-host');changed++}}return changed}
const ct278BasePaintHome=ct275PaintHome;
function ct278PaintHome(...args){const out=ct278BasePaintHome.apply(this,args);ct278EnsureWatchActions(document);return out}
ct275PaintHome=ct278PaintHome;
paintHome=ct278PaintHome;
window.__ctR278Test={effectiveTmdb:ct278EffectiveTmdb,episodeWatchAction:ct278EpisodeWatchAction,episodeAttrs:ct278EpisodeAttrs,movieWatchAction:ct278MovieWatchAction,ensureWatchActions:ct278EnsureWatchActions,tmdbFromCard:ct278TmdbFromCard,basePaintHome:ct278BasePaintHome,baseEpisodeWatchAction:ct278BaseEpisodeWatchAction,baseEpisodeAttrs:ct278BaseEpisodeAttrs,baseMovieWatchAction:ct278BaseMovieWatchAction,baseMovieAttrs:ct278BaseMovieAttrs};
