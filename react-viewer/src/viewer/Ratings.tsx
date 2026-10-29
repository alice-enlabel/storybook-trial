import { useId, useState } from 'react'
import { Icon } from '../components/ui'

function Star() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path className="star-path" d="M10 1.8l2.5 5.2 5.7.8-4.1 4 1 5.7L10 14.8l-5.1 2.7 1-5.7-4.1-4 5.7-.8z" />
    </svg>
  )
}

type StarGroupProps = {
  label: string
  value: number
  onChange: (n: number) => void
}

/** Five stars as an ARIA radiogroup with a hover preview. */
function StarGroup({ label, value, onChange }: StarGroupProps) {
  const [preview, setPreview] = useState<number | null>(null)
  const shown = preview ?? value
  return (
    <span className="stars" role="radiogroup" aria-label={label} onMouseLeave={() => setPreview(null)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          className={['star-btn', n <= shown && 'on'].filter(Boolean).join(' ')}
          onMouseEnter={() => setPreview(n)}
          onClick={() => onChange(n)}
        >
          <Star />
        </button>
      ))}
    </span>
  )
}

type RatingsProps = {
  categories: string[]
  onSubmit: () => void
}

/** Ratings (Figma "new SST themes" 214:3380, sized up 25% as in the prototype). */
export function Ratings({ categories, onSubmit }: RatingsProps) {
  const id = useId()
  const [open, setOpen] = useState(true)
  const [ratings, setRatings] = useState<Record<string, number>>(() => Object.fromEntries(categories.map((c) => [c, 0])))
  const [submitted, setSubmitted] = useState(false)

  const rated = categories.filter((c) => ratings[c])
  const avg = rated.length ? rated.reduce((sum, c) => sum + ratings[c], 0) / rated.length : 0
  const avgLabel = +avg.toFixed(1)

  return (
    <section className="ratings" aria-label="Ratings">
      <div className="rating-head">
        <button
          type="button"
          className="rating-toggle"
          aria-expanded={open}
          aria-controls={`${id}-categories`}
          onClick={() => setOpen((o) => !o)}
        >
          <Icon name="chevron-down" className="ui-chevron" />
          Average Rating:
        </button>
        <span className="avg">
          <span className="stars" role="img" aria-label={`Average rating ${avgLabel} out of 5`}>
            {[1, 2, 3, 4, 5].map((n) => (
              <span key={n} className={n <= Math.round(avg) ? 'on' : undefined}>
                <Star />
              </span>
            ))}
          </span>
          <span className="score">{avgLabel}/5</span>
        </span>
      </div>
      <div id={`${id}-categories`} className="categories" hidden={!open}>
        <h3>Categories</h3>
        <dl>
          {categories.map((c) => (
            <div key={c} className="category">
              <dt>{c}:</dt>
              <dd>
                <StarGroup
                  label={c}
                  value={ratings[c]}
                  onChange={(n) => {
                    setRatings((r) => ({ ...r, [c]: n }))
                    setSubmitted(false)
                  }}
                />
                <span className="score">{ratings[c]}/5</span>
              </dd>
            </div>
          ))}
        </dl>
        <button
          type="button"
          className="submit-ratings"
          disabled={!rated.length || submitted}
          onClick={() => {
            setSubmitted(true)
            onSubmit()
          }}
        >
          Submit Your Ratings
        </button>
      </div>
    </section>
  )
}
