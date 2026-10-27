# Character Wardrobe Picker

A text-only writing tool with 2,048 distinct base details, including 316 hairstyles, 332 headwear entries, 479 tops, 523 bottoms, and 150 undergarments, plus 94 weapons / social advantages (58 physical weapons and 36 metaphorical advantages). No dependencies, build step, third-party requests, or accounts. Install it on a phone and use it offline after the first online load.

## Open it

Open `index.html` in a modern web browser. Everything runs locally. Alternatively, run `python3 -m http.server 8000` in this folder and visit `http://localhost:8000`.

Browser storage remembers results, locks, and settings when available. File-URL storage support varies by browser. If storage is unavailable, the app works for the current session. Clipboard access may also be unavailable when opening a file directly; Copy outfit then shows selected plain text for manual copying.

## Install on a phone

Serve this folder at an **HTTPS** address, then open that address on your phone. Any static host that serves all the files unchanged works, including when the app lives in a subdirectory. Opening a downloaded HTML file or a local-network HTTP address does not enable installation/offline caching. `http://localhost` works for development on the same device.

- **Android:** Tap **Install app**, then accept the browser's install prompt. If the prompt is unavailable, use Chrome's menu → **Install app** or **Add to Home screen**.
- **iPhone / iPad:** Open in Safari, tap **Share → Add to Home Screen → Add**. Leave **Open as Web App** enabled if shown. The app's **Install app** button shows these steps.

The installed app opens in its own window. Let the first online visit finish loading before going offline; the service worker saves the app and its full wardrobe catalog. Outfits, settings, and locks remain in local browser storage. A phone installation may have separate storage from the original browser tab, so copy any outfit you want to keep before switching.

For code or catalog updates, increment the cache version in `sw.js` and deploy all files together. The next online visit downloads the update; it takes over after all existing app windows and tabs close. Cache cleanup only removes this app's older caches within its own URL scope.

## Use it

Choose **Clothing collection → Japanese only** to limit future clothing/accessory draws to the 51 explicitly tagged Japanese or Japanese-inspired entries. The collection includes 24 tops, 20 bottoms, and 7 robes, jackets, and footwear items. Occasion and gender still apply, including in Wildcard; choosing Any / mixed removes only the gender filter. Hairstyles and Weapons keep their independent pools. Accessories and setting combinations without tagged entries show a clear availability note and never substitute unrelated clothing. Locked results keep their earlier selections: use Unlock all, then Roll outfit for a fully refreshed selection. The collection setting is saved locally; older saved outfits default to All collections.

Choose an occasion, presentation, picking mode, and outfit structure, then **Roll outfit**. Coordinated matches occasion, without guaranteeing perfect styling. Wildcard draws each slot across occasions while retaining the presentation filter. Hairstyles use presentation tags: shared styles appear for every gender option; masculine-associated styles use `m n`, and feminine-associated styles use `f n`. Neutral and Any / mixed include the full hairstyle catalog. These tags guide a writing prompt, rather than define who can wear a hairstyle. All hairstyles remain available across occasions.

Each slot has a reroll, a lock, and an empty probability. `0%` always picks a matching item; `100%` always picks None (Unspecified for hair). Bald and shaved heads are deliberate choices. Locks preserve the exact text, including its descriptors, even after filters change. Individual top/bottom rerolls keep the existing separates structure.

**Undergarment top**, **Undergarment bottom**, and **Hosiery** have separate rows in Head to toe below One-piece garment. The same 150 foundation-layer entries are distributed across 42 tops (including seven full sets/full-body pieces), 83 bottoms, and 25 hosiery choices. Bras, bralettes, camisoles, and undershirts belong in Top; briefs, boxers, slips, and open-bust shapewear belong in Bottom. Stockings, tights, and socks have their own row, so a bra, panties, and hosiery can appear together. Both men and women have separate upper and lower options; Neutral and Any / mixed include all eligible entries.

Choose **Underwear category → All categories, Modern, or Comedy** in Outfit settings. It filters only the two underwear rows in both picking modes. Hosiery draws independently from its 25 choices. Modern retains the original 100 entries, and Comedy retains its 25 entries. Women's pools include more bra and hosiery styles; shared comedy and sock entries remain available for all genders. Locked results stay as selected until unlocked and rerolled.

Foundation layers remain selectable under outer separates and one-piece outfits. Each row has its own 10% default None chance, color, garment condition, reroll, and lock. Full underwear sets, closed-bust bodysuits, full slips, and union suits appear in Undergarment top and include the underwear bottom; its reroll, lock, and condition controls are disabled while covered. Rerolling the top to a separate or None releases the bottom. Locking a separate bottom excludes full sets from future top rolls. Open-bust bodysuits remain bottoms so they can pair with a bra.

