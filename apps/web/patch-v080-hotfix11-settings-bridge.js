(() => {
'use strict';
if(window.__ctHotfix11SettingsBridge)return;
window.__ctHotfix11SettingsBridge=true;
const previous=window.ct92Navigate;
if(typeof previous!=='function')return;
function upgrade(){try{window.ct11UpgradeImporter?.()}catch{}}
function schedule(){for(const delay of [100,200,360,600])setTimeout(upgrade,delay)}
window.ct92Navigate=function(target){const out=previous.apply(this,arguments);if(String(target)==='settings')schedule();return out};
})();
