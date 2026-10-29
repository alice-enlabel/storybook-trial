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
    variant: { control: 'inline-radio', options: ['outline', 'muted'] },
    icon: { control: 'select', options: [undefined, 'search', 'download', 'print'] },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/** Secondary action, e.g. "Show All Fields". */
export const Outline: Story = { args: { variant: 'outline', children: 'Show All Fields' } }

/** Low-emphasis action, e.g. the search submit. */
export const Muted: Story = { args: { variant: 'muted', icon: 'search', children: 'Search' } }

export const Disabled: Story = { args: { variant: 'outline', disabled: true } }
