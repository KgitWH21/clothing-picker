/* Weapon and advantage statuses are independent of garment wear. Traits name
   actual catalog objects so abstract advantages cannot roll physical damage.
   Supernatural effects are writing prompts, available regardless of era. */
(function(root) {
  const catalog=[];
  function add(group,kind,trait,entries) {
    for(const entry of entries.split('|')) {
      const [id,label]=entry.split(':');
      catalog.push({id:'weapon_'+id,label,group,kind,trait});
    }
  }

  // 25 physical maintenance and readiness conditions.
  add('Wear & readiness','physical','',
    'used:Used|battle_tested:Battle-tested|battle_scarred:Battle-scarred|bloodstained:Bloodstained|balance_shifted:Balance-shifted|reinforced:Reinforced');
  add('Wear & readiness','physical','solid','chipped:Chipped|brittle:Brittle');
  add('Wear & readiness','physical','forgeable','reforged:Reforged');
  add('Wear & readiness','physical','edge','blunted:Blunted|edge_rolled:Edge-rolled|sharpened:Sharpened|honed:Honed');
  add('Wear & readiness','physical','grip','grip_loosened:Grip-loosened');
  add('Wear & readiness','physical','haft','haft_split:Haft-split');
  add('Wear & readiness','physical','string','string_slackened:String-slackened');
  add('Wear & readiness','physical','mechanism',
    'mechanism_jammed:Mechanism-jammed|misaligned:Misaligned|calibrated:Calibrated|safety_locked:Safety-locked|primed:Primed');
  add('Wear & readiness','physical','ammunition','out_of_ammunition:Out of ammunition');
  add('Wear & readiness','physical','powered','uncharged:Uncharged|overcharged:Overcharged|overheated:Overheated');

  // 25 elemental enchantments and combat effects.
  add('Enchantment & combat','physical','',
    'flame_infused:Flame-infused|frostbound:Frostbound|stormcharged:Stormcharged|venom_coated:Venom-coated|acid_etched:Acid-etched|radiant:Radiant|shadow_infused:Shadow-infused|void_touched:Void-touched|earthbound:Earthbound|wind_blessed:Wind-blessed|thunderous:Thunderous|soul_draining:Soul-draining|life_stealing:Life-stealing|mana_draining:Mana-draining|armor_piercing:Armor-piercing|shield_breaking:Shield-breaking|bleed_inflicting:Bleed-inflicting|stun_inflicting:Stun-inflicting|slow_inflicting:Slow-inflicting|silence_inflicting:Silence-inflicting|petrifying:Petrifying|fear_inducing:Fear-inducing|knockback_enhanced:Knockback-enhanced|blast_charged:Blast-charged');
  add('Enchantment & combat','physical','ranged','ricochet_enabled:Ricochet-enabled');

  // 25 game and story statuses shared by weapons and advantages.
  add('Power & binding','both','',
    'cursed:Cursed|blessed:Blessed|honorbound:Honorbound|soulbound:Soulbound|oathbound:Oathbound|bloodbound:Bloodbound|haunted:Haunted|hexed:Hexed|doom_marked:Doom-marked|fortune_favored:Fortune-favored|fate_sealed:Fate-sealed|unstable:Unstable|dormant:Dormant|awakened:Awakened|empowered:Empowered|weakened:Weakened|suppressed:Suppressed|dispelled:Dispelled|sealed:Sealed|corrupted:Corrupted|purified:Purified|forbidden:Forbidden|legendary:Legendary|mythic:Mythic|time_limited:Time-limited');

  // 25 social, information, and resource statuses for advantages.
  add('Leverage & standing','metaphorical','',
    'unproven:Unproven|verified:Verified|disputed:Disputed|compromised:Compromised|exposed:Exposed|conditional:Conditional|under_investigation:Under investigation|discredited:Discredited|alliance_backed:Alliance-backed|bargain_bound:Bargain-bound|blackmail_tainted:Blackmail-tainted|politically_protected:Politically protected|publicly_endorsed:Publicly endorsed|secretly_backed:Secretly backed|leverage_exhausted:Leverage-exhausted|on_cooldown:On cooldown|charges_depleted:Charges depleted|single_use:Single-use|renewable:Renewable|escalating:Escalating');
  add('Leverage & standing','metaphorical','record','classified:Classified|redacted:Redacted|forged:Forged');
  add('Leverage & standing','metaphorical','authority','revoked:Revoked');
  add('Leverage & standing','metaphorical','credential','expired:Expired');

  // 25 questionable purchases, ownership arrangements, and unlikely prizes.
  add('Dubious provenance','both','',
    'rented:Rented|borrowed:Borrowed|bargain:Bargain|won_in_a_contest:Won in a contest|bought_with_coupons:Bought with coupons|paid_for_in_exposure:Paid for in exposure|on_a_payment_plan:On a payment plan|free_trial:Free trial|subscription_required:Subscription required|some_assembly_required:Some assembly required|no_refunds:No refunds|warranty_void:Warranty void|as_seen_on_tv:As seen on TV|suspicious_yard_sale:From a suspicious yard sale|cereal_box_prize:Found in a cereal box|regifted:Regifted|inherited_with_strings:Inherited with strings attached|unofficial_merchandise:Unofficial merchandise|managers_special:Manager’s special|definitely_not_stolen:Definitely not stolen|receipt_missing:Receipt mysteriously missing|sponsored_by_a_rival:Sponsored by a rival|manufacturer_recall:Recalled by the manufacturer|raccoon_approved:Approved by three raccoons|lost_in_a_bet:Lost in a bet');

  const traitNames={
    forgeable:'Knuckle guards|Arming sword|Basket-hilt rapier|Heavy mace|Notched battle axe|Ash-shaft spear|Plain utility knife|Length of heavy chain|Hooked halberd|Bronze trident|Steel war pick|Square-headed war hammer|Curved cavalry saber|Two-handed claymore|Swept-guard parrying dagger|Spiked flail|Riveted steel buckler|Iron sai|Silk-cord rope dart|Steel throwing discus|Oak-handled pitchfork|Iron-ribbed fighting fan|Bent tire iron|Long-handled forge tongs|Spirit-banishing silver bell',
    solid:'Knuckle guards|Arming sword|Basket-hilt rapier|Heavy mace|Notched battle axe|Ash-shaft spear|Plain utility knife|Recurved bow|Wood-stock crossbow|Flintlock pistol|Compact concealed pistol|Weathered hunting rifle|Compact stun baton|Heavy walking cane|Sturdy umbrella|Broken chair leg|Length of heavy chain|Dented frying pan|Rune-etched staff|Crystal-tipped wand|Plasma sidearm|Collapsible energy spear|Gravity gauntlet|Floating guardian drone|Hooked halberd|Bronze trident|Steel war pick|Square-headed war hammer|Curved cavalry saber|Two-handed claymore|Swept-guard parrying dagger|Spiked flail|Riveted steel buckler|Carved wooden blowpipe|Paired wooden tonfa|Iron sai|Hardwood quarterstaff|Silk-cord rope dart|Steel throwing discus|Oak-handled pitchfork|Iron-ribbed fighting fan|Heavy metal flashlight|Bent tire iron|Thick glass bottle|Long-handled forge tongs|Spirit-banishing silver bell|Awakened stone sentinel figurine|Spell-reflecting mirror talisman|Handheld sonic resonator|Hard-light shield projector',
    edge:'Arming sword|Basket-hilt rapier|Notched battle axe|Ash-shaft spear|Plain utility knife|Hooked halberd|Bronze trident|Steel war pick|Curved cavalry saber|Two-handed claymore|Swept-guard parrying dagger|Iron sai|Silk-cord rope dart|Steel throwing discus|Oak-handled pitchfork|Iron-ribbed fighting fan|Monofilament ribbon',
    grip:'Arming sword|Basket-hilt rapier|Heavy mace|Notched battle axe|Ash-shaft spear|Plain utility knife|Recurved bow|Wood-stock crossbow|Flintlock pistol|Compact concealed pistol|Weathered hunting rifle|Compact stun baton|Heavy walking cane|Sturdy umbrella|Rune-etched staff|Crystal-tipped wand|Plasma sidearm|Collapsible energy spear|Hooked halberd|Bronze trident|Steel war pick|Square-headed war hammer|Curved cavalry saber|Two-handed claymore|Swept-guard parrying dagger|Spiked flail|Riveted steel buckler|Paired wooden tonfa|Iron sai|Hardwood quarterstaff|Braided leather bullwhip|Oak-handled pitchfork|Iron-ribbed fighting fan|Heavy metal flashlight|Long-handled forge tongs|Handheld sonic resonator',
    haft:'Heavy mace|Notched battle axe|Ash-shaft spear|Heavy walking cane|Broken chair leg|Rune-etched staff|Hooked halberd|Bronze trident|Steel war pick|Square-headed war hammer|Spiked flail|Hardwood quarterstaff|Oak-handled pitchfork',
    string:'Recurved bow|Wood-stock crossbow|Braided sling',
    mechanism:'Wood-stock crossbow|Flintlock pistol|Compact concealed pistol|Weathered hunting rifle|Compact stun baton|Plasma sidearm|Collapsible energy spear|Gravity gauntlet|Floating guardian drone|Handheld sonic resonator|Hard-light shield projector',
    ammunition:'Recurved bow|Wood-stock crossbow|Flintlock pistol|Compact concealed pistol|Weathered hunting rifle|Carved wooden blowpipe',
    powered:'Compact stun baton|Plasma sidearm|Collapsible energy spear|Gravity gauntlet|Floating guardian drone|Heavy metal flashlight|Handheld sonic resonator|Hard-light shield projector',
    ranged:'Recurved bow|Wood-stock crossbow|Braided sling|Flintlock pistol|Compact concealed pistol|Weathered hunting rifle|Storm-bound orb|Plasma sidearm|Floating guardian drone|Weighted throwing net|Carved wooden blowpipe|Silk-cord rope dart|Steel throwing discus|Handheld sonic resonator',
    record:'Incriminating recording|Forged invitation|Signed debt ledger|Sealed letter of introduction|Document-filled briefcase|Royal writ|Privileged access credential|Annotated survey map|Counterfeit identity',
    authority:'Political influence|Legal authority|Control of the guest list|Official signet ring|Royal writ|Privileged access credential|Diplomatic immunity|Labor union backing|Claim to a vacant throne',
    credential:'Forged invitation|Sealed letter of introduction|Royal writ|Privileged access credential|Counterfeit identity|Diplomatic immunity'
  };
  const traitSets=Object.fromEntries(Object.entries(traitNames).map(([trait,names])=>[trait,new Set(names.split('|'))]));
  function options(item) {
    if(!item||!['physical','metaphorical'].includes(item.kind)) return [];
    return catalog.filter(c=>(c.kind==='both'||c.kind===item.kind)&&(!c.trait||traitSets[c.trait].has(item.name)));
  }
  const api={catalog,options};root.WeaponConditionData=api;
  if(typeof module!=='undefined') module.exports=api;
})(globalThis);
