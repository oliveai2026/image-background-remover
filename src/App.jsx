import { useState, useCallback } from 'react'
import './App.css'

export default function App() {
  const [original, setOriginal] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [dragging, setDragging] = useState(false)

  const processFile = async (file) => {
    if (!file) return

    // Validate type
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) {
      setError('Unsupported format. Please upload JPG, PNG, or WEBP.')
      return
    }

    // Validate size (10MB)
    if (file.size > 10 * 1024 * 1024) {
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

      const res = await fetch('/api/remove-bg', {
        method: 'POST',
        body: formData
      })

      if (!res.ok) {
        throw new Error('Processing failed. Please try again.')
      }

      const blob = await res.blob()
      setResult(URL.createObjectURL(blob))
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const onFileChange = (e) => processFile(e.target.files[0])

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    processFile(e.dataTransfer.files[0])
  }, [])

  const onDragOver = (e) => { e.preventDefault(); setDragging(true) }
  const onDragLeave = () => setDragging(false)

  const download = () => {
    const a = document.createElement('a')
    a.href = result
    a.download = 'removed-bg.png'
    a.click()
  }

  return (
    <div className="app">
      <header className="hero">
        <h1>Image Background Remover</h1>
        <p>Remove image backgrounds instantly. Free, fast, no sign-up.</p>
      </header>

      <main>
        {!original && (
          <div
            className={`upload-zone ${dragging ? 'dragging' : ''}`}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={() => document.getElementById('file-input').click()}
          >
            <div className="upload-icon">🖼️</div>
            <p>Drag & drop an image here, or click to upload</p>
            <span className="upload-hint">Supports JPG, PNG, WEBP · Max 10MB</span>
            <input
              id="file-input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={onFileChange}
              style={{ display: 'none' }}
            />
          </div>
        )}

        {error && <div className="error">{error}</div>}

        {original && (
          <div className="result-area">
            <div className="images">
              <div className="image-box">
                <span className="label">Original</span>
                <img src={original} alt="Original" />
              </div>
              <div className="image-box">
                <span className="label">Result</span>
                <div className="checkerboard">
                  {loading && <div className="loading"><div className="spinner" /><span>Processing...</span></div>}
                  {result && <img src={result} alt="Result" />}
                </div>
              </div>
            </div>

            <div className="actions">
              {result && (
                <button className="btn-download" onClick={download}>
                  ⬇️ Download PNG
                </button>
              )}
              <button className="btn-reset" onClick={() => { setOriginal(null); setResult(null); setError(null) }}>
                Try another image
              </button>
            </div>
          </div>
        )}

        <section className="info">
          <div className="info-item">⚡ Fast processing</div>
          <div className="info-item">🔒 Your images are never stored</div>
          <div className="info-item">✅ No sign-up required</div>
        </section>
      </main>
    </div>
  )
}
