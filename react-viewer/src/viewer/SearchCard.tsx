import { useState } from 'react'
import { Button, TextField } from '../components/ui'

/**
 * Document search form above the viewer. Mobile: stacked fields and an
 * icon-only 86×40 submit. Desktop (≥900px): two columns and a full-width
 * labelled submit. The submit stays disabled (grey) until either field has
 * text, then turns eIFU teal with white text.
 */
export function SearchCard({ onSearch }: { onSearch: () => void }) {
  const [hasQuery, setHasQuery] = useState(false)
  return (
    <form
      className="search-card"
      role="search"
      onChange={(e) =>
        setHasQuery([...new FormData(e.currentTarget).values()].some((v) => String(v).trim() !== ''))
      }
      onSubmit={(e) => {
        e.preventDefault()
        onSearch()
      }}
    >
      <div className="search-card__fields">
        <TextField label="Search Criteria 1" name="q1" />
        <TextField label="Search Criteria 2" name="q2" />
      </div>
      <Button
        variant="primary"
        icon="search"
        type="submit"
        block
        disabled={!hasQuery}
        className="search-card__submit"
        aria-label="Search"
      >
        <span className="search-card__submit-label">Search</span>
      </Button>
    </form>
  )
}
