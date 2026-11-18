import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import baseTokens from '../styles/tokens.css?inline'
import { aliceSstConcept } from './recipes'
import { SKINS, type Skin } from './skins'
import { SstPage } from './SstPage'

/*
 * Skins are the colour / font / radius layer of an SST: token overrides only
 * (skins/_template.css). The toolbar's Skin switch re-skins every story; these
 * stories are the per-skin checks that run in CI (vitest + a11y).
 */

/** `--name: value` pairs declared in a CSS string, first occurrence wins. */
function declaredTokens(css: string): Map<string, string> {
  const tokens = new Map<string, string>()
  const noComments = css.replace(/\/\*[\s\S]*?\*\//g, '')
  for (const [, name, value] of noComments.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    if (!tokens.has(name)) tokens.set(name, value.trim())
  }
  return tokens
}

const BASE = declaredTokens(baseTokens)

function hexToRgb(hex: string): string {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h
  const n = parseInt(full, 16)
  return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`
}

function TokenReport({ skin }: { skin: Skin }) {
  const overrides = declaredTokens(skin.css)
  const root = getComputedStyle(document.documentElement)
  const rows = [...BASE.keys()].map((name) => ({
    name,
    base: BASE.get(name)!,
    resolved: root.getPropertyValue(name).trim(),
    overridden: overrides.has(name),
  }))

  return (
    <div style={{ font: '14px/1.4 system-ui, sans-serif', color: '#202020', padding: 16 }}>
      <h1 style={{ font: '700 20px system-ui, sans-serif', margin: '0 0 4px' }}>{skin.title}</h1>
      <p style={{ margin: '0 0 16px', color: '#5b6b75' }}>
        {skin.description}. {overrides.size} of {BASE.size} tokens overridden. Switch skin in the toolbar.
      </p>
      <table style={{ borderCollapse: 'collapse', width: '100%', maxWidth: 900 }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #cecece' }}>
            <th style={{ padding: 6 }}>Token</th>
            <th style={{ padding: 6 }}>Default</th>
            <th style={{ padding: 6 }}>Resolved in this skin</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} style={{ borderBottom: '1px solid #e4e9ec', background: r.overridden ? '#fff6d6' : undefined }}>
              <td style={{ padding: 6, fontFamily: 'ui-monospace, monospace' }}>
                {r.name}
                {r.overridden && <strong> · skin</strong>}
              </td>
              <td style={{ padding: 6, fontFamily: 'ui-monospace, monospace' }}>{r.base}</td>
              <td style={{ padding: 6, fontFamily: 'ui-monospace, monospace' }}>
                {r.name.startsWith('--color-') && (
                  <span
                    aria-hidden
                    style={{
                      display: 'inline-block', width: 14, height: 14, marginRight: 6, verticalAlign: -2,
                      border: '1px solid #8a8a8a', background: r.resolved,
                    }}
                  />
                )}
                {r.resolved}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const meta = {
  title: 'SST/Skins',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/** Every token with its base value and what the toolbar's skin resolves it to. Overrides are highlighted. */
export const Tokens: Story = {
  render: (_args, { globals }) => <TokenReport skin={SKINS.find((s) => s.id === globals.skin) ?? SKINS[0]} />,
}

/** The Alice SST Concept page in one skin. The play test proves the skin's brand colour reaches a block. */
function skinStory(skin: Skin): Story {
  return {
    name: skin.title,
    globals: { skin: skin.id, viewport: { value: 'desktop', isRotated: false } },
    render: () => <SstPage recipe={aliceSstConcept} />,
    play: async ({ canvasElement, step }) => {
      const canvas = within(canvasElement)
      const brand = declaredTokens(skin.css).get('--color-brand-primary') ?? BASE.get('--color-brand-primary')!

      await step('skin stylesheet is active and loaded last', async () => {
        await expect(document.documentElement.dataset.skin).toBe(skin.id)
        await expect(document.head.lastElementChild?.id).toBe('sst-skin')
      })

      await step('search submit uses the skin brand colour', async () => {
        await userEvent.type(canvas.getByLabelText('SKU Number'), 'RPTR071128')
        const submit = canvas.getByRole('button', { name: 'Enter' })
        await expect(submit).toBeEnabled()
        await waitFor(() => expect(getComputedStyle(submit).backgroundColor).toBe(hexToRgb(brand)))
      })
    },
  }
}

const skin = (id: string) => SKINS.find((s) => s.id === id)!

export const Default = skinStory(skin('default'))
export const HighContrast = skinStory(skin('sample-high-contrast'))
