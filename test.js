const assert=require('node:assert/strict');
const P=require('./engine.js'), D=require('./data.js'), W=require('./weapons.js');
let checks=0;
function test(name,fn){fn();checks++;console.log('PASS',name);}
const fixed=()=>0.3;
const fresh=()=>P.roll(P.initial(),null,fixed).state;
test('authored collection has 300+ unique base names and valid tags',()=>{
 assert.ok(D.items.length>=300);assert.equal(new Set(D.items.map(x=>x.name)).size,D.items.length);
 for(const i of D.items){assert.ok(P.slots.some(s=>s[0]===i.slot));assert.ok(i.occasions.length);assert.ok(i.presentations.length);}
});
test('every occasion and presentation has choices in every wardrobe slot',()=>{
 for(const occasion of ['casual','work','formal','outdoor','active','sleep','fantasy']) for(const presentation of ['m','f','n','any']) for(const [slot] of P.slots.filter(x=>x[0]!=='weapon')){
 const pool=P.pool(slot,{...P.initial().settings,occasion,presentation});assert.ok(pool.length,`${occasion}/${presentation}/${slot}`);
 assert.ok(pool.every(i=>i.occasions.includes(occasion)||i.occasions.includes('all')));
 assert.ok(pool.every(i=>presentation==='any'||i.presentations.includes(presentation)||i.presentations.includes('shared')));
 }
});
test('wildcard ignores occasion but retains presentation',()=>{
 for(const presentation of ['m','f','n','any']){
 const s={...P.initial().settings,mode:'wildcard',presentation};
 const pool=P.pool('top',s);assert.equal(pool.length,D.items.filter(i=>i.slot==='top'&&(presentation==='any'||i.presentations.includes(presentation)||i.presentations.includes('shared'))).length);
 assert.deepEqual(pool,P.pool('top',{...s,occasion:'formal'}));
 }
});
test('0% always picks an item; 100% always returns empty including hairstyle',()=>{
 const s=P.initial();for(const [id] of P.slots){s.chances[id]=0;assert.equal(P.pick(id,s,()=>0).empty,false,id);s.chances[id]=100;assert.equal(P.pick(id,s,()=>0.999).empty,true,id);}
 assert.equal(P.pick('hairstyle',s,fixed).text,'Unspecified');
});
test('full rolls and individual rerolls preserve locks',()=>{
 const s=fresh();s.locks.top=true;s.settings.occasion='fantasy';s.settings.presentation='f';
 assert.deepEqual(P.roll(s).state.results.top,s.results.top);assert.ok(P.roll(s,'top').error);
});
test('one-piece replaces separates; lock conflict is transactional',()=>{
 let s=fresh();s.settings.structure='onepiece';s=P.roll(s,null,fixed).state;
 assert.equal(s.structure,'onepiece');assert.equal(s.results.top.text,'Covered by one-piece');assert.equal(s.results.bottom.covered,true);
 s.locks.onepiece=true;s.settings.structure='separates';const attempt=P.roll(s);assert.ok(attempt.error.includes('One-piece'));assert.equal(attempt.state,s);
 s.settings.structure='auto';assert.equal(P.roll(s,null,()=>0.99).state.structure,'onepiece');
});
test('locked separates and locked None one-piece prevent incompatible modes',()=>{
 for(const slot of ['top','bottom','onepiece']){const s=fresh();s.locks[slot]=true;s.settings.structure='onepiece';assert.ok(P.roll(s).error);s.settings.structure='auto';assert.equal(P.roll(s,null,()=>0).state.structure,'separates');}
});
test('auto chance boundaries and one-piece empty fall back to separates',()=>{
 let s=fresh();s.settings.onepieceChance=0;assert.equal(P.roll(s,null,()=>0).state.structure,'separates');s.settings.onepieceChance=100;assert.equal(P.roll(s,null,()=>0.99).state.structure,'onepiece');s.chances.onepiece=100;s.settings.structure='onepiece';s=P.roll(s,null,fixed).state;assert.equal(s.structure,'separates');assert.equal(s.results.top.empty,false);assert.equal(s.results.bottom.empty,false);
});
test('switching back to separates restores core slots',()=>{
 let s=fresh();s.settings.structure='onepiece';s=P.roll(s,null,fixed).state;s.settings.structure='separates';s=P.roll(s,'onepiece',fixed).state;assert.equal(s.results.top.empty,false);assert.equal(s.results.bottom.empty,false);assert.equal(s.results.onepiece.empty,true);
});
test('hairstyles are never colored or worn',()=>{
 const s=fresh();s.settings.color=true;s.settings.condition=true;const r=P.pick('hairstyle',s,fixed);assert.equal(r.text,D.items.find(x=>x.id===r.id).name);
});
test('weapons respect kind and era even in wildcard',()=>{
 for(const era of ['contemporary','historical','fantasy','sci-fi','any']) for(const weaponMode of ['physical','metaphorical','mixed']){
 const pool=P.pool('weapon',{...P.initial().settings,mode:'wildcard',era,weaponMode});assert.ok(pool.length);assert.ok(pool.every(i=>era==='any'||i.eras.includes(era)));assert.ok(pool.every(i=>weaponMode==='mixed'||i.kind===weaponMode));
 }
});
test('weapon reservations prevent duplicates and honor wardrobe locks',()=>{
 let s=fresh();s.settings.weapons=true;s.chances.weapon=0;s=P.roll(s,'weapon',()=>0).state;assert.equal(s.results.weapon.id,W.physical[0].id);assert.equal(s.results.gloves.reserved,true);
 s.locks.weapon=true;s=P.roll(s,null,fixed).state;assert.equal(s.results.gloves.reserved,true);assert.equal(s.results.weapon.id,W.physical[0].id);
 s=fresh();s.settings.weapons=true;s.chances.weapon=0;s.chances.gloves=0;s.results.gloves=P.pick('gloves',s,fixed);s.locks.gloves=true;s=P.roll(s,'weapon',()=>0).state;assert.notEqual(s.results.weapon.id,W.physical[0].id);assert.equal(s.results.gloves.empty,false);
});
test('plain text copy includes labels and optional empty slots / weapons',()=>{
 const s=fresh();s.results.headwear={text:'None',empty:true};assert.ok(!P.copyText(s).includes('Headwear:'));s.settings.omitEmpty=false;assert.ok(P.copyText(s).includes('Headwear: None'));s.results.weapon={text:'Damaging secret — can undermine someone’s standing',empty:false};assert.ok(!P.copyText(s).includes('Weapon /'));s.settings.weapons=true;assert.ok(P.copyText(s).includes('Weapon / advantage: Damaging secret —'));
});
test('persistence round trips results, locks, and settings; bad storage recovers',()=>{
 const s=fresh();s.locks.top=true;s.settings.color=true;s.chances.neck=93;const r=P.restore(JSON.stringify(s));assert.deepEqual(r.results,s.results);assert.equal(r.locks.top,true);assert.deepEqual(r.settings,s.settings);assert.equal(r.chances.neck,93);assert.deepEqual(P.restore('broken JSON'),P.initial());assert.deepEqual(P.restore(null),P.initial());
});
test('expanded hairstyles have intentional gender mappings in both picking modes',()=>{
 const hair=D.items.filter(i=>i.slot==='hairstyle');
 assert.ok(hair.length>=300);
 assert.equal(new Set(hair.map(i=>i.name.toLowerCase())).size,hair.length);
 assert.ok(hair.every(i=>i.occasions.includes('all')));
 for(const mode of ['coordinated','wildcard']) for(const occasion of ['casual','work','formal','outdoor','active','sleep','fantasy']){
   const pools=Object.fromEntries(['m','f','n','any'].map(presentation=>[presentation,P.pool('hairstyle',{...P.initial().settings,mode,occasion,presentation})]));
   const has=(p,name)=>pools[p].some(i=>i.name===name);
   for(const p of ['m','f','n','any']) {
     assert.ok(pools[p].length>=200);
     for(const name of ['Bald','Clean-shaved head','Low ponytail','Cornrows','Box braids','Shoulder-length locs','Long loose curls']) assert.ok(has(p,name),`${p}: ${name}`);
   }
   assert.ok(has('m','Ivy League cut'));assert.ok(!has('f','Ivy League cut'));
   assert.ok(has('f','French twist'));assert.ok(!has('m','French twist'));
   assert.equal(pools.n.length,hair.length);assert.equal(pools.any.length,hair.length);
 }
});
test('expanded headwear covers settings and presentation without duplicate base names',()=>{
 const hats=D.items.filter(i=>i.slot==='headwear');
 assert.ok(hats.length>=300);
 assert.equal(new Set(hats.map(i=>i.name.toLowerCase())).size,hats.length);
 const settings=P.initial().settings;
 const names=(occasion,presentation='any',mode='coordinated')=>P.pool('headwear',{...settings,occasion,presentation,mode}).map(i=>i.name);
 for(const occasion of ['casual','work','formal','outdoor','active','sleep','fantasy']) for(const presentation of ['m','f','n','any']) assert.ok(names(occasion,presentation).length>=15);
 for(const presentation of ['m','f','n','any']) {
   assert.ok(names('active',presentation).includes('Cycling helmet'));
   assert.ok(names('sleep',presentation).includes('Tie-back sleep cap'));
   assert.ok(names('work',presentation).includes('Construction hard hat'));
   assert.ok(names('fantasy',presentation).includes('Sallet helm'));
 }
 assert.ok(!names('sleep').includes('Construction hard hat'));
 assert.ok(!names('work').includes('Sallet helm'));
 assert.ok(names('formal','f').includes('Tiara'));
 assert.ok(names('formal','n').includes('Tiara'));
 assert.ok(!names('formal','m').includes('Tiara'));
 assert.equal(names('sleep','any','wildcard').length,hats.length);
 assert.equal(names('work','n','wildcard').length,hats.length);
});
test('headwear descriptors distinguish rigid ornaments and woven materials from fabric',()=>{
 const s=P.initial();Object.assign(s.settings,{mode:'wildcard',presentation:'any',color:true,condition:true});s.chances.headwear=0;
 const pool=P.pool('headwear',s.settings);
 for(const name of ['Open royal crown','Lifeguard straw hat','Flower crown']) {
   const index=pool.findIndex(i=>i.name===name);assert.ok(index>=0);
   const result=P.pick('headwear',s,()=>(index+0.5)/pool.length);
   assert.equal(result.id,pool[index].id);
   assert.ok(!/freshly pressed|mended|frayed/.test(result.text),result.text);
 }
});
test('expanded tops retain broad filter coverage and named international separates',()=>{
 const tops=D.items.filter(i=>i.slot==='top');
 assert.ok(tops.length>=450);
 assert.equal(new Set(tops.map(i=>i.name.toLowerCase())).size,tops.length);
 const pool=(occasion,presentation='any',mode='coordinated')=>P.pool('top',{...P.initial().settings,occasion,presentation,mode});
 const has=(occasion,presentation,name)=>pool(occasion,presentation).some(i=>i.name===name);
 for(const occasion of ['casual','work','formal','outdoor','active','sleep','fantasy']) for(const presentation of ['m','f','n','any']) assert.ok(pool(occasion,presentation).length>=20);
 for(const presentation of ['m','f','n','any']) {
   assert.ok(has('work',presentation,'Samue work top (Japanese wrap-front shirt)'));
   assert.ok(has('sleep',presentation,'Jinbei top (Japanese summer lounge shirt)'));
   assert.ok(has('active',presentation,'Judogi top (Japanese judo training jacket)'));
   assert.ok(has('work',presentation,'Kariyushi shirt (Okinawan open-collar shirt)'));
   assert.ok(has('formal',presentation,'Jeogori (Korean tie-front upper garment)'));
   assert.ok(has('casual',presentation,'Guayabera (Caribbean and Latin American pleated shirt)'));
 }
 assert.ok(has('formal','f','Kebaya (Southeast Asian front-opening blouse)'));
 assert.ok(has('formal','n','Kebaya (Southeast Asian front-opening blouse)'));
 assert.ok(has('formal','m','Barong Tagalog (Philippine embroidered shirt)'));
 assert.ok(has('formal','n','Barong Tagalog (Philippine embroidered shirt)'));
 assert.ok(!has('sleep','any','Judogi top (Japanese judo training jacket)'));
 assert.ok(!has('fantasy','any','Samue work top (Japanese wrap-front shirt)'));
 assert.ok(!tops.some(i=>/^(haori|hanten|happi|kimono robe|yukata|kosode|nagajuban|hakama|hanbok ensemble|áo dài)(\b|$)/i.test(i.name)));
 assert.equal(pool('sleep','any','wildcard').length,tops.length);
 const feminineWildcard=pool('sleep','f','wildcard');
 assert.ok(feminineWildcard.some(i=>i.name==='Kebaya (Southeast Asian front-opening blouse)'));
 assert.ok(!feminineWildcard.some(i=>i.name==='Barong Tagalog (Philippine embroidered shirt)'));
});
test('Japanese collection intersects occasion and gender in coordinated and wildcard modes',()=>{
 const base={...P.initial().settings,collection:'japanese'};
 const tagged=D.items.filter(i=>i.collections.includes('japanese'));
 assert.ok(tagged.length>=51);assert.equal(tagged.filter(i=>i.slot==='top').length,24);
 for(const mode of ['coordinated','wildcard']) for(const occasion of ['casual','work','formal','outdoor','active','sleep','fantasy']) for(const presentation of ['m','f','n','any']) {
   const settings={...base,mode,occasion,presentation};
   for(const [slot] of P.slots.filter(([id])=>!['hairstyle','weapon'].includes(id))) {
     const actual=P.pool(slot,settings);
     assert.ok(actual.every(i=>i.collections.includes('japanese')));
     assert.ok(actual.every(i=>mode==='wildcard'||i.occasions.includes(occasion)||i.occasions.includes('all')));
     assert.ok(actual.every(i=>presentation==='any'||i.presentations.includes('shared')||i.presentations.includes(presentation)));
   }
 }
 const wildcard=P.pool('top',{...base,mode:'wildcard'});
 assert.equal(wildcard.length,24);
 assert.ok(!wildcard.some(i=>i.name.startsWith('Kebaya')));
 assert.ok(P.pool('top',{...base,collection:'all',mode:'wildcard'}).length>wildcard.length);
 assert.deepEqual(P.pool('hairstyle',base),P.pool('hairstyle',{...base,collection:'all'}));
 assert.deepEqual(P.pool('weapon',base),P.pool('weapon',{...base,collection:'all'}));
});
test('Japanese rolls preserve locks and explain empty pools without unrelated fallback',()=>{
 let s=fresh();const locked=s.results.top;s.locks.top=true;s.settings.collection='japanese';
 s.settings.structure='separates';s=P.roll(s,null,fixed).state;
 assert.deepEqual(s.results.top,locked);
 assert.ok(D.items.find(i=>i.id===s.results.bottom.id).collections.includes('japanese'));
 s.chances.headwear=0;const missing=P.pick('headwear',s,fixed);
 assert.equal(missing.empty,true);assert.ok(missing.text.includes('No Japanese options'));
 s.chances.headwear=100;assert.equal(P.pick('headwear',s,fixed).text,'None');
 s.locks={};s.settings.structure='onepiece';s=P.roll(s,null,fixed).state;
 assert.equal(s.structure,'onepiece');assert.equal(s.results.top.covered,true);
 assert.ok(D.items.find(i=>i.id===s.results.onepiece.id).collections.includes('japanese'));
 s.settings.occasion='active';const conflict=P.roll(s,null,fixed);assert.ok(conflict.error.includes('No one-piece'));assert.equal(conflict.state,s);
});
test('Japanese collection restores safely and old saves default to all collections',()=>{
 const s=fresh();s.settings.collection='japanese';s.locks.top=true;
 const saved=P.restore(JSON.stringify(s));assert.equal(saved.settings.collection,'japanese');assert.equal(saved.locks.top,true);assert.deepEqual(saved.results,s.results);
 delete s.settings.collection;assert.equal(P.restore(JSON.stringify(s)).settings.collection,'all');
 s.settings.collection='unknown';assert.equal(P.restore(JSON.stringify(s)).settings.collection,'all');
});
test('expanded bottoms cover all occasions and Japanese selections without outfit-slot leakage',()=>{
 const bottoms=D.items.filter(i=>i.slot==='bottom');
 assert.ok(bottoms.length>=500);
 assert.equal(new Set(bottoms.map(i=>i.name.toLowerCase())).size,bottoms.length);
 const occasions=['casual','work','formal','outdoor','active','sleep','fantasy'];
 for(const item of bottoms){
   assert.ok(item.occasions.every(o=>occasions.includes(o)));
   assert.ok(item.presentations.every(p=>['m','f','n','shared'].includes(p)));
   assert.ok(!/\b(dress|jumpsuit|overalls|coveralls|wetsuit|singlet)\b/i.test(item.name.replace('dress trousers','trousers').replace('dress slacks','slacks')));
 }
 for(const occasion of occasions) for(const presentation of ['m','f','n','any']){
   const s=P.initial();Object.assign(s.settings,{occasion,presentation,structure:'separates'});
   assert.ok(P.pool('bottom',s.settings).length>=25,`${occasion}/${presentation}`);
   s.settings.collection='japanese';assert.ok(P.pool('bottom',s.settings).length>0,`Japanese ${occasion}/${presentation}`);
   const result=P.roll(s,'bottom',fixed).state.results.bottom;
   assert.equal(result.empty,false);assert.ok(D.items.find(i=>i.id===result.id).collections.includes('japanese'));
 }
 const examples={casual:'Barrel-leg jeans',work:'Chef’s checked trousers',formal:'Taffeta ball skirt',outdoor:'Stretch trekking trousers',active:'Board shorts',sleep:'Cotton poplin pajama trousers',fantasy:'Venetian breeches'};
 for(const [occasion,name] of Object.entries(examples)) assert.ok(P.pool('bottom',{...P.initial().settings,occasion}).some(i=>i.name===name));
 const settings={...P.initial().settings,collection:'japanese',mode:'wildcard'};
 assert.equal(P.pool('bottom',settings).length,20);
 assert.ok(!P.pool('bottom',settings).some(i=>i.name.startsWith('Salwar')));
 assert.equal(P.pool('bottom',{...settings,collection:'all'}).length,bottoms.length);
});
console.log(`${checks} behavior checks passed.`);
