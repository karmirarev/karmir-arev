# karmir-arev site notes

Personal site of marita (karmirarev). Live at https://կարմիրարեւ.հայ (punycode
https://xn--y9aamws5a2fcbv.xn--y9a3aq). Static files, no build step. Pushing to
`main` on GitHub publishes it within a minute or two.

## Look and feel (keep it exactly like this)

- Beige paper `rgb(212,211,200)` with the light-blue dot grid, fixed behind the page.
- Font: `'Courier New', monospace` everywhere. All text lowercase, including dates and small labels (no `text-transform: uppercase`
  anywhere, marita does not want capitals). Titles are the same
  font, bold, in purple.
- Armenian letters use FreeMono (`fonts/FreeMono.ttf`, GNU FreeFont, GPL with font
  exception, credit in `fonts/CREDITS.txt`). It is first in the `body` font stack with a
  `unicode-range`, so any Armenian text picks it up and everything else stays Courier.
  Do not use the Antique font: its license forbids hosting it.
- Colours are CSS variables in `site.css`:
  - `--maroon: #52222b` deep wine. Titles, borders, chips, the `+`/`-` squares. (Palette changed sep 2026: before it was purple `#911254`, green `#129150`,
    lime `#E4F882`, lilac `#C1BCD7`. Marita also tried darker plums, an ATNN palette and a
    matcha/velvet one; she kept the beige paper, the blue dots and ink text and took only
    these four colours.)
  - `--green: #b3ae5a` olive. Current page pill, green buttons, happy pill; text on it is
    ink `#1b1b1b`, not white (white is unreadable on it).
  - `--lime: #c4bab5` warm grey. Hover fill on menu links and buttons. Picked from a row of
    swatches after trying lime, light blue, dusty pink, peaches and a paler grey `#d7d0cd`
    (too close to the paper, invisible) and orange `#c56e3b` (too harsh). Orange stays
    only as the menu's notebook margin line (`rgba(197,110,59,0.6)`).
  - `--lilac: #C1BCD7` the soft lilac-blue marita calls "the light blue". Box shadows
    `4px 4px 0 #C1BCD7`, tag pills, plant drops, essay quote background.
  - `--orange: #c56e3b`. Every dashed separation line (between sections, events,
    drawing types, fact sheet rows, the games groups, above "elsewhere") and the menu's
    notebook line. Also the update log's dashed timeline line. The menu tree lines and
    the essay quote connector lines stay deep wine.
  - Organisms (`toys.js`): `PLUM` is `#52222b`, `PLUM2` `#9a5a66`.
  - Text is `#1b1b1b`. Links are ink with a thin purple underline. Never bright blue.
- Boxes (left wing, menu, portfolio cards, game cards): 1px purple border,
  `border-radius: 14px`, the lilac shadow, solid paper background so dots do not show through.
- The left wing is a plain box (marita removed its notebook lines). The menu box has one
  orange notebook margin line 21px in from its left side (menu padding-left 34px), a background gradient on `.menu` and
  `.links-box` so the sticky elsewhere part keeps it too.
- Green outline on hover for gallery pictures and event photos. Lightbox on click.
- Icons: hollow purple squares for sections, green filled square for home and elsewhere,
  hollow circles for the elsewhere links. No emoji anywhere on the site.
- Things marita rejected, do not bring back: fading/opacity transitions, image tiles on
  the home page, a map in the menu, bright blue links, bold
  that switches to a different-looking font.

## Layout

Every main page is three parts: `.wing` (left box), `.content` (middle), `.side` on the
right which holds `.menu`, one box with the page tree and, at its bottom, `.links-box`
("elsewhere"), both rendered by `nav.js`. The links sit under a dashed line and are
`position: sticky; bottom: 21px` (the page padding plus the border, so they sit exactly
where they sit on a short page), so on long pages they ride along the bottom of the
screen and settle at the bottom of the menu box at the end (static under 700px). Wing and menu are `min(400px, 28vw)` wide and stretch to the full page
height. Under 700px the order is menu, content, wing, and an empty wing is hidden.

Section pages (`projects`, `arts-and-crafts`, `thinking-out-loud`) keep every subsection
inline in one `index.html`: a `sections` object of template strings keyed by name, a
matching `wings` object for what goes in the left box, and `show(key)` swaps
`#content` and `#wing`. The URL hash picks the section (`/projects/#games`).

Sub-pages like `arts-and-crafts/clay/` still exist as files but nothing links to them.

## Menu

