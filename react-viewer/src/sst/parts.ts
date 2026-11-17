/*
 * Styling hooks every SST block exposes.
 *
 * The live subscriber app gives each element a deterministic id,
 * `eifu_<component>_<part>` (e.g. eifu_search_bar_filtered_top_header), and SST
 * CSS files target those ids. Blocks keep that scheme so existing SST CSS keeps
 * working, and add `data-block` / `data-variant` on the root so new CSS can
 * target a block without depending on ids:
 *
 *   [data-block="hero"][data-variant="image"] { ... }
 *   #eifu_hero_title { ... }
 */
// Every block imports this module, so importing any block brings its styles.
import './sst.css'
export type PartFn = (part?: string) => string

/** `blockParts('hero')()` → "eifu_hero"; `blockParts('hero')('title')` → "eifu_hero_title". */
export function blockParts(base: string): PartFn {
  const root = `eifu_${base}`
  return (part?: string) => (part ? `${root}_${part}` : root)
}

/** Root attributes for a block: id plus the data hooks. */
export function blockRoot(p: PartFn, block: string, variant?: string) {
  return { id: p(), 'data-block': block, 'data-variant': variant, className: `sst-block sst-${block}` }
}
