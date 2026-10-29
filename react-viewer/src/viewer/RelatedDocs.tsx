import { useState } from 'react'
import { Icon } from '../components/ui'
import line from '../assets/images/line.svg'

type RelatedDoc = { id: string; title: string; crumb: string; cover: string }

type RelatedDocsProps = {
  docs: RelatedDoc[]
  onAction: (message: string) => void
}

/** Related documents: a horizontal, scroll-snapping row of cards. */
export function RelatedDocs({ docs, onAction }: RelatedDocsProps) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

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
    <section className="related" aria-labelledby="related-title">
      <div className="related-head">
        <h2 id="related-title">Related</h2>
        <img src={line} alt="" width={1473} height={2} />
      </div>
      <div className="cards">
        {docs.map((d, i) => {
          const fav = favorites.has(d.id)
          return (
            <article key={d.id} className="doc-card">
              <button type="button" className="open" aria-label={`Open ${d.title} ${i + 1}`} onClick={() => onAction('Opens this related document')}>
                <img src={d.cover} alt="" width={244} height={351} loading="lazy" />
              </button>
              <div className="card-body">
                <div className="crumb">{d.crumb}</div>
                <h3 className="title">{d.title}</h3>
                <div className="card-actions">
                  <button
                    type="button"
                    className="fav"
                    aria-pressed={fav}
                    aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
                    title={fav ? 'Remove from favorites' : 'Add to favorites'}
                    onClick={() => toggleFavorite(d.id)}
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
