import React from 'react'

export default function HelpModal({ onClose, settings = {}, setSettings }) {
  const dontShow = !!settings.showHelpOnStart

  function toggleDontShow(e) {
    if (typeof setSettings === 'function') {
      setSettings(prev => ({ ...(prev || {}), showHelpOnStart: e.target.checked }))
    } else {
      try { localStorage.setItem('palette:showHelp', JSON.stringify(e.target.checked)) } catch (e) {}
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-60 w-full max-w-2xl p-6 bg-slate-900 rounded-md shadow-lg text-slate-100">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-2xl font-semibold">Help & Guide</h2>
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-300 flex items-center gap-2">
              <input type="checkbox" checked={dontShow} onChange={toggleDontShow} />
              Don't show on startup
            </label>
            <button className="btn btn-ghost" onClick={onClose}>Close</button>
          </div>
        </div>

        <div className="mt-4 space-y-4 text-sm text-slate-200">
          <section>
            <h3 className="font-medium">Overview</h3>
            <p className="mt-1">Chromatique helps you generate color palettes (HSL-based schemes and random swatches), lock colors, copy color values, save favorites, and export palettes for use in code or design tools.</p>
          </section>

          <section>
            <h3 className="font-medium">HSL & Generation</h3>
            <p className="mt-1">Use the HSL panel to adjust hue, saturation, and lightness rules and to choose scheme presets (analogous, complementary, triadic, etc.). The "Generate" action creates new colors according to the current settings. Locked swatches remain unchanged when generating.</p>
          </section>

          <section>
            <h3 className="font-medium">Palette / Swatches</h3>
            <p className="mt-1">Click a swatch to copy the color (HEX / RGB / HSL depending on your settings). Click the lock icon to prevent that color from changing during generation. Use the small handle or drag to reorder in some views.</p>
          </section>

          <section>
            <h3 className="font-medium">Favorites & Exports</h3>
            <p className="mt-1">Save palettes to your Favorites for quick reuse. From Favorites you can export a palette as JSON, CSS variables, SCSS map, Tailwind snippet, or download a PNG swatch image. Exports are done client-side and saved to your Downloads folder.</p>
          </section>

          <section>
            <h3 className="font-medium">Image Extraction</h3>
            <p className="mt-1">Use the Image tab to upload an image and extract dominant colors. For best results, use photos without heavy compression. Remote images may be blocked by CORS and can't be read by the browser; use local files instead.</p>
          </section>

          <section>
            <h3 className="font-medium">Accessibility & WCAG</h3>
            <p className="mt-1">Each swatch shows contrast information so you can evaluate foreground/background pairings. Aim for contrast ratios of at least 4.5:1 for normal text and 3:1 for large text. Use the Settings to enable any accessibility helpers.</p>
          </section>

          <section>
            <h3 className="font-medium">Tips & Shortcuts</h3>
            <ul className="list-disc ml-5 mt-1">
              <li>Click a color to copy. Use Settings to change the default copy format (HEX / RGB / HSL).</li>
              <li>Use the Import feature to load palettes saved as JSON (an array of color strings or an object with a `colors` array).</li>
              <li>If an export fails (rare), check browser console for errors and ensure you have permission to save files.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-medium">Troubleshooting</h3>
            <p className="mt-1">If image extraction doesn't work, try a smaller image or reduce the number of colors to extract. If the app behaves unexpectedly, try clearing local storage for the app keys (search for `palette:` keys) or reloading the page.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
