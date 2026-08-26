import { readFile } from 'node:fs/promises';
const read=p=>readFile(p,'utf8');
const edge=await read('supabase/functions/ct-import-bingers-user/index.ts');
const nav=await read('apps/web/patch-v085-hotfix15-import-transport.js');
const build=await read('scripts/apply-hotfix10-selective.mjs');
const android=await read('apps/android/app/src/main/java/com/cinetracker/app/MainActivity.java');
const gradle=await read('apps/android/app/build.gradle');
const fail=m=>{throw new Error('HOTFIX15_IMPORT_TRANSPORT: '+m)};

for(const h of ['Access-Control-Allow-Origin','Access-Control-Allow-Headers','Access-Control-Allow-Methods'])if(!edge.includes(h))fail('CORS header missing: '+h);
const options=edge.indexOf("if(req.method==='OPTIONS')");
const auth=edge.indexOf('const user=await uid(req)');
if(options<0||auth<0||options>auth)fail('OPTIONS preflight must execute before JWT user lookup');
if(!edge.includes("'authorization, x-client-info, apikey, content-type'"))fail('browser Authorization/apikey/content-type preflight not allowed');
if(!edge.includes("strategy:'hotfix15_cors_plays_semantics'"))fail('deployed source strategy not HOTFIX15');

if(!nav.includes('__ctHotfix15ImportTransport')||!nav.includes('ct15EnhanceNativePicker')||!nav.includes('ct15RestoreNativeFiles'))fail('HOTFIX15 web/native transport layer missing');
for(const slot of ['library','watches','package'])if(!nav.includes(`['${slot}'`)&&!nav.includes(`'${slot}'`))fail('native slot missing '+slot);
if(!nav.includes('data-ct15-native-pick')&&!nav.includes('ct15NativePick'))fail('explicit Android native picker buttons missing');
if(nav.includes("closest?.('#ct11-library,#ct11-watches,#ct11-package')"))fail('HOTFIX14 input click interception was copied into HOTFIX15');
if(!build.includes('patch-v085-hotfix15-import-transport.js'))fail('HOTFIX15 layer not shipped');
if(!build.includes('patch-v084-hotfix14-real-device'))fail('obsolete HOTFIX14 layer is not explicitly stripped');

if(!android.includes('release=hotfix15'))fail('Android runtime URL not HOTFIX15');
if(!android.includes('cinetracker_hotfix15_import'))fail('Android import persistence namespace not HOTFIX15');
if(android.includes('Intent.EXTRA_MIME_TYPES'))fail('Android CSV picker still filters OEM MIME types');
if(!android.includes('intent.setType("*/*")'))fail('Android picker is not OEM-safe all-files chooser');
if(!android.includes("window.ct15Navigate&&window.ct15Navigate('settings')"))fail('Android does not restore Settings after picker/Activity recreation');
if(!android.includes('hasPendingImportFlow()'))fail('Android does not detect interrupted picker flow');
if(!android.includes('ct15RestoreNativeFiles'))fail('Android does not restore cached native files');
if(!android.includes('if (fileChooserCallback != null)'))fail('legacy WebChrome chooser compatibility lost');
if(!android.includes('String slot = currentPickerSlot;')||!android.includes('slot = importPrefs().getString("picker_slot", "")'))fail('Activity recreation can still lose the native picker slot');
if(!android.includes('cacheImportFile(slot, uris.get(0))'))fail('Android result is not cached before returning to WebView');
if(!gradle.includes('versionCode 993')||!gradle.includes("versionName '0.0.97 HOTFIX 15'"))fail('Android identity is not HOTFIX15');
console.log('HOTFIX15_IMPORT_TRANSPORT_OK: CORS preflight before auth; explicit native buttons; picker slot restored from SharedPreferences; selected bytes cached before WebView handoff; versionCode=993.');
