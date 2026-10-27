const assert=require('node:assert/strict');
const P=require('./engine.js'),W=require('./weapons.js'),WC=require('./weapon-conditions.js'),C=require('./conditions.js'),D=require('./data.js');
const weapons=[...W.physical,...W.metaphorical];
const item=name=>{const found=weapons.find(i=>i.name===name);assert.ok(found,name);return found;};
const ids=name=>WC.options(item(name)).map(c=>c.id);
const stateWith=name=>{
  const weapon=item(name),s=P.initial();s.settings.weapons=true;s.chances.weapon=0;
  const baseText=weapon.name+(weapon.advantage?' — '+weapon.advantage:'');
  s.results.weapon={id:weapon.id,baseText,text:baseText,condition:null,empty:false,conflictSlots:[...weapon.conflictSlots]};
  return s;
};
let checks=0;
function test(name,fn){fn();checks++;console.log('PASS',name);}

test('125 unique weapon statuses stay separate from clothing and are all reachable',()=>{
  assert.equal(WC.catalog.length,125);
  assert.equal(new Set(WC.catalog.map(c=>c.id)).size,125);
  assert.equal(new Set(WC.catalog.map(c=>c.label.toLowerCase())).size,125);
  const garmentIds=new Set(C.catalog.map(c=>c.id)),garmentLabels=new Set(C.catalog.map(c=>c.label.toLowerCase()));
  for(const condition of WC.catalog) {
    assert.ok(!garmentIds.has(condition.id));assert.ok(!garmentLabels.has(condition.label.toLowerCase()));
    assert.ok(weapons.some(weapon=>WC.options(weapon).some(c=>c.id===condition.id)),condition.label);
  }
  for(const weapon of weapons) {
    assert.ok(WC.options(weapon).length,weapon.name);
    assert.deepEqual(C.options(weapon),[]);
  }
  for(const garment of D.items) assert.deepEqual(WC.options(garment),[]);
});

test('physical damage, charge, ammunition, and social statuses fit the object',()=>{
  for(const name of ['Arming sword','Steel war pick','Thick glass bottle']) assert.ok(ids(name).includes('weapon_chipped'),name);
  for(const name of ['Reinforced fighting gloves','Braided leather bullwhip','Political influence','Damaging secret']) assert.ok(!ids(name).includes('weapon_chipped'),name);
  assert.ok(ids('Arming sword').includes('weapon_blunted'));assert.ok(!ids('Heavy mace').includes('weapon_blunted'));
  assert.ok(ids('Arming sword').includes('weapon_reforged'));assert.ok(!ids('Hardwood quarterstaff').includes('weapon_reforged'));
  assert.ok(ids('Plasma sidearm').includes('weapon_uncharged'));assert.ok(!ids('Arming sword').includes('weapon_uncharged'));
  assert.ok(ids('Recurved bow').includes('weapon_out_of_ammunition'));assert.ok(!ids('Arming sword').includes('weapon_out_of_ammunition'));
  assert.ok(ids('Recurved bow').includes('weapon_string_slackened'));assert.ok(!ids('Ash-shaft spear').includes('weapon_string_slackened'));
  assert.ok(ids('Royal writ').includes('weapon_revoked'));assert.ok(!ids('Exceptional memory').includes('weapon_revoked'));
  assert.ok(ids('Incriminating recording').includes('weapon_redacted'));assert.ok(!ids('Unshakable composure').includes('weapon_redacted'));
  assert.ok(ids('Counterfeit identity').includes('weapon_expired'));assert.ok(!ids('Shared childhood with a rival').includes('weapon_expired'));
  for(const name of ['Arming sword','Political influence']) for(const id of ['weapon_cursed','weapon_honorbound','weapon_soulbound']) assert.ok(ids(name).includes(id));
});

