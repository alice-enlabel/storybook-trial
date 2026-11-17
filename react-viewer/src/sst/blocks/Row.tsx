import type { ReactNode } from 'react'
import { blockParts, blockRoot } from '../parts'

export type RowProps = {
  /** CSS grid-template-columns at desktop width, e.g. "1fr 1fr" or "280px 1fr". Stacks below 900px. */
  columns?: string
  children?: ReactNode
  idBase?: string
}

/** Places blocks side by side (live Hierarchy: scan card beside text search). */
export function Row({ columns = '1fr 1fr', children, idBase = 'row' }: RowProps) {
  const p = blockParts(idBase)
  return (
    <div {...blockRoot(p, 'row')} style={{ ['--sst-row-columns' as string]: columns }}>
      {children}
    </div>
  )
}
