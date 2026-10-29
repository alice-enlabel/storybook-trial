import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { TextLink } from './actions'

const meta = {
  title: 'Generic UI/Actions/Text Link',
  component: TextLink,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { children: 'Link' },
} satisfies Meta<typeof TextLink>

export default meta
type Story = StoryObj<typeof meta>

/** Underline on: navigation links and downloads. */
export const Underlined: Story = { args: { href: '#', children: 'Download PNG' } }

/** Underline off with a trailing icon: in-panel actions such as Close. */
export const PanelAction: Story = { args: { underline: false, icon: 'close', children: 'Close', onClick: fn() } }
