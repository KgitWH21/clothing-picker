(function() {
  const P=Picker, key='character-wardrobe-v1';
  const $=id=>document.getElementById(id);
  let state=P.initial(), storage=true;
  try {state=P.restore(localStorage.getItem(key));} catch (_) {storage=false;}
  if(!Object.keys(state.results).length) state=P.roll(state).state;
  const rows={};
  function notify(message,error=false) {$('status').textContent=message;$('status').classList.toggle('error',error);}
  function save() {
    try {localStorage.setItem(key,JSON.stringify(state));} catch (_) {storage=false;}
    $('storageStatus').textContent=storage?'Saved in this browser. No account or connection needed.':'Browser storage unavailable. Changes last for this session.';
  }
  function render() {
    for(const [id] of P.slots) {
      const row=rows[id], result=state.results[id];
      row.result.textContent=result?.text||'Not rolled yet';row.result.classList.toggle('empty',!!result?.empty);
      row.lock.textContent=state.locks[id]?'Locked':'Lock';row.lock.setAttribute('aria-pressed',String(!!state.locks[id]));
      row.lock.disabled=!!result?.covered||!!result?.reserved||!result;
      row.reroll.disabled=!!state.locks[id]||!!result?.covered||!!result?.reserved;
      row.input.value=state.chances[id];
      row.availability.textContent=state.settings.collection==='japanese'&&id!=='hairstyle'&&id!=='weapon'&&!P.pool(id,state.settings).length?'No Japanese choices for these filters.':'';
    }
    $('weaponControls').hidden=!state.settings.weapons;
    $('onepieceChance').disabled=state.settings.structure!=='auto';
    $('structureBadge').textContent=state.structure==='onepiece'?'ONE-PIECE OUTFIT':'SEPARATES';
    $('modeHelp').textContent=state.settings.mode==='coordinated'?'Coordinated draws from one occasion; it doesn’t guarantee a perfectly styled outfit.':'Wildcard draws each slot from all occasions. Collection and gender filters still apply; Any / mixed removes only the gender filter.';
    $('collectionHelp').textContent=state.settings.collection==='japanese'?'Japanese only: traditional and clearly labeled Japanese-inspired clothing and accessories. Empty pools never fall back to other collections. Hairstyles and Weapons keep their own filters.':'Collection filters clothing and accessories, including in Wildcard. Hairstyles and Weapons keep their own filters.';
    if(!$('copyFallback').hidden) $('copyText').value=P.copyText(state);
    save();
  }
  function roll(target=null) {const outcome=P.roll(state,target);state=outcome.state;render();notify(outcome.error||(target?'Detail rerolled.':'Outfit rolled. Locked details kept.'),!!outcome.error);}
  for(const [id,label] of P.slots) {
    const row=document.createElement('div');row.className='slot';
    const title=document.createElement('div');title.className='slot-title';title.textContent=label;
    const availability=document.createElement('span');availability.className='slot-availability';title.append(availability);
    const result=document.createElement('div');result.className='result';result.id='result-'+id;
    const chance=document.createElement('label');chance.className='chance';
    const caption=document.createElement('span');caption.className='chance-label';caption.textContent=id==='hairstyle'?'Unspecified':'None';
    const input=document.createElement('input');input.type='number';input.min='0';input.max='100';input.step='1';input.setAttribute('aria-label',label+': chance of '+(id==='hairstyle'?'Unspecified':'None')+' (%)');
    input.addEventListener('change',()=>{state.chances[id]=Math.max(0,Math.min(100,Math.round(Number(input.value)||0)));render();notify('Chance updated for future rolls.');});
    chance.append(caption,input,document.createTextNode('%'));
    const actions=document.createElement('div');actions.className='actions';
    const reroll=document.createElement('button');reroll.textContent='Reroll';reroll.setAttribute('aria-label','Reroll '+label);reroll.setAttribute('aria-controls',result.id);reroll.addEventListener('click',()=>roll(id));
    const lock=document.createElement('button');lock.setAttribute('aria-label','Lock '+label);lock.addEventListener('click',()=>{state.locks[id]=!state.locks[id];render();notify(label+(state.locks[id]?' locked.':' unlocked.'));});
    actions.append(reroll,lock);row.append(title,result,chance,actions);$(id==='weapon'?'weaponSlot':'slots').append(row);rows[id]={result,input,reroll,lock,availability};
  }
  for(const [id,value] of Object.entries(state.settings)) {
    const el=$(id);if(typeof value==='boolean') el.checked=value;else el.value=value;
    el.addEventListener('change',()=>{
      state.settings[id]=el.type==='checkbox'?el.checked:el.type==='number'?Math.max(0,Math.min(100,Math.round(Number(el.value)||0))):el.value;
      if(el.type==='number') el.value=state.settings[id];
      // Enabling a preserved weapon re-applies its reservation without changing it.
      if(id==='weapons') {
        if(state.settings.weapons) {
          const conflicts=(state.results.weapon?.conflictSlots||[]).filter(k=>state.locks[k]&&!state.results[k]?.empty);
          if(conflicts.length) {state.settings.weapons=false;el.checked=false;render();notify('Unlock '+conflicts.map(k=>P.slots.find(x=>x[0]===k)[1]).join(' and ')+' before enabling the saved weapon.',true);return;}
          if(!state.results.weapon) state=P.roll(state,'weapon').state;
          for(const slot of state.results.weapon?.conflictSlots||[]) if(!state.locks[slot]) state.results[slot]={text:'Included in weapon / advantage',empty:true,reserved:true};
        } else for(const [slot] of P.slots) if(state.results[slot]?.reserved) state.results[slot]={text:'None',empty:true};
      }
      render();
      let message='Settings updated. Roll to apply; locked results stay unchanged.';
      if(id==='structure') {
        const check=P.roll(state);
        if(check.error) {notify(check.error,true);return;}
        message+=' A one-piece None roll falls back to separates.';
      }
      notify(message);
    });
  }
  $('roll').addEventListener('click',()=>roll());
  $('unlock').addEventListener('click',()=>{state.locks={};render();notify('All details unlocked.');});
  $('copy').addEventListener('click',async()=>{
    const text=P.copyText(state);
    try {if(!navigator.clipboard?.writeText) throw new Error('unavailable');await navigator.clipboard.writeText(text);notify('Outfit copied as plain text.');}
    catch (_) {$('copyFallback').hidden=false;$('copyText').value=text;$('copyText').focus();$('copyText').select();notify('Clipboard unavailable. Your outfit is selected below; use Copy or Ctrl/Cmd+C.');}
  });
  $('collectionCount').textContent=`${WardrobeData.items.length} base details · ${WeaponData.physical.length+WeaponData.metaphorical.length} weapons & advantages`;
  render();
})();
