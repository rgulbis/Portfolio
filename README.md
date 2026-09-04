# Roberts Gulbis — Portfolio

One-page portfolio site. React + Vite + Tailwind CSS v4. The hero cube is a 2D-canvas
isometric relief renderer with no 3D dependencies.

## Run it locally

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
npm run dev
```

Open the URL it prints (usually http://localhost:5173).

```bash
npm run build     # production build into dist/
npm run preview   # serve the built site locally
```

## Push to GitHub

```bash
git init
git add .
git commit -m "Portfolio site"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/roberts-portfolio.git
git push -u origin main
```

## Deploy on Vercel

1. Go to vercel.com and sign in with GitHub.
2. **Add New → Project**, pick this repository.
3. Leave the settings alone — Vercel detects Vite (build `npm run build`, output `dist`).
4. **Deploy.**

Every push to `main` redeploys automatically. A custom domain goes under
**Project → Settings → Domains**.

## Where things live

```
index.html                  page shell, fonts, meta tags
public/                     CV PDF, project image, favicon
src/index.css               Tailwind import, color/font theme, body styles, keyframes
src/App.jsx                 section order
src/content.js              skills, project bullets, experience, contact details
src/components/             Header, Hero, About, Skills, Work, Contact, primitives
src/cube/Cube.jsx           React wrapper around the canvas
src/cube/CubeRenderer.js    the cube itself
```

## Editing

**Text.** Most copy sits in `src/content.js` (skills, project bullets, job bullets,
contact rows). Headlines and paragraphs are in their own component files.

**Colors and fonts.** The `@theme` block at the top of `src/index.css` defines every
color as a Tailwind token — change `--color-mustard` there and it updates everywhere.

**The cube.** `cubeDefaults` in `src/cube/Cube.jsx` holds the knobs: face text
(`topLine1`, `leftLine1`, …), `gridSize`, `relief`, `cubeScale`, `pointerLift`,
`clickRipple`. Pass any of them as props to override.

## Notes

- The CV is served from `public/Roberts-Gulbis-CV.pdf`. Replacing that file (same name)
  updates the download button.
- Section entrance animations use CSS scroll-driven animations, which Safari ignores
  gracefully — content still shows.
