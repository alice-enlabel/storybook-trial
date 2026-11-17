import { useState } from 'react'
import { Icon } from '../../components/ui/Icon'
import { blockParts, blockRoot } from '../parts'

export type TreeNode = { label: string; children?: TreeNode[] }

export type HierarchyTreeProps = {
  heading?: string
  /** Enterprise name shown above the tree (Figma search results). */
  rootLabel?: string
  nodes: TreeNode[]
  /** Labels expanded on first render. */
  defaultExpanded?: string[]
  selected?: string
  onSelect?: (label: string) => void
  idBase?: string
}

/** Collapsible publisher hierarchy (live Hierarchy SST, Figma new SST search results). */
export function HierarchyTree({
  heading = 'Hierarchy',
  rootLabel,
  nodes,
  defaultExpanded = [],
  selected: selectedProp,
  onSelect,
  idBase = 'hierarchy',
}: HierarchyTreeProps) {
  const p = blockParts(idBase)
  const [expanded, setExpanded] = useState(() => new Set(defaultExpanded))
  const [selected, setSelected] = useState(selectedProp)
  const toggle = (label: string) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })

  const renderNodes = (list: TreeNode[], depth: number) => (
    // Nested lists of buttons rather than role="tree": a full ARIA tree needs
    // roving focus and arrow keys, which this browse-only list does not need.
    <ul className={depth === 0 ? 'sst-tree__list' : undefined}>
      {list.map((n) => {
        const hasKids = !!n.children?.length
        const isOpen = expanded.has(n.label)
        return (
          <li key={n.label}>
            <div className="sst-tree__row" style={{ paddingLeft: 8 + depth * 18 }}>
              {hasKids ? (
                <button
                  type="button"
                  className="sst-tree__toggle"
                  aria-expanded={isOpen}
                  aria-label={n.label}
                  onClick={() => toggle(n.label)}
                >
                  <Icon name="chevron-down" size={12} className={isOpen ? undefined : 'is-collapsed'} />
                </button>
              ) : (
                <span className="sst-tree__toggle" aria-hidden />
              )}
              <button
                type="button"
                className="sst-tree__label"
                aria-current={selected === n.label ? 'true' : undefined}
                onClick={() => {
                  setSelected(n.label)
                  onSelect?.(n.label)
                }}
              >
                {n.label}
              </button>
            </div>
            {hasKids && isOpen && renderNodes(n.children!, depth + 1)}
          </li>
        )
      })}
    </ul>
  )

  return (
    <section {...blockRoot(p, 'hierarchy')} aria-labelledby={p('title')}>
      <div className="sst-tree__head">
        <h2 className="sst-tree__title" id={p('title')}>
          {heading}
        </h2>
        <button type="button" className="sst-tree__collapse" id={p('collapse_all')} onClick={() => setExpanded(new Set())}>
          Collapse All
        </button>
      </div>
      <div className="sst-tree__panel" id={p('panel')}>
        {rootLabel && <p className="sst-tree__root">{rootLabel}</p>}
        {renderNodes(nodes, 0)}
      </div>
    </section>
  )
}
