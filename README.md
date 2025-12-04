# Chromatique

Minimal modern color palette generator built with Vite + React + Tailwind CSS.

Features
- Generate random palettes (2–12 colors)
- Lock colors to keep them when regenerating
- Copy hex values to clipboard
- Save favorite palettes to `localStorage`
- Export current palette as JSON

Quick start (PowerShell)

```powershell
cd "C:\Users\Lewis\OneDrive\文件\Github\color_palette"
npm install
npm run dev
```

Open the provided local URL (usually http://localhost:5173) in your browser.

Notes
- This is a local-first app that stores favorites in your browser's `localStorage`.
- Tailwind is used for styling; feel free to tweak `src/index.css`.
