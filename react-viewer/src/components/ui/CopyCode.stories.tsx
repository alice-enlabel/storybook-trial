import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { copiedMessage, useToast } from '../../viewer/Toast'
import { CopyCode, CopyCodeList } from './actions'

/**
 * A code value (e.g. a product code) that copies itself on click.
 *
 * | State | Looks | When |
 * |---|---|---|
 * | Default | Monospace text, no fill, icon hidden | At rest |
 * | Hover / Focus | Grey fill, copy icon shown | Pointer over it or keyboard focus |
 * | Copied | eIFU teal fill, white text and icon | 1.2s after a click |
 *
 * Mobile and touch (under 900px wide, or no hover) have no hover state:
 *
 * | State | Looks | When |
 * |---|---|---|
 * | Default | Monospace text, no fill, copy icon always shown | At rest |
 * | Tapped / Copied | Darker grey fill, darkened icon, toast "Copied {code} to your clipboard" | While pressed and 1.2s after the tap |
 *
 * `onCopy` does the clipboard write and the confirmation toast; the component
 * only shows the Copied state. Its accessible name is "Copy {kind} {code}".
 */
const meta = {
  title: 'Generic UI/Actions/Copy Code',
  component: CopyCode,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { code: 'RPTR071128', kind: 'product code', onCopy: fn() },
} satisfies Meta<typeof CopyCode>

export default meta
type Story = StoryObj<typeof meta>

/** Hover or tab to it to see the grey fill and copy icon. */
export const Default: Story = {}

/** After a click: teal for 1.2s, then back to Default. */
export const Copied: Story = {
  play: async ({ canvasElement, args }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Copy product code RPTR071128' })
    await userEvent.click(button)
    await expect(args.onCopy).toHaveBeenCalledWith('RPTR071128')
    await expect(button).toHaveClass('ui-copy-code--copied')
  },
}

/**
 * Code length varies by enterprise and product. Columns are as wide as the
 * longest code and stretch to fill the container, and codes that don't fit
 * move to the next row. Resize the canvas to see the column count change.
 */
export const MixedLengths: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 24 }}>
      {[
        ['A12', 'B7', 'C405', 'D9', 'E3310', 'F2', 'G88'],
        ['RPTR071128', 'RPTR071132', 'RPTR074120', 'RPTR074124', 'RPTR074128'],
        ['MDX-4471-02-EU', 'MDX-4471-02-US', 'MDX-4471-10-JP', 'MDX-88-A'],
      ].map((codes) => (
        <div key={codes[0]} style={{ maxWidth: 420, outline: '1px dashed #0b8dc6' }}>
          <CopyCodeList codes={codes} kind={args.kind} onCopy={args.onCopy} />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const list of canvasElement.querySelectorAll('.ui-copy-code-list')) {
      const box = list.getBoundingClientRect()
      const items = [...list.querySelectorAll('li')].map((li) => li.getBoundingClientRect())
      const firstRow = items.filter((r) => Math.abs(r.top - items[0].top) < 1)
      // The first row's codes fill the container width.
      await expect(Math.round(firstRow[firstRow.length - 1].right)).toBe(Math.round(box.right))
      // No code is clipped: each button fits its text.
      for (const button of list.querySelectorAll('button')) {
        await expect(button.scrollWidth).toBeLessThanOrEqual(button.clientWidth)
      }
    }
  },
}

/** Several codes wrap onto as many lines as the container needs. */
export const List: Story = {
  render: (args) => (
    <div style={{ maxWidth: 360 }}>
      <CopyCodeList
        codes={['RPTR071128', 'RPTR071132', 'RPTR074120', 'RPTR074124', 'RPTR074128']}
        kind={args.kind}
        onCopy={args.onCopy}
      />
    </div>
  ),
}

/** Phone: the app's toast confirms each copy, as on the document page. */
function MobileDemo({ codes, kind, onCopy }: { codes: string[]; kind?: string; onCopy: (code: string) => void }) {
  const { toast, toastRegion } = useToast()
  return (
    <div style={{ padding: 16 }}>
      <CopyCodeList
        codes={codes}
        kind={kind}
        onCopy={(code) => {
          onCopy(code)
          toast(copiedMessage(code))
        }}
      />
      {toastRegion}
    </div>
  )
}

/**
 * Mobile: no hover, so the copy icon is always visible. Tap a code: the chip
 * and icon darken for 1.2s and a toast says it was copied to your clipboard.
 */
export const Mobile: Story = {
  globals: { viewport: { value: 'iphone14', isRotated: false } },
  parameters: { layout: 'fullscreen' },
  render: (args) => (
    <MobileDemo codes={['RPTR071128', 'RPTR071132', 'RPTR074120', 'RPTR074124']} kind={args.kind} onCopy={args.onCopy} />
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: 'Copy product code RPTR071132' })
    const icon = button.querySelector('.ui-icon')!
    // The icon shows at rest, without hover.
    await expect(getComputedStyle(icon).opacity).toBe('1')
    const restIcon = getComputedStyle(icon).color
    await userEvent.click(button)
    await expect(args.onCopy).toHaveBeenCalledWith('RPTR071132')
    await expect(button).toHaveClass('ui-copy-code--copied')
    // Darkened, not the desktop teal fill.
    await waitFor(() => expect(getComputedStyle(button).backgroundColor).toBe('rgb(197, 208, 215)'))
    await waitFor(() => expect(getComputedStyle(icon).color).not.toBe(restIcon))
    await expect(await canvas.findByRole('status')).toHaveTextContent('Copied RPTR071132 to your clipboard')
  },
}
