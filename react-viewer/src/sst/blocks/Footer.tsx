import { SiteFooter } from '../../viewer/SiteFooter'
import { blockParts, blockRoot } from '../parts'

export type FooterProps = {
  columns: { heading: string; links: string[] }[]
  idBase?: string
}

/** Publisher footer columns. Wraps the viewer's SiteFooter so both pages share one footer. */
export function Footer({ columns, idBase = 'footer' }: FooterProps) {
  const p = blockParts(idBase)
  return (
    <div {...blockRoot(p, 'footer')}>
      <SiteFooter columns={columns} />
    </div>
  )
}
