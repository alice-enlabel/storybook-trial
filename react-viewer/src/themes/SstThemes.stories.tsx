import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { DocumentPage } from '../viewer/DocumentPage'
import { sampleDocument } from '../viewer/document-data'
import baseTokens from '../styles/tokens.css?inline'
import { SST_THEMES, type SstTheme } from './sst'

/*
 * SST themes are CSS only: each one overrides design tokens (see sst/_template.css).
 * The toolbar's SST switch re-themes every story; the stories here are the
 * per-theme checks that run in CI (vitest + a11y), one full page per SST.
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

function TokenReport({ theme }: { theme: SstTheme }) {
  const overrides = declaredTokens(theme.css)
  const root = getComputedStyle(document.documentElement)
  const rows = [...BASE.keys()].map((name) => ({
    name,
    base: BASE.get(name)!,
    resolved: root.getPropertyValue(name).trim(),
    overridden: overrides.has(name),
  }))
  const isColor = (name: string) => name.startsWith('--color-')

  return (
    <div style={{ font: '14px/1.4 system-ui, sans-serif', color: '#202020', padding: 16 }}>
      <h1 style={{ font: '700 20px system-ui, sans-serif', margin: '0 0 4px' }}>{theme.title}</h1>
      <p style={{ margin: '0 0 16px', color: '#5b6b75' }}>
        {theme.description}. {overrides.size} of {BASE.size} tokens overridden. Switch SST in the toolbar.
      </p>
      <table style={{ borderCollapse: 'collapse', width: '100%', maxWidth: 900 }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #cecece' }}>
            <th style={{ padding: 6 }}>Token</th>
            <th style={{ padding: 6 }}>eIFU base</th>
            <th style={{ padding: 6 }}>Resolved in this SST</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.name}
              data-overridden={r.overridden || undefined}
              style={{ borderBottom: '1px solid #e4e9ec', background: r.overridden ? '#fff6d6' : undefined }}
            >
              <td style={{ padding: 6, fontFamily: 'ui-monospace, monospace' }}>
                {r.name}
                {r.overridden && <strong> · SST</strong>}
              </td>
              <td style={{ padding: 6, fontFamily: 'ui-monospace, monospace' }}>{r.base}</td>
              <td style={{ padding: 6, fontFamily: 'ui-monospace, monospace' }}>
                {isColor(r.name) && (
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
  title: 'SST Themes',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/** Every token with its base value and what the toolbar's SST resolves it to. Overrides are highlighted. */
export const Tokens: Story = {
  render: (_args, { globals }) => (
    <TokenReport theme={SST_THEMES.find((t) => t.id === globals.sst) ?? SST_THEMES[0]} />
  ),
}

/** Full desktop page in one SST. The play test proves the SST's brand colour reaches a real component. */
function pageStory(theme: SstTheme): Story {
  return {
    name: theme.title,
    globals: { sst: theme.id, viewport: { value: 'desktop', isRotated: false } },
    render: () => <DocumentPage doc={sampleDocument} />,
    play: async ({ canvasElement, step }) => {
      const canvas = within(canvasElement)
      const brand = declaredTokens(theme.css).get('--color-brand-primary') ?? BASE.get('--color-brand-primary')!

      await step('SST stylesheet is active and loaded last', async () => {
        await expect(document.documentElement.dataset.sst).toBe(theme.id)
        await expect(document.head.lastElementChild?.id).toBe('sst-theme')
      })

      await step('primary button uses the SST brand colour', async () => {
        await userEvent.type(canvas.getByLabelText('Search Criteria 1'), 'Catheter')
        const submit = canvas.getByRole('button', { name: 'Search' })
        await expect(submit).toBeEnabled()
        // The button fades background-color, so wait out the transition.
        await waitFor(() => expect(getComputedStyle(submit).backgroundColor).toBe(hexToRgb(brand)))
      })
    },
  }
}

export const Eifu = pageStory(SST_THEMES[0])
export const ClinicalNavy = pageStory(SST_THEMES[1])
export const WarmRounded = pageStory(SST_THEMES[2])
export const HighContrast = pageStory(SST_THEMES[3])
