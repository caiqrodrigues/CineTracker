import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
await import('./prepare-android-v09973.mjs');

const indexPath=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(indexPath,'utf8');
html=html
  .replaceAll('android-v0.99.7.3-r151-library-sync','android-v0.99.7.4-r152-sports-hub')
  .replaceAll("window.__ctAndroidBuild='0.99.7.3'","window.__ctAndroidBuild='0.99.7.4'")
  .replaceAll('v09973-r151-library-sync','v09974-r152-sports-hub');
await writeFile(indexPath,html,'utf8');

for(const marker of[
  "window.__ct0997R150Loaded",
  "window.__ct0997R150bLoaded",
  "window.__ct0997R151Loaded",
  "window.__ct0997R152Loaded",
  "window.__ct0997R152='r152-sports-hub-v1'",
  "window.__ct151Scope='seen+watchlist+progress'",
  'ct-reconcile-library-user',
  'ct-sports-sync',
  'cinetracker_sports_payload_v1',
  'cinetracker_sport_toggle_favorite_v1',
  'data-ct152-nav="sports"',
  'Hoje',
  'Ao vivo',
  'Calendário',
  'Favoritos',
  'soccer',
  'formula_1',
  'mma',
  'basketball',
  'american_football',
  'ice_hockey',
  'cinetracker:app-foreground',
  "event==='postgres_changes'"
])if(!html.includes(marker))throw new Error(`Android 0.99.7.4: embedded runtime missing ${marker}`);

if(!html.includes("window.__ctAndroidBundle='android-v0.99.7.4-r152-sports-hub'"))throw new Error('Android 0.99.7.4: bundle marker missing');
if(html.includes('<script src="/'))throw new Error('Android 0.99.7.4: root JS dependency remained after inlining');

const javaPath=resolve(root,'apps/android/app/src/main/java/com/cinetracker/app/MainActivity.java');
let java=await readFile(javaPath,'utf8');
const discoverLine='        findViewById(R.id.nav_discover).setOnClickListener(v -> navigate("discover"));';
const sportsLine='        findViewById(R.id.nav_sports).setOnClickListener(v -> navigate("sports"));';
if(!java.includes(sportsLine)){
  if(!java.includes(discoverLine))throw new Error('Android 0.99.7.4: native Discover anchor missing');
  java=java.replace(discoverLine,`${discoverLine}\n${sportsLine}`);
}
const navAnchor='if(window.ct15Navigate){window.ct15Navigate(t);return true;}';
const sportsDispatch="if(t==='sports'&&window.__ct152Sports&&window.__ct152Sports.open){window.__ct152Sports.open();return true;}";
if(!java.includes(sportsDispatch)){
  if(!java.includes(navAnchor))throw new Error('Android 0.99.7.4: native navigation JS anchor missing');
  java=java.replace(navAnchor,`${sportsDispatch}${navAnchor}`);
}
await writeFile(javaPath,java,'utf8');
if(!java.includes('R.id.nav_sports'))throw new Error('Android 0.99.7.4: native Sports button not bound');
if(!java.includes("t==='sports'&&window.__ct152Sports"))throw new Error('Android 0.99.7.4: native Sports dispatcher missing');

console.log('ANDROID_09974_PREPARED r152=sports-hub native-nav=5 provider=canonical realtime=preserved r151=preserved');
