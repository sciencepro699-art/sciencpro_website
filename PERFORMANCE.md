# Performance notes — Science Pro

This site is going to grow into many HTML pages and PDFs (one chapter =
one page, many chapters, many classes). None of that needs a build
step or a framework to stay fast — it just needs a few real,
unglamorous things done consistently on every page. This file explains
what's in place and why, so it stays consistent as more chapters get
added.

No loading animations are used anywhere on this site. Perceived-speed
tricks like spinners or transition screens don't make anything
actually faster — they just add JavaScript and something else to
maintain. Everything below is a genuine reduction in load time.

## 1. Fonts never block the page from rendering

The browser used to have to fetch Google's font CSS before it could
render *any* text — a full render-blocking round trip to
`fonts.googleapis.com` on every single page load. Now:

```html
<link rel="preload" as="style" href="...fonts.googleapis.com/css2?...">
<link rel="stylesheet" href="...fonts.googleapis.com/css2?..." media="print" id="webfontsLink">
<noscript><link rel="stylesheet" href="...fonts.googleapis.com/css2?..."></noscript>
```

`media="print"` means the browser doesn't wait on this stylesheet to
paint the page — but it still fetches it in the background at normal
priority (the `preload` hint makes sure that starts as early as
possible). The moment `js/main.js` runs, it flips that link's `media`
to `"all"`, and the real fonts apply — usually before a visitor would
have noticed the fallback font at all. The `<noscript>` tag covers
anyone with JavaScript disabled, so they still get the right fonts,
just via the normal (blocking) path.

**If you add a new page:** copy this exact four-line block, keep the
`id="webfontsLink"` — that id is how `main.js` finds it.

## 2. Scripts don't block HTML parsing

Every `<script src="...">` tag has `defer`:

```html
<script src="js/data.js" defer></script>
<script src="js/main.js" defer></script>
```

`defer` scripts download in parallel with the rest of the page instead
of pausing the parser, and — critically — multiple deferred scripts
still run in the order they appear in the HTML, right before
`DOMContentLoaded`. That matters here because `js/data.js` must finish
before `js/main.js` or any page script tries to read `SITE_DATA`.
`defer` preserves that order safely; `async` would not.

**If you add a new page:** always use `defer`, always keep `data.js`
before `main.js` before any page-specific script.

## 3. Prefetch hints for the next likely page

Since every chapter is a separate HTML file, opening one is always a
real navigation — there's no way around that on a framework-free
static site. What helps is telling the browser what a visitor will
probably click next, so it can fetch that page quietly while they're
still reading the current one:

```html
<link rel="prefetch" href="soundwaves.html" />
```

This is on `subject.html` (which points at whichever chapter is
currently live), `class10.html` (points at the live subject),
`classes.html`, and `index.html`. It's a hint, not a guarantee — the
browser only does this when it has spare capacity, so it never
competes with what the current page actually needs.

**If you add a new chapter:** update the `<link rel="prefetch">` on
whatever page links to it, if it's the most likely next click from
there.

## 4. Images reserve their space before loading

Every logo `<img>` has explicit `width` and `height` attributes
matching its real aspect ratio (900×397), even though CSS also sets
its display size. Browsers use the two together to reserve the
correct box before the image has even downloaded, which stops the
page from jumping around as things load in — this is the "Cumulative
Layout Shift" metric in Core Web Vitals.

**If you add an image:** always include real `width`/`height`
attributes, not just CSS sizing.

## 5. Caching (`_headers`)

```
/*.html            Cache-Control: public, max-age=0, must-revalidate
/css/*  /js/*       Cache-Control: public, max-age=3600, must-revalidate
/assets/*          Cache-Control: public, max-age=604800
```

HTML is never cached long-term on purpose — this project adds chapters
and edits pages often, and a visitor stuck on a cached, out-of-date
page is worse than the small cost of always checking for a fresh one.
CSS/JS get a short cache; images and PDFs get a week, since they're
the least likely to be silently overwritten under an unchanged
filename.

**If you replace an existing image or PDF** and need visitors to see
the new version right away, give it a new filename (e.g.
`soundwaves-pyqs-v2.pdf`) rather than relying on a hard refresh to
beat the cache.

## 6. What this deliberately does NOT do

- No loading screens, spinners, or page-transition animations —
  they cost JS and maintenance for zero actual speed benefit.
- No JS framework or bundler, so there's no build step and no
  dependency tree to slow down over time.
- No self-hosted fonts (yet) — this would remove the Google Fonts
  round-trip entirely, but requires downloading and licensing-checking
  the actual font files, which wasn't done here. Worth revisiting once
  the font choices are final and unlikely to change.
- No image lazy-loading — there currently aren't any large
  below-the-fold images on the site that would benefit. Add
  `loading="lazy"` to any large images introduced in a future chapter
  that sit below the first screen.
