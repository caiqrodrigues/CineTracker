(() => {
'use strict';
window.__ctAndroidBuild='0.0.91';
const load=path=>fetch(path,{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error(path+' '+r.status);return r.text()}).then(code=>(0,eval)(code));
Promise.resolve().then(()=>window.__ct90Loaded?null:load('/patch-v060-v090.js')).then(()=>window.__ct91Loaded?null:load('/patch-v061-v091.js')).catch(()=>{});
})();
