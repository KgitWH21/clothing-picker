/* Editable wear vocabulary and compatibility rules. Each garment receives a
   conditionProfile and conditionFeatures in data.js. A rule requires both a
   matching profile (when supplied) and all listed features. Severity orders the
   menu from new to unserviceable; individual defects are not a linear scale. */
(function(root) {
  const catalog = [
    {id:'brand_new',label:'Brand new',severity:0},
    {id:'pristine',label:'Pristine',severity:1},
    {id:'well_kept',label:'Well-kept',severity:2},
    {id:'lightly_worn',label:'Lightly worn',severity:3},
    {id:'broken_in',label:'Broken in',severity:4,profiles:['fabric','leather','rubber']},
    {id:'worn',label:'Worn',severity:5},
    {id:'heavily_worn',label:'Heavily worn',severity:6},
    {id:'faded',label:'Faded',severity:5,profiles:['fabric','leather']},
    {id:'creased',label:'Creased',severity:4,profiles:['fabric','leather']},
    {id:'pilled',label:'Pilled',severity:5,profiles:['fabric'],features:['knit']},
    {id:'stretched',label:'Stretched out',severity:6,profiles:['fabric'],features:['stretch']},
    {id:'frayed',label:'Frayed',severity:6,profiles:['fabric','woven']},
    {id:'threadbare',label:'Threadbare',severity:7,profiles:['fabric']},
    {id:'ripped',label:'Ripped',severity:7,profiles:['fabric','leather']},
    {id:'split_seam',label:'Split seam',severity:7,features:['stitched']},
    {id:'moth_holes',label:'Moth holes',severity:7,features:['wool']},
    {id:'scorched',label:'Scorched',severity:7,profiles:['fabric','leather','woven']},
    {id:'patched',label:'Patched',severity:5,profiles:['fabric','leather']},
    {id:'mended',label:'Mended',severity:4,profiles:['fabric','woven']},
    {id:'soiled',label:'Soiled',severity:5},
    {id:'mud_spattered',label:'Mud-spattered',severity:5},
    {id:'dusty',label:'Dusty',severity:4},
    {id:'grease_stained',label:'Grease-stained',severity:6,profiles:['fabric','leather','woven']},
    {id:'ink_stained',label:'Ink-stained',severity:6,profiles:['fabric','leather']},
    {id:'bleach_marked',label:'Bleach-marked',severity:6,profiles:['fabric']},
    {id:'smelly',label:'Smelly',severity:6,profiles:['fabric','leather','rubber','woven']},
    {id:'musty',label:'Musty',severity:6,profiles:['fabric','leather','woven']},
    {id:'sweat_stained',label:'Sweat-stained',severity:6,profiles:['fabric'],features:['body_contact']},
    {id:'pit_stains',label:'Permanent pit stains',severity:7,profiles:['fabric'],features:['underarms']},
    {id:'mildewed',label:'Mildewed',severity:8,profiles:['fabric','leather','woven']},
    {id:'missing_button',label:'Missing button',severity:6,features:['buttons']},
    {id:'broken_zip',label:'Broken zipper',severity:8,features:['zipper']},
    {id:'failed_elastic',label:'Failed elastic',severity:8,features:['elastic']},
    {id:'worn_knees',label:'Worn through at the knees',severity:7,profiles:['fabric','leather'],features:['knees']},
    {id:'worn_elbows',label:'Worn through at the elbows',severity:7,profiles:['fabric','leather'],features:['elbows']},
    {id:'worn_soles',label:'Worn-through soles',severity:8,features:['soles']},
    {id:'scuffed',label:'Scuffed',severity:5,profiles:['leather','rubber','rigid','metal']},
    {id:'cracked_leather',label:'Cracked leather',severity:7,profiles:['leather']},
    {id:'perished_rubber',label:'Perished rubber',severity:8,profiles:['rubber']},
    {id:'scratched',label:'Scratched',severity:5,profiles:['metal','rigid','fragile']},
    {id:'dented',label:'Dented',severity:6,profiles:['metal']},
    {id:'tarnished',label:'Tarnished',severity:5,profiles:['metal']},
    {id:'rusted',label:'Rusted',severity:7,profiles:['metal'],features:['ferrous']},
    {id:'cracked',label:'Cracked',severity:8,profiles:['rigid','fragile']},
    {id:'cracked_lens',label:'Cracked lens',severity:8,features:['lenses']},
    {id:'broken_clasp',label:'Broken clasp',severity:8,features:['clasp']},
    {id:'unserviceable',label:'Unserviceable',severity:10}
  ];
  function classify(item) {
    if(item.slot==='hairstyle'||item.kind) return {conditionProfile:null,conditionFeatures:[]};
    const n=item.name.toLowerCase(), slot=item.slot;
    let profile='fabric';
    if(/rubber|neoprene|wetsuit|rain boots/.test(n)) profile='rubber';
    else if(/leather|suede|shearling/.test(n)) profile='leather';
    else if(/straw|raffia|reed|rush |sedge|vine|grass|palm-leaf|basket|flower crown|leaf wreath|herb garland/.test(n)) profile='woven';
    else if(/spectacles|glasses|goggles/.test(n)) profile='fragile';
    else if(/pearl|beaded|gemstone|crystal|wooden/.test(n)) profile='fragile';
    else if(/plate|steel|iron|chainmail|mail |cuirass|brigandine|breastplate|metal|chain|torque|crown|coronet|diadem|tiara|circlet/.test(n)) profile='metal';
    else if(/helmet|helm|hard hat|bump cap/.test(n)||item.material==='hard'||item.material==='general') profile='rigid';
    else if(['ears','neck','hands'].includes(slot)&&!/cord|braided|woven|friendship/.test(n)) profile='metal';
    else if(slot==='footwear'&&/boots|shoes|loafers|brogues|derby|pumps|mary janes|flats|monk-strap|moccasin/.test(n)&&!/canvas|running|court|climbing|cycling|snow|quilted|soft|felt|wrestling/.test(n)) profile='leather';
    const f=new Set();
    const soft=['fabric','leather'].includes(profile);
    if(soft) f.add('stitched');
    if(profile==='fabric'&&/knit|jersey|sweater|pullover|cardigan|fleece|sweatshirt|hoodie|sock/.test(n)) f.add('knit');
    if(profile==='fabric'&&/stretch|jersey|leggings|tights|compression|ribbed|swim|sports bra/.test(n)) f.add('stretch');
    if(/wool|cashmere|merino|tweed|aran|guernsey|lopapeysa/.test(n)) f.add('wool');
    if(soft&&['top','bottom','onepiece','headwear','facewear','gloves','footwear'].includes(slot)) f.add('body_contact');
    const sleeveless=/sleeveless|strapless|bandeau|tube top|tank|cami|halter|shell|bodice|bustier|corset|bra\b|vest|waistcoat|cape|poncho|shawl|tabard|pinafore|dungarees|overalls|bib |one-shoulder|off-shoulder/.test(n);
    if(profile==='fabric'&&['top','onepiece','outerwear'].includes(slot)&&!sleeveless&&/shirt|blouse|sweater|pullover|hoodie|sweatshirt|tunic|polo|jersey|robe|kimono|yukata|jumpsuit|coveralls|boiler suit|coat|jacket|cardigan|gambeson|doublet|samue|jinbei|gi top/.test(n)) f.add('underarms');
    if(f.has('underarms')&&!/short.sleeve|cap.sleeve|sleeveless|elbow.sleeve/.test(n)&&/long.sleeve|sweater|hoodie|sweatshirt|jacket|coat|cardigan|robe|kimono|yukata|doublet/.test(n)) f.add('elbows');
    if(soft&&slot==='bottom'&&!/shorts|breeches|skirt|skort|kilt|trunks|briefs|bikini|dhoti|lungi|sarong|longyi|chima|kain|iro |hakama/.test(n)&&/trousers|pants|jeans|slacks|leggings|tights|hose|chausses|jodhpurs|salwar|churidar/.test(n)) f.add('knees');
    if(soft&&/button|pajama shirt|oxford shirt|dress shirt|flannel shirt/.test(n)) f.add('buttons');
    if(soft&&/zip|zipper/.test(n)) f.add('zipper');
    if(profile==='fabric'&&/elastic|jogger|leggings|tights|sweatpants|sweatshorts/.test(n)) f.add('elastic');
    if(slot==='footwear'&&!/sock|tabi socks/.test(n)) f.add('soles');
    if(profile==='metal'&&/steel|iron|chainmail|mail |plate|cuirass|brigandine/.test(n)) f.add('ferrous');
    if(/spectacles|glasses|goggles/.test(n)) f.add('lenses');
    if(['neck','hands','carried'].includes(slot)&&/chain|bracelet|watch|locket|clutch|handbag/.test(n)) f.add('clasp');
    return {conditionProfile:profile,conditionFeatures:[...f]};
  }
  function options(item) {
    if(!item||item.slot==='hairstyle'||item.kind) return [];
    const meta=item.conditionProfile?item:classify(item);
    return catalog.filter(c=>(!c.profiles||c.profiles.includes(meta.conditionProfile))&&(!c.features||c.features.every(f=>meta.conditionFeatures.includes(f)))).sort((a,b)=>a.severity-b.severity);
  }
  const api={catalog,classify,options};root.ConditionData=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
