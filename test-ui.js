// Minimal DOM harness: verifies application event wiring, not browser rendering.
const {readFileSync}=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
class Element {
  constructor(){this.children=[];this.listeners={};this.classList={toggle(){}};this.hidden=true;this.value='';this.checked=false;this.attributes={};}
  replaceChildren(...children){this.children=[...children];}
  append(...children){this.children.push(...children);}
  setAttribute(k,v){this.attributes[k]=v;}
  addEventListener(k,fn){this.listeners[k]=fn;}
  focus(){this.focused=true;}
  select(){this.selected=true;}
  fire(kind){return this.listeners[kind]?.();}
}
function app({failStorage=false, clipboard=false, saved=null}={}){
 const elements={}, writes=[];let stored=saved;
 const document={getElementById(id){return elements[id]||=(new Element());},createElement(){return new Element();},createTextNode(text){return text;}};
 for(const id of ['color','condition','omitEmpty','weapons']) document.getElementById(id).type='checkbox';
 document.getElementById('onepieceChance').type='number';
 const context=vm.createContext({document, navigator:{clipboard:clipboard?{async writeText(t){writes.push(t);}}:undefined},localStorage:{getItem(){if(failStorage)throw Error();return stored;},setItem(k,v){if(failStorage)throw Error();stored=v;}},console});
 // Keep initial Auto structure in separates so the top-lock scenario is stable.
 vm.runInContext('Math.random = () => 0.3;',context);
 for(const file of ['conditions.js','data.js','weapons.js','weapon-conditions.js','engine.js','app.js']) vm.runInContext(readFileSync(file,'utf8'),context);
 return {elements,writes,stored:()=>stored};
}
(async()=>{
 const a=app({clipboard:true});assert.equal(a.elements.slots.children.length,17);assert.equal(a.elements.weaponSlot.children.length,1);
 await a.elements.copy.fire('click');assert.ok(a.writes[0].includes('Hairstyle:'));assert.ok(!a.writes[0].includes('Weapon / advantage:'));
 const topRow=a.elements.slots.children[3], lock=topRow.children[3].children[1];lock.fire('click');const top=JSON.parse(a.stored()).results.top;
 a.elements.occasion.value='fantasy';a.elements.occasion.fire('change');a.elements.roll.fire('click');assert.deepEqual(JSON.parse(a.stored()).results.top,top);
 const restored=app({saved:a.stored()});assert.equal(restored.elements.occasion.value,'fantasy');assert.equal(restored.elements.slots.children[3].children[3].children[1].attributes['aria-pressed'],'true');
 a.elements.weapons.checked=true;a.elements.weapons.fire('change');assert.equal(a.elements.weaponControls.hidden,false);assert.ok(JSON.parse(a.stored()).results.weapon);
 a.elements.unlock.fire('click');assert.deepEqual(JSON.parse(a.stored()).locks,{});
 const b=app({failStorage:true});assert.ok(b.elements.storageStatus.textContent.includes('unavailable'));b.elements.roll.fire('click');await b.elements.copy.fire('click');assert.equal(b.elements.copyFallback.hidden,false);assert.equal(b.elements.copyText.selected,true);assert.ok(b.elements.copyText.value.includes('Footwear:'));
 const c=app();const initialResults=JSON.parse(c.stored()).results;
 c.elements.collection.value='japanese';c.elements.collection.fire('change');
 assert.deepEqual(JSON.parse(c.stored()).results,initialResults);
 assert.equal(c.elements.collectionHelp,undefined);
 assert.equal(c.elements.modeHelp,undefined);
 c.elements.mode.value='wildcard';c.elements.mode.fire('change');c.elements.roll.fire('click');
 const data=require('./data.js');
 for(const [id,result] of Object.entries(JSON.parse(c.stored()).results)) if(id!=='hairstyle'&&!result.empty) assert.ok(data.items.find(i=>i.id===result.id).collections.includes('japanese'));
 assert.ok(c.elements.slots.children[1].children[0].children[0].textContent.includes('No Japanese choices'));
 const collectionReload=app({saved:c.stored()});assert.equal(collectionReload.elements.collection.value,'japanese');
 c.elements.collection.value='all';c.elements.collection.fire('change');assert.equal(JSON.parse(c.stored()).settings.collection,'all');
 console.log('PASS UI Japanese filter: settings event, deferred rolls, wildcard, missing-pool hints, reload, clear filter.');
 const oldSave=JSON.parse(a.stored());delete oldSave.version;oldSave.settings.condition=false;
 const migrated=app({saved:JSON.stringify(oldSave)});assert.equal(migrated.elements.condition.checked,true);
 migrated.elements.condition.checked=false;migrated.elements.condition.fire('change');assert.equal(app({saved:migrated.stored()}).elements.condition.checked,false);
 const e=app();assert.equal(e.elements.condition.checked,true);assert.ok(JSON.parse(e.stored()).results.top.condition);const conditionSelect=e.elements.slots.children[3].children[1].children[1].children[0];
 assert.equal(conditionSelect.disabled,false);const garment=JSON.parse(e.stored()).results.top;
 conditionSelect.value='brand_new';conditionSelect.fire('change');
 assert.equal(JSON.parse(e.stored()).results.top.condition,'brand_new');assert.equal(JSON.parse(e.stored()).results.top.id,garment.id);
 const eLock=e.elements.slots.children[3].children[3].children[1];eLock.fire('click');assert.equal(conditionSelect.disabled,true);
 const eReload=app({saved:e.stored()});assert.equal(eReload.elements.slots.children[3].children[1].children[1].children[0].value,'brand_new');
 eLock.fire('click');conditionSelect.value='';conditionSelect.fire('change');assert.equal(JSON.parse(e.stored()).results.top.condition,null);
 e.elements.condition.checked=true;e.elements.condition.fire('change');e.elements.roll.fire('click');assert.ok(JSON.parse(e.stored()).results.top.condition);
 console.log('PASS UI conditions: per-item edit, stable garment, locks, reload, clear, optional random wear.');
 const w=app({clipboard:true});w.elements.weapons.checked=true;w.elements.weapons.fire('change');
 const weaponRow=w.elements.weaponSlot.children[0],weaponSelect=weaponRow.children[1].children[1].children[0],weaponLock=weaponRow.children[3].children[1];
 assert.equal(weaponRow.children[2].children[1].value,20);assert.equal(weaponSelect.disabled,false);
 const weapon=JSON.parse(w.stored()).results.weapon;assert.ok(weapon.condition.startsWith('weapon_'));
 weaponSelect.value='weapon_cursed';weaponSelect.fire('change');
 assert.equal(JSON.parse(w.stored()).results.weapon.id,weapon.id);assert.equal(JSON.parse(w.stored()).results.weapon.text,weapon.baseText+' — cursed');
 await w.elements.copy.fire('click');assert.ok(w.writes.at(-1).includes(weapon.baseText+' — cursed'));
 weaponLock.fire('click');assert.equal(weaponSelect.disabled,true);
 const weaponReload=app({saved:w.stored()});assert.equal(weaponReload.elements.weaponSlot.children[0].children[1].children[1].children[0].value,'weapon_cursed');
 weaponLock.fire('click');w.elements.weaponMode.value='metaphorical';w.elements.weaponMode.fire('change');weaponRow.children[3].children[0].fire('click');
 assert.ok(weaponSelect.children.some(c=>c.value==='weapon_compromised'));assert.ok(!weaponSelect.children.some(c=>c.value==='weapon_chipped'));
 weaponSelect.value='weapon_honorbound';weaponSelect.fire('change');assert.equal(JSON.parse(w.stored()).results.weapon.condition,'weapon_honorbound');
 w.elements.condition.checked=false;w.elements.condition.fire('change');weaponRow.children[3].children[0].fire('click');assert.equal(JSON.parse(w.stored()).results.weapon.condition,null);
 weaponRow.children[2].children[1].value=100;weaponRow.children[2].children[1].fire('change');weaponRow.children[3].children[0].fire('click');assert.equal(weaponSelect.disabled,true);
 console.log('PASS UI weapon conditions: higher default, tailored menus, edits, copy, locks, reload, random opt-out, empty slot.');
 const oldOutfit=JSON.parse(a.stored());oldOutfit.version=4;
 for(const slot of ['undergarmentTop','undergarmentBottom','hosiery']) {delete oldOutfit.results[slot];delete oldOutfit.chances[slot];delete oldOutfit.locks[slot];}
 const oldItem=data.items.find(i=>i.name==='Classic fly-front briefs');
 const legacyResult={id:oldItem.id,baseText:oldItem.name,text:oldItem.name+' — brand new',condition:'brand_new',empty:false,conflictSlots:[]};
 oldOutfit.results.undergarments=legacyResult;oldOutfit.chances.undergarments=10;oldOutfit.locks.undergarments=true;
 const u=app({saved:JSON.stringify(oldOutfit),clipboard:true}),migratedOutfit=JSON.parse(u.stored());
 assert.deepEqual(migratedOutfit.results.undergarmentBottom,legacyResult);assert.equal(migratedOutfit.locks.undergarmentBottom,true);
 assert.equal(migratedOutfit.results.undergarments,undefined);
 for(const [id,result] of Object.entries(oldOutfit.results)) if(id!=='undergarments') assert.deepEqual(migratedOutfit.results[id],{...result,conflictSlots:result.conflictSlots||[]});
 const underwearRow=u.elements.slots.children[6],underwearSelect=underwearRow.children[1].children[1].children[0],underwearLock=underwearRow.children[3].children[1];
 const lowerRow=u.elements.slots.children[7],hosieryRow=u.elements.slots.children[8];
 assert.equal(underwearRow.children[0].textContent,'Undergarment top');assert.equal(lowerRow.children[0].textContent,'Undergarment bottom');assert.equal(hosieryRow.children[0].textContent,'Hosiery');
 for(const row of [underwearRow,lowerRow,hosieryRow]) assert.equal(row.children[2].children[1].value,10);
 assert.equal(underwearSelect.disabled,false);
 underwearSelect.value='brand_new';underwearSelect.fire('change');underwearLock.fire('click');assert.equal(underwearSelect.disabled,true);
 const undergarment=JSON.parse(u.stored()).results.undergarmentTop;u.elements.roll.fire('click');assert.deepEqual(JSON.parse(u.stored()).results.undergarmentTop,undergarment);
 await u.elements.copy.fire('click');assert.ok(u.writes.at(-1).includes('Undergarment top: '+undergarment.text));assert.ok(u.writes.at(-1).includes('Undergarment bottom: '+legacyResult.text));
 const underwearReload=app({saved:u.stored()});assert.equal(underwearReload.elements.slots.children[6].children[1].children[1].children[0].value,'brand_new');
 underwearLock.fire('click');lowerRow.children[3].children[1].fire('click');u.elements.presentation.value='f';u.elements.presentation.fire('change');underwearRow.children[3].children[0].fire('click');
 assert.ok(data.items.find(i=>i.id===JSON.parse(u.stored()).results.undergarmentTop.id).presentations.some(p=>['f','shared'].includes(p)));
 const beforeCategory=JSON.parse(u.stored()).results;
 u.elements.undergarmentCategory.value='modern';u.elements.undergarmentCategory.fire('change');
 assert.deepEqual(JSON.parse(u.stored()).results,beforeCategory);
 underwearRow.children[3].children[0].fire('click');
 assert.equal(data.items.find(i=>i.id===JSON.parse(u.stored()).results.undergarmentTop.id).undergarmentCategory,'modern');
 underwearLock.fire('click');const lockedTop=JSON.parse(u.stored()).results.undergarmentTop;
 u.elements.undergarmentCategory.value='comedy';u.elements.undergarmentCategory.fire('change');u.elements.roll.fire('click');
 assert.deepEqual(JSON.parse(u.stored()).results.undergarmentTop,lockedTop);
 underwearLock.fire('click');underwearRow.children[3].children[0].fire('click');
 assert.equal(data.items.find(i=>i.id===JSON.parse(u.stored()).results.undergarmentTop.id).undergarmentCategory,'comedy');
 assert.equal(app({saved:u.stored()}).elements.undergarmentCategory.value,'comedy');
 const fullState=JSON.parse(u.stored()),fullItem=data.items.find(i=>i.name==='Snap-front thermal union suit');
 fullState.results.undergarmentTop={id:fullItem.id,baseText:fullItem.name,text:fullItem.name,condition:null,empty:false,conflictSlots:[]};
 const full=app({saved:JSON.stringify(fullState)}),fullBottom=full.elements.slots.children[7];
 assert.equal(fullBottom.children[3].children[0].disabled,true);assert.equal(fullBottom.children[3].children[1].disabled,true);assert.equal(fullBottom.children[1].children[1].children[0].disabled,true);
 full.elements.slots.children[6].children[3].children[0].fire('click');assert.equal(fullBottom.children[3].children[0].disabled,false);
 console.log('PASS UI foundation layers: migration, three independent rows, conditions, locks, copying, gender/category filters, full-set coverage and release.');
 console.log('PASS UI event wiring: initial results, clipboard success/fallback, locks, reload, weapons, unlock all, storage failure.');
})().catch(e=>{console.error(e);process.exitCode=1;});