Older single-row selections move to the correct row with their original ID, text, condition, and lock preserved. Their old None percentage applies to all three new rows; missing layers are filled without rerolling other outfit results. Legacy locked None remains None in all three rows. The former Hosiery category setting becomes All categories because hosiery now has its own row. Saves using the original pre-version-4 0% default still upgrade once to 10%; later explicit 0% choices stay unchanged. The Japanese-only collection has no tagged foundation layers and shows unavailable results rather than substituting from other collections.

Auto has a separate one-piece selection chance, initially 25%. A selected one-piece replaces top and bottom; its own None chance still applies. If that roll is None, the picker generates separates, even with One-piece requested. Covered slots cannot be locked or individually rerolled. A locked nonempty one-piece forces one-piece structure; a locked top, bottom, or empty one-piece forces separates. Explicit conflicting requests explain what to unlock and leave results unchanged. Unlock, then roll again to apply the new structure.

Color starts off; random conditions start on. Both are independent and never decorate hairstyles. Some rigid accessories omit color to keep descriptions sensible. Copy outfit produces labeled plain text; empty, covered, and reserved slots are omitted when Omit empty slots is enabled.

Weapons are disabled by default. Once enabled, their default is an **80% chance of a weapon or advantage** (20% None). Older saves using the previous 70% None default migrate once to 20%; other saved percentages are preserved. Their mode and era operate independently of clothing settings, even in Wildcard. Wearable/carried weapon objects reserve relevant wardrobe slots to avoid conflicting duplicates. A new weapon draw excludes objects that conflict with nonempty locked wardrobe slots. Disabling Weapons retains its result and lock for later, removes it from copied text, and releases its reserved slots to None; reroll those slots as desired. Re-enabling a saved conflicting weapon asks you to unlock the named wardrobe slot first.

## Item conditions

Each nonempty clothing/accessory result has a **Condition** menu. Choose one of 47 possible statuses, filtered for that item: brand new, pristine, well-kept, lightly worn, worn, heavily worn, and unserviceable, plus specific defects such as ripped, soiled, smelly, permanent pit stains, mildew, split seams, worn soles, cracked leather, and broken fasteners. The menu runs from new to unusable; defects are not all points on a single linear scale.

A manual condition edit changes only that result's condition, preserving its item and color. Choose **No condition** to remove it. Unlock a locked item before editing; locks preserve both the item and its condition during rolls. Empty, covered, and weapon-reserved slots have no editable garment condition. Hairstyles and Weapons do not use clothing conditions.

**Random condition on rolls** is enabled by default and generates an eligible condition whenever an unlocked garment is rolled. Older saves enable this default once when loaded; subsequent opt-outs are remembered. It does not immediately rewrite existing results. Manual edits work even when random conditions are off. Rerolling replaces the garment and its condition; lock the slot to preserve them. Conditions appear in copied text and persist locally with the outfit.

Compatibility uses material and construction metadata: permanent pit stains require a fabric garment with underarms, worn knees require suitable legwear, worn soles require footwear, and missing buttons or broken zippers require those features. Metal, leather, rubber, rigid, fragile, woven, and fabric items have different damage pools. Existing saved descriptions remain unchanged until explicitly edited or rerolled.

## Weapon and advantage conditions

The **Weapon / advantage** row has its own **Condition** menu with a separate catalog of **125 statuses**: 25 physical wear/readiness conditions, 25 enchantments/combat effects, 25 shared power/binding statuses, 25 social/information/resource statuses, and 25 funny ownership/provenance conditions. Examples include Used, Chipped, Cursed, Honorbound, Soulbound, Overcharged, Mana-draining, Compromised, Revoked, and On cooldown. The funny conditions apply to both weapons and advantages, including Rented, Borrowed, Bargain, Won in a contest, Definitely not stolen, and Approved by three raccoons. Clothing conditions never enter this menu.

Options fit the selected entry: edged weapons can be blunted or sharpened, powered gear can be uncharged, ranged weapons can have ricochet effects, records can be redacted, and authority can be revoked. Abstract advantages do not receive physical damage. Supernatural statuses are available as creative prompts in every era.

**Random condition on rolls** also applies to weapons and advantages. Manual edits preserve the weapon or advantage, its explanation, and its wardrobe reservations. **No condition** clears the status. Locks preserve it, and copied text and saved outfits include it. Existing results change only when edited or rerolled.

## Expand the data

Bottoms cover all seven occasions: everyday trousers/jeans/skirts/shorts, professional tailoring and uniforms, formal separates, outdoor gear, sports/swim bottoms, sleep/lounge separates, and historical/fantasy pieces. International names identify the lower component only; Japanese-inspired adaptations are explicitly labeled and tagged for the Japanese collection. No full suits, dresses, or bib overalls are added to Bottom.

The tops collection includes Japanese separates and contemporary styles, plus international shirts, tunics, and blouses. Named garments have brief English descriptions; modern adaptations are marked as such. Two-piece sets contribute only their top component. Full-length robes and overcoats are not entered as tops. Regional names do not impose ethnicity restrictions. See [DATA-SOURCES.md](DATA-SOURCES.md) for terminology references and classification notes. Coordinated mode matches occasion, not cultural tradition or historical period.

