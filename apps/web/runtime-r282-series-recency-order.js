/* CineTracker Web 1.0.73 / r282 — strict recency ordering inside final series buckets. */
window.__ctR282='series-recency-order+bucket-authority';
window.__ctR282Series='last-watched-desc-inside-final-bucket';
window.__ctR282Rule='latest-watch-first-unless-bucket-changes';
window.__ctR282Frozen='r281-watch-isolation+r280-minimal-check+r278-fixed-tabs+r277-sidebar+r276-history+android-preserved';

const ct282BaseSeriesSection=ct275SeriesSection;

function ct282WatchTime(row){
 const t=Date.parse(row?.last_watched_at||row?.watched_at||'');
 return Number.isFinite(t)?t:0
}
function ct282SortSeriesRows(rows){
 return (Array.isArray(rows)?rows:[])
  .map((row,index)=>({row,index,time:ct282WatchTime(row)}))
  .sort((a,b)=>b.time-a.time||a.index-b.index)
  .map(x=>x.row)
}
function ct282SeriesSection(title,rows){
 return ct282BaseSeriesSection(title,ct282SortSeriesRows(rows))
}

ct275SeriesSection=ct282SeriesSection;
window.__ctR282Test={watchTime:ct282WatchTime,sortSeriesRows:ct282SortSeriesRows,seriesSection:ct282SeriesSection,baseSeriesSection:ct282BaseSeriesSection};
