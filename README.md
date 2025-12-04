# Chromatique

A modern color palette web app - generate HSL palettes, lock colors, save favorites, extract colors from images, and export palettes for designers and developers.

Live demo
---------
- Deployed to GitHub Pages: https://scmlewis.github.io/Chromatique/

How it's deployed
------------------
- The repository contains a GitHub Actions workflow at `.github/workflows/deploy-gh-pages.yml` that builds the app with `npm run build` (Vite) and deploys the `dist` output to the `gh-pages` branch using `peaceiris/actions-gh-pages`.
- The workflow runs automatically on pushes to `main`.

Quick local development
-----------------------
1. Install dependencies:

```powershell
npm install
```

2. Run the dev server:

```powershell
npm run dev
```

3. Build for production:

```powershell
npm run build
```

Notes & troubleshooting
----------------------
- If the site shows `404` after a deploy, wait a few minutes for GitHub Pages to provision the site the first time, then refresh (or open in an incognito window).
- Verify Pages settings at: `Settings → Pages` and ensure the source is set to the `gh-pages` branch (folder: `/`).
- Asset base path: the Vite config uses `base: '/Chromatique/'` so the site is served correctly under the repository path.
- CI logs: check the Actions page for build and deploy logs: https://github.com/scmlewis/Chromatique/actions

Contact / Next steps
--------------------
- If you want a custom domain, add a `CNAME` file or set the domain under Pages settings and update DNS accordingly.
- I can add caching to the workflow (actions/cache) to speed up installs, or enable automatic release notes.
