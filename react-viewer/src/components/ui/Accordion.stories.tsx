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
  decorators: [(Story) => <div style={{ maxWidth: 420 }}>{Story()}</div>],
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
