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
 for(const file of ['conditions.js','data.js','weapons.js','engine.js','app.js']) vm.runInContext(readFileSync(file,'utf8'),context);
 return {elements,writes,stored:()=>stored};
}
(async()=>{
 const a=app({clipboard:true});assert.equal(a.elements.slots.children.length,14);assert.equal(a.elements.weaponSlot.children.length,1);
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
 assert.ok(c.elements.collectionHelp.textContent.includes('Japanese only'));
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
 console.log('PASS UI event wiring: initial results, clipboard success/fallback, locks, reload, weapons, unlock all, storage failure.');
})().catch(e=>{console.error(e);process.exitCode=1;});
