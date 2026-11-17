import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { SearchBlock } from './SearchBlock'
import { inBand } from './story-utils'

const meta = {
  title: 'SST/Blocks/Search',
  component: SearchBlock,
  tags: ['autodocs'],
  decorators: [inBand],
  args: { variant: 'bar', onSearch: fn() },
} satisfies Meta<typeof SearchBlock>

export default meta
type Story = StoryObj<typeof meta>

/** One wide field (SimpleModernSST, new SST hero). */
export const Bar: Story = { args: { fields: ['SKU Number'], submitLabel: 'Enter', suggestions: ['Popular Suggestion 1', 'Popular Suggestion 2', 'Popular Suggestion 3'] } }

/** "Text Search" card, one labelled field per criterion (live Hierarchy). */
export const Filtered: Story = { args: { variant: 'filtered', fields: ['Product Product Code', 'Document GTIN / UDI'] } }

/** Titled card with an icon submit (Figma simple SST 35:85). */
export const Card: Story = { args: { variant: 'card', fields: ['Search Criteria 1'] } }

/** Submit stays disabled until a field has text, then reports every field's value. */
export const SubmitsValues: Story = {
  args: Filtered.args,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const submit = canvas.getByRole('button', { name: 'Search' })
    await expect(submit).toBeDisabled()
    await userEvent.type(canvas.getByLabelText('Document GTIN / UDI'), '00812345678905')
    await userEvent.click(submit)
    await expect(args.onSearch).toHaveBeenCalledWith(['', '00812345678905'])
  },
}

/** Part ids follow the live app's scheme, so existing SST CSS keeps matching. */
export const PartIds: Story = {
  args: Filtered.args,
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('#eifu_search_bar_filtered_top_header')).toHaveTextContent('Text Search')
    await expect(canvasElement.querySelector('#eifu_search_bar_filtered_input_text_1_label')).toHaveTextContent('Document GTIN / UDI')
  },
}
