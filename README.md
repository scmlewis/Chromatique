# Chromatique

A modern color palette web app built with React and Vite. Generate HSL palettes, lock colors, save favorites, extract colors from images, and export palettes for designers and developers.

## Features

- **Palette Generation**: Generate random HSL color palettes
- **Color Locking**: Lock specific colors to keep them while regenerating
- **Favorites Management**: Save and manage favorite palettes
- **Image Color Extraction**: Extract dominant colors from uploaded images
- **Palette Export**: Export palettes in multiple formats for design tools
- **Local Storage**: Persistent favorite palettes across sessions
- **Responsive Design**: Works seamlessly on desktop and mobile

## Live Demo

Deployed to GitHub Pages: https://scmlewis.github.io/Chromatique/

## Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS + Custom CSS
- **Color Picker**: react-colorful
- **Testing**: Jest + React Testing Library
- **Build**: Vite with GitHub Pages deployment

## Quick Start

### Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the dev server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

3. Build for production:
   ```bash
## Troubleshooting

### Deployment Issues
- **404 after deploy**: Wait a few minutes for GitHub Pages to provision the site on first deploy, then refresh or open in an incognito window
- **Page settings**: Verify at `Settings → Pages` that the source is set to the `gh-pages` branch (folder: `/`)
- **Asset paths**: Vite config uses `base: '/Chromatique/'` for correct serving under the repository path
- **Build logs**: Check GitHub Actions page for build and deploy logs: https://github.com/scmlewis/Chromatique/actions

### Local Development
- Ensure Node.js 16+ is installed
- Clear `node_modules` and reinstall if dependencies have issues: `rm -r node_modules && npm install`
- For test failures, check the console output and coverage reports in `coverage/`

## Project Structure

```
src/
├── components/      # React components
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
├── styles/         # CSS files (design tokens, components, themes)
├── __tests__/      # Test files
└── main.jsx        # Entry point
```

## Contributing

Feel free to fork, submit issues, or create pull requests. The test suite should pass before submitting PRs.

## Future Improvements

Historical optimization notes were archived out of the tracked repo during housekeeping.

Test files are located in:
- `src/__tests__/` - Test files organized by module
- Tests use Jest + React Testing Library for comprehensive coverage

## Deployment

The repository uses GitHub Actions for continuous deployment:
- **Workflow**: `.github/workflows/deploy-gh-pages.yml`
- **Trigger**: Automatically runs on pushes to `main` branch
- **Build**: `npm run build` (Vite)
- **Deploy**: Output deployed to `gh-pages` branch via `peaceiris/actions-gh-pages`

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