Headwear spans everyday hats, cultural and religious coverings, professional uniforms, safety and sports equipment, sleep caps, historical designs, and fantasy regalia. Shared entries match every gender option; `m n` and `f n` entries also match Neutral. Occasion tags keep specialist pieces in relevant pools; Wildcard opens all occasions. These are broad writing prompts, not a claim that a hairstyle or hat can only be worn by one gender.

- `data.js`: clothing, hairstyles, accessories, colors, and per-item condition metadata.
- `conditions.js`: condition vocabulary, severity ordering, material profiles, and construction rules.
- `weapons.js`: separate physical and metaphorical lists.
- `weapon-conditions.js`: independent weapon/advantage status catalog and compatibility traits.
- `engine.js`: filtering, random selection, structure, locks, serialization, and copying.
- `app.js`: interface events, clipboard fallback, and browser storage.
- `style.css`: responsive dark theme.

In `data.js`, add a call before the exported `api`, for example:

```js
add('top', 'casual work', 'shared', 'Embroidered linen blouse|Pleated popover shirt');
```

Names separated by `|` become distinct base entries. Don't duplicate garments just to add colors. Slots are listed in `engine.js`. Occasion tags are `casual work formal outdoor active sleep fantasy`; use `all` for universal items. Presentation tags are `m f n` or `shared` (matches all presentations). Multiple tags use spaces. The optional fifth `add` argument can be `hard` for rigid ornaments or `general` for non-fabric items such as straw hats and wreaths; these avoid fabric-only wear phrases. The optional sixth argument adds space-separated collection tags, for example `add('top', 'casual', 'shared', 'New Japanese-inspired shirt', '', 'japanese')`. Use explicit collection tags; names are never searched to decide inclusion. Add colors in `data.js`; add condition records and compatibility rules in `conditions.js`. Rendered descriptions are stored so expanding lists doesn't rewrite an existing outfit.

In `weapons.js`, add entries before the exported `api`:

```js
add(physical, 'historical fantasy', 'Ceremonial polearm');
add(metaphorical, 'contemporary historical fantasy sci-fi',
    'Trusted witness', 'can corroborate a disputed account');
```

Era tags are `contemporary historical fantasy sci-fi`. For an ordinary wearable/carried object, provide conflict slots as the fifth argument, such as `['carried']` or `['hands']`. This reserves the entire slot conservatively. Intangible advantages should have no conflict slots. Descriptions concern appearance and narrative advantage, not weapon operation.

Weapon/advantage status groups in `weapon-conditions.js` specify a kind (`physical`, `metaphorical`, or `both`) and an optional compatibility trait. Add new objects to the relevant `traitNames` lists to enable specific statuses. General and shared statuses work without traits. Keep status IDs stable for saved outfits.

Condition metadata is assigned to each item at the end of `data.js`. `conditionProfile` describes the material and `conditionFeatures` lists construction details such as `underarms`, `knees`, `zipper`, or `soles`. Classification is deliberately conservative when construction is unspecified. To correct a particular item, override its metadata after the classification loop. A condition record in `conditions.js` can limit `profiles` and require `features`; absent restrictions apply to every garment. Keep condition IDs stable so saved selections remain meaningful.

## Verification

With Node.js installed:

```sh
node test.js
node test-ui.js
node test-conditions.js
node test-underlayers.js
node test-weapon-conditions.js
node test-pwa.js
```

Engine checks cover the collection, every occasion/presentation/slot combination, wildcard filtering, 0%/100% probabilities, locks, one-piece transitions and conflicts, descriptors, weapon eras/reservations, plain-text copy, and saved-state restoration. The UI harness checks event wiring, clipboard success/fallback, reload persistence, storage failure, weapon enablement, and unlocking.

Condition tests cover all garment metadata, material/feature exclusions, manual edits, random generation, color preservation, locks, copying, old saves, and persistence.

Foundation-layer tests cover independent bra/bottom/hosiery rolls, every full set and its covered-slot controls, lock conflicts, releasing covered bottoms, and migration of every one of the 150 legacy entries without changing saved descriptions.

Weapon-condition checks verify all 125 distinct statuses are reachable and separate from clothing, compatibility across all 94 entries, manual edits and locks, random rolls across every mode/era, copied explanations, saved results, and migration of the higher default roll chance.

PWA checks cover icon dimensions, installation prompts and fallbacks, standalone mode, insecure URLs, offline assets, and cache isolation between URL scopes. Chromium browser checks also verified desktop and phone layouts, the manifest, offline reloads and rolls, and saved results at both the site root and a subdirectory. iPhone installation guidance was checked with an iPhone user agent; native phone installation, browser clipboard permissions, and screen-reader interaction still require device checks.
