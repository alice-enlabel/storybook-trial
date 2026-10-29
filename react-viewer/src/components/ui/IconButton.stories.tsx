import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { IconButton } from './actions'

const meta = {
  title: 'Generic UI/Actions/Icon Button',
  component: IconButton,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { icon: 'info', label: 'Document Information', onClick: fn() },
  argTypes: {
    icon: { control: 'select', options: ['info', 'qr-code', 'more-vertical', 'favorite', 'download', 'print'] },
  },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** Marks the action whose panel or menu is open. */
export const Selected: Story = { args: { selected: true, hideTooltip: true } }

/** The three document triggers as they appear in the title row. */
export const DocumentTriggers: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 6 }}>
      <IconButton icon="info" label="Document Information" />
      <IconButton icon="qr-code" label="QR Code" />
      <IconButton icon="more-vertical" label="Actions" className="ui-icon-button--tip-end" />
    </div>
  ),
}
