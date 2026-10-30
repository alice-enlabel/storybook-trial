import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Button } from './actions'

const meta = {
  title: 'Generic UI/Actions/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { children: 'Button', onClick: fn() },
  argTypes: {
    variant: { control: 'inline-radio', options: ['outline', 'muted', 'primary'] },
    icon: { control: 'select', options: [undefined, 'search', 'download', 'print'] },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/** Secondary action, e.g. "Show All Fields". */
export const Outline: Story = { args: { variant: 'outline', children: 'Show All Fields' } }

/** Low-emphasis action. */
export const Muted: Story = { args: { variant: 'muted', icon: 'search', children: 'Search' } }

/**
 * Main action: eIFU teal, white text. Sizes to its content; pass `block` to
 * fill its container. The search submit's mobile and desktop sizes are in
 * Viewer/Search Card.
 */
export const Primary: Story = { args: { variant: 'primary', icon: 'search', children: 'Search' } }

/** Primary while its form has no input: grey, not clickable. */
export const PrimaryDisabled: Story = { args: { variant: 'primary', icon: 'search', children: 'Search', disabled: true } }

/** `block` fills the container width, as the desktop search submit does. */
export const PrimaryBlock: Story = {
  args: { variant: 'primary', icon: 'search', children: 'Search', block: true },
  parameters: { layout: 'padded' },
}

export const Disabled: Story = { args: { variant: 'outline', disabled: true } }
