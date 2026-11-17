import { blockParts, blockRoot } from '../parts'

export type LabelGuideProps = {
  /** Publisher-configurable heading ("How to Read Product Labels"). */
  heading: string
  /** One paragraph per entry. */
  text: string[]
  /** Publisher's annotated label image. A placeholder label stands in when omitted. */
  imageUrl?: string
  /** Callout drawn on the placeholder, e.g. "REF: 901234B". */
  callout?: string
  /** `image-left`: image beside text (new SST, simple SST). `image-top`: centred image, text below (live SimpleModernSST). */
  layout?: 'image-left' | 'image-top'
  idBase?: string
}

/** Annotated label image with instructions (live `label_guide`, Figma "How to Read Product Labels"). */
export function LabelGuide({ heading, text, imageUrl, callout = 'REF: 901234B', layout = 'image-left', idBase = 'label_guide' }: LabelGuideProps) {
  const p = blockParts(idBase)
  return (
    <section {...blockRoot(p, 'label-guide', layout)} aria-labelledby={p('title')}>
      <h2 className="sst-section-title" id={p('title')}>
        {heading}
      </h2>
      <div className="sst-label-guide__grid">
        <figure className="sst-label-guide__image" id={p('image')}>
          {imageUrl ? <img src={imageUrl} alt="Annotated product label" /> : <PlaceholderLabel callout={callout} />}
        </figure>
        <div className="sst-label-guide__text" id={p('text')}>
          {text.map((t) => (
            <p key={t}>{t}</p>
          ))}
        </div>
      </div>
    </section>
  )
}

function PlaceholderLabel({ callout }: { callout: string }) {
  return (
    <svg viewBox="0 0 360 220" role="img" aria-label={`Example product label with ${callout} highlighted`}>
      <rect x="10" y="50" width="250" height="150" rx="10" fill="#c9ced3" stroke="#2a4f8f" strokeWidth="5" />
      <rect x="28" y="66" width="140" height="10" rx="2" fill="#2a4f8f" />
      <rect x="28" y="86" width="200" height="14" rx="2" fill="#3b3f44" />
      <g fill="#3b3f44">
        {Array.from({ length: 14 }, (_, i) => (
          <rect key={i} x={28 + i * 5} y="116" width={i % 3 ? 2 : 3} height="36" />
        ))}
      </g>
      <rect x="110" y="114" width="70" height="14" fill="#fff" stroke="#d0021b" strokeWidth="2" />
      <text x="115" y="125" fontSize="9" fontFamily="Arial" fill="#111">
        {callout}
      </text>
      <rect x="110" y="136" width="120" height="6" fill="#7b8087" />
      <rect x="110" y="148" width="100" height="6" fill="#7b8087" />
      <rect x="28" y="170" width="200" height="6" fill="#7b8087" />
      <path d="M180 121 H300 V30" fill="none" stroke="#d0021b" strokeWidth="2" />
      <text x="262" y="22" fontSize="13" fontFamily="Arial" fill="#111">
        {callout}
      </text>
    </svg>
  )
}
