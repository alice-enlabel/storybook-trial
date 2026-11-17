import { createElement, type ReactNode } from 'react'
import { BLOCKS, type BlockSpec } from './registry'
import type { SstRecipe } from './recipe'
import './sst.css'

function renderBlock(spec: BlockSpec, key: string | number): ReactNode {
  const component = BLOCKS[spec.type]
  if (!component) return null
  const children = spec.children?.map((child, i) => renderBlock(child, i))
  // The BlockSpec union guarantees props match the component for its type.
  return createElement(component as never, { key, ...spec.props } as never, children)
}

/** Renders an SST recipe: header, ordered sections, footer. The recipe is the whole template. */
export function SstPage({ recipe }: { recipe: SstRecipe }) {
  return (
    <div className="sst-page" data-sst={recipe.id}>
      {recipe.header && renderBlock(recipe.header, 'header')}
      <main className="sst-page__main">
        {recipe.sections.map((spec, i) => (
          <div key={i} className={`sst-band sst-band--${spec.width ?? (spec.type === 'hero' ? 'full' : 'contained')}`}>
            {renderBlock(spec, i)}
          </div>
        ))}
      </main>
      {recipe.footer && renderBlock(recipe.footer, 'footer')}
    </div>
  )
}
