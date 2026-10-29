import type { Meta, StoryObj } from '@storybook/react-vite'
import { TextField } from './inputs'

const meta = {
  title: 'Generic UI/Inputs/Text Field',
  component: TextField,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { label: 'Search Criteria 1', placeholder: '' },
  decorators: [(Story) => <div style={{ maxWidth: 360 }}>{Story()}</div>],
} satisfies Meta<typeof TextField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithPlaceholder: Story = { args: { label: 'Product code', placeholder: 'e.g. RPTR071128' } }
export const HiddenLabel: Story = { args: { showLabel: false, placeholder: 'Search documents' } }
