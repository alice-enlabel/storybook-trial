import { useEffect, useRef, useState } from 'react'
import {
  Accordion,
  Badge,
  Button,
  Chip,
  Icon,
  ContentCard,
  DescriptionItem,
  KeyValueList,
  KeyValueRow,
  PanelHeader,
  Select,
  TabBar,
  TextLink,
  type TabItem,
} from '../components/ui'
import type { ViewerDocument } from './document-data'

const TABS: TabItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'details', label: 'Details' },
  { id: 'notices', label: 'Notices' },
]

type DocInfoPanelProps = {
  doc: ViewerDocument
  onClose: () => void
  onCopyCode: (code: string) => void
}

/**
 * Document info: a side panel on desktop, a bottom sheet on mobile. The tabs
 * jump within the panel's own scroller and follow it (scroll-spy).
 */
export function DocInfoPanel({ doc, onClose, onCopyCode }: DocInfoPanelProps) {
  const [tab, setTab] = useState('overview')
  const [version, setVersion] = useState(doc.versions[0].value)
  const [showAll, setShowAll] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const rootRef = useRef<HTMLElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const jumping = useRef(false)

  // Opening moves focus to Close, as in the prototype.
  useEffect(() => {
    rootRef.current?.querySelector<HTMLElement>('.ui-panel-header .ui-text-link')?.focus({ preventScroll: true })
  }, [])

  useEffect(() => {
    const body = bodyRef.current
    if (!body) return
    const onScroll = () => {
      if (jumping.current) return
      const top = body.getBoundingClientRect().top
      let current = TABS[0].id
      for (const t of TABS) {
        const section = body.querySelector<HTMLElement>(`#docinfo-${t.id}`)
        if (section && section.getBoundingClientRect().top - top <= 24) current = t.id
      }
      if (body.scrollTop + body.clientHeight >= body.scrollHeight - 2) current = TABS[TABS.length - 1].id
      setTab(current)
    }
    body.addEventListener('scroll', onScroll, { passive: true })
    return () => body.removeEventListener('scroll', onScroll)
  }, [])

  const jumpTo = (id: string) => {
    const body = bodyRef.current
    const section = body?.querySelector<HTMLElement>(`#docinfo-${id}`)
    if (!body || !section) return
    setTab(id)
    jumping.current = true
    const top = section.getBoundingClientRect().top - body.getBoundingClientRect().top + body.scrollTop
    // Start after the tab re-render commits so it cannot interrupt the smooth scroll.
    requestAnimationFrame(() => body.scrollTo({ top, behavior: 'smooth' }))
    window.setTimeout(() => (jumping.current = false), 700)
  }

  return (
    <aside ref={rootRef} className="docinfo" aria-labelledby="docinfo-title">
      <div className="docinfo__head">
        <PanelHeader title="Document info" titleId="docinfo-title" onClose={onClose} />
        <TabBar tabs={TABS} active={tab} onSelect={jumpTo} label="Document info sections" controlsPrefix="docinfo" />
      </div>

      <div ref={bodyRef} className="docinfo__body">
        <section id="docinfo-overview" role="tabpanel" aria-label="Overview" className="docinfo__section docinfo__overview">
          <Select
            label="Version"
            options={doc.versions}
            value={version}
            onChange={setVersion}
            className="docinfo__version"
          />
          <DescriptionItem heading="Enterprise" className="docinfo__enterprise">
            {doc.enterprise}
          </DescriptionItem>
          <DescriptionItem heading="Article Summary" className="docinfo__summary">
            {doc.summary}
          </DescriptionItem>
          <div className="docinfo__qr">
            <h3 className="docinfo__subheading">QR code</h3>
            <img src={doc.qrCode} alt={`QR code linking to ${doc.title}`} />
            <TextLink href={doc.qrCode} download="eIFU-Comprehensive-Guide-QR.png" className="docinfo__qr-download">
              Download PNG
            </TextLink>
          </div>
        </section>

        <section id="docinfo-details" role="tabpanel" aria-label="Details" className="docinfo__section">
          <h3 className="docinfo__subheading">Document Metadata</h3>
          <KeyValueList>
            {[...doc.metadata, ...(showAll ? doc.extraMetadata : [])].map((row) => (
              <KeyValueRow key={row.label} label={row.label}>
                {row.href ? <a href={row.href}>{row.value}</a> : row.value}
              </KeyValueRow>
            ))}
          </KeyValueList>
          <Button variant="outline" onClick={() => setShowAll((s) => !s)} aria-expanded={showAll} className="docinfo__show-all">
            {showAll ? 'Show Fewer Fields' : 'Show All Fields'}
          </Button>
          <Accordion title="Product Codes" count={doc.productCodes.length}>
            <ul className="docinfo__codes">
              {doc.productCodes.map((code) => (
                <li key={code}>
                  <button
                    type="button"
                    className={['docinfo__code', copied === code && 'is-copied'].filter(Boolean).join(' ')}
                    onClick={() => {
                      onCopyCode(code)
                      setCopied(code)
                      window.setTimeout(() => setCopied((c) => (c === code ? null : c)), 1200)
                    }}
                    aria-label={`Copy product code ${code}`}
                  >
                    {code}
                    <Icon name="copy-link" size={14} />
                  </button>
                </li>
              ))}
            </ul>
          </Accordion>
          <Accordion title="Languages Covered" count={doc.languages.length} defaultOpen>
            <div className="docinfo__chips">
              {doc.languages.map((l) => (
                <Chip key={l}>{l}</Chip>
              ))}
            </div>
          </Accordion>
        </section>

        <section id="docinfo-notices" role="tabpanel" aria-label="Notices" className="docinfo__section">
          <h3 className="docinfo__subheading docinfo__notices-heading">
            Publisher Notices <Badge count={doc.notices.count} />
          </h3>
          <div className="docinfo__notices">
            <ContentCard>
              {doc.notices.contact.map((block) => (
                <div key={block.heading} className="docinfo__contact">
                  <strong>{block.heading}</strong>
                  {block.lines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </div>
              ))}
            </ContentCard>
            <ContentCard className="docinfo__legal">
              <a href={doc.notices.legalHref}>Legal Notice</a>
            </ContentCard>
            <ContentCard className="docinfo__watermark">
              <img src={doc.notices.watermark} alt="" />
              <span>Watermark</span>
            </ContentCard>
          </div>
        </section>
      </div>
    </aside>
  )
}
