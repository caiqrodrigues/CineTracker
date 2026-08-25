(() => {
'use strict';
window.__ctAndroidBuild='0.0.92';
const load=path=>fetch(path,{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error(path+' '+r.status);return r.text()}).then(code=>(0,eval)(code));
Promise.resolve()
  .then(()=>window.__ct91Loaded?null:load('/patch-v061-v091.js'))
  .then(()=>window.__ct91PreserveLoaded?null:load('/patch-v062-v091-preserve.js'))
  .then(()=>window.__ct92Loaded?null:load('/patch-v063-v092.js'))
  .then(()=>window.__ct92EpisodeContextLoaded?null:load('/patch-v064-v092-episode-context.js'))
  .catch(()=>{});
})();
