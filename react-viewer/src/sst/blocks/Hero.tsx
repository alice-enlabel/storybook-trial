import type { ReactNode } from 'react'
import { blockParts, blockRoot } from '../parts'

export type HeroProps = {
  /**
   * `brand`: solid brand colour, left-aligned copy (live SimpleModernSST).
   * `image`: photo under a dark scrim (Figma new SST 157:2834).
   * `wordmark`: soft gradient with the brand name set huge at the bottom (Figma simple SST 35:85).
   */
  variant: 'brand' | 'image' | 'wordmark'
  title?: string
  subtitle?: string
  blurb?: string
  /** `image` background. A neutral gradient stands in when omitted. */
  imageUrl?: string
  /** `wordmark` text. */
  wordmark?: string
  /** Usually a SearchBlock; the page renderer passes nested blocks here. */
  children?: ReactNode
  idBase?: string
}

export function Hero({ variant, title, subtitle, blurb, imageUrl, wordmark, children, idBase = 'hero' }: HeroProps) {
  const p = blockParts(idBase)
  const style = variant === 'image' && imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined
  return (
    <section {...blockRoot(p, 'hero', variant)} style={style} aria-labelledby={title ? p('title') : undefined}>
      <div className="sst-hero__inner" id={p('inner')}>
        {title && (
          <h2 className="sst-hero__title" id={p('title')}>
            {title}
          </h2>
        )}
        {variant === 'brand' && title && <hr className="sst-hero__rule" id={p('rule')} />}
        {subtitle && (
          <p className="sst-hero__subtitle" id={p('subtitle')}>
            {subtitle}
          </p>
        )}
        {blurb && (
          <p className="sst-hero__blurb" id={p('blurb')}>
            {blurb}
          </p>
        )}
        {children && (
          <div className="sst-hero__slot" id={p('slot')}>
            {children}
          </div>
        )}
      </div>
      {variant === 'wordmark' && wordmark && (
        <p className="sst-hero__wordmark" id={p('wordmark')} aria-hidden>
          {wordmark}
        </p>
      )}
    </section>
  )
}
