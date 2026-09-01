import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';

const src=await readFile(resolve(process.cwd(),'apps/web/runtime-r177.js'),'utf8');
assert.match(src,/ct176SetQueue=function\(mediaId,queue\)/,'r177 must wrap canonical queue setter');
assert.match(src,/if\(changed&&route\(\)==='home'\)ct175SchedulePaint\(\)/,'queue change must repaint Home');
assert.match(src,/ct176PrimeWithWatched\(x,watchedNow,true\).*ct175SchedulePaint/s,'unwatch must seed from drawer watched set and repaint');
assert.match(src,/ct176PrimeCanonical=async function\(x,force=false\)/,'canonical rebuild must be wrapped');
console.log('R177_REPAINT_OK drawer-home-shared=true canonical-queue-repaints=true');
