/*
 * Skins: the colour / font / radius layer of an SST. A skin only overrides
 * design tokens (see _template.css); layout and blocks come from the recipe.
 *
 * In production a skin's CSS loads after the app CSS. Here each skin is a CSS
 * file imported as a string (?inline) and injected as one <style> tag at the end
 * of <head>, which reproduces that load order.
 */
import highContrast from './sample-high-contrast.css?inline'

export interface Skin {
  id: string
  title: string
  description: string
  /** Raw CSS. Empty for the default skin. */
  css: string
}

export const SKINS: Skin[] = [
  { id: 'default', title: 'Default', description: 'tokens.css with no override', css: '' },
  { id: 'sample-high-contrast', title: 'Sample: High Contrast', description: 'Black brand, white surfaces, square corners', css: highContrast },
]

export const DEFAULT_SKIN = 'default'

const STYLE_ID = 'sst-skin'

/** Swap the active skin stylesheet. Idempotent, so it is safe to call on every render. */
export function applySkin(id: string, doc: Document = document): Skin {
  const skin = SKINS.find((s) => s.id === id) ?? SKINS[0]
  let style = doc.getElementById(STYLE_ID) as HTMLStyleElement | null
  if (!style) {
    style = doc.createElement('style')
    style.id = STYLE_ID
  }
  // Always last in <head>, so the skin wins over app styles injected later (Vite HMR).
  doc.head.appendChild(style)
  if (style.textContent !== skin.css) style.textContent = skin.css
  doc.documentElement.dataset.skin = skin.id
  return skin
}
