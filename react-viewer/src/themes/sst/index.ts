/*
 * SST (Subscriber Site Template) themes for the viewer.
 *
 * In production an SST's CSS is loaded after the viewer's base CSS. Here each
 * theme is a CSS file imported as a string (?inline) and injected as one
 * <style> tag after the app styles, which reproduces that load order. Add a real
 * subscriber by copying _template.css and adding an entry below.
 */
import highContrast from './sample-high-contrast.css?inline'
import clinicalNavy from './sample-clinical-navy.css?inline'
import warmRounded from './sample-warm-rounded.css?inline'

export interface SstTheme {
  id: string
  title: string
  description: string
  /** Raw CSS. Empty for the base eIFU theme. */
  css: string
}

export const SST_THEMES: SstTheme[] = [
  { id: 'eifu', title: 'eIFU (base)', description: 'tokens.css with no SST override', css: '' },
  { id: 'sample-clinical-navy', title: 'Sample: Clinical Navy', description: 'Navy brand, serif face', css: clinicalNavy },
  { id: 'sample-warm-rounded', title: 'Sample: Warm Rounded', description: 'Warm brand and neutrals, large radii', css: warmRounded },
  { id: 'sample-high-contrast', title: 'Sample: High Contrast', description: 'Black brand, white surfaces, square corners', css: highContrast },
]

export const DEFAULT_SST = 'eifu'

const STYLE_ID = 'sst-theme'

/** Swap the active SST stylesheet. Idempotent, so it is safe to call on every render. */
export function applySstTheme(id: string, doc: Document = document): SstTheme {
  const theme = SST_THEMES.find((t) => t.id === id) ?? SST_THEMES[0]
  let style = doc.getElementById(STYLE_ID) as HTMLStyleElement | null
  if (!style) {
    style = doc.createElement('style')
    style.id = STYLE_ID
  }
  // Always last in <head>, so the SST wins over app styles injected later (Vite HMR).
  doc.head.appendChild(style)
  if (style.textContent !== theme.css) style.textContent = theme.css
  doc.documentElement.dataset.sst = theme.id
  return theme
}
