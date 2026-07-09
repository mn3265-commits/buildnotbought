import { useCallback, useRef, useState } from 'react'

const STORE_PREFIX = 'gym-tracker:imgslot:'

function loadImage(id: string): string | null {
  try {
    return localStorage.getItem(STORE_PREFIX + id)
  } catch {
    return null
  }
}
function saveImage(id: string, dataUrl: string | null) {
  try {
    if (dataUrl) localStorage.setItem(STORE_PREFIX + id, dataUrl)
    else localStorage.removeItem(STORE_PREFIX + id)
  } catch {
    /* ignore */
  }
}

/**
 * A user-fillable image placeholder: click to browse or drag-drop an image.
 * The chosen image is stored as a data URL in localStorage keyed by `id`,
 * so it survives a refresh — a lightweight port of the prototype's <image-slot>.
 */
export function ImageSlot({ id, placeholder }: { id: string; placeholder: string }) {
  const [src, setSrc] = useState<string | null>(() => loadImage(id))
  const [drag, setDrag] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const ingest = useCallback(
    (file: File | undefined) => {
      if (!file || !file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = () => {
        const url = String(reader.result)
        setSrc(url)
        saveImage(id, url)
      }
      reader.readAsDataURL(file)
    },
    [id],
  )

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault()
        setDrag(true)
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDrag(false)
        ingest(e.dataTransfer.files[0])
      }}
      style={{
        position: 'absolute',
        inset: 0,
        cursor: 'pointer',
        background: src ? '#0b0b0d' : '#141417',
        border: drag ? '2px dashed #CCFF00' : '1px solid transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {src ? (
        <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: 12, textAlign: 'center' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#54545c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <circle cx="8.5" cy="8.5" r="1.6" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
          <span style={{ fontFamily: "'Archivo'", fontSize: 11, fontWeight: 600, color: '#61616a', lineHeight: 1.4 }}>{placeholder}</span>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => ingest(e.target.files?.[0])}
        style={{ display: 'none' }}
      />
    </div>
  )
}
