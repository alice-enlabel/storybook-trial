import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Select } from './inputs'

const versions = [
  { value: 'v1', label: 'Version 1 · Released 12/19/2025' },
  { value: 'v0.9', label: 'Draft 0.9 · Released 11/02/2025' },
]

const meta = {
  title: 'Generic UI/Inputs/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { label: 'Version', options: versions, value: 'v1', onChange: fn() },
  decorators: [(Story) => <div style={{ maxWidth: 360, minHeight: 220 }}>{Story()}</div>],
  // Keep the chosen value in story state so the listbox is fully interactive.
  render: function Render(args) {
    const [value, setValue] = useState(args.value)
    return (
      <Select
        {...args}
        value={value}
        onChange={(v) => {
          setValue(v)
          args.onChange(v)
        }}
      />
    )
  },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

/** Click or press ArrowDown to open; arrows, Enter and Escape work in the list. */
export const Default: Story = {}
