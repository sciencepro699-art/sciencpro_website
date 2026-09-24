# Security notes — Science Pro

This is a static site: no backend, no database, no user accounts, no
cookies. That already removes most of the usual attack surface. The
notes below cover what's in place, and what to keep in mind as more
chapters/classes are added.

## 1. No data-entry forms — by design

There are currently no `<form>` elements anywhere on the site, and none
should be added without deliberate thought. A static site has nowhere
safe to *send* form data — no server to validate it, sanitise it, or
protect it from abuse. If a form is ever genuinely needed (e.g. a
contact form, feedback box):

- Don't wire it to a plain `action="mailto:"` or a third-party form
  endpoint without checking what that service does with the data.
- Add real server-side handling (even a small serverless function)
  before collecting anything from a visitor.
- Never store personal data (name, email, etc.) in `localStorage`,
  `sessionStorage`, or anywhere client-side — it's not private there.

## 2. Content-Security-Policy (CSP)

Every HTML page includes a CSP `<meta>` tag in `<head>`:

```
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data:;
connect-src 'self';
object-src 'none';
base-uri 'self';
form-action 'self';
frame-ancestors 'none';
frame-src 'none';
```

What this buys us:
- `script-src 'self'` — only scripts loaded from our own files can run.
  **No inline `<script>` blocks exist anywhere in the site** (all page
  logic lives in `js/*.js` files) specifically so this can stay strict
  with no `'unsafe-inline'` exception. Keep it that way: if a new page
  needs JS, put it in its own `js/pagename.js` file and load it with
  `<script src="...">`, never an inline block.
- `object-src 'none'`, `frame-ancestors 'none'`, `frame-src 'none'` —
  blocks Flash/plugin embeds and stops the site being framed by (or
  framing) anything else, which closes off clickjacking.
- `style-src` still allows `'unsafe-inline'`, because the site uses
  inline `style="..."` attributes for dynamic per-subject colouring
  (e.g. `style="color: var(--c-physics)"`). This is a deliberate,
  low-risk trade-off — inline styles can't execute JS — rather than a
  full CSS refactor. Tighten this later if it's ever worth the effort.
- `https://fonts.googleapis.com` / `https://fonts.gstatic.com` are
  allow-listed only because Google Fonts is loaded for typography.
  Remove them if fonts are ever self-hosted instead.

## 3. Headers a `<meta>` tag can't set

`X-Frame-Options`, `X-Content-Type-Options`, and `Referrer-Policy` only
work as real HTTP response headers, not `<meta>` tags. Two things cover
this once the site is actually deployed:

- **`_headers`** in the project root — read automatically by Netlify
  and Cloudflare Pages.
- If hosting elsewhere, add the equivalent manually:

  **Nginx** (inside the relevant `server {}` block):
  ```
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-Frame-Options "DENY" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;
  ```

  **Apache** (`.htaccess`):
  ```
  Header always set X-Content-Type-Options "nosniff"
  Header always set X-Frame-Options "DENY"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  ```

## 4. Safe patterns when adding new chapter pages

Every new topic (e.g. `quadraticequations.html`) should follow the same
rules `soundwaves.html` does:

- Copy the CSP `<meta>` tag block into the new page's `<head>`.
- Put all JS in its own external file (`js/quadraticequations.js`,
  for example) — never an inline `<script>` block.
- Only use `innerHTML` with strings your own code builds from
  `data.js` or hardcoded content — never with anything a visitor
  typed. There's no form input anywhere today, so this isn't currently
  exploitable, but keep it that way if that ever changes.
- Don't add third-party `<script src="...">` tags from CDNs without
  updating `script-src` in the CSP to allow list that exact domain —
  the CSP will silently block it otherwise (check the browser console
  if a new script mysteriously doesn't run).

## 5. What's deliberately NOT done here

- No JavaScript frameworks or bundlers, so there's no dependency tree
  to audit or worry about supply-chain issues in.
- No analytics, tracking, or third-party scripts beyond Google Fonts.
- No `localStorage`/`sessionStorage`/cookies used anywhere.

## 6. Downloadable chapter resources (PYQs)

Each chapter can ship one PDF in `assets/downloads/`, named by
convention:

```
assets/downloads/<chapter-slug>-pyqs.pdf
```

You add this file yourself (e.g. via VSCode) — nothing on the site
generates or edits it. `js/chapter-resources.js` is a shared script
that checks whether the file actually exists (a `fetch(..., {method:
"HEAD"})` same-origin request) and renders either a working download
card or a "not added yet" placeholder — so a missing PDF never becomes
a dead link on the page.

**To wire up a new chapter page:**
```html
<div class="resource-grid" id="resourceGrid" data-chapter="yourchapterslug"></div>
<script src="js/chapter-resources.js"></script>
```
That's the only chapter-specific line — the slug in `data-chapter` must
match the prefix used in the PDF filename.

**Local testing caveat:** the existence check uses `fetch()`, which
browsers block entirely on `file://` pages (i.e. double-clicking the
HTML file). Every resource will show "not added yet" in that mode even
if the PDF is present. To see real results while developing, serve the
folder over HTTP, e.g. `python3 -m http.server` or `npx serve` from
the project root — or just check the deployed site.

No CSP changes are needed for any of this — `connect-src 'self'`
already permits the same-origin fetch, and normal `<a download>` clicks
aren't restricted by CSP at all.
