import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const [js,html,release]=await Promise.all([
 readFile('dist/app-v544.js','utf8'),readFile('dist/index.html','utf8'),
 readFile('dist/release.json','utf8').then(JSON.parse)
]);
new Function(js);
assert.ok(js.includes("const REVISION='r544-official-0.3.71'"));
assert.ok(js.includes('if(s.initialDone){homeAnchorPending507=false;return true}'));
assert.ok(js.includes('data-ct544-retry'));
assert.ok(js.includes('window.__ctR544Home='));
assert.ok(js.includes('card.dataset.ct544EventAt=stamp'));
assert.ok(!js.includes("stack.insertAdjacentHTML('afterbegin',cardHtml(key,p));recount(target);"));
assert.ok(html.includes('app-v544.js'));
assert.equal(release.revision,'r544-official-0.3.71');
console.log('WEB_R544_TEST_OK');