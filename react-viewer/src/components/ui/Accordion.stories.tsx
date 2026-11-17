import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Accordion } from './overlays'
import { CopyCodeList } from './actions'
import { ChipGroup } from './data-display'

/**
 * Disclosure section. Parts:
 * - **Header**: heading text, optional **Badge** with the number of items
 *   inside, and a chevron that rotates when open. The whole header is one
 *   button with `aria-expanded`.
 * - **Content**: any children; it slides open and is `inert` while closed.
 */
const meta = {
  title: 'Generic UI/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    title: 'Accordion Heading',
    count: 3,
    defaultOpen: false,
    children: <p style={{ margin: 0 }}>Accordion content. Any element can go here.</p>,
  },
  argTypes: {
    count: { control: 'number', description: 'Shows a Badge with the number of items inside. Omit to hide it.' },
    children: { control: false },
  },
  decorators: [(Story, { parameters }) => (parameters.fullWidth ? Story() : <div style={{ maxWidth: 420 }}>{Story()}</div>)],
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

export const Collapsed: Story = {}

export const Expanded: Story = { args: { defaultOpen: true } }

/** Leave `count` out when the number of items is not useful. */
export const WithoutCount: Story = { args: { count: undefined } }

/** Clicking the header toggles the content and `aria-expanded`. */
export const Toggle: Story = {
  play: async ({ canvasElement }) => {
    const header = within(canvasElement).getByRole('button', { name: /Accordion Heading/ })
    await expect(header).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(header)
    await expect(header).toHaveAttribute('aria-expanded', 'true')
  },
}

/**
 * Content pattern: product codes. The Badge counts the codes. Each code is a
 * Copy Code: hover or focus shows the copy icon on a grey fill; a click copies
 * it to the clipboard, turns it teal for 1.2s, and the page confirms with a
 * toast ("Copied RPTR071128"). Codes wrap onto as many lines as needed.
 */
export const ProductCodes: Story = {
  args: {
    title: 'Product Codes',
    count: 6,
    defaultOpen: true,
    children: (
      <CopyCodeList
        codes={['RPTR071128', 'RPTR071132', 'RPTR074120', 'RPTR074124', 'RPTR074128', 'RPTR074132']}
        kind="product code"
        onCopy={fn()}
      />
    ),
  },
}

/**
 * Content pattern: languages covered. The Badge counts the languages; each
 * language is a read-only Chip, in a Chip Group that wraps. Opens expanded by
 * default in the doc info panel.
 */
export const LanguagesCovered: Story = {
  args: {
    title: 'Languages Covered',
    count: 3,
    defaultOpen: true,
    children: <ChipGroup items={['English', 'Mandarin', 'French']} label="Languages covered" />,
  },
}

/* Spacing specs ---------------------------------------------------------- */

type SpecRow = [part: string, value: string, note?: string]

const SHARED_SPECS: SpecRow[] = [
  ['Header padding', '16 top · 14 bottom · 0 sides', 'Content has no horizontal inset; it lines up with the heading.'],
  ['Title ↔ Badge gap', '10'],
  ['Header → first content row', '0', 'The header’s 14 bottom padding is the only space above the content.'],
  ['Last content row → divider', '14', 'margin-bottom on the content’s last child.'],
  ['Divider', '1px border-subtle'],
]

const LANGUAGE_SPECS: SpecRow[] = [
  ['Component', 'Chip Group of read-only Chips'],
  ['Chip padding', '2 top/bottom · 8 sides'],
  ['Chip height', '24', '14px text × 1.4 line height (19.6) + 4 padding'],
  ['Chip radius', '10'],
  ['Gap between chips', '6 (row and column)', 'Chips wrap onto new lines.'],
  ['Row pitch', '30', 'chip height + 6 gap'],
  ['Chip fill → heading edge', '0', 'The fill sits flush with the heading; the text is inset 8.'],
  ['Header text → chip text', '≈ 16', '14 header bottom padding + 2 chip padding'],
]

const CODE_SPECS: SpecRow[] = [
  ['Component', 'Copy Code List of Copy Codes'],
  ['Code padding', '5 top/bottom · 8 sides'],
  ['Code height', '30', '14px mono text × 1.4 (19.6) + 10 padding'],
  ['Code radius', '4'],
  ['Code ↔ copy icon gap', '8', 'Icon is 1.25em (17.5). On desktop it is hidden at rest but keeps its space, so the width does not change on hover.'],
  ['Gap between codes', '6 (row and column)', 'Equal columns fill the width. Each column is as wide as the longest code, and codes that do not fit move to the next row.'],
  ['Row pitch', '36', 'code height + 6 gap'],
  ['Code fill → heading edge', '0', 'Fill is transparent at rest, so the code text looks inset 8 from the heading.'],
  ['Header text → code text', '≈ 19', '14 header bottom padding + 5 code padding'],
]

