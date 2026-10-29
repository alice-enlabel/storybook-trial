import { useCallback, useEffect, useRef, useState } from 'react'
import {
  AppHeader,
  BackLink,
  Breadcrumb,
  Button,
  ContentHeader,
  IconButton,
  MediaPopover,
  Menu,
  TextField,
  type MenuEntry,
} from '../components/ui'
import { usePresence } from '../components/ui/usePresence'
import logo from '../assets/images/eifu-logo.png'
import { DocInfoPanel } from './DocInfoPanel'
import { PdfViewer } from './PdfViewer'
import { Ratings } from './Ratings'
import { RelatedDocs } from './RelatedDocs'
import { SiteFooter } from './SiteFooter'
import { useToast } from './Toast'
import type { ViewerDocument } from './document-data'

type Popover = 'qr' | 'actions' | null

/** Exit animation length for the info panel/sheet; matches --duration-panel. */
const PANEL_EXIT_MS = 240

export function DocumentPage({ doc }: { doc: ViewerDocument }) {
  const [infoOpen, setInfoOpen] = useState(false)
  const [popover, setPopover] = useState<Popover>(null)
  const [favorite, setFavorite] = useState(false)
  const { toast, toastRegion } = useToast()
  const panel = usePresence(infoOpen, PANEL_EXIT_MS)

  const infoRef = useRef<HTMLButtonElement>(null)
  const qrRef = useRef<HTMLButtonElement>(null)
  const actionsRef = useRef<HTMLButtonElement>(null)
  const triggersRef = useRef<HTMLDivElement>(null)

  const closePopover = useCallback(
    (returnFocus = true) => {
      const trigger = popover === 'qr' ? qrRef : actionsRef
      setPopover(null)
      if (returnFocus) trigger.current?.focus()
    },
    [popover],
  )

  const closeInfo = useCallback(() => {
    setInfoOpen(false)
    infoRef.current?.focus({ preventScroll: true })
  }, [])

  // One Escape handler: the open popover first, then the info panel.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (popover) closePopover()
      else if (infoOpen) closeInfo()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [popover, infoOpen, closePopover, closeInfo])

  useEffect(() => {
    if (!popover) return
    const onDown = (e: PointerEvent) => {
      if (!triggersRef.current?.contains(e.target as Node)) closePopover(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [popover, closePopover])

  const actions: MenuEntry[] = [
    { id: 'favorite', label: favorite ? 'Remove from favorites' : 'Add to favorites', icon: favorite ? 'favorite-filled' : 'favorite' },
    { id: 'print', label: 'Print', icon: 'print' },
    { id: 'download', label: 'Download', icon: 'download' },
    { id: 'email', label: 'Email document', icon: 'email' },
    { id: 'copy', label: 'Copy link', icon: 'copy-link' },
  ]

  const runAction = async (id: string) => {
    closePopover()
    switch (id) {
      case 'favorite':
        setFavorite((f) => !f)
        toast(favorite ? 'Removed from favorites' : 'Added to favorites')
        break
      case 'print':
        window.open(doc.pdfUrl, '_blank', 'noopener')
        toast('Opening print dialog…')
        break
      case 'download': {
        const a = document.createElement('a')
        a.href = doc.pdfUrl
        a.download = 'eIFU Comprehensive Guide.pdf'
        a.click()
        toast('Downloading eIFU Comprehensive Guide.pdf (319 KB)')
        break
      }
      case 'email':
        toast('Opening your email app…')
        window.location.href = `mailto:?subject=${encodeURIComponent(doc.title)}&body=${encodeURIComponent(window.location.href)}`
        break
      case 'copy':
        await copyText(window.location.href)
        toast('Link copied')
        break
    }
  }

  const copyCode = async (code: string) => {
    const ok = await copyText(code)
    toast(ok ? `Copied ${code}` : 'Press Ctrl+C to copy')
  }

  const { meta } = doc
  const metaLine = `${meta.format} · ${meta.pages} pages · ${meta.size} · Version ${meta.version} · Released ${meta.released}`
  const withInfo = panel.mounted && panel.state === 'open'

  return (
    <div className={['page', withInfo && 'page--info-open'].filter(Boolean).join(' ')}>
      <AppHeader logo={<img src={logo} alt="eIFU" width={198} height={100} className="page__logo" />} onMenu={() => toast('Site menu')} />

      <main className="page__main">
        <form
          className="search-card"
          role="search"
          onSubmit={(e) => {
            e.preventDefault()
            toast('Search runs on the live site; this prototype covers the document view.')
          }}
        >
          <div className="search-card__fields">
            <TextField label="Search Criteria 1" name="q1" />
            <TextField label="Search Criteria 2" name="q2" />
          </div>
          <Button variant="muted" icon="search" type="submit" block className="search-card__submit" aria-label="Search">
            <span className="search-card__submit-label">Search</span>
          </Button>
        </form>

        <div className="page__nav">
          <a href="#" className="page__nav-mobile">
            ‹ Documents
          </a>
          <div className="page__nav-desktop">
            <Breadcrumb items={doc.breadcrumb} />
            <BackLink href="#">Back to Search</BackLink>
          </div>
        </div>

        <div className="doc-header">
          <ContentHeader
            title={doc.title}
            meta={metaLine}
            actions={
              <div ref={triggersRef} className="doc-header__triggers">
                <IconButton
                  ref={infoRef}
                  icon="info"
                  label="Document Information"
                  selected={infoOpen}
                  hideTooltip={infoOpen}
                  aria-expanded={infoOpen}
                  aria-controls="docinfo"
                  onClick={() => {
                    setPopover(null)
                    setInfoOpen((o) => !o)
                  }}
                />
                <div className="doc-header__anchor">
                  <IconButton
                    ref={qrRef}
                    icon="qr-code"
                    label="QR Code"
                    selected={popover === 'qr'}
                    hideTooltip={popover === 'qr'}
                    aria-haspopup="dialog"
                    aria-expanded={popover === 'qr'}
                    aria-controls="qr-popover"
                    onClick={() => setPopover((p) => (p === 'qr' ? null : 'qr'))}
                  />
                  {popover === 'qr' && (
                    <MediaPopover
                      id="qr-popover"
                      label="Document QR code"
                      src={doc.qrCode}
                      alt={`QR code linking to ${doc.title}`}
                      downloadLabel="Download PNG"
                      downloadName="eIFU-Comprehensive-Guide-QR.png"
                      className="doc-header__popover"
                    />
                  )}
                </div>
                <div className="doc-header__anchor">
                  <IconButton
                    ref={actionsRef}
                    icon="more-vertical"
                    label="Actions"
                    className="doc-header__kebab ui-icon-button--tip-end"
                    selected={popover === 'actions'}
                    hideTooltip={popover === 'actions'}
                    aria-haspopup="menu"
                    aria-expanded={popover === 'actions'}
                    aria-controls="actions-menu"
                    onClick={() => setPopover((p) => (p === 'actions' ? null : 'actions'))}
                  />
                  {popover === 'actions' && (
                    <Menu
                      id="actions-menu"
                      label="Document actions"
                      items={actions}
                      onSelect={(id) => void runAction(id)}
                      onClose={closePopover}
                      className="doc-header__popover"
                    />
                  )}
                </div>
              </div>
            }
          />
        </div>

        <div className={['stage', withInfo && 'stage--with-info'].filter(Boolean).join(' ')}>
          <div className="stage__viewer">
            <PdfViewer url={doc.pdfUrl} title={doc.title} onToast={toast} />
          </div>
          <div className="stage__panel-slot">
            {panel.mounted && (
              <div id="docinfo" className="stage__panel" data-state={panel.state}>
                <DocInfoPanel doc={doc} onClose={closeInfo} onCopyCode={(c) => void copyCode(c)} />
              </div>
            )}
          </div>
        </div>

        <div className="below">
          <Ratings categories={doc.ratingCategories} onSubmit={() => toast('Thanks, your ratings were submitted')} />
          <RelatedDocs docs={doc.related} onAction={toast} />
        </div>
      </main>

      <SiteFooter columns={doc.footer} />

      {popover && <div className="scrim" aria-hidden="true" />}
      {toastRegion}
    </div>
  )
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