test('weapon presence defaults to 80% and old defaults migrate without rewriting saved results or opt-outs',()=>{
  const fresh=P.initial();assert.equal(fresh.chances.weapon,20);
  for(const mode of ['physical','metaphorical','mixed']) {
    fresh.settings.weaponMode=mode;
    assert.equal(P.pick('weapon',fresh,()=>0.199).empty,true);
    assert.equal(P.pick('weapon',fresh,()=>0.2).empty,false);
  }
  const old=stateWith('Legal authority');old.version=2;old.chances.weapon=70;old.settings.condition=false;old.locks.weapon=true;
  const restored=P.restore(JSON.stringify(old));
  assert.equal(restored.chances.weapon,20);assert.equal(restored.settings.condition,false);
  assert.deepEqual(restored.results.weapon,old.results.weapon);assert.equal(restored.locks.weapon,true);
  old.chances.weapon=42;assert.equal(P.restore(JSON.stringify(old)).chances.weapon,42);
  restored.chances.weapon=70;assert.equal(P.restore(JSON.stringify(restored)).chances.weapon,70);
});

test('manual weapon and advantage conditions preserve identity, descriptions, reservations, and locked rolls',()=>{
  for(const name of ['Arming sword','Official signet ring','Document-filled briefcase','Political influence']) {
    const original=stateWith(name),base=original.results.weapon;
    let s=P.setCondition(original,'weapon','weapon_cursed').state;
    assert.equal(s.results.weapon.id,base.id);assert.equal(s.results.weapon.baseText,base.baseText);
    assert.equal(s.results.weapon.text,base.baseText+' — cursed');
    assert.deepEqual(s.results.weapon.conflictSlots,base.conflictSlots);
    s=P.setCondition(s,'weapon','weapon_honorbound').state;
    assert.equal(s.results.weapon.text,base.baseText+' — honorbound');
    assert.ok(P.copyText(s).includes('Weapon / advantage: '+base.baseText+' — honorbound'));
    assert.equal(P.setCondition(s,'weapon','brand_new').state,s);
    assert.equal(P.setCondition(s,'weapon','not_a_status').state,s);
    s.locks.weapon=true;
    assert.ok(P.setCondition(s,'weapon','weapon_blessed').error);
    assert.deepEqual(P.roll(s,null,()=>0.8).state.results.weapon,s.results.weapon);
    assert.deepEqual(P.restore(JSON.stringify(s)).results.weapon,s.results.weapon);
    s.locks.weapon=false;s=P.setCondition(s,'weapon',null).state;
    assert.equal(s.results.weapon.text,base.baseText);assert.equal(s.results.weapon.condition,null);
  }
  const legacy=stateWith('Damaging secret');delete legacy.results.weapon.baseText;
  const updated=P.setCondition(legacy,'weapon','weapon_compromised').state;
  assert.equal(updated.results.weapon.text,legacy.results.weapon.text+' — compromised');
  const empty=P.initial();empty.results.weapon={text:'None',empty:true};
  assert.ok(P.setCondition(empty,'weapon','weapon_cursed').error);
  const garment=D.items.find(i=>i.name==='Hoodie');empty.results.top={id:garment.id,text:garment.name,empty:false};
  assert.ok(P.setCondition(empty,'top','weapon_cursed').error);
});

test('random statuses stay eligible across modes and eras, can be disabled, and never accumulate',()=>{
  for(const weaponMode of ['physical','metaphorical','mixed']) for(const era of ['any','contemporary','historical','fantasy','sci-fi']) {
    const s=P.initial();Object.assign(s.settings,{weapons:true,weaponMode,era});s.chances.weapon=0;
    for(const value of [0,0.2,0.5,0.8,0.999]) {
      const result=P.pick('weapon',s,()=>value);
      assert.equal(result.empty,false);assert.ok(P.conditionOptions(result).some(c=>c.id===result.condition),result.text);
      s.results.weapon=result;
      const changed=P.setCondition(s,'weapon','weapon_blessed').state;
      assert.equal(changed.results.weapon.text,result.baseText+' — blessed');
    }
    s.settings.condition=false;const result=P.pick('weapon',s,()=>0.5);
    assert.equal(result.condition,null);assert.equal(result.text,result.baseText);
    s.results.weapon=result;assert.equal(P.setCondition(s,'weapon','weapon_cursed').state.results.weapon.condition,'weapon_cursed');
  }
});
console.log(`${checks} weapon-condition checks passed (${WC.catalog.length} condition types).`);
