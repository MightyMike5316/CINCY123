# Westside-Old Window Repair — www.cincy123.com

Static, 5-page marketing site for **Westside - Old Window Repair** (Mark Gay, Cincinnati's West Side).
No build step, no framework — plain HTML, CSS and a little JavaScript, ready for **Cloudflare Pages**.

| Page | File | URL |
|------|------|-----|
| Home | `index.html` | `/` |
| Services (+ FAQ) | `services.html` | `/services` |
| About Mark | `about.html` | `/about` |
| Repair vs. Replacement (article) | `repair-vs-replacement.html` | `/repair-vs-replacement` |
| Contact, Hours & Reviews | `contact.html` | `/contact` |

Cloudflare Pages serves `services.html` at `/services` automatically (clean URLs), and all internal links, canonical tags and the sitemap already use the clean form.

---

## 1. Deploy to Cloudflare Pages (one time, ~5 minutes)

1. Log in to the [Cloudflare dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Authorize GitHub and pick the **`Cincy123.com`** repository.
3. Build settings:
   - **Framework preset:** None
   - **Build command:** *(leave blank)*
   - **Build output directory:** `/`
4. Click **Save and Deploy**. You'll get a `*.pages.dev` preview URL in about a minute.

Every push to `main` redeploys automatically.

## 2. Add the custom domain `www.cincy123.com`

1. Make sure `cincy123.com` is added as a zone in the same Cloudflare account (if the registrar is elsewhere, point its nameservers at Cloudflare first).
2. In the Pages project → **Custom domains** → **Set up a custom domain** → enter `www.cincy123.com` → **Activate domain**. Cloudflare creates the CNAME for you.
3. Repeat for the bare domain `cincy123.com` so it can redirect to `www`. The `_redirects` file in this repo sends `cincy123.com/*` → `https://www.cincy123.com/*` (301).
   - Alternative: **Rules → Redirect Rules → Create** → "Redirect from Root to WWW" template.
4. **SSL/TLS → Edge Certificates**: turn on **Always Use HTTPS** and **Automatic HTTPS Rewrites**.

## 3. Tell Google (and Bing) about the site

1. Add `https://www.cincy123.com` in [Google Search Console](https://search.google.com/search-console) (Domain property; verify with the DNS TXT record Cloudflare lets you add in one click).
2. **Sitemaps** → submit `https://www.cincy123.com/sitemap.xml`.
3. Do the same in [Bing Webmaster Tools](https://www.bing.com/webmasters) (it can import from Search Console).
4. In the **Google Business Profile** dashboard, set the **Website** field to `https://www.cincy123.com` — this links the profile and the site and is the single biggest local-SEO signal.

---

## Keeping it up to date

### Reviews
Reviews live in **`reviews.json`**. The pages ship with the current Google review baked into the HTML, and `js/main.js` re-renders the review sections from this file, so adding a review is one edit:

```json
{
  "author": "First L.",
  "rating": 5,
  "date": "2026-11-20",
  "text": "Copy the review text exactly as it appears on Google.",
  "source": "Google"
}
```

After adding to `reviews.json`, also paste the same review into the static review markup in `index.html` / `contact.html` if you want it visible to crawlers that don't run JavaScript (optional — Google does run JS).

**"Write a Google review" button:** both `index.html` and `contact.html` currently link to the Maps listing. In the Business Profile dashboard click **Ask for reviews**, copy the short `g.page/r/…/review` link, and replace the `href` on the "Write a Google review" / "Leave a Google review" buttons.

> Note: the site intentionally does **not** put the Google rating into `LocalBusiness` schema markup — Google's guidelines treat self-served third-party reviews as "self-serving" and ignore (or penalise) them. The reviews are displayed as normal page content instead.

### Photos
The site mixes real photos (`images/hero-dining-room-double-hung-windows.jpg`, `images/photo-*.jpg`) with original SVG artwork (the window cutaway diagram and the glazing/casement/storm illustrations). The current photos are web-resolution (~400–600 px wide); if higher-resolution originals are available, drop them in under the same file names and they'll look sharper on large and Retina screens. When Mark has before/after shots of his own work:

1. Export as JPG, ~1600 px on the long side, under 300 KB each.
2. Save to `images/` with descriptive file names (`re-roped-sash-westwood.jpg`, not `IMG_4021.jpg`).
3. Add to a page, e.g. in `about.html`:
   ```html
   <img src="/images/mark-gay-window-repair.jpg" width="800" height="600" loading="lazy"
        alt="Mark Gay re-glazing a wood window sash in a Westwood home">
   ```
   Always write a real `alt` sentence — it's what Google Images and screen readers use.
4. Add each new image to `sitemap.xml` under the page's `<url>` as an `<image:image>` entry.

### Hours, phone, service area
These appear in several places. Search the repo for the old value and replace everywhere:
- Hours: footer of every page, `index.html`, `contact.html`, `llms.txt`, and the `openingHoursSpecification` JSON-LD block in `index.html`.
- Phone: search for `921-1244` and `+15139211244`.
- Service area list: `index.html`, `contact.html`, `llms.txt`, and the `areaServed` JSON-LD in `index.html`.

---

## What's in here for SEO / discoverability

- **Unique `<title>` and meta description** on every page, sized for Google's display limits.
- **Canonical URLs**, Open Graph + Twitter cards with a 1200×630 share image (`images/og-image.png`).
- **Structured data (JSON-LD):** `HomeAndConstructionBusiness`/`LocalBusiness` with hours, phone, geo, service area and service catalog; `WebSite`; `WebPage`/`AboutPage`/`ContactPage`; `BreadcrumbList`; `Service` entries; `FAQPage`; `Person` (Mark Gay). Test at <https://search.google.com/test/rich-results>.
- **`sitemap.xml`** (with image entries) and **`robots.txt`** that points to it and explicitly allows AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended).
- **`llms.txt`** — a plain-language summary for AI search engines.
- **One `<h1>` per page**, logical heading order, descriptive **alt text** on every image, semantic landmarks, skip link, keyboard-visible focus states, high-contrast 19 px body text.
- **Internal linking:** every page links to every other page in the header and footer; service cards, FAQ answers and body copy cross-link to specific service anchors.
- **Performance:** no frameworks, SVG artwork (a few KB each), lazy-loaded below-the-fold images, long-cache headers in `_headers`, security headers, fonts with `display=swap`.
- **Mobile:** sticky tap-to-call bar, collapsible menu, `tel:` links everywhere the number appears.
- **Local signals:** NAP (name/phone) identical to the Google Business Profile, `geo.*` meta tags, embedded map, neighborhood names in copy and schema.

## Previewing locally

```bash
npx wrangler pages dev .      # emulates Cloudflare Pages (clean URLs, _headers, _redirects)
# or, without clean URLs:
python3 -m http.server 8080
```

## Vercel (preview / alternate host)

The repo also works on Vercel with zero configuration beyond the included `vercel.json`
(clean URLs, cache/security headers and the same redirects as Cloudflare).
Import at <https://vercel.com/new> → pick `CINCY123` → Framework preset **Other** → Deploy.
Pushes to `main` redeploy automatically; every pull request gets its own preview URL.
