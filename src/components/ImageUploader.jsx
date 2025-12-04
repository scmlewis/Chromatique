import React, { useEffect, useRef, useState } from 'react'
import { extractDominantColorsFromFile } from '../utils/imageColors'

export default function ImageUploader({ onExtract }) {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [fileInfo, setFileInfo] = useState(null)
  const [count, setCount] = useState(5)
  const [colors, setColors] = useState([])
  const [busy, setBusy] = useState(false)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (!file) { setPreview(null); return }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => { URL.revokeObjectURL(url) }
  }, [file])

  async function handleExtract() {
    if (!file) return
    setBusy(true)
    try {
      const result = await extractDominantColorsFromFile(file, Number(count) || 5)
      setColors(result)
      if (onExtract) onExtract(result)
    } catch (err) {
      console.error('Extract failed', err)
      setColors([])
    } finally {
      setBusy(false)
    }
  }

  function acceptFile(f) {
    if (!f) return false
    return f.type && f.type.startsWith('image/')
  }

  function setFileFromFileObject(f) {
    if (!f) return
    setFile(f)
    setColors([])
    // extract basic info (size) and image dimensions
    const info = { name: f.name, size: f.size }
    const img = new Image()
    const url = URL.createObjectURL(f)
    img.onload = () => {
      info.width = img.naturalWidth || img.width
      info.height = img.naturalHeight || img.height
      setFileInfo(info)
      URL.revokeObjectURL(url)
    }
    img.onerror = () => { setFileInfo(info); URL.revokeObjectURL(url) }
    img.src = url
  }

  function handleFileInputChange(e) {
    const f = e.target.files && e.target.files[0]
    if (!f) return
    setFileFromFileObject(f)
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    const dt = e.dataTransfer
    if (dt && dt.files && dt.files.length > 0) {
      const f = dt.files[0]
      if (acceptFile(f)) setFileFromFileObject(f)
    }
  }

  function handleDragOver(e) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
    setDragging(true)
  }

  function handleDragLeave(e) {
    e.preventDefault()
    setDragging(false)
  }

  function removeFile() {
    setFile(null)
    setFileInfo(null)
    setPreview(null)
    setColors([])
  }

  return (
    <div className="p-4 bg-slate-800 rounded-md text-slate-100">
      <div
        role="button"
        aria-label="Image upload drop zone"
        aria-describedby="image-upload-desc"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click() }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`mb-3 p-6 rounded-2xl border-2 transition-transform duration-200 ${dragging ? 'border-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 shadow-2xl transform scale-102' : 'border-dashed border-slate-700 bg-slate-800/40'} cursor-pointer`}
        style={{ minHeight: 160 }}
      >
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFileInputChange} style={{ display: 'none' }} />

        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points="7 10 12 15 17 10" />
            <line strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <div className="text-lg font-semibold text-white">{dragging ? 'Release to upload' : 'Drop an image here or click to choose'}</div>
          <div id="image-upload-desc" className="text-sm text-slate-200/80">PNG · JPG · GIF — local files only</div>

          {fileInfo && (
            <div className="mt-2 text-xs text-slate-100/80 flex items-center gap-3">
              <div>{fileInfo.name}</div>
              <div>•</div>
              <div>{(fileInfo.size / 1024).toFixed(0)} KB</div>
              {fileInfo.width && fileInfo.height && <div>• {fileInfo.width}×{fileInfo.height}px</div>}
              <button className="ml-3 text-xs text-rose-400 hover:underline" onClick={(e) => { e.stopPropagation(); removeFile() }} aria-label="Remove selected file">Remove</button>
            </div>
          )}
        </div>
      </div>

      {/* Controls separated from drop zone */}
      <div className="flex items-center gap-3 mb-3">
        <label className="text-sm text-slate-300">Colors to extract</label>
        <input type="number" min={1} max={12} value={count} onChange={e => setCount(e.target.value)} className="w-20 bg-slate-700/40 p-1 rounded text-slate-100" />
        <button className="btn btn-primary ml-2 flex items-center" onClick={handleExtract} disabled={busy || !file} aria-busy={busy}>
          {busy ? (
            <>
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" aria-hidden="true" />
              Extracting…
            </>
          ) : (
            'Extract'
          )}
        </button>
      </div>

      {preview && (
        <div className="mb-3">
          <img src={preview} alt="preview" className="max-h-48 rounded-md shadow-sm object-contain" />
        </div>
      )}

      {colors && colors.length > 0 && (
        <div className="mt-2">
          <div className="flex gap-2">
            {colors.map((c, i) => (
              <div key={c} className="flex flex-col items-center text-xs">
                <div style={{ background: c }} className="w-12 h-12 rounded border" />
                <div className="mt-1">{c}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
