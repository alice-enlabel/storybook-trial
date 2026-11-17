import { useRef } from 'react'
import { Icon } from '../../components/ui/Icon'
import { blockParts, blockRoot } from '../parts'

export type Category = { label: string; imageUrl?: string }

export type CategoryCarouselProps = {
  heading?: string
  categories: Category[]
  onSelect?: (label: string) => void
  idBase?: string
}

/** Scrollable row of category tiles with prev/next arrows (Figma new SST "Search by Category"). */
export function CategoryCarousel({ heading = 'Search by Category', categories, onSelect, idBase = 'categories' }: CategoryCarouselProps) {
  const p = blockParts(idBase)
  const track = useRef<HTMLUListElement>(null)
  const scroll = (dir: number) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.8, behavior: 'smooth' })
  return (
    <section {...blockRoot(p, 'categories')} aria-labelledby={p('title')}>
      <h2 className="sst-section-title sst-categories__title" id={p('title')}>
        {heading}
      </h2>
      <div className="sst-categories__band">
        <button type="button" className="sst-categories__arrow" aria-label="Previous categories" onClick={() => scroll(-1)}>
          <Icon name="arrow-left" />
        </button>
        <ul className="sst-categories__track" ref={track} id={p('track')}>
          {categories.map((c) => (
            <li key={c.label}>
              <button type="button" className="sst-categories__tile" onClick={() => onSelect?.(c.label)}>
                {c.imageUrl ? (
                  <img src={c.imageUrl} alt="" />
                ) : (
                  <span className="sst-categories__glyph" aria-hidden>
                    {c.label.slice(0, 1)}
                  </span>
                )}
                <span>{c.label}</span>
              </button>
            </li>
          ))}
        </ul>
        <button type="button" className="sst-categories__arrow sst-categories__arrow--next" aria-label="Next categories" onClick={() => scroll(1)}>
          <Icon name="arrow-left" />
        </button>
      </div>
    </section>
  )
}
