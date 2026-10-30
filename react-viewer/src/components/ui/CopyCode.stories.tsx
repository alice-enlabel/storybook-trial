import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
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
