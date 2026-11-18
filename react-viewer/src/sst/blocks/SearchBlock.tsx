import { useState } from 'react'
import { Icon } from '../../components/ui/Icon'
import { TextField } from '../../components/ui/inputs'
import { blockParts, blockRoot } from '../parts'

export type SearchBlockProps = {
  /**
   * `bar`: one wide field with barcode and submit inside (SimpleModernSST, new SST hero).
   * `filtered`: "Text Search" card with one labelled field per criterion (live Hierarchy).
   * `card`: titled card with one field and an icon button (Figma simple SST 35:85).
   * `criteria`: untitled card of labelled fields (document page). Mobile: stacked
   *   fields and an icon-only 86x40 submit. Desktop (>=900px): two columns and a
   *   full-width labelled submit.
   */
  variant: 'bar' | 'filtered' | 'card' | 'criteria'
  /** Field labels. `bar` and `card` use the first one; `filtered` and `criteria` show them all. */
  fields?: string[]
  heading?: string
  submitLabel?: string
  /** Chips under the bar (Figma "Popular Suggestion"). */
  suggestions?: string[]
  /** Scan button inside the fields (`bar` and `filtered` only). */
  barcode?: boolean
  onSearch?: (values: string[]) => void
  idBase?: string
}

export function SearchBlock({
  variant,
  fields = ['Search'],
  heading = 'Text Search',
  submitLabel = 'Search',
  suggestions = [],
  barcode = true,
  onSearch,
  idBase,
}: SearchBlockProps) {
  const p = blockParts(idBase ?? (variant === 'filtered' ? 'search_bar_filtered' : 'search_bar'))
  const multi = variant === 'filtered' || variant === 'criteria'
  const shown = multi ? fields : fields.slice(0, 1)
  const [values, setValues] = useState(() => shown.map(() => ''))
  const hasQuery = values.some((v) => v.trim() !== '')
  const set = (i: number, v: string) => setValues((prev) => prev.map((x, j) => (j === i ? v : x)))

  return (
    <section {...blockRoot(p, 'search', variant)} aria-label={variant === 'bar' ? 'Search' : undefined}>
      <form
        className="sst-search__form"
        id={p('form')}
        onSubmit={(e) => {
          e.preventDefault()
          if (hasQuery) onSearch?.(values)
        }}
      >
        {variant === 'filtered' && (
          <div className="sst-search__top" id={p('top')}>
            <span className="sst-search__top-icon" id={p('top_icon')}>
              <Icon name="search" />
            </span>
            <h2 className="sst-search__heading" id={p('top_header')}>
              {heading}
            </h2>
          </div>
        )}
        {variant === 'card' && (
          <h2 className="sst-search__heading" id={p('top_header')}>
            {shown[0]}
          </h2>
        )}
        <div className="sst-search__inputs" id={p('form_inputs_search')}>
          {shown.map((label, i) => (
            <TextField
              key={label}
              className="sst-search__field"
              rootId={p(`input_text_${i}`)}
              id={p(`input_text_${i}_control`)}
              labelId={p(`input_text_${i}_label`)}
              label={label}
              showLabel={multi}
              leadingIcon={variant === 'bar' ? 'search' : undefined}
              scan={barcode && (variant === 'bar' || variant === 'filtered')}
              value={values[i]}
              placeholder={variant === 'bar' ? label : undefined}
              onChange={(e) => set(i, e.target.value)}
            />
          ))}
          <button
            type="submit"
            className="sst-search__submit"
            id={p('button_search')}
            disabled={!hasQuery}
            aria-label={variant === 'card' || variant === 'criteria' ? submitLabel : undefined}
          >
            <Icon name="search" />
            {variant !== 'card' && <span className="sst-search__submit-label">{submitLabel}</span>}
          </button>
        </div>
        {suggestions.length > 0 && (
          <ul className="sst-search__suggestions" id={p('suggestions')} aria-label="Popular searches">
            {suggestions.map((s) => (
              <li key={s}>
                <button type="button" onClick={() => set(0, s)}>
                  {s}
                </button>
              </li>
            ))}
          </ul>
        )}
      </form>
    </section>
  )
}

