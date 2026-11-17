import { useState } from 'react'
import { Icon } from '../../components/ui/Icon'
import { blockParts, blockRoot } from '../parts'

export type ResourceLink = { title: string; blurb: string }
export type Faq = { question: string; answer: string }

export type ResourcesProps = {
  heading?: string
  links?: ResourceLink[]
  faqs?: Faq[]
  linksHeading?: string
  faqHeading?: string
  idBase?: string
}

/** Publisher-configured useful links beside an FAQ accordion (Figma new SST "Additional Resources"). */
export function Resources({
  heading = 'Additional Resources',
  links = [],
  faqs = [],
  linksHeading = 'Useful Links',
  faqHeading = 'FAQ',
  idBase = 'resources',
}: ResourcesProps) {
  const p = blockParts(idBase)
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section {...blockRoot(p, 'resources')} aria-labelledby={p('title')}>
      <h2 className="sst-section-title" id={p('title')}>
        {heading}
      </h2>
      <div className="sst-resources__grid">
        {links.length > 0 && (
          <div id={p('links')}>
            <h3 className="sst-resources__sub">{linksHeading}</h3>
            <ul className="sst-resources__links">
              {links.map((l) => (
                <li key={l.title}>
                  <a href="#" className="sst-resources__link">
                    <span className="sst-resources__link-icon" aria-hidden>
                      ✦
                    </span>
                    <span>
                      <strong>{l.title}</strong>
                      <span>{l.blurb}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        {faqs.length > 0 && (
          <div id={p('faq')}>
            <h3 className="sst-resources__sub">{faqHeading}</h3>
            <ul className="sst-resources__faq">
              {faqs.map((f, i) => {
                const expanded = open === i
                const answerId = p(`faq_${i}_answer`)
                return (
                  <li key={f.question}>
                    <button type="button" aria-expanded={expanded} aria-controls={answerId} onClick={() => setOpen(expanded ? null : i)}>
                      <span>{f.question}</span>
                      <Icon name="chevron-down" size={14} className={expanded ? 'is-flipped' : undefined} />
                    </button>
                    <p id={answerId} hidden={!expanded}>
                      {f.answer}
                    </p>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
