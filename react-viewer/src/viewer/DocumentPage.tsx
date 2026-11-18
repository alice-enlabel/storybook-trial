import { useCallback, useEffect, useRef, useState } from 'react'
import { AppHeader } from '../components/ui'
import { usePresence } from '../components/ui/usePresence'
import logo from '../assets/images/eifu-logo.png'
import { DocInfoPanel } from './DocInfoPanel'
import { DocumentHeading, type DocumentActionId } from './DocumentHeading'
import { PdfViewer } from './PdfViewer'
import { Ratings } from './Ratings'
import { RelatedDocs } from './RelatedDocs'
import { SearchBlock } from '../sst/blocks/SearchBlock'
import { SiteFooter } from './SiteFooter'
import { copiedMessage, useToast } from './Toast'
import type { ViewerDocument } from './document-data'

/** Exit animation length for the info panel/sheet; matches --duration-panel. */
const PANEL_EXIT_MS = 240

export function DocumentPage({ doc }: { doc: ViewerDocument }) {
  const [infoOpen, setInfoOpen] = useState(false)
  const [favorite, setFavorite] = useState(false)
  const { toast, toastRegion } = useToast()
  const panel = usePresence(infoOpen, PANEL_EXIT_MS)

  const infoRef = useRef<HTMLButtonElement>(null)

  const closeInfo = useCallback(() => {
    setInfoOpen(false)
    infoRef.current?.focus({ preventScroll: true })
  }, [])

  // Escape closes the info panel. DocumentHeading handles Escape first while a popover is open.
  useEffect(() => {
    if (!infoOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeInfo()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [infoOpen, closeInfo])

  const runAction = async (id: DocumentActionId) => {
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
      case 'paper':
        toast('Paper copy requested. It will ship within 7 days.')
        break
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
    toast(ok ? copiedMessage(code) : `Couldn't copy ${code}. Select the code to copy it.`)
  }

  const withInfo = panel.mounted && panel.state === 'open'

  return (
    <div className={['doc-page', withInfo && 'doc-page--info-open'].filter(Boolean).join(' ')}>
      <AppHeader logo={<img src={logo} alt="eIFU" width={198} height={100} className="page__logo" />} onMenu={() => toast('Site menu')} />

      <main className="page__main">
        <div className="page__search">
          <SearchBlock
            variant="criteria"
            fields={['Search Criteria 1', 'Search Criteria 2']}
            onSearch={() => toast('Search runs on the live site; this prototype covers the document view.')}
          />
        </div>

        <DocumentHeading
          doc={doc}
          infoOpen={infoOpen}
          onToggleInfo={() => setInfoOpen((o) => !o)}
          infoRef={infoRef}
          favorite={favorite}
          onAction={(id) => void runAction(id)}
        />

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
