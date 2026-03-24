'use client'

import { useState, useCallback } from 'react'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

export default function Remover() {
  const [original, setOriginal] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [dragging, setDragging] = useState(false)

  const processFile = async (file) => {
    if (!file) return
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Unsupported format. Please upload JPG, PNG, or WEBP.')
      return
    }
    if (file.size > MAX_SIZE) {
      setError('File too large. Maximum size is 10MB.')
      return
    }

    setError(null)
    setResult(null)
    setOriginal(URL.createObjectURL(file))
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('image', file)

      const res = await fetch('/api/remove-bg', { method: 'POST', body: formData })
      if (!res.ok) throw new Error('Processing failed. Please try again.')

      const blob = await res.blob()
      setResult(URL.createObjectURL(blob))
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    processFile(e.dataTransfer.files[0])
  }, [])

  const reset = () => { setOriginal(null); setResult(null); setError(null) }

  const download = () => {
    const a = document.createElement('a')
    a.href = result
    a.download = 'removed-bg.png'
    a.click()
  }

  return (
    <div>
      {/* Upload zone */}
      {!original && (
        <label
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-16 cursor-pointer transition-colors
            ${dragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-white hover:border-indigo-400 hover:bg-indigo-50'}`}
          onDrop={onDrop}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
        >
          <span className="text-5xl mb-4">🖼️</span>
          <p className="text-lg font-medium mb-1">Drag & drop an image here, or click to upload</p>
          <p className="text-sm text-gray-400">Supports JPG, PNG, WEBP · Max 10MB</p>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => processFile(e.target.files[0])}
          />
        </label>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 bg-red-50 text-red-600 rounded-lg px-4 py-3 text-center text-sm">
          {error}
        </div>
      )}

      {/* Result area */}
      {original && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            {/* Original */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-2 border-b">Original</p>
              <img src={original} alt="Original" className="w-full object-contain max-h-72" />
            </div>

            {/* Result */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-2 border-b">Result</p>
              <div
                className="min-h-[180px] flex items-center justify-center"
                style={{
                  backgroundImage: 'linear-gradient(45deg,#ddd 25%,transparent 25%),linear-gradient(-45deg,#ddd 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#ddd 75%),linear-gradient(-45deg,transparent 75%,#ddd 75%)',
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0,0 10px,10px -10px,-10px 0'
                }}
              >
                {loading && (
                  <div className="flex flex-col items-center gap-2 text-gray-500 text-sm">
                    <div className="w-8 h-8 border-2 border-gray-200 border-t-indigo-500 rounded-full animate-spin" />
                    Processing...
                  </div>
                )}
                {result && <img src={result} alt="Result" className="w-full object-contain max-h-72" />}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-center flex-wrap">
            {result && (
              <button
                onClick={download}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-8 py-3 rounded-lg transition-colors"
              >
                ⬇️ Download PNG
              </button>
            )}
            <button
              onClick={reset}
              className="border border-gray-300 hover:border-gray-400 text-gray-600 font-medium px-8 py-3 rounded-lg transition-colors"
            >
              Try another image
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
