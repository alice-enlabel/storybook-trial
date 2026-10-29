import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon, type IconName } from './Icon'

const PRODUCT: IconName[] = ['info', 'qr-code', 'more-vertical', 'favorite', 'favorite-filled', 'print', 'download', 'email', 'copy-link']
const UI: IconName[] = ['arrow-left', 'chevron-down', 'close', 'menu', 'search']

const meta = {
  title: 'Generic UI/Icons',
  component: Icon,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { name: 'info', size: 32 },
  argTypes: {
    name: { control: 'select', options: [...PRODUCT, ...UI] },
    size: { control: { type: 'range', min: 12, max: 64, step: 2 } },
  },
  decorators: [(Story) => <div style={{ color: 'var(--color-icon-accent)' }}>{Story()}</div>],
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

/** One icon; colour follows the parent's `color` (eIFU teal here). */
export const Single: Story = {}

function Grid({ names }: { names: IconName[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 96px)', gap: 16, font: 'var(--type-caption)' }}>
      {names.map((n) => (
        <div key={n} style={{ display: 'grid', justifyItems: 'center', gap: 8 }}>
          <Icon name={n} size={32} />
          <code>{n}</code>
        </div>
      ))}
    </div>
  )
}

export const ProductIcons: Story = { render: () => <Grid names={PRODUCT} /> }
export const UiGlyphs: Story = { render: () => <Grid names={UI} /> }
