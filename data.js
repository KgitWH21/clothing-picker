/* Expand the collection with add(slot, occasions, presentations, pipe-separated names).
   Occasions: casual work formal outdoor active sleep fantasy. Presentation: m f n;
   shared entries match every presentation. Base names must be unique. */
(function (root) {
  const items = [];
  const add = (slot, occasions, presentations, names, material = '', collections = '') => names.split('|').forEach(name => items.push({id: `${slot}-${items.length}`, name, slot, occasions: occasions.split(' '), presentations: presentations.split(' '), material, collections: collections ? collections.split(' ') : []}));
  add('hairstyle','all','shared','Bald|Clean-shaved head|Close buzz cut|Crew cut|Short textured crop|Side-parted crop|Slicked-back hair|Undercut|Pompadour|Quiff|Flat top|Short natural curls|Rounded afro|High-top fade|Tapered cut|Shoulder-length waves|Long loose curls|Straight waist-length hair|Chin-length bob|Angled bob|Pixie cut|Shag cut|Curtain fringe|Blunt fringe|Low ponytail|High ponytail|Loose bun|Topknot|Braided crown|Single long braid|Twin braids|Cornrows|Box braids|Shoulder-length locs|Long tied-back locs|Half-up twist|Finger waves|Pinned chignon|Tousled bedhead|Receding short hair');
  add('headwear','casual outdoor','shared','Beanie|Bucket hat|Baseball cap|Flat cap|Newsboy cap|Sun hat|Wide-brimmed felt hat|Straw boater|Headscarf|Knitted headband|Trapper hat|Rain hat');
  add('headwear','work formal','shared','Fedora|Trilby|Pillbox hat|Fascinator|Top hat|Structured beret');
  add('headwear','active','shared','Running visor|Cycling cap|Sweatband|Swim cap');
  add('headwear','sleep','shared','Sleep bonnet|Nightcap|Soft hair wrap');
  add('headwear','fantasy','shared','Mail coif|Arming cap|Open-faced helm|Hornless greathelm|Circlet|Pointed wool cap|Hooded cowl');
  add('facewear','all','shared','Round spectacles|Rectangular spectacles|Rimless glasses|Wire-frame glasses|Tinted spectacles|Eye patch');
  add('facewear','casual outdoor active','shared','Aviator sunglasses|Wraparound sunglasses|Cloth face mask|Dust mask|Ski goggles|Neck gaiter over face');
  add('facewear','formal fantasy','shared','Lace veil|Half-face masquerade mask|Beaded face veil|Opaque ceremonial mask');
  add('top','casual work','f','Peplum blouse|Camisole|Wrap top|Pussy-bow blouse|Boat-neck blouse|Cowl-neck top|Smocked blouse|Cap-sleeve blouse|Tunic blouse|Draped shell top|Lace-trimmed tank|Balloon-sleeve blouse');
  add('top','casual work','m','Oxford shirt|Henley shirt|Rugby shirt|Cuban-collar shirt|Grandad-collar shirt|Chambray shirt|Cable-knit pullover|V-neck sweater|Button-down flannel shirt|Polo shirt');
  add('top','casual work outdoor','shared','Crew-neck T-shirt|Long-sleeved T-shirt|Striped jersey|Roll-neck sweater|Hoodie|Sweatshirt|Oversized linen shirt|Utility shirt|Cotton tunic|Fisherman sweater|Denim overshirt|Half-zip fleece');
  add('top','formal','f','Silk evening blouse|Sequin camisole|Structured bustier|Off-shoulder top|Velvet wrap blouse|Halter-neck shell');
  add('top','formal','m','Pleated tuxedo shirt|Wing-collar shirt|French-cuff dress shirt|Mandarin-collar dress shirt');
  add('top','formal work','shared','High-neck satin shirt|Fine-knit mock neck|Collarless dress shirt|Draped crepe tunic');
  add('top','active','shared','Running singlet|Compression shirt|Rash guard|Training tank|Cycling jersey|Mesh sports jersey|Thermal base-layer top');
  add('top','active','f','Sports bra|Longline workout crop');
  add('top','sleep','shared','Pajama shirt|Sleep T-shirt|Thermal undershirt|Loose lounge tank|Waffle-knit lounge top|Flannel sleep shirt');
  add('top','fantasy','shared','Gambeson|Cuirass|Brigandine|Traveling tunic|Mail hauberk|Padded arming doublet|Laced linen shirt|Leather jerkin|Quilted vest|Embroidered court tunic|Scale armor vest|Wool surcoat');
  add('bottom','casual work','f','Culottes|Palazzo trousers|Pencil skirt|A-line skirt|Pleated midi skirt|Wrap skirt|Tulip skirt|Circle skirt|Denim maxi skirt|Paper-bag waist trousers|Cropped cigarette trousers|Button-front skirt');
  add('bottom','casual work','m','Pleated chinos|Straight-cut dress trousers|Corduroy trousers|Slim wool trousers|Five-pocket jeans|Flat-front slacks|Tweed trousers|Tailored Bermuda shorts');
  add('bottom','casual work outdoor','shared','Wide-leg trousers|Straight-leg jeans|Cargo trousers|Linen drawstring trousers|Utility shorts|Carpenter trousers|Cropped canvas trousers|Relaxed chinos|Corduroy shorts|Knee-length kilt');
  add('bottom','formal','f','Satin fishtail skirt|Tulle evening skirt|Velvet maxi skirt|Brocade ball skirt');
  add('bottom','formal','shared','Tuxedo trousers|High-waisted evening trousers|Silk wide-leg pants|Formal pleated kilt');
  add('bottom','outdoor','shared','Waterproof overtrousers|Convertible hiking trousers|Insulated trekking pants|Waxed field trousers');
  add('bottom','active','shared','Running shorts|Track pants|Compression leggings|Cycling shorts|Tennis shorts|Martial arts trousers|Training joggers');
  add('bottom','active','f','Tennis skort|Workout capri leggings');
  add('bottom','sleep','shared','Pajama bottoms|Lounge shorts|Soft jersey pants|Flannel sleep trousers|Thermal long johns');
  add('bottom','fantasy','shared','Laced breeches|Wool hose|Split riding skirt|Leather riding trousers|Padded chausses|Striped court breeches|Linen braies|Wrapped leg trousers');
  add('onepiece','casual work','f','Sheath dress|Wrap dress|Shirt dress|Pinafore dress|A-line dress|Shift dress|Fit-and-flare dress|Sweater dress|Smocked sundress|Tea dress|Denim overall dress|Empire-waist dress');
  add('onepiece','casual work outdoor','shared','Utility jumpsuit|Bib overalls|Mechanic coveralls|Linen boiler suit|Short-sleeved romper|Canvas dungarees');
  add('onepiece','formal','f','Column evening gown|Mermaid gown|Bias-cut slip dress|Ball gown|Velvet cocktail dress|Cape-sleeve gown');
  add('onepiece','formal','shared','Tailored evening jumpsuit|Ceremonial robe|Structured long kaftan|Brocade court robe');
  add('onepiece','active','shared','Wetsuit|Racing skinsuit|Unitard|Wrestling singlet');
  add('onepiece','sleep','shared','Sleep romper|Flannel nightshirt|Hooded sleep suit|Long sleeping robe');
  add('onepiece','sleep','f','Cotton nightgown|Satin chemise');
  add('onepiece','fantasy','shared','Mage robe|Monastic habit|Long belted tabard|Layered traveling robe|Full harness of plate armor|Ritual vestment');
  add('onepiece','fantasy','f','Laced kirtle|Court houppelande|Embroidered overdress');
  add('outerwear','casual work outdoor','shared','Denim jacket|Bomber jacket|Trench coat|Peacoat|Duffel coat|Parka|Raincoat|Quilted jacket|Fleece jacket|Waxed field jacket|Windbreaker|Cardigan|Chore coat|Leather motorcycle jacket|Wool overcoat|Harrington jacket');
  add('outerwear','work formal','shared','Single-breasted blazer|Double-breasted blazer|Dinner jacket|Longline waistcoat|Tailcoat|Cashmere coat|Velvet smoking jacket');
  add('outerwear','formal','f','Evening bolero|Opera cape|Embroidered shawl|Cropped satin jacket');
  add('outerwear','active','shared','Track jacket|Warm-up vest|Packable running shell');
  add('outerwear','sleep','shared','Dressing gown|Quilted housecoat|Soft bed jacket');
  add('outerwear','fantasy','shared','Hooded cloak|Traveling mantle|Fur-lined cape|Heraldic surcoat|Ranger cloak|Sleeveless riding coat|Felt shoulder cape');
  add('ears','all','shared','Small hoop earrings|Stud earrings|Ear cuff|Single drop earring|Sleeper hoops|Chain-linked earrings|Carved wooden plugs|Pearl drops|Gemstone pendants|Hammered disk earrings');
  add('neck','all','shared','Fine chain necklace|Pendant on cord|Beaded necklace|Choker|Locket|Layered chains|Signet pendant|Torque|Pearl strand|Woven neck cord');
  add('hands','all','shared','Plain band ring|Signet ring|Stacked rings|Charm bracelet|Cuff bracelet|Beaded bracelet|Wristwatch|Pocket-watch chain|Braided friendship bracelet|Gemstone ring|Leather wristband|Delicate chain bracelet');
  add('gloves','casual work outdoor','shared','Knitted gloves|Leather driving gloves|Fingerless mitts|Insulated mittens|Work gloves|Rainproof gloves');
  add('gloves','formal','shared','White dress gloves|Satin opera gloves|Lace wrist gloves');
  add('gloves','active','shared','Cycling gloves|Climbing gloves|Goalkeeper gloves');
  add('gloves','sleep','shared','Soft cotton hand mitts');
  add('gloves','fantasy','shared','Plate gauntlets|Mail mittens|Padded arming gloves|Leather bracers');
  add('waist','all','shared','Narrow leather belt|Woven sash|Braided belt|Cord tie|Wide cloth belt|Decorative chain belt');
  add('waist','work formal','shared','Suspenders|Cummerbund|Tooled dress belt');
  add('waist','outdoor fantasy','shared','Utility belt|Belt pouch cluster|Broad riding belt|Rope girdle');
  add('carried','casual work formal','shared','Canvas tote|Leather satchel|Messenger bag|Briefcase|Portfolio case|Envelope clutch|Structured handbag|Drawstring purse|Crossbody bag|Beaded evening pouch|Umbrella|Walking cane');
  add('carried','outdoor active','shared','Hiking backpack|Roll-top rucksack|Duffel bag|Hydration pack|Waterproof dry bag|Trail waist pack|Bedroll sling|Rope-handled carryall');
  add('carried','sleep','shared','Hot-water bottle|Small wash bag|Folded sleep mask');
  add('carried','fantasy','shared','Traveling pack|Leather scrip|Scroll case|Herb pouch|Woven market basket|Map tube|Pilgrim satchel');
  add('footwear','casual work','f','Ballet flats|Mary Janes|Slingback pumps|Kitten heels|Ankle-strap flats|Wedge sandals');
  add('footwear','casual work','m','Derby shoes|Brogues|Monk-strap shoes|Penny loafers|Moc-toe shoes');
  add('footwear','casual work outdoor','shared','Canvas sneakers|Chelsea boots|Lace-up ankle boots|Desert boots|Leather loafers|Clogs|Fisherman sandals|Espadrilles');
  add('footwear','formal','shared','Patent Oxford shoes|Velvet slippers|Polished buckle shoes|Embroidered formal flats');
  add('footwear','formal','f','Stiletto pumps|Satin evening sandals');
  add('footwear','outdoor','shared','Hiking boots|Rubber rain boots|Snow boots|Trail sandals|Leather riding boots');
  add('footwear','active','shared','Running shoes|Court sneakers|Football cleats|Cycling shoes|Wrestling boots|Climbing shoes');
  add('footwear','sleep','shared','House slippers|Soft slipper socks|Quilted booties|Felt bedroom mules');
  add('footwear','fantasy','shared','Turnshoes|Laced leather buskins|Fur-lined boots|Armored sabatons|Greaves with leather sandals|Wrapped soft boots');
  // Extended hairstyle catalog. Appended to preserve existing saved item IDs.
  // Presentation tags are writing prompts, not rules about who can wear a style.
  // Shared includes every gender option; m n / f n includes Neutral as well as
  // the associated presentation. Any / mixed includes the entire catalog.
  // All hairstyles remain available in every occasion and picking mode.
  const hairPresentation = {
    'm n': 'Crew cut|Side-parted crop|Pompadour|Quiff|Flat top|High-top fade',
    'f n': 'Chin-length bob|Angled bob|Pixie cut|Braided crown|Finger waves|Pinned chignon'
  };
  for (const [tags, names] of Object.entries(hairPresentation)) {
    const selected = new Set(names.split('|'));
    for (const item of items) if (item.slot === 'hairstyle' && selected.has(item.name)) item.presentations = tags.split(' ');
  }

  // Shared short cuts, shaved patterns, and alternative silhouettes.
  add('hairstyle','all','shared','Uniform stubble cut|Grown-out buzz cut|Buzz cut with a shaved line|Buzz cut with geometric shaved panels|Short crop with a long fringe|Choppy ear-length crop|Asymmetric crop|Disconnected undercut|Undercut with a tied-back top|Nape undercut beneath long hair|Side-shaved shoulder-length hair|Both sides shaved with a long center strip|Soft mohawk|Spiked mohawk|Faux hawk|Liberty spikes|Short spiky hair|Spiky crown with a flat fringe|Bowl cut|Asymmetric bowl cut|Shaggy bowl cut|Pageboy cut|Short mullet|Long mullet|Curly mullet|Wolf cut|Jellyfish cut|Asymmetric shag|Long shag with cropped fringe');

  // Masculine-associated barbering; also included in Neutral.
  add('hairstyle','all','m n','Ivy League cut|Butch cut|Burr cut|High and tight|Recon cut|Regulation cut|Brush cut|Caesar cut|French crop|Textured crop with a skin fade|Side part with a low taper|Hard-part comb-over|Classic scissor taper|Low fade with a brushed-up top|Mid fade with a textured top|High fade with a short top|Skin fade with a slicked-back top|Drop fade with curls|Burst fade with a mohawk|Temple fade with coils|Low taper with waves|Flat top with faded sides|Rounded high-top cut|Sponge-twisted high top|Curly high top with shaved sides|Short back and sides|Executive contour cut|Slicked-back pompadour|Textured pompadour|Curly pompadour|Side-parted pompadour|Rockabilly quiff|Short brushed-up quiff|Ducktail hairstyle|Elephant-trunk forelock|Middle-parted curtain cut|Bro flow|Feathered medium-length cut|Shoulder-length swept-back hair|Comb-over across a thinning crown');

  // Feminine-associated crops, bobs, and layered cuts; also included in Neutral.
  add('hairstyle','all','f n','Long pixie cut|Curly pixie cut|Asymmetric pixie cut|Feathered pixie cut|Pixie with a sweeping fringe|Undercut pixie|Bixie cut|Micro bob|Blunt jaw-length bob|French bob with short fringe|Italian bob|Stacked bob|Inverted bob|Graduated bob|Asymmetric bob|A-line bob|Shingle bob|Curly bob|Wavy bob|Braided bob|Collarbone-length lob|Angled lob|Shaggy lob|Blunt lob with a center part|Shoulder-length butterfly cut|Long butterfly layers|Face-framing feathered layers|Long U-shaped cut|Long V-shaped cut|Hime cut|Long hair with a rounded full fringe|Long hair with wispy bangs|Long hair with side-swept bangs|Long hair with short arched bangs|Long hair with cheek-length curtain bangs');

  // Loose hair, texture, thinning, and parting: no gender restriction.
  add('hairstyle','all','shared','Ear-length loose waves|Chin-length loose curls|Shoulder-length straight hair|Mid-back straight hair|Hip-length straight hair|Shoulder-length tight ringlets|Mid-back spiral curls|Long corkscrew curls|Loose brushed-out curls|Long crimped hair|Loose beach waves|Deep side-parted waves|Center-parted loose hair|Zigzag-parted shoulder-length hair|Side-swept long hair|Wet-look slicked-back hair|Loose hair tucked behind both ears|Short finger-coiled hair|Shoulder-length finger coils|Cropped afro|Large rounded afro|Angular sculpted afro|Heart-shaped afro|Tapered natural coils|Loose stretched coils|Defined twist-out|Fluffy braid-out|Short natural wash-and-go curls|Long natural wash-and-go curls|Brushed-back waves with a widow’s peak|Fine wispy shoulder-length hair|Sparse close-cropped hair|Bald crown with a short fringe of hair|Bald crown with long hair at the sides|Thinning hair tied at the nape');

  // Braids, twists, locs, and protective arrangements stay shared.
  add('hairstyle','all','shared','Single French braid|Single Dutch braid|Single fishtail braid|Four-strand braid|Five-strand braid|Single rope twist|Twin French braids|Twin Dutch braids|Twin fishtail braids|Side-swept braid|Loose three-strand side braid|Small accent braid in loose hair|Braided fringe pinned back|Straight-back cornrows|Curved cornrows|Zigzag cornrows|Cornrows gathered into a bun|Cornrows gathered into a ponytail|Cornrows with loose curled ends|Short box braids|Waist-length box braids|Jumbo box braids|Knotless braids|Microbraids|Tree braids|Braids with curled ends|Box braids in a high bun|Box braids in twin buns|Flat twists|Two-strand twists|Mini twists|Chunky rope twists|Senegalese twists|Havana twists|Passion twists|Twists gathered at the nape|Bantu knots|Half-up Bantu knots|Short starter locs|Chin-length locs|Waist-length locs|Freeform locs|Sisterlocks|Microlocs|Locs in a high bun|Locs in twin buns|Locs in a low ponytail|Half-up locs|Locs braided into a single plait|Locs with an undercut|Loc petals pinned around a bun');

  // Practical tied and pinned styles, including textured-hair arrangements.
  add('hairstyle','all','shared','Mid-height ponytail|Side ponytail|Low curly ponytail|High curly ponytail|Braided ponytail|Segmented bubble ponytail|Looped ponytail|Folded ponytail at the nape|Half-up ponytail|Half-up braided ponytail|Half-up topknot|Twin low ponytails|Twin high ponytails|High puff|Low puff|Twin afro puffs|Half-up puff|Pineapple updo|Low coiled bun|High coiled bun|Messy bun|Braided bun|Twisted rope bun|Double low buns|Double high buns|Loose knot at the nape|Hair held in a claw-clip twist|Hair pinned with a single hair stick|Crossed-stick bun|Rolled tuck at the nape|Half-up hair with loose face-framing strands|Half-up hair with two small braids');

  // Dressier, vintage, and elaborate styles, also available in Neutral.
  add('hairstyle','all','f n','French twist|Loose French twist with tendrils|Low side chignon|Braided chignon|Looped chignon|Ballet bun|Donut bun|Gibson tuck|Gibson-girl updo|Bouffant updo|Beehive updo|Half-up bouffant|Victory rolls|Single front victory roll|Pin-curl set|Short sculpted pin curls|Hollywood waves|Marcel waves|Brushed-out roller set|Flipped-out shoulder-length hair|Feathered winged hair|Waterfall braid|Lace braid around the hairline|Halo braid|Milkmaid braids|Braided headband with loose curls|Crown of pinned rope twists|Basket-weave braided updo|Rose-shaped braided bun|Bow-shaped hair bun|Ribbon-woven braid|Pearl-threaded updo|Ringlets pinned above the ears|Elaborate powdered court coiffure');

  // Historical and invented fantasy silhouettes, without assigning ethnicity.
  add('hairstyle','all','shared','Tonsure with a ring of short hair|Shaved crown with a tied rear section|Long queue braid|Single long forelock with a shaved scalp|Temple braids with loose lengths|Three braids joined at the nape|Five narrow braids gathered into a tail|Long hair bound in leather-wrapped sections|Braided topknot with loose sides|Braids coiled above both ears|High fan-shaped topknot|Crown of upright hair loops|Sculpted horn-shaped hair coils|Long hair woven through a cord lattice|Bead-tipped accent braids|Metal-ringed side braids|Feather-threaded long braid|Knotted strands framing the face|Half-shaved head with a long rope braid|Long loose hair with a braided nape section');

  // Extended headwear catalog, appended so existing saved item IDs remain stable.
  // Shared items match all presentations. m n / f n are styling associations,
  // not restrictions on who can wear an item. Historical designs use fantasy
  // and/or formal; everyday cultural/religious coverings are not fantasy-only.
  // Optional material: hard = rigid ornaments, general = non-fabric headwear.

  // Everyday caps and soft hats: distinct constructions, not color variants.
  add('headwear','casual outdoor','shared','Docker cap|Watch cap|Slouch beanie|Bobble hat|Earflap knit cap|Chullo-style knitted hat|Five-panel cap|Six-panel cap|Trucker cap|Snapback cap|Dad cap|Camp cap|Cadet cap|Patrol cap|Short-billed work cap|Long-billed fishing cap|Fisherman cap|Greek fisherman cap|Baker boy cap|Eight-panel apple cap|Tam cap|Slouch beret|Oversized knitted tam|Crocheted skullcap|Soft peaked travel cap');
  add('headwear','casual work formal','shared','Pork-pie hat|Homburg|Bowler hat|Tyrolean hat|Alpine felt hat|Breton sailor hat|Gaucho hat');
  add('headwear','casual formal','m n','High-crowned coachman hat|Collapsible opera hat|Low-crowned riding top hat');
  add('headwear','casual formal','f n','Cloche hat|Bell-shaped felt hat|Mushroom-brim hat|Juliet cap|Cocktail hat|Cartwheel hat|Saucer hat|Tilt hat|Doll hat|Half hat|Halo hat|Heart-shaped bonnet|Sculpted bow hat|Draped turban hat');

  // Sun, rain, wind, and cold-weather travel.
  add('headwear','casual outdoor','shared','Panama hat|Pith helmet|Safari hat|Boonie hat|Outback hat|Australian slouch hat|Cowboy hat|Cattleman hat|Gambler hat|Open-crown western hat|Pinch-front western hat|Sombrero|Conical rain hat|Foldable travel hat|Neck-flap sun cap|Desert sun cap with side drapes|Sou’wester|Waterproof storm hood|Waxed rain hood|Insulated expedition hood|Balaclava|Open-face fleece hood|Aviator cap|Shearling flight cap|Ushanka|Wool ear band|Fleece ear warmers|Quilted earflap hat|Detachable parka hood');
  add('headwear','casual outdoor','shared','Lifeguard straw hat|Harvest hat|Woven palm-leaf hat|Rush sun hat|Sedge field hat|Raffia visor|Wide-brimmed garden hat','general');
  add('headwear','casual outdoor','f n','Sunbonnet|Prairie bonnet|Poke bonnet|Scoop bonnet|Wide-brimmed beach visor');

  // Hair coverings, wraps, and modest headwear: shared across presentations.
  add('headwear','casual work formal outdoor','shared','Turban|Headwrap|Square scarf tied at the nape|Triangle kerchief|Bandana head covering|Knotted headband|Wide fabric hairband|Stretch jersey head covering|Pleated headwrap|Wrapped headcloth with a trailing end|Hijab|Al-amira head covering|Khimar|Snood|Crocheted hair net|Kufi|Kippah|Taqiyah|Fez');
  add('headwear','work formal','shared','Dress turban|Embroidered ceremonial cap|Velvet skullcap|Folded ceremonial headcloth');
  add('headwear','casual formal','f n','Lace head covering|Bow headband|Ruched hairband|Ribbon bandeau|Pleated satin headband');
  add('headwear','casual formal','shared','Beaded headband|Pearl hairband|Jeweled hair comb|Decorative bun cage|Chain headpiece','hard');
  add('headwear','casual formal outdoor fantasy','shared','Flower crown|Leaf wreath|Woven vine circlet|Herb garland|Braided grass headband','general');

  // Professional uniforms, occupational coverings, and protective equipment.
  add('headwear','work','shared','Chef’s toque|Chef’s skullcap|Baker’s cap|Food-service hairnet|Bouffant hygiene cap|Surgical cap|Disposable surgical hood|Nurse’s cap|Maid’s cap|Bellhop pillbox|Porter’s cap|Chauffeur’s cap|Doorman’s peaked cap|Railway conductor’s cap|Stationmaster’s cap|Airline pilot’s cap|Flight attendant’s hat|Naval peaked cap|Sailor’s round cap|Police peaked cap|Military beret|Garrison cap|Dress-uniform side cap');
  add('headwear','work outdoor','shared','Construction hard hat|Climbing-style safety helmet|Firefighter helmet|Forestry safety helmet|Rescue helmet|Miner’s helmet|Utility-worker bump cap','hard');
  add('headwear','work outdoor','shared','Beekeeper’s hood|Welding cap|Flame-resistant work hood|Cold-storage balaclava');
  add('headwear','work formal','shared','Academic mortarboard|Doctoral tam|Academic bonnet|Judge’s wig|Barrister’s wig');

  // Sports and movement: tagged separately from everyday hats.
  add('headwear','active outdoor','shared','Cycling helmet|Mountain-bike helmet|Skate helmet|Ski helmet|Snowboard helmet|Equestrian helmet|Polo helmet|Climbing helmet|Kayaking helmet|Whitewater rafting helmet|Batting helmet|Cricket helmet|Ice-hockey helmet|American football helmet|Lacrosse helmet','hard');
  add('headwear','active','shared','Boxing headguard|Wrestling ear guards|Rugby scrum cap|Water-polo cap|Surf hood|Diving hood|Thermal swim hood|Triathlon cap|Tennis headband|Martial-arts headband|Gymnastics hair cover');
  add('headwear','active outdoor','shared','Trail-running cap|Legionnaire running cap|Cross-country ski headband|Race-day sweat cap');

  // Sleep and home: keep usable options for each presentation.
  add('headwear','sleep','shared','Satin-lined sleep cap|Silk sleep turban|Adjustable drawstring sleep bonnet|Long-hair sleep bonnet|Braids-and-locs sleep sleeve|Tie-back sleep cap|Slouch jersey sleep cap|Pointed tassel nightcap|Knitted bed cap|Soft thermal bed hood|Sleep headband|Hair plopping wrap|Towel turban|Shower cap|Deep-conditioning hair cap');
  add('headwear','sleep','f n','Ruffled sleep cap|Lace-edged boudoir cap');

  // Historical and fantasy soft headwear.
  add('headwear','fantasy','shared','Linen coif|Padded arming hood|Long-tailed hood|Scalloped traveling hood|Chaperon|Liripipe hood|Pilgrim’s hat|Broad-brimmed merchant hat|Soft scholar’s cap|Round artisan’s cap|Jester’s cap|Phrygian cap|Pointed felt hat|Wizard’s hat|Bent-tipped sorcerer’s hat|Wide-brimmed witch’s hat|Feathered ranger hat|Robin Hood-style cap|Tricorn|Bicorn|Cavalier hat|Plumed cavalier hat|Musketeer hat|Shako|Bearskin guard hat|Busby|Monastic hood|Ceremonial mitre');
  add('headwear','fantasy formal','f n','Hennin|Truncated hennin|Butterfly hennin|Escoffion|Gable hood|French hood|Attifet|Reticulated headdress');

  // Armor: helmet type supplies the rigid-material descriptor behavior.
  add('headwear','fantasy','shared','Kettle helm|Nasal helm|Spangenhelm|Bascinet helm|Visored bascinet helm|Sallet helm|Barbute helm|Armet helm|Close helm|Burgonet helm|Morion helm|Cabasset helm|Lobster-tailed helmet|Spiked cavalry helmet|Plumed tournament helm|Crested parade helm|Scaled leather helmet|Lamellar helmet|Ridged bronze helmet|Winged fantasy helm|Dragon-crested helm|Antler-crested helm');

  // Regalia and invented ceremonial silhouettes; no implied rank or backstory.
  add('headwear','formal fantasy','shared','Open royal crown|Arched royal crown|Ducal coronet|Laurel diadem|Jeweled diadem|Leaf-shaped metal circlet|Hammered brow band|Chain-linked brow circlet|Filigree brow piece|Sunburst crown|Crescent diadem|Star-pointed crown|Antler crown|Branch-shaped crown|Crystal-spired crown|Horned ritual headdress|Winged temple headpiece|Fan-shaped ceremonial crown','hard');
  add('headwear','formal fantasy','f n','Tiara|Comb-mounted tiara|Fringe tiara|Kokoshnik-shaped tiara|Delicate forehead pendant','hard');
  add('headwear','fantasy','shared','Feather-crested ritual cap|Shell-strung headband|Carved wooden brow piece|Braided reed crown|Antler-and-vine headdress','general');

  // Extended tops: append-only so existing saved item IDs stay stable.
  // Regional names identify garments, not a character's ethnicity. Occasion tags
  // describe use; international clothing is not automatically tagged fantasy.
  // m n / f n permit associated styles in Neutral; shared matches every gender.
  // Only upper-body garments here: no complete outfits, robes, or overcoats.
  // Terminology sources and garment-boundary notes: DATA-SOURCES.md.

  // T-shirts, tanks, and casual jersey silhouettes.
  add('top','casual','shared','V-neck T-shirt|Scoop-neck T-shirt|Boat-neck T-shirt|Pocket T-shirt|Raglan-sleeve T-shirt|Baseball T-shirt|Ringer T-shirt|Boxy T-shirt|Oversized drop-shoulder T-shirt|Fitted ribbed T-shirt|Longline T-shirt|Split-hem T-shirt|Asymmetric-hem T-shirt|Mock-neck T-shirt|Rolled-sleeve T-shirt|Cap-sleeve T-shirt|Elbow-sleeve T-shirt|Sleeveless muscle shirt|Square-cut tank top|Ribbed tank top|Racerback tank top|High-neck tank top|Longline tank top|Slub jersey Henley|Short-sleeved Henley|Hooded sleeveless top|Boat-neck sailor top|Side-laced jersey top');
  add('top','casual','f n','Baby tee|Bandeau top|Tube top|Handkerchief-hem top|Tie-front crop top|Halter crop top|One-shoulder jersey top|Cropped racerback tank|Ruched-side tank top|Cross-back camisole|Cowl-neck camisole|Tie-shoulder camisole|Scalloped camisole|Lace-up-front crop top|Bustier-seam jersey top');

  // Shirts: construction differences, not permutations of color and condition.
  add('top','casual work','shared','Poplin shirt|Broadcloth shirt|Twill shirt|Seersucker shirt|Popover shirt|Hidden-placket shirt|Band-collar shirt|Tab-collar shirt|Spread-collar shirt|Point-collar shirt|Convertible-collar shirt|Short-sleeved button-down shirt|Grandad-front pullover shirt|Two-pocket work shirt|Western snap shirt|Sawtooth-pocket western shirt|Yoke-back ranch shirt|Epaulette utility shirt|Safari shirt|Tropical bush shirt|Roll-tab sleeve shirt|Half-placket linen shirt|Box-pleat-back shirt|Longline collarless shirt|Side-button shirt|Asymmetric wrap shirt|Tucked-bib shirt|Split-back shirt|Gusseted work shirt|Tunic-length popover');
  add('top','casual work','m n','Spearpoint-collar shirt|Club-collar shirt|Pinned-collar shirt|Button-under collar shirt|Contrast-collar business shirt|Detachable-collar shirt|Chest-bib work shirt|Pullover mechanic shirt|Short-sleeved bowling shirt|Loop-collar leisure shirt');

  // Blouses, shells, and bodices.
  add('top','casual work','f n','Peter Pan collar blouse|Portrait-collar blouse|Notched-collar blouse|Shawl-collar blouse|Sailor-collar blouse|Ruffle-front blouse|Jabot blouse|Pintuck blouse|Tucked-yoke blouse|Broderie-anglaise blouse|Ladder-insertion lace blouse|Gathered-neck peasant blouse|Bishop-sleeve blouse|Leg-of-mutton sleeve blouse|Lantern-sleeve blouse|Flutter-sleeve blouse|Bell-sleeve blouse|Dolman-sleeve blouse|Batwing blouse|Raglan peasant blouse|Split-sleeve blouse|Cold-shoulder blouse|Surplice blouse|Tie-neck blouse|Keyhole-neck blouse|Square-neck blouse|Sweetheart-neck blouse|Asymmetric-neck blouse|Scalloped-neck blouse|Button-back blouse|Bow-back blouse|Pleated-front blouse|Pleated shell top|Sleeveless collared blouse|Princess-seam blouse|Empire-seam blouse|Basque-waist blouse|Side-tie blouse|Wrap-front shell|Swing blouse|Trapeze top|Bubble-hem blouse|Gathered peplum shell|Paneled corset-style top|Laced bodice top|Sleeveless cowl shell');

  // Knitwear with different silhouettes or recognizable knitting structures.
  add('top','casual work outdoor','shared','Saddle-shoulder sweater|Raglan wool sweater|Guernsey sweater|Aran sweater|Fair Isle yoke sweater|Norwegian-pattern ski sweater|Icelandic lopapeysa sweater|Breton fisherman pullover|Ribbed commando sweater|Shawl-collar pullover|Henley-neck sweater|Split-neck sweater|Funnel-neck sweater|Cowl-neck sweater|Boat-neck sweater|Mock-neck pullover|Quarter-zip knit pullover|Button-shoulder sweater|Dolman-sleeve sweater|Drop-shoulder sweater|Side-slit tunic sweater|Sleeveless turtleneck|Sleeveless cable-knit pullover|Ribbed sweater vest|V-neck slipover|Crew-neck slipover|Collared knit polo|Zip-neck knit polo|Short-sleeved knit shirt|Waffle-knit pullover');
  add('top','casual','f n','Ballet-wrap knit top|Off-shoulder sweater|One-shoulder sweater|Cropped bolero-sleeve top|Pointelle knit top|Crochet halter top|Granny-square crochet top|Openwork knit camisole');
  add('top','casual active','shared','Raglan sweatshirt|Funnel-neck sweatshirt|Half-zip sweatshirt|Hoodless kangaroo-pocket sweatshirt|Cropped boxy sweatshirt|Side-panel athletic sweatshirt|Lace-neck sweatshirt|Short-sleeved sweatshirt|Sleeveless sweatshirt|Cowl-neck sweatshirt');

  // Formal separates: shirts, evening tops, and tailored waistcoats.
  add('top','formal','shared','Piqué-bib evening shirt|Stud-front evening shirt|Marcella-front dress shirt|Ruffled dress shirt|Soft-collar silk shirt|Pleated band-collar evening shirt|Stand-collar brocade shirt|Draped satin pullover|Tailored button-front waistcoat|Double-breasted waistcoat top|Shawl-collar evening waistcoat');
  add('top','formal','f n','Beaded evening shell|Cape-sleeve evening top|Asymmetric evening bodice|Boned corset top|Strapless satin bodice|Illusion-neck evening blouse|Scalloped lace shell|Draped one-shoulder top|Crystal-fringe top|Pleated organza blouse|Tiered chiffon top|Rosette evening top|Sculpted peplum bodice|Halter-wrap evening top|Velvet square-neck bodice|Back-button silk shell|Brocade sleeveless top|Appliqué evening blouse');

  // Functional work and travel garments.
  add('top','work','shared','V-neck scrub top|Mock-wrap scrub top|Button-front scrub tunic|Dental tunic|Hospitality service tunic|Chef’s short-sleeved shirt|Standing-collar kitchen tunic|Housekeeping tunic|Utility service polo|High-visibility work polo|High-visibility long-sleeved shirt|Flame-resistant work shirt|Oilfield drill shirt|Warehouse uniform shirt');
  add('top','outdoor active','shared','Ventilated hiking shirt|Fishing shirt with mesh vents|Insect-shield travel shirt|Long-sleeved sun shirt|Hooded sun shirt|Merino base-layer shirt|Grid-fleece base-layer top|Zip-neck thermal shirt|Expedition weight base layer|Ribbed wool undershirt|Paddle-sport thermal top|Quick-drying trail shirt');

  // Sports tops; complete suits remain in the one-piece category.
  add('top','active','shared','Basketball jersey|Football training shirt|Hockey practice jersey|Baseball uniform shirt|Cricket shirt|Tennis polo|Badminton shirt|Table-tennis shirt|Volleyball jersey|Rowing training tank|Boxing singlet top|Wrestling training shirt|Sleeveless cycling jersey|Long-sleeved cycling jersey|Triathlon top|Dance practice shirt|Ballet wrap practice top|Fitted yoga tank|Ventilated running shirt|Long-sleeved compression top|Short-sleeved rash guard|Zip-front surf top|Neoprene paddling top|Fencing practice underlayer');
  add('top','active','f n','Racerback sports bra|Cross-back sports bra|High-neck sports bra|Front-zip sports bra|Encapsulation sports bra|Longline yoga bra|Shelf-bra training tank|Supportive dance crop|Swim crop top|Tankini top');

  // Sleep and lounge separates, including soft underlayers.
  add('top','sleep','shared','Short-sleeved pajama shirt|Collarless pajama top|Henley pajama top|Sleep Henley with ribbed cuffs|Jersey sleep tunic|Oversized sleep tee|Sleeveless sleep shirt|Button-shoulder sleep top|Thermal waffle sleep shirt|Brushed-cotton lounge shirt|Hooded lounge top|Fleece lounge pullover|Wrap-front lounge shirt|Soft bamboo-knit sleep top|Pointelle sleep tank|Cotton undershirt|Ribbed long-sleeved undershirt');
  add('top','sleep','f n','Sleep camisole|Cropped pajama cami|Lace-yoke sleep top|Empire-seam sleep tank|Soft wrap sleep bra|Button-front lounge crop');

  // Japanese separates: the top component is named explicitly for two-piece sets.
  add('top','casual work outdoor','shared','Samue work top (Japanese wrap-front shirt)|Kariyushi shirt (Okinawan open-collar shirt)','','japanese');
  add('top','casual sleep','shared','Jinbei top (Japanese summer lounge shirt)','','japanese');
  add('top','active','shared','Judogi top (Japanese judo training jacket)|Karategi top (Japanese karate training jacket)|Kendogi top (Japanese kendo practice shirt)|Aikidogi top (Japanese aikido training jacket)|Kyudogi top (Japanese archery practice shirt)','','japanese');
  add('top','sleep','shared','Hadajuban shirt (Japanese short underlayer)|Hanjuban top (Japanese half-length under-kimono)','','japanese');
  // Contemporary Japanese fashion references, not claims of traditional costume.
  add('top','casual','shared','Japanese sailor-uniform blouse|Japanese school-uniform knit vest|Japanese workwear-inspired sashiko shirt|Japanese streetwear drop-tail shirt|Japanese streetwear asymmetric panel top|Japanese streetwear wrap-front jersey top','','japanese');
  add('top','casual formal','f n','Lolita-fashion high-collar blouse|Lolita-fashion detachable-sleeve blouse|Lolita-fashion capelet-collar blouse','','japanese');
  add('top','casual formal','shared','Ouji-fashion ruffled shirt','','japanese');
  add('top','casual work','shared','Kimono-sleeve shirt (modern cut)|Cross-collar tunic (Japanese-inspired)','','japanese');
  add('top','casual work','f n','Kimono-sleeve wrap blouse (modern cut)|Origami-pleated blouse (modern Japanese-inspired cut)','','japanese');

  // East and Southeast Asian upper-body garments; no whole hanbok or áo dài.
  add('top','casual formal','shared','Jeogori (Korean tie-front upper garment)|Modern hanbok wrap shirt|Cross-collar hanfu shirt (Chinese upper garment)|Straight-collar hanfu shirt (Chinese upper garment)');
  add('top','work formal','m n','Barong Tagalog (Philippine embroidered shirt)');
  add('top','casual work formal','shared','Batik shirt (Indonesia and Malaysia)|Baju Melayu shirt (Malay stand-collar top)');
  add('top','casual formal','f n','Kebaya (Southeast Asian front-opening blouse)|Kebaya panjang (long kebaya blouse)|Kebaya pendek (short kebaya blouse)|Kebaya kotabaru (panel-front blouse)|Baju kurung top (Malay loose tunic)|Baro blouse (Philippines)|Butterfly-sleeve terno blouse (Philippines)');
  add('top','casual','shared','Áo bà ba top (Vietnamese collarless shirt)');

  // South Asian separates: explicit tunic/blouse lengths, not complete ensembles.
  add('top','casual work formal','shared','Kurta (South Asian long shirt)|Short kurta (South Asian hip-length shirt)|Kameez tunic (South Asian outfit top)');
  add('top','casual work','f n','Kurti (South Asian short tunic)|Side-slit kurti|Angrakha-style wrap tunic|Pleated-yoke kurti');
  add('top','casual formal','f n','Choli (South Asian fitted blouse)|Tie-back choli|Long-sleeved sari blouse|High-neck sari blouse|Peplum choli|Mirror-work blouse (South Asian style)');
  add('top','formal','m n','Festive band-collar kurta|Chikan-embroidered kurta');

  // African and African-diaspora shirts and blouses.
  add('top','casual formal','shared','Dashiki (West African and diaspora shirt)|Kente-cloth shirt (Ghanaian style)|Ankara-print button-front shirt|Adire cloth pullover shirt (Nigerian style)|Short-sleeved senator-style tunic (Nigeria)');
  add('top','casual formal','f n','Buba blouse (Yoruba loose blouse)|Ankara peplum blouse|Kaba blouse (Ghanaian fitted blouse)');
  add('top','work formal','m n','Madiba shirt (South African patterned shirt)');

  // Americas and Caribbean: specific upper-body forms, not full dresses.
  add('top','casual work formal','shared','Guayabera (Caribbean and Latin American pleated shirt)|Aloha shirt (Hawaiian camp-collar shirt)');
  add('top','casual formal','f n','Blouse-length huipil (Mexico and Central America)|Mola-panel blouse (Guna textile tradition)|Huipil-style square-cut blouse|Mexican embroidered peasant blouse');

  // European regional shirts, blouses, and folk-inspired separates.
  add('top','casual work','shared','Breton marinière shirt|Grandad-front Irish linen shirt|Alpine collarless linen shirt');
  add('top','casual formal','shared','Vyshyvanka (Ukrainian embroidered shirt)|Kosovorotka (Russian side-fastened shirt)|Romanian-Moldovan embroidered shoulder-panel blouse|Ghillie shirt (Scottish lace-neck shirt)|Bavarian trachten shirt');
  add('top','casual formal','f n','Dirndl blouse (Alpine cropped blouse)|Square-neck dirndl blouse|High-neck dirndl blouse|Slavic-inspired gathered linen blouse');

  // Historical and fictional silhouettes. Cultural garments above retain their
  // everyday/formal tags rather than being treated as fantasy by default.
  add('top','fantasy','shared','Linen undertunic|Wool overtunic|Split-skirt riding tunic|Side-laced traveling shirt|Drawstring-neck peasant shirt|Square-neck medieval tunic|Keyhole-neck court tunic|Gusseted arming shirt|Fitted arming vest|Button-front doublet|Slashed-sleeve doublet|Puffed-sleeve doublet|Sleeveless doublet|Quilted jack|Laced leather vest|Reinforced leather bodice|Short heraldic tabard|Fur-edged hunting tunic|Cross-laced sailor shirt|Fencer’s linen shirt|Scholar’s high-collar tunic|Apothecary’s pocketed tunic|Layered desert traveler’s shirt|Asymmetric mage’s tunic');
  add('top','fantasy','f n','Square-neck laced bodice|Peasant blouse with gathered cuffs|Stomacher-front bodice|Court bodice with detachable sleeves');
  add('top','fantasy','shared','Lamellar cuirass|Laminar armor vest|Segmented breastplate|Riveted plate vest|Ring-mail shirt|Padded armor vest with shoulder caps','hard');

  // Japanese collection staples. Append entries to retain all previous IDs.
  // Collection tags are explicit editorial groupings, never inferred from names.
  add('bottom','casual work outdoor','shared','Samue trousers (Japanese workwear)','','japanese');
  add('bottom','casual sleep','shared','Jinbei shorts (Japanese loungewear)','','japanese');
  add('bottom','active formal fantasy','shared','Divided hakama (Japanese pleated trousers)','','japanese');
  add('onepiece','casual formal fantasy','shared','Kimono (Japanese full-length robe)','','japanese');
  add('onepiece','casual sleep','shared','Yukata (Japanese cotton summer robe)','','japanese');
  add('outerwear','casual formal','shared','Haori (Japanese outer jacket)','','japanese');
  add('outerwear','casual sleep','shared','Hanten (Japanese padded jacket)','','japanese');
  add('outerwear','casual','shared','Happi (Japanese festival coat)','','japanese');
  add('footwear','casual','shared','Geta (Japanese wooden sandals)','general','japanese');
  add('footwear','casual formal','shared','Zori (Japanese thong sandals)','general','japanese');

  const colors = ['black','charcoal','navy','cream','brown','burgundy','forest-green','slate-blue','rust','ivory'];
  const conditions = {fabric:['faded','freshly pressed','well-kept','mended','frayed'], general:['well-kept','worn'], hard:['polished','well-kept'], leather:['scuffed','well-kept','worn','polished']};
  const api = {items, colors, conditions}; root.WardrobeData = api;
  if (typeof module !== 'undefined') module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
