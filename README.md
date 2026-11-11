# 许乙东 · Yidong Xu

A bilingual personal homepage for research, projects, and engineering experience. Built with HTML, CSS, and JavaScript, with no third-party runtime dependencies, tracking, or external font requests.

- **Website URL:** https://xyidong.github.io/personal-homepage/
- **Source repository:** https://github.com/xyidong/personal-homepage
- **Languages:** Chinese / English; remembers the visitor’s choice. Initial language follows the browser. Use `?lang=zh` or `?lang=en` to open a language directly.

## Local preview

Requires Node.js 20 or later. No installation or build step is needed.

```sh
npm run dev
```

Open http://127.0.0.1:4173. To choose a different port, set `PORT` before starting.

## Validate

```sh
npm run check
node --check dist/app.js
```

Checks both translation dictionaries, internal anchors, asset references, and the agreed public-content boundaries. Browser QA covers desktop/mobile layouts, navigation, language switching and persistence, project details, and copying the email address.

## Files and maintenance

```text
dist/
  index.html          Page structure and Chinese fallback content
  content.js          Chinese and English public copy
  app.js              Language switching, navigation, and interactions
  styles.css          Responsive styling and reduced-motion support
  assets/             Portrait and original SVG illustrations
  robots.txt          Search crawler configuration
  sitemap.xml         Website URL
scripts/
  serve.mjs           Local static preview server
  check.mjs           Content and structural validation
.github/workflows/     GitHub Pages validation and deployment
```

Update both dictionaries in `dist/content.js` when editing text. Keep the corresponding Chinese fallback in `dist/index.html` in sync. Serve `dist/` with any static host; all asset paths are relative.

## Publication

GitHub Pages serves `dist/`. The workflow validates the content, uploads only the static website, and publishes it on pushes to `main`. In repository Settings → Pages, the publishing source must be set to **GitHub Actions**. GitHub requires a plan that supports Pages for private source repositories; free accounts can publish Pages from public repositories. Never commit credentials or deployment archives.

## Content scope

Content was adapted from the supplied résumé. Competition awards and individual contributions are presented separately; no unpublished performance numbers, papers, or project repositories are claimed. The portrait is extracted from the supplied résumé. The original PDF, phone number, birth date, and political affiliation are excluded from both the website and repository.
