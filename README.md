# Character Wardrobe Picker

A local, text-only writing tool with 1,898 distinct base details, including 316 hairstyles, 332 headwear entries, 479 tops, and 523 bottoms, plus 47 physical weapons / social advantages. No dependencies, build step, network requests, or accounts.

## Open it

Open `index.html` in a modern web browser. Everything runs locally. Alternatively, run `python3 -m http.server 8000` in this folder and visit `http://localhost:8000`.

Browser storage remembers results, locks, and settings when available. File-URL storage support varies by browser. If storage is unavailable, the app works for the current session. Clipboard access may also be unavailable when opening a file directly; Copy outfit then shows selected plain text for manual copying.

## Use it

Choose **Clothing collection → Japanese only** to limit future clothing/accessory draws to the 51 explicitly tagged Japanese or Japanese-inspired entries. The collection includes 24 tops, 20 bottoms, and 7 robes, jackets, and footwear items. Occasion and gender still apply, including in Wildcard; choosing Any / mixed removes only the gender filter. Hairstyles and Weapons keep their independent pools. Accessories and setting combinations without tagged entries show a clear availability note and never substitute unrelated clothing. Locked results keep their earlier selections: use Unlock all, then Roll outfit for a fully refreshed selection. The collection setting is saved locally; older saved outfits default to All collections.

Choose an occasion, presentation, picking mode, and outfit structure, then **Roll outfit**. Coordinated matches occasion, without guaranteeing perfect styling. Wildcard draws each slot across occasions while retaining the presentation filter. Hairstyles use presentation tags: shared styles appear for every gender option; masculine-associated styles use `m n`, and feminine-associated styles use `f n`. Neutral and Any / mixed include the full hairstyle catalog. These tags guide a writing prompt, rather than define who can wear a hairstyle. All hairstyles remain available across occasions.

Each slot has a reroll, a lock, and an empty probability. `0%` always picks a matching item; `100%` always picks None (Unspecified for hair). Bald and shaved heads are deliberate choices. Locks preserve the exact text, including its descriptors, even after filters change. Individual top/bottom rerolls keep the existing separates structure.

Auto has a separate one-piece selection chance, initially 25%. A selected one-piece replaces top and bottom; its own None chance still applies. If that roll is None, the picker generates separates, even with One-piece requested. Covered slots cannot be locked or individually rerolled. A locked nonempty one-piece forces one-piece structure; a locked top, bottom, or empty one-piece forces separates. Explicit conflicting requests explain what to unlock and leave results unchanged. Unlock, then roll again to apply the new structure.

Color starts off; random conditions start on. Both are independent and never decorate hairstyles. Some rigid accessories omit color to keep descriptions sensible. Copy outfit produces labeled plain text; empty, covered, and reserved slots are omitted when Omit empty slots is enabled.

Weapons are disabled by default with a 70% None chance. Their mode and era operate independently of clothing settings, even in Wildcard. Wearable/carried weapon objects reserve relevant wardrobe slots to avoid conflicting duplicates. A new weapon draw excludes objects that conflict with nonempty locked wardrobe slots. Disabling Weapons retains its result and lock for later, removes it from copied text, and releases its reserved slots to None; reroll those slots as desired. Re-enabling a saved conflicting weapon asks you to unlock the named wardrobe slot first.

## Item conditions

Each nonempty clothing/accessory result has a **Condition** menu. Choose one of 47 possible statuses, filtered for that item: brand new, pristine, well-kept, lightly worn, worn, heavily worn, and unserviceable, plus specific defects such as ripped, soiled, smelly, permanent pit stains, mildew, split seams, worn soles, cracked leather, and broken fasteners. The menu runs from new to unusable; defects are not all points on a single linear scale.

A manual condition edit changes only that result's condition, preserving its item and color. Choose **No condition** to remove it. Unlock a locked item before editing; locks preserve both the item and its condition during rolls. Empty, covered, and weapon-reserved slots have no editable garment condition. Hairstyles and Weapons do not use clothing conditions.

**Random condition on rolls** is enabled by default and generates an eligible condition whenever an unlocked garment is rolled. Older saves enable this default once when loaded; subsequent opt-outs are remembered. It does not immediately rewrite existing results. Manual edits work even when random conditions are off. Rerolling replaces the garment and its condition; lock the slot to preserve them. Conditions appear in copied text and persist locally with the outfit.

Compatibility uses material and construction metadata: permanent pit stains require a fabric garment with underarms, worn knees require suitable legwear, worn soles require footwear, and missing buttons or broken zippers require those features. Metal, leather, rubber, rigid, fragile, woven, and fabric items have different damage pools. Existing saved descriptions remain unchanged until explicitly edited or rerolled.

## Expand the data

Bottoms cover all seven occasions: everyday trousers/jeans/skirts/shorts, professional tailoring and uniforms, formal separates, outdoor gear, sports/swim bottoms, sleep/lounge separates, and historical/fantasy pieces. International names identify the lower component only; Japanese-inspired adaptations are explicitly labeled and tagged for the Japanese collection. No full suits, dresses, or bib overalls are added to Bottom.

The tops collection includes Japanese separates and contemporary styles, plus international shirts, tunics, and blouses. Named garments have brief English descriptions; modern adaptations are marked as such. Two-piece sets contribute only their top component. Full-length robes and overcoats are not entered as tops. Regional names do not impose ethnicity restrictions. See [DATA-SOURCES.md](DATA-SOURCES.md) for terminology references and classification notes. Coordinated mode matches occasion, not cultural tradition or historical period.

Headwear spans everyday hats, cultural and religious coverings, professional uniforms, safety and sports equipment, sleep caps, historical designs, and fantasy regalia. Shared entries match every gender option; `m n` and `f n` entries also match Neutral. Occasion tags keep specialist pieces in relevant pools; Wildcard opens all occasions. These are broad writing prompts, not a claim that a hairstyle or hat can only be worn by one gender.

- `data.js`: clothing, hairstyles, accessories, colors, and per-item condition metadata.
- `conditions.js`: condition vocabulary, severity ordering, material profiles, and construction rules.
- `weapons.js`: separate physical and metaphorical lists.
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

Condition metadata is assigned to each item at the end of `data.js`. `conditionProfile` describes the material and `conditionFeatures` lists construction details such as `underarms`, `knees`, `zipper`, or `soles`. Classification is deliberately conservative when construction is unspecified. To correct a particular item, override its metadata after the classification loop. A condition record in `conditions.js` can limit `profiles` and require `features`; absent restrictions apply to every garment. Keep condition IDs stable so saved selections remain meaningful.

## Verification

With Node.js installed:

```sh
node test.js
node test-ui.js
node test-conditions.js
```

Engine checks cover the collection, every occasion/presentation/slot combination, wildcard filtering, 0%/100% probabilities, locks, one-piece transitions and conflicts, descriptors, weapon eras/reservations, plain-text copy, and saved-state restoration. The UI harness checks event wiring, clipboard success/fallback, reload persistence, storage failure, weapon enablement, and unlocking.

Condition tests cover all garment metadata, material/feature exclusions, manual edits, random generation, color preservation, locks, copying, old saves, and persistence.

The UI harness is not a browser: desktop/mobile visual rendering, real browser clipboard permissions, and keyboard/screen-reader interaction have not been manually verified in this environment. The layout includes phone breakpoints, native labeled form controls, visible focus styles, and live status messages.
