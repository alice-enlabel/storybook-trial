import type { BlockSpec } from './registry'

/**
 * An SST as data: which blocks, in which variant, in which order, with which
 * publisher content, plus the skin (token overrides) it wears. A new SST is a
 * new recipe file, not new components.
 */
export interface SstRecipe {
  id: string
  name: string
  description: string
  /** Skin id from ./skins (colours, font, radius). */
  skin: string
  header?: Extract<BlockSpec, { type: 'header' }>
  sections: BlockSpec[]
  footer?: Extract<BlockSpec, { type: 'footer' }>
}
