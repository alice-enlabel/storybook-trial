import cover from '../../assets/images/related-cover.png'
import { Icon } from '../../components/ui/Icon'
import { blockParts, blockRoot } from '../parts'

export type ShelfDocument = { title: string; path?: string; coverUrl?: string }

export type DocumentShelfProps = {
  heading?: string
  documents: ShelfDocument[]
  idBase?: string
}

/** Horizontal row of document cards (Figma new SST "Recently Published", `document card/Variant3`). */
export function DocumentShelf({ heading = 'Recently Published', documents, idBase = 'shelf' }: DocumentShelfProps) {
  const p = blockParts(idBase)
  return (
    <section {...blockRoot(p, 'shelf')} aria-labelledby={p('title')}>
      <h2 className="sst-section-title" id={p('title')}>
        {heading}
      </h2>
      <ul className="sst-shelf__track" id={p('track')}>
        {documents.map((d, i) => (
          <li key={`${d.title}-${i}`} className="sst-shelf__card">
            <img src={d.coverUrl ?? cover} alt="" className="sst-shelf__cover" />
            <div className="sst-shelf__meta">
              {d.path && <p className="sst-shelf__path">{d.path}</p>}
              <a href="#" className="sst-shelf__name">
                {d.title}
              </a>
              <div className="sst-shelf__actions">
                <button type="button" aria-label={`Favorite ${d.title}`}>
                  <Icon name="favorite" size={20} />
                </button>
                <button type="button" aria-label={`QR code for ${d.title}`}>
                  <Icon name="qr-code" size={20} />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
