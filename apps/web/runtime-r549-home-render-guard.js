/* Injected inside the Web r404 Home owner, before its series renderer. */
function ct549ApplyReleasedToVisibleHome(){
 const selected=window.__ctR548Home?.selected;
 const idFor=window.__ctR548Home?.mediaId;
 if(!selected||!idFor)return;
 for(let i=series404.length-1;i>=0;i--){
  const row=series404[i],id=idFor(row);
  if(!row?.__ct549_home_release||selected.has(id))continue;
  if(row.__ct549_home_inserted){series404.splice(i,1);continue}
  const previous=row.__ct549_home_before;
  if(previous)Object.assign(row,previous);
  delete row.__ct549_home_release;
  delete row.__ct549_home_before;
 }
 for(const [id,{row:original,episode:ep}] of selected){
  let row=series404.find(item=>idFor(item)===id);
  if(!row){
   row={...original,tmdb_id:id,__ct549_home_inserted:true};
   series404.push(row);
  }
  if(!row.__ct549_home_release){
   row.__ct549_home_before={
    home_bucket:row.home_bucket,next_season_number:row.next_season_number,
    next_episode_number:row.next_episode_number,next_episode_title:row.next_episode_title,
    next_episode_air_date:row.next_episode_air_date,available_episodes:row.available_episodes
   };
  }
  Object.assign(row,{
   home_bucket:'continue',next_season_number:ep.season,
   next_episode_number:ep.episode,next_episode_title:ep.name,
   next_episode_air_date:ep.air,
   available_episodes:Math.max(Number(row.available_episodes||0),ep.available),
   __ct549_home_release:true
  });
 }
}
