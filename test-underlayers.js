const assert=require('node:assert/strict');
const P=require('./engine.js'),D=require('./data.js');
const layers=['undergarmentTop','undergarmentBottom','hosiery'];
const catalog=D.items.filter(i=>layers.includes(i.slot));
const item=name=>{const i=catalog.find(i=>i.name===name);assert.ok(i,name);return i;};
const result=i=>({id:i.id,baseText:i.name,text:i.name,condition:null,empty:false,conflictSlots:[]});
function select(state,name) {
 const i=item(name);state.chances[i.slot]=0;
 const pool=P.pool(i.slot,state.settings).filter(option=>i.slot!=='undergarmentTop'||!state.locks.undergarmentBottom||!option.covers?.length);
 const index=pool.findIndex(option=>option.id===i.id);assert.ok(index>=0,name);
 const outcome=P.roll(state,i.slot,()=>(index+0.5)/pool.length);assert.equal(outcome.error,'');
 return outcome.state;
}
let checks=0;
function test(name,fn){fn();checks++;console.log('PASS',name);}

test('all 150 entries retain IDs and occupy appropriate top, bottom, or hosiery slots',()=>{
 assert.equal(catalog.length,150);
 for(const [index,i] of catalog.entries()) assert.equal(i.id,'undergarments-'+(1898+index));
 for(const name of ['Crew-neck undershirt','Underwired balconette bra','Bra with detachable emergency confetti pouches']) assert.equal(item(name).slot,'undergarmentTop');
 for(const name of ['Classic fly-front briefs','Low-rise bikini panties','Open-bust shaping bodysuit']) assert.equal(item(name).slot,'undergarmentBottom');
 for(const name of ['Fishnet pantyhose','Ankle-length liner socks']) assert.equal(item(name).slot,'hosiery');
});

test('a bra, underwear bottom, and hosiery can coexist and reroll independently under outer one-pieces',()=>{
 let s=P.initial();s.settings.presentation='f';s.settings.structure='onepiece';s.chances.onepiece=0;s=P.roll(s,null,()=>0.3).state;
 s=select(s,'Underwired balconette bra');s=select(s,'Low-rise bikini panties');s=select(s,'Fishnet pantyhose');
 assert.equal(s.results.top.covered,true);assert.equal(s.results.bottom.covered,true);
 const before=JSON.parse(JSON.stringify(s.results));s=select(s,'Full-coverage underwear briefs');
 assert.deepEqual(s.results.undergarmentTop,before.undergarmentTop);assert.deepEqual(s.results.hosiery,before.hosiery);
 const text=P.copyText(s);assert.match(text,/Undergarment top: Underwired balconette bra/);assert.match(text,/Undergarment bottom: Full-coverage underwear briefs/);assert.match(text,/Hosiery: Fishnet pantyhose/);
});

test('every full set covers the bottom, rejects edits and rerolls there, and releases it on a separate top or None',()=>{
 const sets=catalog.filter(i=>i.covers?.includes('undergarmentBottom'));assert.equal(sets.length,7);
 for(const full of sets) {
   let s=P.roll(P.initial(),null,()=>0.3).state;s=select(s,full.name);
   assert.equal(s.results.undergarmentBottom.coveredBy,'undergarmentTop');
   const blocked=P.roll(s,'undergarmentBottom');assert.ok(blocked.error);assert.equal(blocked.state,s);
   assert.ok(P.setCondition(s,'undergarmentBottom','brand_new').error);
   const text=P.copyText(s);assert.ok(text.includes(full.name));assert.ok(!text.includes('Undergarment bottom:'));
   s=P.setCondition(s,'undergarmentTop','brand_new').state;s.locks.undergarmentTop=true;
   const locked=s.results.undergarmentTop;s=P.roll(s,null,()=>0.8).state;assert.deepEqual(s.results.undergarmentTop,locked);
   assert.equal(s.results.undergarmentBottom.covered,true);assert.equal(P.restore(JSON.stringify(s)).results.undergarmentBottom.covered,true);
   s.locks.undergarmentTop=false;s=select(s,'Crew-neck undershirt');assert.ok(!s.results.undergarmentBottom.covered);
   s=select(s,full.name);s.chances.undergarmentTop=100;s=P.roll(s,'undergarmentTop',()=>0.5).state;
   assert.equal(s.results.undergarmentTop.text,'None');assert.ok(!s.results.undergarmentBottom.covered);
 }
});

test('locked nonempty and None underwear bottoms exclude full sets and preserve exact results',()=>{
 for(const empty of [false,true]) {
   let s=P.initial();s.settings.condition=false;s.chances.undergarmentTop=0;
   s.results.undergarmentBottom=empty?{text:'None',empty:true,conflictSlots:[]}:result(item('Classic fly-front briefs'));
   s.locks.undergarmentBottom=true;const kept=s.results.undergarmentBottom;
   for(const value of [0,0.1,0.3,0.8,0.999]) {
     const picked=P.pick('undergarmentTop',s,()=>value);assert.ok(!item(picked.baseText).covers);
     const outcome=P.roll(s,null,()=>value);assert.equal(outcome.error,'');assert.deepEqual(outcome.state.results.undergarmentBottom,kept);
   }
 }
});

test('legacy single rows migrate every item, condition, lock, and percentage while preserving other outfit results',()=>{
 const existing={id:D.items.find(i=>i.slot==='top').id,text:'Previously saved top',empty:false,conflictSlots:[]};
 for(const i of catalog) {
   const legacy={...result(i),baseText:'navy '+i.name,text:'navy '+i.name+' — brand new',condition:'brand_new'};
   const old={version:4,settings:{...P.initial().settings,condition:false,undergarmentCategory:'hosiery'},chances:{undergarments:17},locks:{undergarments:true,top:true},results:{undergarments:legacy,top:existing}};
   const restored=P.restore(JSON.stringify(old));
   assert.deepEqual(restored.results[i.slot],legacy,i.name);assert.equal(restored.locks[i.slot],true,i.name);
   assert.deepEqual(restored.results.top,existing);assert.equal(restored.locks.top,true);assert.equal(restored.settings.condition,false);
   assert.equal(restored.settings.undergarmentCategory,'all');assert.equal(restored.results.undergarments,undefined);
   for(const slot of layers) assert.equal(restored.chances[slot],17);
   const filled=P.fillFoundation(restored,()=>0.3);assert.deepEqual(filled.results[i.slot],legacy);assert.deepEqual(filled.results.top,existing);
   if(i.covers?.length) assert.equal(filled.results.undergarmentBottom.covered,true);
   const roundTrip=P.restore(JSON.stringify(filled));assert.deepEqual(roundTrip.results[i.slot],legacy);
 }
});

test('legacy locked None, old default migration, custom zero, and missing layers restore without forced selections',()=>{
 const old={version:4,results:{undergarments:{text:'None',empty:true,conflictSlots:[]}},locks:{undergarments:true},chances:{undergarments:0}};
 let restored=P.fillFoundation(P.restore(JSON.stringify(old)),()=>0.9);
 for(const slot of layers) {assert.equal(restored.results[slot].text,'None');assert.equal(restored.locks[slot],true);assert.equal(restored.chances[slot],0);}
 old.version=3;restored=P.restore(JSON.stringify(old));for(const slot of layers) assert.equal(restored.chances[slot],10);
 const fresh=P.initial();for(const slot of layers) fresh.chances[slot]=0;
 restored=P.restore(JSON.stringify(fresh));for(const slot of layers) assert.equal(restored.chances[slot],0);
});
console.log(`${checks} foundation-layer checks passed.`);
