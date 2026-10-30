import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge, Chip, ChipGroup, ContentHeader, DescriptionItem, KeyValueList, KeyValueRow } from './data-display'
import { IconButton } from './actions'

// Small display pieces share one page; each export is its own story.
const meta = {
  title: 'Generic UI/Data display',
  component: Badge,
  parameters: { layout: 'padded' },
  args: { count: 10 },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

/** Count pill next to a heading, e.g. the number of items inside an Accordion. */
export const BadgeStory: Story = { name: 'Badge' }

/** Read-only tags, e.g. languages covered. */
export const Chips: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 6 }}>
      <Chip>English</Chip>
      <Chip>Mandarin</Chip>
      <Chip>French</Chip>
    </div>
  ),
}

/** Chips in a wrapping list, e.g. the languages a document covers. */
export const ChipGroupStory: Story = {
  name: 'Chip Group',
  render: () => (
    <div style={{ maxWidth: 240 }}>
      <ChipGroup items={['English', 'Mandarin', 'French', 'German', 'Spanish', 'Japanese']} label="Languages covered" />
    </div>
  ),
}

/** Stack rows for a metadata table. Pass a link as the value for the Link variant. */
export const KeyValueRows: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <KeyValueList>
        <KeyValueRow label="Enterprise">enLabel Global Services</KeyValueRow>
        <KeyValueRow label="File name">eifu comprehensive guide.pdf</KeyValueRow>
        <KeyValueRow label="File size">319.49 KB</KeyValueRow>
        <KeyValueRow label="Article URL">
          <a href="#">/eIFUGuide</a>
        </KeyValueRow>
      </KeyValueList>
    </div>
  ),
}

export const Description: Story = {
  render: () => (
    <DescriptionItem heading="Article Summary">
      A comprehensive guide that revolves around best practices for businesses looking to implement eIFU.
    </DescriptionItem>
  ),
}

/** Title + meta line with trailing Icon Buttons. */
export const PageHeader: Story = {
  render: () => (
    <ContentHeader
      title="eIFU Comprehensive Guide"
      meta="PDF · 29 pages · 319 KB · Version 1 · Released 12/19/2025"
      actions={
        <div style={{ display: 'flex', gap: 6 }}>
          <IconButton icon="info" label="Document Information" />
          <IconButton icon="qr-code" label="QR Code" />
          <IconButton icon="more-vertical" label="Actions" className="ui-icon-button--tip-end" />
        </div>
      }
    />
  ),
}
