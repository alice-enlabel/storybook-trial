import { useId, useState } from 'react'
import { Icon } from '../components/ui'
import line from '../assets/images/line.svg'
import defaultCover from '../assets/images/related-cover.png'

export type RelatedDoc = {
  title: string
  /** Hierarchy path above the title, e.g. "Hierarchy > Hierarchy 2". */
  crumb?: string
  /** Cover image. Default: the sample document cover. */
  cover?: string
  /** Stable key, for favourites. Default: the card's position. */
  id?: string
}

export type RelatedDocsProps = {
  docs: RelatedDoc[]
  /** Section heading: "Related" on the document page, "Recently Published" on an SST home. */
  heading?: string
  /** Feedback for card actions (open, favourite, QR), e.g. a toast. */
  onAction?: (message: string) => void
}

/**
 * The one document-card carousel: a heading over a rule, then a horizontal,
 * scroll-snapping row of cards (cover, hierarchy path, title, favourite and QR
 * buttons). Used by the document page and by SSTs as the `shelf` block.
 */
export function RelatedDocs({ docs, heading = 'Related', onAction = () => {} }: RelatedDocsProps) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const titleId = useId()

  const toggleFavorite = (id: string) => {
    const on = !favorites.has(id)
    setFavorites((prev) => {
      const next = new Set(prev)
      if (on) next.add(id)
      else next.delete(id)
      return next
    })
    onAction(on ? 'Added to favorites' : 'Removed from favorites')
  }

  return (
    // data-block: SST pages count and target blocks by it (this is the `shelf` block).
    <section className="related" data-block="shelf" aria-labelledby={titleId}>
      <div className="related-head">
        <h2 id={titleId}>{heading}</h2>
        <img src={line} alt="" width={1473} height={2} />
      </div>
      <div className="cards">
        {docs.map((d, i) => {
          const key = d.id ?? `doc-${i}`
          const fav = favorites.has(key)
          return (
            <article key={key} className="doc-card">
              <button type="button" className="open" aria-label={`Open ${d.title} ${i + 1}`} onClick={() => onAction('Opens this document')}>
                <img src={d.cover ?? defaultCover} alt="" width={244} height={351} loading="lazy" />
              </button>
              <div className="card-body">
                {d.crumb && <div className="crumb">{d.crumb}</div>}
                <h3 className="title">{d.title}</h3>
                <div className="card-actions">
                  <button
                    type="button"
                    className="fav"
                    aria-pressed={fav}
                    aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
                    title={fav ? 'Remove from favorites' : 'Add to favorites'}
                    onClick={() => toggleFavorite(key)}
                  >
                    <Icon name={fav ? 'favorite-filled' : 'favorite'} />
                  </button>
                  <button type="button" aria-label="Show QR code" title="QR code" onClick={() => onAction('Opens this document’s QR code')}>
                    <Icon name="qr-code" />
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
