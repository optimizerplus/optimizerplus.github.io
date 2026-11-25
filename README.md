# optimizerplus.github.io

Website of [Boosteroid Optimizer Plus](https://github.com/optimizerplus/optimizer-plus), built with [Zola](https://www.getzola.org/) and the Tailwind CSS standalone CLI. No npm.

## Edit

| What | Where |
|------|-------|
| Page markup | `templates/index.html` (shared `<head>` and SEO in `templates/base.html`) |
| Text, 15 languages | `static/i18n/<lang>.json` |
| Styles and animations | `styles/main.css` |
| Interactivity (menus, language, demo, FAQ) | `static/app.js` |
| AI-readable summary | `static/llms.txt` |

Each language gets its own pre-rendered page (`/fr/`, `/de/`, ...). When you add a language, add a `content/_index.<lang>.md`, a `[languages.<lang>]` entry in `config.toml` and the locale lists in `templates/base.html` and `static/app.js`.

## Build locally

Needs `zola` 0.23.6 and `tailwindcss` 4.2.4 (the same pinned binaries as `.github/workflows/deploy.yml`).

```sh
tailwindcss -i styles/main.css -o static/style.css --minify
zola serve
```

## Deploy

Push to `main`. GitHub Actions builds the site and publishes `public/` to GitHub Pages.