`nav.js` holds the whole tree in `NAV` and the outside links in `LINKS`. Buy me a coffee is
separate, in `SUPPORT`, under its own "support me here" title below the elsewhere links.
On the home page only, that whole title cycles through, one colour at a time, matcha, velvet, monarch, pink silk, moss and
cornflower (`#b4a64b #591e2a #d2682b #d6a6b1 #464719 #98a8d9`) (CSS `rainbow`
keyframes with `steps(1)`, half a second each, switching without fading). Adding a page
means adding an entry there. Links with `newTab: true` open in a new tab (used for all
outside links). The current page gets the green pill, its
parents are unfolded.

## Click sound

Clicking anything clickable (links, buttons, toggles, cards, gallery pictures, organism
covers, the lightbox, the 3D model; the list is `CLICKABLE` in `nav.js`) plays
`click-hard.mp3`: the first click of Mixkit's "mouse hard clicking" (mixkit-mouse-hard-
clicking-1111, free Mixkit licence), trimmed to 0.13s with a short fade. Marita picked it
after trying a creamy pitched-down keyboard click, a synthesized "bloop", a clear mouse
click and a light switch tap. Each click is pitched a few percent up or down at random
so repeats do not sound robotic. Empty space stays silent. Played through Web Audio so quick clicks overlap;
fetched when the page loads, and links that load a page (including a reload) wait until
the pop has finished, plus the speaker delay, before leaving (at most 500ms). Hash links,
new-tab links and outside links are left alone. `click.mp3` is an earlier keyboard
click (freesound_community, Pixabay), not used right now.

## The guy in the menu

`guy.gif` (a walking beet, see-through, trimmed from her download) sits at the right edge
of the menu box, level with the current page's green pill. `placeGuy()` in `nav.js`
positions him inside `.side` with his body (63% down the image, below the leaf) on the
row's vertical middle, and he stays anchored to that row: on hash changes he jumps
straight to the new one (marita did not want him walking up and down), and he hides when
the current page is folded away. She asked for him, so the old "no animated character" rule does not apply
to him. The menu tree keeps 30px free on the right for him, and its links are
`display: inline` with `box-decoration-break: clone`, so a long label that wraps gets a
pill hugging each line instead of one box stretched to the full width.

## Adding a game

Every game has its own page at `/projects/#KEY`, built from one entry in the `GAMES`
list in `projects/index.html`. The games grid, the game page (content) and the
"at a glance" fact sheet (wing) are all made from that entry, so there is no html
to copy.

1. Add an entry to `GAMES`:
   ```js
   {
     key: 'my-game',                 // url hash and toys.js key
     jam: true,                      // only for game jam games, listed under "game jams"
     name: 'my game',
     tag: 'mobile game',             // or 'video game'
     blurb: 'one line for the card',
     about: ['paragraph', 'paragraph'],
     did: ['thing i did', 'another'],
     facts: { genre: 'top-down puzzle', platform: '', engine: '', status: '', year: '', role: '' },
     tools: ['aseprite', 'blender'],
     links: { play: '', itch: '', store: '', github: '', ggd: '' },
     shots: ['./shots/my-game-1.png']
   }
   ```
   The fact sheet always shows every fact and "additional tools", with `-` for empty
   ones, so marita can see what is left to fill in. `genre` is what kind of game it
   is (not "mobile game", that is what `tag` and `platform` are for). `tools` is only
   for extra tools beyond the engine; never repeat the
   engine there.
   Empty fields, links and lists are simply not shown. The way to play is always the green button: `play` if there is one, otherwise `itch`,
   then `store`, then `appstore`.
   Other link keys: `appstore`, `trailer` (names in `LINK_NAMES`). Design docs and
   screenshots go in `projects/` as files with new names.
2. Either a picture cover: `cover: './covers/KEY.webp'` (16:9, 1280x720 webp in
   `projects/covers/`, original colours, no filter), shown at the top of the game page. For an animated cover also add
   `video: './covers/KEY.mp4'` (1280x720 h264, no sound, short loop; the webp stays as its
   poster): it autoplays muted and looping on the game page and plays on card hover. The games grid cards
   show the live organism cover and swap to the picture while hovered (instantly, no
   fade), so every game also needs a `TOYS[KEY]` entry.
   Or a live cover: in `toys.js`, add a `TOYS[KEY]` entry. Covers are live GPU cellular automata
   (WebGL2, ported from snek-git/quickshell-toys). Existing regimes: Gray-Scott with
   `u_F`/`u_k` (mode 4) and Lenia species (mode 0). Keep them purple: `ink: PLUM,
   ink2: PLUM2`. They pause off-screen and reseed on click.
3. Add `{ label, href: '/projects/#KEY' }` to the `games` children in `nav.js`, in the
   order the grid shows them: personal projects first, then game jams.
4. Bump `toys.js?v=N` in `projects/index.html` and `nav.js?v=N` in all pages.

