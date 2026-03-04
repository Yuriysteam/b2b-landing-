# B2B Landing — Яндекс Путешествия для бизнеса

## Project structure

```
index.html          — single-page landing (Russian)
assets/
  styles/           — CSS (BEM, one file per section)
  scripts/          — JS (vanilla, no bundler)
  images/           — SVG / PNG assets
  fonts/            — YS Text / YS Display / YS Text Cond (TTF)
  data/             — map customization data
```

## Conventions

- Pure HTML/CSS/JS — no frameworks, no build step
- BEM naming for CSS classes
- All asset paths are relative: `assets/…`
- Cyrillic content — keep `lang="ru"` and `charset="UTF-8"`

## Git workflow

Push changes to remote:

```sh
git add -A
git commit -m "Describe your changes"
git push origin main
```

Stage specific files only:

```sh
git add index.html assets/styles/hero.css
git commit -m "Update hero section"
git push origin main
```
