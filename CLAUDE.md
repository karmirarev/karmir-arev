# karmir-arev site notes

Personal site of marita (karmirarev). Live at https://կարմիրարեւ.հայ (punycode
https://xn--y9aamws5a2fcbv.xn--y9a3aq). Static files, no build step. Pushing to
`main` on GitHub publishes it within a minute or two.

## Look and feel (keep it exactly like this)

- Beige paper `rgb(212,211,200)` with the light-blue dot grid, fixed behind the page.
- Font: `'Courier New', monospace` everywhere. All text lowercase. Titles are the same
  font, bold, in purple.
- Armenian letters use FreeMono (`fonts/FreeMono.ttf`, GNU FreeFont, GPL with font
  exception, credit in `fonts/CREDITS.txt`). It is first in the `body` font stack with a
  `unicode-range`, so any Armenian text picks it up and everything else stays Courier.
  Do not use the Antique font: its license forbids hosting it.
- Colours are CSS variables in `site.css`:
  - `--maroon: #911254` purple. Lines, titles, chips, dashed dividers, the `+`/`-` squares.
  - `--green: #129150` current page highlight, filled squares next to home and elsewhere.
  - `--lime: #E4F882` hover fill on menu links, copy button hover.
  - `--lilac: #9582F8` accent. Game tag pills are `#C1BCD7`.
  - Box shadow on every box is `4px 4px 0 #C1BCD7`.
  - Text is `#1b1b1b`. Links are ink with a thin purple underline. Never bright blue.
- Boxes (left wing, menu, portfolio cards, game cards): 1px purple border,
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

`nav.js` holds the whole tree in `NAV` and the outside links in `LINKS`. Adding a page
means adding an entry there. Links with `newTab: true` open in a new tab (used for all
outside links). The current page gets the green pill, its
parents are unfolded.

## Adding a game

Every game has its own page at `/projects/#KEY`, built from one entry in the `GAMES`
list in `projects/index.html`. The games grid, the game page (content) and the
"at a glance" fact sheet (wing) are all made from that entry, so there is no html
to copy.

1. Add an entry to `GAMES`:
   ```js
   {
     key: 'my-game',                 // url hash and toys.js key
     name: 'my game',
     tag: 'mobile game',             // or 'video game'
     blurb: 'one line for the card',
     about: ['paragraph', 'paragraph'],
     did: ['thing i did', 'another'],
     facts: { year: '', platform: '', engine: '', role: '', team: '', status: '' },
     made: ['unity', 'aseprite'],
     links: { play: '', itch: '', store: '', github: '', ggd: '' },
     shots: ['./shots/my-game-1.png']
   }
   ```
   Empty fields, links and lists are simply not shown. `play` is the green button.
   Other link keys: `appstore`, `trailer` (names in `LINK_NAMES`). Design docs and
   screenshots go in `projects/` as files with new names.
2. In `toys.js`, add a `TOYS[KEY]` entry. Covers are live GPU cellular automata
   (WebGL2, ported from snek-git/quickshell-toys). Existing regimes: Gray-Scott with
   `u_F`/`u_k` (mode 4) and Lenia species (mode 0). Keep them purple: `ink: PLUM,
   ink2: PLUM2`. They pause off-screen and reseed on click.
3. Add `{ label, href: '/projects/#KEY' }` to the `games` children in `nav.js`, same
   order as `GAMES`.
4. Bump `toys.js?v=N` in `projects/index.html` and `nav.js?v=N` in all pages.

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

Every major change to the site gets a line at the top of the update log in
`index.html` (`<li><time>mon d, yyyy</time>short lowercase line.</li>`), in the same
change that makes it. Only the newest 3 lines show (CSS hides the rest, no
"older" button, marita does not want one), so keep new lines at the top.

The home wing is only the update log (`ul.log` with `<time>` lines). Marita removed
the guestbook, do not add a message form back.

## Cache

The host caches files for four hours and ignores `_headers`. Every page loads
`site.css?v=N`, `nav.js?v=N`, `toys.js?v=N`. Bump the number in all
pages whenever that file changes (a one-line sed across `**/index.html`, skipping the
game folders and `lab/`). New images get new file names rather than reusing one.

## Local preview

`python3 -m http.server 8765` from the repo root. `.claude/launch.json` has the same
for the app's preview button. The browser pane reports itself hidden, so the cover
simulations pause there; `?toys=force` in the URL overrides that, and each canvas has
`.advance(n)` and `.readState()` hooks for checking.

## Not part of the site

`lab/` holds design sketches (`index.html` is the latest, `v1.html` the first) and
`creatures.html`, the creature picker. Do not
link them from the menu. `projects/games/pingala/` and `bebe-heist/` are built game
exports, leave their files alone.
