(function(root) {
  const D = root.WardrobeData || require('./data.js');
  const C = root.ConditionData || require('./conditions.js');
  const W = root.WeaponData || require('./weapons.js');
  const slots = [ ['hairstyle','Hairstyle',0], ['headwear','Headwear',65], ['facewear','Facewear',65], ['top','Top',0], ['bottom','Bottom',0], ['onepiece','One-piece garment',0], ['outerwear','Outerwear',50], ['ears','Ear jewelry',70], ['neck','Neck jewelry',65], ['hands','Wrist / hand jewelry',60], ['gloves','Gloves / handwear',75], ['waist','Waist accessories',55], ['carried','Carried accessories',50], ['footwear','Footwear',0], ['weapon','Weapon / advantage',70] ];
  function initial() {return {version:2,settings:{collection:'all',occasion:'casual',presentation:'any',mode:'coordinated',structure:'auto',onepieceChance:25,color:false,condition:true,omitEmpty:true,weapons:false,weaponMode:'physical',era:'any'}, results:{}, locks:{}, chances:Object.fromEntries(slots.map(([id,,p])=>[id,p])), structure:'separates'};}
  const empty = slot => ({text:slot==='hairstyle'?'Unspecified':'None',empty:true,conflictSlots:[]});
  const covered = () => ({text:'Covered by one-piece',empty:true,covered:true});
  const choose = (pool, rng) => pool[Math.min(pool.length-1,Math.floor(rng()*pool.length))];
  function pool(slot, settings) {
    if(slot==='weapon') return [...(settings.weaponMode!=='metaphorical'?W.physical:[]),...(settings.weaponMode!=='physical'?W.metaphorical:[])].filter(i=>settings.era==='any'||i.eras.includes(settings.era));
    return D.items.filter(i=>i.slot===slot && (slot==='hairstyle'||!settings.collection||settings.collection==='all'||i.collections?.includes(settings.collection)) && (settings.mode==='wildcard'||i.occasions.includes('all')||i.occasions.includes(settings.occasion)) && (settings.presentation==='any'||i.presentations.includes('shared')||i.presentations.includes(settings.presentation)));
  }
  function describe(item, settings, rng) {
    if(item.kind) return item.name+(item.advantage?' — '+item.advantage:'');
    if(item.slot==='hairstyle') return item.name;
    const hard = item.material==='hard'||['ears','neck','hands'].includes(item.slot)||/spectacles|glasses|goggles|armor|cuirass|brigandine|gauntlet|helm|sabatons|greaves/i.test(item.name);
    const modifiers=[];

    if(settings.color&&!hard&&!/white|black|ivory|brown/i.test(item.name)) modifiers.push(choose(D.colors,rng));
    return modifiers.length ? modifiers.join(' ')+' '+item.name.charAt(0).toLowerCase()+item.name.slice(1) : item.name;
  }
  function conditionText(baseText, id) {
    const condition=C.catalog.find(c=>c.id===id);
    return baseText+(condition?' — '+condition.label.toLowerCase():'');
  }
  function conditionOptions(result) {return result&&!result.empty?C.options(D.items.find(i=>i.id===result.id)):[];}
  function setCondition(current, slot, id) {
    const result=current.results[slot];
    if(current.locks[slot]) return {state:current,error:'Unlock this item before changing its condition.'};
    if(!result||result.empty||!conditionOptions(result).length) return {state:current,error:'This slot has no clothing item to condition.'};
    if(id!==null&&!conditionOptions(result).some(c=>c.id===id)) return {state:current,error:'That condition does not fit this item.'};
    const state=JSON.parse(JSON.stringify(current));
    const r=state.results[slot];
    // Old saved results had only a rendered text. Remove their known wear prefix
    // only when the user explicitly edits the condition; preserve their color.
    r.baseText=r.baseText||r.text.replace(/^(faded|freshly pressed|well-kept|mended|frayed|worn|polished|scuffed) /i,'');
    r.condition=id;r.text=conditionText(r.baseText,id);
    return {state,error:''};
  }
  function pick(slot,state,rng) {
    if(state.chances[slot]>=100 || (state.chances[slot]>0 && rng()<state.chances[slot]/100)) return empty(slot);
    let options=pool(slot,state.settings);
    if(slot==='weapon') options=options.filter(i=>i.conflictSlots.every(s=>!state.locks[s] || state.results[s]?.empty));
    if(!options.length) return {...empty(slot),text:state.settings.collection==='japanese'&&slot!=='weapon'&&slot!=='hairstyle'?'No Japanese options for these filters':'No matching options',reason:true};
    const item=choose(options,rng);
    const baseText=describe(item,state.settings,rng);
    const conditions=C.options(item);
    const condition=state.settings.condition&&conditions.length?choose(conditions,rng).id:null;
    return {id:item.id,baseText,condition,text:conditionText(baseText,condition),empty:false,conflictSlots:item.conflictSlots||[]};
  }
  function roll(current, target=null, rng=Math.random) {
    const state=JSON.parse(JSON.stringify(current)), s=state.settings;
    if(target && state.locks[target]) return {state:current,error:'Unlock '+slots.find(x=>x[0]===target)[1]+' before rerolling it.'};
    if(target==='weapon'&&!s.weapons) return {state:current,error:'Enable Weapons before rolling it.'};
    if(target==='top'||target==='bottom') {
      if(state.structure==='onepiece') return {state:current,error:'Top and Bottom are covered. Choose Separates, unlock the one-piece if needed, and roll the outfit.'};
      state.results[target]=pick(target,state,rng);return {state,error:''};
    }
    const structureRoll=!target||target==='onepiece';
    if(structureRoll) {
      const lockedOne=state.locks.onepiece&&!state.results.onepiece?.empty;
      const lockedSeparates=['top','bottom'].filter(k=>state.locks[k]);
      const blockedOne=state.locks.onepiece && state.results.onepiece?.empty;
      if(lockedOne && (s.structure==='separates'||lockedSeparates.length)) return {state:current,error:'Unlock One-piece garment to use separates.'};
      if(s.structure==='onepiece'&&(lockedSeparates.length||blockedOne)) return {state:current,error:'Unlock '+(blockedOne?'One-piece garment':lockedSeparates.map(k=>k==='top'?'Top':'Bottom').join(' and '))+' to use a one-piece outfit.'};
      if(target && ['top','bottom'].includes(target)&&state.structure==='onepiece'&&s.structure!=='separates') return {state:current,error:'Top and Bottom are covered. Choose Separates and unlock the one-piece if needed.'};
      let wantOne = lockedOne || (!lockedSeparates.length&&!blockedOne && (s.structure==='onepiece'||(s.structure==='auto'&&rng()<s.onepieceChance/100)));
      if(wantOne&&!lockedOne) {
        if(!pool('onepiece',s).length && s.structure==='onepiece') return {state:current,error:'No one-piece garments match these filters. Choose Auto, Separates, or different filters.'};
        const result=pick('onepiece',state,rng);
        wantOne=!result.empty;
        state.results.onepiece=result;
      }
      const prior=state.structure;
      state.structure=wantOne?'onepiece':'separates';
      if(wantOne) {state.results.top=covered();state.results.bottom=covered();}
      else {
        if(!state.locks.onepiece) state.results.onepiece=empty('onepiece');
        for(const slot of ['top','bottom']) if(!state.locks[slot]&&(!target||target===slot||prior==='onepiece'||!state.results[slot])) state.results[slot]=pick(slot,state,rng);
      }
    }
    if(s.weapons && (!target||target==='weapon')&&!state.locks.weapon) state.results.weapon=pick('weapon',state,rng);
    const reserved=s.weapons ? state.results.weapon?.conflictSlots||[] : [];
    for(const [slot] of slots) {
      if(['top','bottom','onepiece','weapon'].includes(slot)||state.locks[slot]) continue;
      if(reserved.includes(slot)) state.results[slot]={text:'Included in weapon / advantage',empty:true,reserved:true};
      else if(!target||target===slot||state.results[slot]?.reserved) state.results[slot]=pick(slot,state,rng);
    }
    return {state,error:''};
  }
  function copyText(state) {return slots.filter(([id])=>id!=='weapon'||state.settings.weapons).filter(([id])=>state.results[id]&&(!state.settings.omitEmpty||!state.results[id].empty)).map(([id,label])=>`${label}: ${state.results[id].text}`).join('\n');}
  function restore(raw) {
    const base=initial();
    try {
      const saved=JSON.parse(raw); if(!saved||typeof saved!=='object') return base;
      const enums={collection:['all','japanese'],occasion:['casual','work','formal','outdoor','active','sleep','fantasy'],presentation:['any','m','f','n'],mode:['coordinated','wildcard'],structure:['auto','separates','onepiece'],weaponMode:['physical','metaphorical','mixed'],era:['any','contemporary','historical','fantasy','sci-fi']};
      for(const key of Object.keys(base.settings)) {
        const v=saved.settings?.[key];
        if(enums[key]?enums[key].includes(v):typeof base.settings[key]==='boolean'?typeof v==='boolean':Number.isFinite(v)&&v>=0&&v<=100) base.settings[key]=v;
      }
      // Enable the requested default once for older saves; later opt-outs persist.
      if(saved.version!==2) base.settings.condition=true;
      for(const [id] of slots) {
        if(Number.isFinite(saved.chances?.[id])) base.chances[id]=Math.min(100,Math.max(0,saved.chances[id]));
        const r=saved.results?.[id];
        if(r&&typeof r.text==='string'&&r.text.length<500) base.results[id]={...r,empty:!!r.empty,conflictSlots:Array.isArray(r.conflictSlots)?r.conflictSlots.filter(k=>slots.some(x=>x[0]===k)):[]};
        base.locks[id]=!!saved.locks?.[id]&&!!base.results[id]&&!base.results[id].covered&&!base.results[id].reserved;
      }
      base.structure=base.results.onepiece&&!base.results.onepiece.empty?'onepiece':'separates';
      if(base.structure==='onepiece') {base.results.top=covered();base.results.bottom=covered();base.locks.top=false;base.locks.bottom=false;}
    } catch (_) {} return base;
  }
  const api={conditionOptions,setCondition,slots,initial,pool,pick,roll,copyText,restore}; root.Picker=api; if(typeof module!=='undefined') module.exports=api;
})(globalThis);