Unity web builds play inside the game page instead of a new tab: give the entry
`embed: { build: './games/NAME/Build/FILEPREFIX', width, height }`. The page then loads the game
straight away (no play button, no cover) in a portrait player box on the left with the
links and about text on its right (stacked under 700px) and a green loading bar while it
loads. It loads `FILEPREFIX.loader.js` and calls
`createUnityInstance` itself, so the export's own `index.html` is never touched. The
separate "play in browser" link is hidden for embedded games, and `show()` quits the game
when you leave the page. Pingala uses this.

The portfolio cards (gif, name, email with copy button, bio, find me on, resume) live in
`wings.games` in `projects/index.html`. The resume is `projects/resume.pdf`.

## Adding drawings, events, essays

- Drawings: `arts-and-crafts/index.html`, `sections.drawings`. Six type blocks
  (game assets, mixed media, digital, traditional, fanarts, sketches) as `.event` divs,
  with matching `.story` titles in `wings.drawings`. Put a
  gallery item into the right block. Empty blocks show "nothing here yet".
- Previews: every drawing and event photo shows a small preview, never the full file.
  Run `python3 tools/thumb.py arts-and-crafts/digital-mixed-media/x.png` (any number of
  paths). It writes a 560px-wide webp into `arts-and-crafts/thumbs/` (event photos into
  `thumbs/events/`, animated gifs stay animated) and prints the tag to paste, e.g.
  `<div class="gallery-item"><img src="./thumbs/x.webp" data-full="./digital-mixed-media/x.png" width="560" height="700" loading="lazy" alt="x"></div>`.
  The lightbox opens `data-full`, the original. Keep `width`/`height` (no layout jump)
  and `loading="lazy"` on gallery items (not on event `.shot`s, they sit at the top).
  This took the drawings page from 49MB to about 1MB.
- Events: `sections['events-markets-exhibits']` holds the photo groups (`.event` with a
  `.shots` grid), `wings['events-markets-exhibits']` holds the date, place and story.
  `alignEvents()` lines each story up with its photos. Photo columns are sized from
  the images' real proportions so nothing is cropped.
- 3D models: `sections['3d-model-painting']` shows `<model-viewer class="model">`
  (Google model-viewer 4.1.0 from jsdelivr, loaded by `show()` only when the section
  has one). Shrink scans before adding: textures to 2048 webp (occlusion and
  metallicRoughness 1024), Draco geometry (model-viewer decodes it natively; meshopt
  failed to load reliably), smooth normals if the scan has none. The figurine went
  from 16.7MB to 538KB. The scan's table sheet was cut off: model leveled (the scan was
  tilted 18 degrees), everything below 3.5% height dropped, only the biggest piece
  kept, and the open bottom closed with a flat cap. New versions get new file names
  (`figurine-v3.glb`). The wing holds a `.story` with the name and the
  printables link ("link to the 3d model").
  The model sits in `.event > .model-wrap` (centered, max 460px, overflow hidden) so it
  pairs with the wing story like other sections. The viewer's own framing leaves empty
  space above, so `.model` has negative margins to trim it, and the tilt is locked
  (`min/max-camera-orbit="auto 75deg auto"`) so dragging only spins it and never clips.
  `disable-pan disable-tap` stop a click from moving the model off its spot.
  `camera-orbit="180deg 75deg auto"` makes it start (and begin spinning) from her front.
- Essays: `thinking-out-loud/index.html`, `sections`, plus a `nav.js` entry.
  Quotes from other authors go between paragraphs as
  `<div class="cite-spot"><blockquote class="cite">"quote"<cite>author</cite></blockquote></div>`.
  On desktop `show()` copies them into the left box, `alignCites()` lines each one up with
  its spot and draws a straight dashed purple line with a dot to the gap (quotes are square, kept
  inside the box). Under 700px they
  show inline instead. Quote background is the tag colour `#C1BCD7`.

## Creatures in the left box

Only the main pages `projects`, `arts-and-crafts` and `thinking-out-loud` (no hash) show `<canvas class="wing-toy" data-toy="wing-PAGE">`, sized to the box. Each page has
its own, picked by marita from `lab/creatures.html` (a numbered grid of every
option, `pick-N` in `toys.js`): projects is 11 (pale ripples, Gray-Scott F 0.014 k 0.054),
arts is 9 (rings and curls, F 0.03 k 0.062), thinking is 10 (budding dots, F 0.078
k 0.061). Keep them small (`cols: 220`) and never reuse a game banner's creature. She
disliked the spinning Gyrorbium in the wings. Subpages (any hash) never
show creatures: `show()` sets the wing to `wings[key]` or empty and drops `.only-toy`
(which hides the landing box under 700px).

