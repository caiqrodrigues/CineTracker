/* CineTracker Web 1.0.98 / r307 — exact Home watch isolation + legacy weekly frontier availability. */
window.__ctR307='exact-home-watch+legacy-frontier-production-renderers';
window.__ctR307Home='exact-item-writer-not-series-seen';
window.__ctR307Legacy='raw+smackdown-frontier-no-historical-backlog';
window.__ctR307Frozen='r306-modal-actions+f1-results+sports-sync+android-preserved';

const ct307BaseApplyFreshAvailability=ct283ApplyFreshAvailability;

function ct307LegacyPendingCount(row,show){
  if(!ct283LegacySeries(row))return null;
  const frontier=ct283Frontier(row),boundary=ct283ReleaseBoundary(show);
  if(!frontier||!boundary)return null;
  if(ct283Pos(frontier.s,frontier.e)>=ct283Pos(boundary.s,boundary.e))return 0;
  let pending=0;
  for(const info of ct283SeasonRows(show)){
    if(info.s<frontier.s||info.s>boundary.s)continue;
    const start=info.s===frontier.s?frontier.e+1:1;
    const end=info.s===boundary.s?Math.min(info.count,boundary.e):info.count;
    if(end>=start)pending+=end-start+1;
  }
  if(!pending&&frontier.s===boundary.s&&boundary.e>frontier.e)pending=boundary.e-frontier.e;
  return Math.max(0,pending);
}

function ct307ApplyFreshAvailability(row,show){
  const pending=ct307LegacyPendingCount(row,show);
  if(pending===null)return ct307BaseApplyFreshAvailability(row,show);
  const watchedKeys=ct283WatchedKeys(row);
  const watched=Math.max(0,Number(row?.watched_episodes||0),watchedKeys.length);
  const tmdbId=ct275Tmdb(row);
  row.released_episodes=watched+pending;
  row.available_episodes=pending;
  row.history_missing_episodes=pending;
  if(tmdbId>0)ct283AvailabilityByTmdb.set(tmdbId,pending);
  if(pending===0){
    row.is_caught_up=true;
    row.home_bucket='up_to_date';
    row.next_season_number=null;
    row.next_episode_number=null;
    row.next_episode_title=null;
    row.next_episode_air_date=null;
  }else{
    row.is_caught_up=false;
    if(!row.home_bucket||row.home_bucket==='up_to_date')row.home_bucket='continue';
  }
  return row;
}

ct283ApplyFreshAvailability=ct307ApplyFreshAvailability;

window.__ctR307Test={
  legacyPending:ct307LegacyPendingCount,
  applyFreshAvailability:ct307ApplyFreshAvailability
};
