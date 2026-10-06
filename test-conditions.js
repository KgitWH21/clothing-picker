const assert=require('node:assert/strict');
const C=require('./conditions.js'),D=require('./data.js'),P=require('./engine.js');
const item=name=>{const value=D.items.find(i=>i.name===name);assert.ok(value,name);return value;};
const ids=name=>C.options(item(name)).map(c=>c.id);
let checks=0;function test(name,fn){fn();checks++;console.log('PASS',name);}
test('every garment has compatible metadata and the full new-to-unserviceable range',()=>{
 assert.equal(new Set(C.catalog.map(c=>c.id)).size,C.catalog.length);
 for(const i of D.items){
   const options=C.options(i);
   if(i.slot==='hairstyle'){assert.equal(options.length,0);continue;}
   assert.ok(i.conditionProfile,i.name);assert.ok(Array.isArray(i.conditionFeatures),i.name);
   assert.equal(options[0].id,'brand_new',i.name);assert.equal(options.at(-1).id,'unserviceable',i.name);
 }
});
test('underarm stains are limited to suitable fabric garments',()=>{
 for(const n of ['Hoodie','Oxford shirt','Long-sleeved T-shirt','Pajama shirt','Kimono (Japanese full-length robe)'])assert.ok(ids(n).includes('pit_stains'),n);
 for(const n of ['Camisole','Bandeau top','Sleeveless turtleneck','Pencil skirt','Straight-leg jeans','Cuirass','Leather motorcycle jacket','Beanie','Stud earrings','Leather driving gloves','Hiking boots'])assert.ok(!ids(n).includes('pit_stains'),n);
});
test('damage types fit materials and construction',()=>{
 assert.ok(ids('Hoodie').includes('ripped'));assert.ok(ids('Hoodie').includes('soiled'));assert.ok(ids('Hoodie').includes('smelly'));
 assert.ok(ids('Leather driving gloves').includes('cracked_leather'));assert.ok(!ids('Cotton tunic').includes('cracked_leather'));
 assert.ok(ids('Plate gauntlets').includes('rusted'));assert.ok(!ids('Pearl drops').includes('rusted'));
 assert.ok(ids('Round spectacles').includes('cracked_lens'));assert.ok(!ids('Cloth face mask').includes('cracked_lens'));
 assert.ok(!ids('Open royal crown').includes('ripped'));assert.ok(!ids('Lifeguard straw hat').includes('threadbare'));
 assert.ok(ids('Running shoes').includes('worn_soles'));assert.ok(!ids('Soft slipper socks').includes('worn_soles'));
 assert.ok(ids('Straight-leg jeans').includes('worn_knees'));assert.ok(!ids('Running shorts').includes('worn_knees'));assert.ok(!ids('Denim maxi skirt').includes('worn_knees'));
 assert.ok(ids('Zip-front skirt').includes('broken_zip'));assert.ok(!ids('Circle skirt').includes('broken_zip'));
});
function stateWith(name){const i=item(name);const s=P.initial();s.results[i.slot]={id:i.id,baseText:'navy '+i.name,text:'navy '+i.name,condition:null,empty:false,conflictSlots:[]};return s;}
test('manual edits preserve garment and color, copy condition, remove cleanly, and respect locks',()=>{
 let s=stateWith('Hoodie');const id=s.results.top.id;
 s=P.setCondition(s,'top','pit_stains').state;
 assert.equal(s.results.top.id,id);assert.equal(s.results.top.baseText,'navy Hoodie');assert.equal(s.results.top.text,'navy Hoodie — permanent pit stains');assert.ok(P.copyText(s).includes('Top: navy Hoodie — permanent pit stains'));
 assert.equal(P.setCondition(s,'top','worn_soles').state,s);
 s.locks.top=true;assert.ok(P.setCondition(s,'top','brand_new').error);assert.deepEqual(P.roll(s).state.results.top,s.results.top);
 const saved=P.restore(JSON.stringify(s));assert.deepEqual(saved.results.top,s.results.top);
 s.locks.top=false;s=P.setCondition(s,'top',null).state;assert.equal(s.results.top.text,'navy Hoodie');assert.equal(s.results.top.condition,null);
});
test('optional random conditions remain eligible throughout every slot and filter',()=>{
 for(const collection of ['all','japanese']) for(const occasion of ['casual','work','formal','outdoor','active','sleep','fantasy']) for(const presentation of ['m','f','n','any']) {
   const s=P.initial();Object.assign(s.settings,{collection,occasion,presentation,condition:true,color:true});
   for(const [slot] of P.slots){s.chances[slot]=0;const r=P.pick(slot,s,()=>0.65);if(r.empty)continue;
     if(['hairstyle','weapon'].includes(slot)){assert.equal(r.condition,null);assert.equal(r.text,r.baseText);}
     else assert.ok(P.conditionOptions(r).some(c=>c.id===r.condition),r.text);
     s.settings.condition=false;assert.equal(P.pick(slot,s,()=>0.65).condition,null);s.settings.condition=true;
   }
 }
});
test('legacy saved descriptions only change on explicit edit and do not accumulate wear labels',()=>{
 let s=P.initial();s.results.top={id:item('Hoodie').id,text:'faded navy hoodie',empty:false,conflictSlots:[]};s.locks.top=true;
 s=P.restore(JSON.stringify(s));assert.equal(s.results.top.text,'faded navy hoodie');assert.ok(P.setCondition(s,'top','brand_new').error);
 s.locks.top=false;s=P.setCondition(s,'top','brand_new').state;assert.equal(s.results.top.text,'navy hoodie — brand new');
 s=P.setCondition(s,'top','ripped').state;assert.equal(s.results.top.text,'navy hoodie — ripped');
});
test('empty, covered, hair and weapon slots cannot receive clothing conditions',()=>{
 let s=P.initial();assert.ok(P.setCondition(s,'top','brand_new').error);
 s.settings.structure='onepiece';s=P.roll(s,null,()=>0.3).state;assert.ok(P.setCondition(s,'top','ripped').error);assert.ok(P.setCondition(s,'hairstyle','soiled').error);
 s.settings.weapons=true;s.chances.weapon=0;s=P.roll(s,'weapon',()=>0.3).state;assert.ok(P.setCondition(s,'weapon','brand_new').error);
});
test('random conditions default on, migrate old saves once, and respect later opt-outs',()=>{
 const fresh=P.initial();assert.equal(fresh.settings.condition,true);
 let rolled=P.roll(fresh,null,()=>0.3).state;
 assert.ok(rolled.results.top.condition);
 assert.ok(P.roll(rolled,'top',()=>0.6).state.results.top.condition);
 const legacy={...rolled,settings:{...rolled.settings,condition:false}};delete legacy.version;
 const restored=P.restore(JSON.stringify(legacy));assert.equal(restored.settings.condition,true);assert.deepEqual(restored.results,legacy.results);
 restored.settings.condition=false;
 const optedOut=P.restore(JSON.stringify(restored));assert.equal(optedOut.settings.condition,false);
 assert.equal(P.roll(optedOut,'top',()=>0.3).state.results.top.condition,null);
});
console.log(`${checks} condition checks passed (${C.catalog.length} condition types).`);
