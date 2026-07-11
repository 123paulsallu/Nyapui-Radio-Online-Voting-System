import { useState, useRef, useCallback } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || '/api'

function UploadIcon() {
  return (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  )
}

const STATUS_COLORS = {
  success: { bg: '#ecfdf5', text: '#065f46', label: 'Created' },
  duplicate: { bg: '#fffbeb', text: '#92400e', label: 'Duplicate' },
  error: { bg: '#fef2f2', text: '#991b1b', label: 'Error' },
}

function DocumentTable({ document, duplicate }) {
  if (!document) return null
  const rows = [
    ['ID', document.id],
    ['DOI', document.doi],
    ['Title', document.title],
    ['Abstract', document.abstract || '(not found)'],
    ['Authors', document.authors || '(not found)'],
    ['Year', document.year ?? '(not found)'],
  ]
  return (
    <div className="result">
      <div className="resultHeader" style={{ background: duplicate ? STATUS_COLORS.duplicate.bg : STATUS_COLORS.success.bg, color: duplicate ? STATUS_COLORS.duplicate.text : STATUS_COLORS.success.text }}>
        {duplicate ? <InfoIcon /> : <CheckIcon />} {' '}
        {duplicate ? 'Already exists — returned existing record' : 'Document created'}
      </div>
      <div className="resultBody">
        <table>
          <tbody>
            {rows.map(([label, value]) => (
              <tr key={label}>
                <td>{label}</td>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ErrorMessage({ message }) {
  return (
    <div className="result">
      <div className="resultHeader error" style={{ background: STATUS_COLORS.error.bg, color: STATUS_COLORS.error.text }}>
        Upload failed
      </div>
      <div className="resultBody">{message}</div>
    </div>
  )
}

export default function App() {
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  const handleFile = useCallback((f) => {
    if (f && f.type === 'application/pdf') {
      setFile(f)
      setError(null)
      setResult(null)
    } else {
      setError('Please select a valid PDF file')
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }, [handleFile])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => setDragging(false), [])

  const handleInputChange = useCallback((e) => {
    handleFile(e.target.files[0])
  }, [handleFile])

  const upload = useCallback(async () => {
    if (!file) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const form = new FormData()
      form.append('file', file)

      const res = await fetch(`${API_URL}/documents`, { method: 'POST', body: form })
      const body = await res.json()

      if (!res.ok) {
        setError(body.error || `Server error (${res.status})`)
      } else {
        setResult(body)
      }
    } catch {
      setError('Network error — is the server running?')
    } finally {
      setLoading(false)
    }
  }, [file])

  const reset = useCallback(() => {
    setFile(null)
    setResult(null)
    setError(null)
    if (inputRef.current) inputRef.current.value = ''
  }, [])

  return (
    <div className="container">
      <h1 className="title">Document Ingestion</h1>
      <p className="subtitle">Upload a PDF to extract metadata and store it in the database</p>

      <div
        className={`dropzone${dragging ? ' dragging' : ''}${file ? ' hasFile' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <UploadIcon />
        {file ? (
          <>
            <p className="filename">{file.name}</p>
            <p className="hint">{(file.size / 1024).toFixed(1)} KB — click or drop to replace</p>
          </>
        ) : (
          <>
            <p>Drop a PDF here, or click to browse</p>
            <p className="hint">Only PDF files are accepted</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          onChange={handleInputChange}
          style={{ display: 'none' }}
        />
      </div>

      <div className="actions">
        <button className="button primary" onClick={upload} disabled={!file || loading}>
          {loading ? 'Uploading\u2026' : 'Upload'}
        </button>
        <button className="button secondary" onClick={reset} disabled={loading}>
          Clear
        </button>
      </div>

      {error && <ErrorMessage message={error} />}
      {result && <DocumentTable document={result.document} duplicate={result.duplicate} />}
    </div>
  )
}
