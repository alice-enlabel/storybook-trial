import { useCallback, useEffect, useRef, useState, type Ref } from 'react'
import { BackLink, Breadcrumb, ContentHeader, IconButton, MediaPopover, Menu, type MenuEntry } from '../components/ui'
import type { ViewerDocument } from './document-data'

export type HeadingPopover = 'qr' | 'actions' | null

export type DocumentActionId = 'favorite' | 'print' | 'download' | 'paper' | 'email' | 'copy'

type DocumentHeadingProps = {
  doc: ViewerDocument
  /** Whether the Document Information panel is open; the info trigger shows selected. */
  infoOpen: boolean
  onToggleInfo: () => void
  /** The info trigger, so the page can return focus to it when the panel closes. */
  infoRef?: Ref<HTMLButtonElement>
  /** Drives the Favorites item's label and icon in the actions menu. */
  favorite: boolean
  /** Called with the chosen actions-menu item, after the menu closes. */
  onAction: (id: DocumentActionId) => void
  /** Popover open on first render (Storybook states). */
  initialPopover?: HeadingPopover
}

/**
 * Everything above the PDF: navigation (mobile "‹ Documents", desktop
 * breadcrumbs + Back to Search), the document title, the metadata line and the
 * action bar (Document Information, QR Code, Actions). The QR popover and the
 * actions menu open under their triggers; Escape or a click outside closes them.
 */
export function DocumentHeading({ doc, infoOpen, onToggleInfo, infoRef, favorite, onAction, initialPopover = null }: DocumentHeadingProps) {
  const [popover, setPopover] = useState<HeadingPopover>(initialPopover)
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

  // Capture phase, and the event stops here: Escape closes the popover before
  // the page's handler can also close the info panel.
  useEffect(() => {
    if (!popover) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      e.stopPropagation()
      closePopover()
    }
    const onDown = (e: PointerEvent) => {
      if (!triggersRef.current?.contains(e.target as Node)) closePopover(false)
    }
    document.addEventListener('keydown', onKey, true)
    document.addEventListener('pointerdown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey, true)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [popover, closePopover])

  const actions: MenuEntry[] = [
    { id: 'favorite', label: favorite ? 'Remove from favorites' : 'Add to favorites', icon: favorite ? 'favorite-filled' : 'favorite' },
    { id: 'print', label: 'Print', icon: 'print' },
    { id: 'download', label: 'Download', icon: 'download' },
    { id: 'paper', label: 'Request paper copy', icon: 'request-paper-copy' },
    { id: 'email', label: 'Email document', icon: 'email' },
    { id: 'copy', label: 'Copy link', icon: 'copy-link' },
  ]

  const { meta } = doc
  const metaLine = `${meta.format} · ${meta.pages} pages · ${meta.size} · Version ${meta.version} · Released ${meta.released}`

  return (
    <>
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
                  onToggleInfo()
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
                    onSelect={(id) => {
                      closePopover()
                      onAction(id as DocumentActionId)
                    }}
                    onClose={closePopover}
                    className="doc-header__popover"
                  />
                )}
              </div>
            </div>
          }
        />
      </div>

      {popover && <div className="scrim" aria-hidden="true" />}
    </>
  )
}
