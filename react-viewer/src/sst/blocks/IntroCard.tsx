import logo from '../../assets/images/eifu-logo.png'
import { blockParts, blockRoot } from '../parts'

export type IntroCardProps = {
  heading: string
  text: string
  logoSrc?: string
  /** Name under the logo tile, e.g. the subscriber brand. */
  logoCaption?: string
  idBase?: string
}

/** Logo tile beside a heading and paragraph (Figma simple SST 35:85, "Instructions for Use"). */
export function IntroCard({ heading, text, logoSrc = logo, logoCaption, idBase = 'intro' }: IntroCardProps) {
  const p = blockParts(idBase)
  return (
    <section {...blockRoot(p, 'intro')} aria-labelledby={p('heading')}>
      <figure className="sst-intro__logo" id={p('logo')}>
        <img src={logoSrc} alt="" />
        {logoCaption && <figcaption>{logoCaption}</figcaption>}
      </figure>
      <div className="sst-intro__body">
        <h2 id={p('heading')}>{heading}</h2>
        <p id={p('text')}>{text}</p>
      </div>
    </section>
  )
}