function SpecTable({ caption, rows }: { caption: string; rows: SpecRow[] }) {
  const cell = { padding: '6px 10px', borderBottom: '1px solid var(--color-border-subtle)', verticalAlign: 'top' } as const
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', font: 'var(--type-caption)', color: 'var(--color-neutral-strongest)' }}>
      <caption style={{ textAlign: 'left', font: 'var(--type-label)', padding: '0 0 6px' }}>{caption}</caption>
      <thead>
        <tr style={{ textAlign: 'left', color: 'var(--color-text-secondary)' }}>
          <th style={cell}>Part</th>
          <th style={cell}>Value (px)</th>
          <th style={cell}>Note</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([part, value, note]) => (
          <tr key={part}>
            <td style={cell}>{part}</td>
            <td style={{ ...cell, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>{value}</td>
            <td style={{ ...cell, color: 'var(--color-text-secondary)' }}>{note}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/** Dashed outlines on each item's box and the content area, for the redline view. */
const REDLINE_CSS = `
.spec-redline .ui-accordion__inner { outline: 1px dashed #0b8dc6; outline-offset: -1px; }
.spec-redline .ui-chip,
.spec-redline .ui-copy-code { outline: 1px dashed #d6336c; outline-offset: -1px; }
.spec-redline .ui-copy-code .ui-icon { opacity: 1; }
`

const SPEC_LANGUAGES = ['English', 'Mandarin', 'French', 'German', 'Spanish', 'Italian', 'Japanese']
const SPEC_CODES = ['RPTR071128', 'RPTR071132', 'RPTR074120', 'RPTR074124', 'RPTR074128', 'RPTR074132']

/**
 * Spacing specs for the two accordion contents in the doc info panel,
 * **Languages Covered** (Chips) and **Product Codes** (Copy Codes), shown
 * side by side so the differences are easy to see.
 *
 * Both patterns use the same 6px wrap gap, and both sit with no horizontal
 * inset under the heading. They differ in item height (Chip 24, Copy Code 30),
 * so the row pitch is 30 for languages and 36 for codes. They also differ in
 * what touches the heading edge: a Chip's fill sits flush with it, but a Copy
 * Code's fill is transparent at rest, so its text reads as indented 8px.
 *
 * Pink dashes mark each item's box and blue dashes mark the content area. The
 * copy icons are forced visible here to show the space they reserve. All
 * values are px from `ui.css`, and the play test checks them against the
 * computed styles.
 */
export const SpacingSpecs: Story = {
  parameters: { fullWidth: true },
  render: () => (
    <div style={{ display: 'grid', gap: 32, maxWidth: 900 }}>
      <style>{REDLINE_CSS}</style>
      <SpecTable caption="Accordion (both patterns)" rows={SHARED_SPECS} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
        <div style={{ display: 'grid', gap: 16, alignContent: 'start' }}>
          <div className="spec-redline" data-spec="languages" style={{ maxWidth: 420 }}>
            <Accordion title="Languages Covered" count={SPEC_LANGUAGES.length} defaultOpen>
              <ChipGroup items={SPEC_LANGUAGES} label="Languages covered" />
            </Accordion>
          </div>
          <SpecTable caption="Languages Covered: Chip Group" rows={LANGUAGE_SPECS} />
        </div>
        <div style={{ display: 'grid', gap: 16, alignContent: 'start' }}>
          <div className="spec-redline" data-spec="codes" style={{ maxWidth: 420 }}>
            <Accordion title="Product Codes" count={SPEC_CODES.length} defaultOpen>
              <CopyCodeList codes={SPEC_CODES} kind="product code" onCopy={fn()} />
            </Accordion>
          </div>
          <SpecTable caption="Product Codes: Copy Code List" rows={CODE_SPECS} />
        </div>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const css = (sel: string) => {
      const el = canvasElement.querySelector(sel)
      if (!el) throw new Error(`Missing ${sel}`)
      return getComputedStyle(el)
    }
    const header = css('[data-spec="languages"] .ui-accordion__header')
    await expect([header.paddingTop, header.paddingBottom, header.paddingLeft]).toEqual(['16px', '14px', '0px'])
    await expect(css('[data-spec="languages"] .ui-accordion__title-group').columnGap).toBe('10px')
    await expect(css('[data-spec="languages"] .ui-accordion__inner > :last-child').marginBottom).toBe('14px')

    const group = css('.ui-chip-group')
    await expect([group.rowGap, group.columnGap]).toEqual(['6px', '6px'])
    const chip = css('.ui-chip')
    await expect([chip.paddingTop, chip.paddingLeft, chip.borderTopLeftRadius]).toEqual(['2px', '8px', '10px'])

    const list = css('.ui-copy-code-list')
    await expect([list.rowGap, list.columnGap]).toEqual(['6px', '6px'])
    const code = css('.ui-copy-code')
    await expect([code.paddingTop, code.paddingLeft, code.columnGap, code.borderTopLeftRadius]).toEqual(['5px', '8px', '8px', '4px'])

    const height = (sel: string) => Math.round(canvasElement.querySelector(sel)!.getBoundingClientRect().height)
    await expect(height('.ui-chip')).toBe(24)
    await expect(height('.ui-copy-code')).toBe(30)
  },
}
