import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';

const src=await readFile(resolve(process.cwd(),'apps/web/runtime-r176.js'),'utf8');
const a=src.indexOf('function ct176PickUnwatched');
const b=src.indexOf('\nfunction ct176SetQueue',a);
assert.ok(a>=0&&b>a,'ct176PickUnwatched must exist');
const pick=Function(src.slice(a,b)+'; return ct176PickUnwatched;')();
const released=Array.from({length:10},(_,i)=>({season:1,episode:i+1,title:'E'+(i+1)}));

let watched=new Set(['1:1','1:2','1:3','1:4','1:5','1:7']);
let out=pick(released,watched,6);
assert.equal(out[0].episode,6,'gap at E6 must rewind next to E6 even when E7 is watched');
assert.equal(out[1].episode,8,'successor must skip already-watched E7 and become E8');

watched=new Set(['1:1','1:2','1:3','1:4','1:5']);
out=pick(released,watched,2);
assert.deepEqual(out.map(x=>x.episode),[6,7],'normal sequence must remain E6 then E7');

watched=new Set(['1:1','1:3','1:4']);
out=pick(released,watched,3);
assert.deepEqual(out.map(x=>x.episode),[2,5,6],'earliest released gap always has priority over greatest watched pointer');

console.log('R176_GAP_LOGIC_OK first-unwatched=true rewind=true skip-watched-successor=true');