`deco.js` (draggable `.deco` gifs) is no longer used by any page.

## Home wing

The update log in `index.html` is for new things visitors can look at: a new drawing,
clay piece, figurine, essay, game or event. Log it in the same change that adds it
in this exact plain form: `<li><time>mon d, yyyy</time>new 3d model added in <a
href="/arts-and-crafts/#3d-model-painting">3d-model-painting</a>: ranni the witch</li>`
Every line must say what was added and where it was
added, with a link to that page. No chatty sentences. Do not log site
work like layout, menus, fonts, colours, caching or the left-box creatures. It is drawn as a timeline: a dashed
orange line down the left with a square per entry, the newest one filled green, date
above the sentence. Only the newest 3 lines show (CSS hides the rest, no
"older" button, marita does not want one), so keep new lines at the top.

The home wing holds the update log (`ul.log` with `<time>` lines), the plant box and the
"last watched" box (latest Letterboxd film and latest completed AniList anime, user
karmirarev). Marita removed the guestbook, do not
add a message form back.

Last watched: Letterboxd's RSS has no CORS, so the browser cannot read it. A GitHub
Action (`.github/workflows/watched.yml`, every 3 hours, also runnable by hand)
runs `.github/scripts/letterboxd.py` and `.github/scripts/anilist.py` (AniList GraphQL,
status COMPLETED sorted by finish date then last update, since she often marks several
done on one day), writes `letterboxd.json` and `anilist.json`, and commits only when
they changed. `index.html` fetches both and feeds them to the "last watched" carousel; an item whose
file is missing is skipped. The second line is her rating (stars for films,
score/10 for anime) and just `-` when she has not rated it. Do not log these bot commits in the update log.
The poster always gets marita's Canva "Sepia" duotone: an inline SVG filter `#sepia`
in `index.html` (greyscale, then darks to `rgb(37,20,41)` and lights to
`rgb(238,238,219)`), applied with `filter: url(#sepia)`.

## Plant tracker

The home page left box, under the update log, has two carousel boxes (`.slides`, own
border and shadow, built by `carousel(key, items, card)`): first "plants i am taking care
of", then "last watched". Each shows one item; a small square `>` button sitting on the
middle of the box's right edge cycles through them in a loop. "last watched" holds the
latest film (Letterboxd) and anime (AniList), poster left, a small kind label ("film",
"anime"), title, rating and date; a tv show can be added the same way as another item.
Dashed dividers only separate different topics, never a plant from its own facts. The
fun fact and care lines are plain text ("fun fact: ...", "care: ..."). `plants.json` in the repo root lists each
plant `{ name, latin, img, size (picture height in px, matching the real plants: peace lily
biggest, silvery ann smallest), every (days between waterings), watered (yyyy-mm-dd),
fact, care }` and
`index.html` draws the current plant: pixel picture (`plants/`, white backgrounds removed,
`image-rendering: pixelated`), name, latin name, five water drops (filled in the light blue `#C1BCD7`) that empty as days pass,
"watered N days ago", "next drink in N days" and a mood pill (green happy, lime thirsty
soon, purple "water me!", when thirsty the plant gently sways), then a short fun fact and
care routine. `plants/watering-can.png` is not used right now. Marita always waters on schedule, so the page assumes it: `watered` is just a
starting date, and every `every` days a new cycle begins by itself. On the due day the
plant shows "water me today!" (purple, swaying), and from the next day it counts as
freshly watered again. Nobody needs to update `watered`; only change it if the schedule
itself shifts. The
intervals are rough guesses (peace lily 7, calathea 6, silvery ann 12); change `every` if
her plants disagree.

## Cache

The host caches files for four hours and ignores `_headers`. Every page loads
`site.css?v=N`, `nav.js?v=N`, `toys.js?v=N`. Bump the number in all
pages whenever that file changes (a one-line sed across `**/index.html`, skipping the
game folders and `lab/`). New images get new file names rather than reusing one.

## Local preview

`python3 -m http.server 8765` from the repo root. `.claude/launch.json` runs the same
for the app's preview button, but with `autoPort`, so it takes a free port when 8765 is
already busy (e.g. a server started in the terminal). The browser pane reports itself hidden, so the cover
simulations pause there; `?toys=force` in the URL overrides that, and each canvas has
`.advance(n)` and `.readState()` hooks for checking.

## Not part of the site

`lab/` holds design sketches (`index.html` is the latest, `v1.html` the first) and
`creatures.html`, the creature picker. Do not
link them from the menu. `projects/games/pingala/` and `bebe-heist/` are built game
exports, leave their files alone.
