import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { TextField } from './inputs'

const meta = {
  title: 'Generic UI/Inputs/Text Field',
  component: TextField,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { label: 'Search Criteria 1', placeholder: '' },
  argTypes: {
    leadingIcon: { control: 'select', options: [undefined, 'search'] },
  },
  decorators: [(Story) => <div style={{ maxWidth: 360 }}>{Story()}</div>],
} satisfies Meta<typeof TextField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithPlaceholder: Story = { args: { label: 'Product code', placeholder: 'e.g. RPTR071128' } }
export const HiddenLabel: Story = { args: { showLabel: false, placeholder: 'Search documents' } }

/** Search icon and placeholder left-aligned inside the box. */
export const WithSearchIcon: Story = {
  args: { label: 'Search', showLabel: false, leadingIcon: 'search', placeholder: 'Search by product name or code' },
}

/** The bar SSTs share: search icon left, scan-barcode button right. */
export const SearchWithScan: Story = {
  args: {
    label: 'Search',
    showLabel: false,
    leadingIcon: 'search',
    scan: true,
    onScan: fn(),
    placeholder: 'Search by product name or code',
  },
  decorators: [(Story) => <div style={{ maxWidth: 560 }}>{Story()}</div>],
  play: async ({ canvasElement, args }) => {
    const c = within(canvasElement)
    const input = c.getByRole('textbox', { name: 'Search' })
    await userEvent.type(input, 'RPTR')
    await expect(input).toHaveValue('RPTR')
    await userEvent.click(c.getByRole('button', { name: 'Scan barcode for Search' }))
    await expect(args.onScan).toHaveBeenCalledOnce()
  },
}

/** Labelled criterion with scan only (SST "Text Search" card). */
export const LabelledWithScan: Story = {
  args: { label: 'Search Criteria 1', scan: true, onScan: fn() },
}

export const DisabledSearchWithScan: Story = {
  args: { ...SearchWithScan.args, disabled: true },
}
