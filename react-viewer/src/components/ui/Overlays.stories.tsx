import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Accordion, ContentCard, MediaPopover, Menu, PanelHeader } from './overlays'
import { Chip } from './data-display'
import qrCode from '../../assets/images/qr-code.png'

const meta = {
  title: 'Generic UI/Overlays & containers',
  component: Menu,
  parameters: { layout: 'padded' },
  args: {
    label: 'Document actions',
    onSelect: fn(),
    onClose: fn(),
    items: [
      { id: 'favorite', label: 'Add to favorites', icon: 'favorite' },
      { id: 'print', label: 'Print', icon: 'print' },
      { id: 'download', label: 'Download', icon: 'download' },
      { id: 'email', label: 'Email document', icon: 'email' },
      { id: 'copy', label: 'Copy link', icon: 'copy-link' },
    ],
  },
} satisfies Meta<typeof Menu>

export default meta
type Story = StoryObj<typeof meta>

/** Actions menu. Focus starts on the first item; arrows move, Escape closes. */
export const ActionsMenu: Story = { decorators: [(Story) => <div style={{ display: 'inline-block' }}>{Story()}</div>] }

export const QrPopover: Story = {
  render: () => (
    <div style={{ display: 'inline-block' }}>
      <MediaPopover label="Document QR code" src={qrCode} alt="QR code" downloadLabel="Download PNG" downloadName="qr.png" />
    </div>
  ),
}

export const Panel: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <PanelHeader title="Document info" onClose={fn()} />
    </div>
  ),
}

/** The chevron rotates and the content slides open. */
export const Accordions: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <Accordion title="Product Codes" count={10}>
        <p style={{ margin: 0 }}>RPTR071128 · RPTR071132 · RPTR074120</p>
      </Accordion>
      <Accordion title="Languages Covered" count={3} defaultOpen>
        <div style={{ display: 'flex', gap: 6 }}>
          <Chip>English</Chip>
          <Chip>Mandarin</Chip>
          <Chip>French</Chip>
        </div>
      </Accordion>
    </div>
  ),
}

export const Card: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <ContentCard>Card content. Use for notices, contact blocks or any bordered text group.</ContentCard>
    </div>
  ),
}
