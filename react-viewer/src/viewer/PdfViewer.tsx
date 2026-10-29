import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react'
import * as pdfjs from 'pdfjs-dist'
import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { Icon, type IconName } from '../components/ui'

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl

const ZOOM_MIN = 0.5
const ZOOM_MAX = 2
const ZOOM_STEP = 0.1
const PAGE_GAP = 16
const DESKTOP = '(min-width: 900px)'

type PdfViewerProps = {
  url: string
  title: string
  onToast: (message: string) => void
}

/**
 * In-page PDF rendering with pdf.js: the same viewer on every browser,
 * instead of whatever the browser's own PDF plug-in provides.
 */
export function PdfViewer({ url, title, onToast }: PdfViewerProps) {
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null)
  const [error, setError] = useState(false)
  const [aspect, setAspect] = useState(11 / 8.5)
  const [boxWidth, setBoxWidth] = useState(0)
  const [desktop, setDesktop] = useState(() => window.matchMedia(DESKTOP).matches)
  const [zoom, setZoom] = useState(1)
  const [page, setPage] = useState(1)
  const [pageInput, setPageInput] = useState('1')
  const [fullscreen, setFullscreen] = useState(false)
  const [fallbackFs, setFallbackFs] = useState(false)
  const viewerRef = useRef<HTMLElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    const task = pdfjs.getDocument({ url })
    task.promise
      .then(async (pdf) => {
        if (cancelled) return
        const first = await pdf.getPage(1)
        const vp = first.getViewport({ scale: 1 })
        setAspect(vp.height / vp.width)
        setDoc(pdf)
      })
      .catch(() => !cancelled && setError(true))
    return () => {
      cancelled = true
      void task.destroy()
    }
  }, [url])

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP)
    const onChange = () => setDesktop(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Re-fit once the scroller settles (window resize, info panel animating open or closed).
  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    let t: number | undefined
    let first = true
    const ro = new ResizeObserver(([entry]) => {
      window.clearTimeout(t)
      const w = Math.floor(entry.contentRect.width)
      t = window.setTimeout(() => setBoxWidth(w), first ? 0 : 150)
      first = false
    })
    ro.observe(el)
    return () => {
      ro.disconnect()
      window.clearTimeout(t)
    }
  }, [])

  const fitWidth = desktop ? boxWidth * 0.7 : Math.min(boxWidth - 28, 820)
  const pageWidth = Math.max(0, Math.round(fitWidth * zoom))
  const pageHeight = Math.round(pageWidth * aspect)
  const total = doc?.numPages ?? 0

  // The current page is the one crossing the middle of the scroller.
  const onScroll = useCallback(() => {
    const el = scrollerRef.current
    if (!el || !total || !pageHeight) return
    const mid = el.scrollTop + el.clientHeight / 2
    const n = Math.min(total, Math.max(1, Math.floor(mid / (pageHeight + PAGE_GAP)) + 1))
    setPage(n)
    setPageInput(String(n))
  }, [total, pageHeight])

  const goTo = (n: number) => {
    const el = scrollerRef.current
    if (!el || !total) return
    const target = Math.min(total, Math.max(1, n))
    el.scrollTo({ top: (target - 1) * (pageHeight + PAGE_GAP), behavior: 'smooth' })
    setPageInput(String(target))
  }

  const changeZoom = (delta: number) =>
    setZoom((z) => Math.round(Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z + delta)) * 10) / 10)

  // Full screen: the native API on the viewer; iPhone Safari has none, so fall back to a fixed overlay.
  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === viewerRef.current)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])
  useEffect(() => {
    document.documentElement.classList.toggle('fs-lock', fallbackFs)
    if (!fallbackFs) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setFallbackFs(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [fallbackFs])
  const toggleFullscreen = () => {
    if (fallbackFs) return setFallbackFs(false)
    if (document.fullscreenElement) return void document.exitFullscreen()
    const el = viewerRef.current
    if (el?.requestFullscreen) el.requestFullscreen().catch(() => setFallbackFs(true))
    else setFallbackFs(true)
  }
  const isFs = fullscreen || fallbackFs

  const soon = () => onToast('This tool is not part of the prototype yet')
  const pageControl = (
    <div className="pg">
      <input
        className="pg__input"
        inputMode="numeric"
        aria-label="Page"
        value={pageInput}
        onChange={(e) => setPageInput(e.target.value.replace(/\D/g, ''))}
        onKeyDown={(e) => e.key === 'Enter' && goTo(Number(pageInput) || page)}
        onBlur={() => goTo(Number(pageInput) || page)}
        disabled={!total}
      />
      <span>of {total || '–'}</span>
    </div>
  )
  const zoomOut = <Tool icon="tool-minus" label="Zoom out" onClick={() => changeZoom(-ZOOM_STEP)} disabled={zoom <= ZOOM_MIN} />
  const zoomIn = <Tool icon="tool-plus" label="Zoom in" onClick={() => changeZoom(ZOOM_STEP)} disabled={zoom >= ZOOM_MAX} />
  const fsButton = (
    <Tool
      icon={isFs ? 'tool-collapse' : 'tool-expand'}
      label={isFs ? 'Exit full screen' : 'Full screen'}
      pressed={isFs}
      onClick={toggleFullscreen}
    />
  )

  return (
    <section
      ref={viewerRef}
      className={['viewer', fallbackFs && 'viewer--fs'].filter(Boolean).join(' ')}
      aria-label={`${title} document viewer`}
      style={{ '--max-h': pageHeight ? `${Math.round(pageHeight * 1.5)}px` : undefined } as CSSProperties}
    >
      {desktop ? (
        <div className="pdf-bar bar-d" role="toolbar" aria-label="PDF tools">
          <div className="grp">
            <Tool icon="tool-contents" label="Contents" onClick={soon} />
            <span className="tb-sep opt2" />
            <Tool icon="tool-marker" label="Highlight" className="opt2" caret onClick={soon} />
            <Tool icon="tool-draw" label="Draw" className="opt2" text="Draw" caret onClick={soon} />
            <Tool icon="tool-erase" label="Erase" className="opt" onClick={soon} />
            <span className="tb-sep opt2" />
            <Tool icon="tool-textbox" label="Add text" className="opt2" onClick={soon} />
            <span className="tb-sep opt" />
            <Tool icon="tool-read-aloud" label="Read aloud" className="opt" onClick={soon} />
          </div>
          <div className="grp mid">
            {zoomOut}
            <output className="zoom" aria-live="polite">
              {Math.round(zoom * 100)}%
            </output>
            {zoomIn}
            <Tool icon="tool-fit-width" label="Fit to width" className="opt2" onClick={() => setZoom(1)} />
            <span className="tb-sep" />
            {pageControl}
            <span className="tb-sep opt2" />
            <Tool icon="tool-rotate" label="Rotate" className="opt2" onClick={soon} />
            <Tool icon="tool-two-page" label="Two-page view" className="opt" onClick={soon} />
          </div>
          <div className="grp">
            <Tool icon="tool-search" label="Find in document" onClick={soon} />
            <span className="tb-sep opt2" />
            <Tool icon="tool-printer" label="Print" className="opt2" onClick={() => onToast('Opening print dialog…')} />
            <Tool icon="tool-save" label="Save" className="opt2" onClick={() => onToast('Downloading eIFU Comprehensive Guide.pdf (319 KB)')} />
            <Tool icon="tool-settings" label="Viewer settings" className="opt" onClick={soon} />
            <span className="tb-sep" />
            {fsButton}
          </div>
        </div>
      ) : (
        <div className="pdf-bar bar-m" role="toolbar" aria-label="PDF tools">
          <Tool icon="tool-thumbnails" label="Toggle thumbnails" onClick={soon} />
          <Tool icon="tool-search" label="Find in document" onClick={soon} />
          {pageControl}
          <span className="spacer" />
          {zoomOut}
          {zoomIn}
          <Tool icon="tool-highlight" label="Highlight" onClick={soon} />
          <Tool icon="tool-text" label="Add text" onClick={soon} />
          <Tool icon="tool-pen" label="Draw" onClick={soon} />
          <Tool icon="tool-image" label="Add image" onClick={soon} />
          {fsButton}
          <Tool icon="tool-more" label="More tools" onClick={soon} />
        </div>
      )}
      <div ref={scrollerRef} className="pages" onScroll={onScroll} tabIndex={0} aria-label="Document pages" aria-busy={!doc && !error}>
        {!doc && !error && <p className="pdf-status">Loading document…</p>}
        {error && <p className="pdf-status">The document could not be loaded. Reload the page to try again.</p>}
        {doc &&
          pageWidth > 0 &&
          Array.from({ length: total }, (_, i) => (
            <PdfPage key={i + 1} doc={doc} pageNumber={i + 1} width={pageWidth} height={pageHeight} root={scrollerRef} />
          ))}
      </div>
    </section>
  )
}

type ToolProps = {
  icon: IconName
  label: string
  onClick: () => void
  className?: string
  text?: ReactNode
  caret?: boolean
  pressed?: boolean
  disabled?: boolean
}

function Tool({ icon, label, onClick, className, text, caret, pressed, disabled }: ToolProps) {
  return (
    <button
      type="button"
      className={['tb', className].filter(Boolean).join(' ')}
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
    >
      <Icon name={icon} />
      {text && (
        <span className="lbl" aria-hidden="true">
          {text}
        </span>
      )}
      {caret && <Icon name="chevron-down" className="caret" />}
    </button>
  )
}

type PdfPageProps = {
  doc: PDFDocumentProxy
  pageNumber: number
  width: number
  height: number
  root: RefObject<HTMLDivElement | null>
}

/** One page placeholder; renders its canvas only while near the viewport. */
function PdfPage({ doc, pageNumber, width, height, root }: PdfPageProps) {
  const boxRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [near, setNear] = useState(false)
  const [rendered, setRendered] = useState(false)

  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), {
      root: root.current,
      rootMargin: '1200px 0px',
    })
    io.observe(el)
    return () => io.disconnect()
  }, [root])

  useEffect(() => {
    if (!near) return
    let task: RenderTask | null = null
    let cancelled = false
    void doc.getPage(pageNumber).then((p) => {
      const canvas = canvasRef.current
      if (cancelled || !canvas) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const base = p.getViewport({ scale: 1 })
      const viewport = p.getViewport({ scale: (width / base.width) * dpr })
      canvas.width = Math.floor(viewport.width)
      canvas.height = Math.floor(viewport.height)
      task = p.render({ canvas, viewport })
      task.promise.then(() => !cancelled && setRendered(true)).catch(() => {})
    })
    return () => {
      cancelled = true
      task?.cancel()
    }
  }, [near, doc, pageNumber, width])

  return (
    <div
      ref={boxRef}
      className={['page', near && rendered && 'page--rendered'].filter(Boolean).join(' ')}
      data-page={pageNumber}
      style={{ width, height }}
      aria-label={`Page ${pageNumber}`}
      role="img"
    >
      {near && <canvas ref={canvasRef} />}
    </div>
  )
}
