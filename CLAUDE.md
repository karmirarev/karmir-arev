# karmir-arev site notes

Personal site of marita (karmirarev). Live at https://կարմիրարեւ.հայ (punycode
https://xn--y9aamws5a2fcbv.xn--y9a3aq). Static files, no build step. Pushing to
`main` on GitHub publishes it within a minute or two.

## Look and feel (keep it exactly like this)

- Beige paper `rgb(212,211,200)` with the light-blue dot grid, fixed behind the page.
- Font: `'Courier New', monospace` everywhere. All text lowercase. Titles are the same
  font, bold, in purple.
- Colours are CSS variables in `site.css`:
  - `--maroon: #911254` purple. Lines, titles, chips, dashed dividers, the `+`/`-` squares.
  - `--green: #129150` current page highlight, filled squares next to home and elsewhere.
  - `--lime: #E4F882` hover fill on menu links, copy button hover.
  - `--lilac: #9582F8` accent. Game tag pills are `#C1BCD7`.
  - Box shadow on every box is `4px 4px 0 #C1BCD7`.
  - Text is `#1b1b1b`. Links are ink with a thin purple underline. Never bright blue.
- Boxes (left wing, menu, elsewhere, portfolio cards, game cards): 1px purple border,
  `border-radius: 14px`, the lilac shadow, solid paper background so dots do not show through.
- The left wing has notebook lines inside it: red verticals near its sides and a purple
  line across the top (done with background gradients in `.wing`).
- Green outline on hover for gallery pictures and event photos. Lightbox on click.
- Icons: hollow purple squares for sections, green filled square for home and elsewhere,
  hollow circles for the elsewhere links. No emoji anywhere on the site.
- Things marita rejected, do not bring back: fading/opacity transitions, image tiles on
  the home page, a map in the menu, an animated character, bright blue links, bold
  that switches to a different-looking font.

## Layout

Every main page is three parts: `.wing` (left box), `.content` (middle), `.side` on the
right which holds `.menu` (the page tree, rendered by `nav.js`) and `.links-box`
("elsewhere"). Wing and menu are `min(400px, 28vw)` wide and stretch to the full page
height. Under 700px the order is menu, content, wing, and an empty wing is hidden.

Section pages (`projects`, `arts-and-crafts`, `thinking-out-loud`) keep every subsection
inline in one `index.html`: a `sections` object of template strings keyed by name, a
matching `wings` object for what goes in the left box, and `show(key)` swaps
`#content` and `#wing`. The URL hash picks the section (`/projects/#games`).

Sub-pages like `arts-and-crafts/clay/` still exist as files but nothing links to them.

## Menu

`nav.js` holds the whole tree in `NAV` and the outside links in `LINKS`. Adding a page
means adding an entry there. Links with `newTab: true` open in a new tab (used for the
two playable games and all outside links). The current page gets the green pill, its
parents are unfolded.

## Adding a game

1. In `projects/index.html`, inside `sections.games`, copy one `.game` card:
   ```html
   <div class="game">
     <canvas class="cover" data-toy="NAME"></canvas>
     <div class="body">
       <p class="name">NAME</p>
       <span class="tag mobile">mobile game</span>   <!-- or tag video / video game -->
       <p>one line about it</p>
     </div>
   </div>
   ```
   Use `<a class="game" href="..." target="_blank" rel="noopener">` instead of the div
   if it links somewhere. Cards are 16:9 covers, name, tag, blurb, in that order.
2. In `toys.js`, add a `TOYS[NAME]` entry. Covers are live GPU cellular automata
   (WebGL2, ported from snek-git/quickshell-toys). Existing regimes: Gray-Scott with
   `u_F`/`u_k` (mode 4) and Lenia species (mode 0). Keep them purple: `ink: PLUM,
   ink2: PLUM2`. They pause off-screen and reseed on click.
3. Add the game to the `games` children in `nav.js`, same order as the cards.
4. Bump `toys.js?v=N` in `projects/index.html`.

The portfolio cards (gif, name, email with copy button, bio, find me on, resume) live in
`wings.games` in `projects/index.html`. The resume is `projects/resume.pdf`.

## Adding drawings, events, essays

- Drawings: `arts-and-crafts/index.html`, `sections.drawings`. Six type blocks
  (game assets, mixed media, digital, traditional, fanarts, sketches) as `.event` divs,
  with matching `.story` titles in `wings.drawings`. Put a
  `<div class="gallery-item"><img src="./digital-mixed-media/x.png" alt="x"></div>`
  into the right block. Empty blocks show "nothing here yet".
- Events: `sections['events-markets-exhibits']` holds the photo groups (`.event` with a
  `.shots` grid), `wings['events-markets-exhibits']` holds the date, place and story.
  `alignEvents()` lines each story up with its photos. Photo columns are sized from
  the images' real proportions so nothing is cropped.
- Essays: `thinking-out-loud/index.html`, `sections`, plus a `nav.js` entry.

## Draggable things

`deco.js` makes `.deco` images draggable inside `.deco-area` (the projects wing).
Positions are saved per visitor in localStorage under `deco-positions:v2:<path>`.

## Home wing

Update log (`ul.log` with `<time>` lines) and the guestbook. The guestbook posts to
Formspree (form action in `index.html`, currently a `FORMSPREE_ID` placeholder, which
keeps the form disabled) and lists entries from `guestbook.json` in the repo root:
`[{ "name": "...", "when": "23 sep", "text": "..." }]`. Add approved entries there.

## Cache

The host caches files for four hours and ignores `_headers`. Every page loads
`site.css?v=N`, `nav.js?v=N`, `deco.js?v=N`, `toys.js?v=N`. Bump the number in all
pages whenever that file changes (a one-line sed across `**/index.html`, skipping the
game folders and `lab/`). New images get new file names rather than reusing one.

## Local preview

`python3 -m http.server 8765` from the repo root. `.claude/launch.json` has the same
for the app's preview button. The browser pane reports itself hidden, so the cover
simulations pause there; `?toys=force` in the URL overrides that, and each canvas has
`.advance(n)` and `.readState()` hooks for checking.

## Not part of the site

`lab/` holds design sketches (`index.html` is the latest, `v1.html` the first). Do not
link them from the menu. `projects/games/pingala/` and `bebe-heist/` are built game
exports, leave their files alone.
