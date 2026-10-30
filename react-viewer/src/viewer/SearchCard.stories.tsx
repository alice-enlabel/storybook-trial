import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { SearchCard } from './SearchCard'

// The mobile/desktop switch is a viewport media query (900px), so each story
// pins a viewport. No autodocs: the docs page renders every story at the docs
// column width, which would show the mobile layout for all of them.
const meta = {
  title: 'Viewer/Search Card',
  component: SearchCard,
  parameters: { layout: 'fullscreen' },
  args: { onSearch: fn() },
  decorators: [
    (Story) => (
      <main className="page__main" style={{ paddingBlock: 16 }}>
        {Story()}
      </main>
    ),
  ],
} satisfies Meta<typeof SearchCard>

export default meta
type Story = StoryObj<typeof meta>

const mobile = { viewport: { value: 'mobile2', isRotated: false } }
const desktop = { viewport: { value: 'desktop', isRotated: false } }

const typeQuery: Story['play'] = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const submit = canvas.getByRole('button', { name: 'Search' })
  await expect(submit).toBeDisabled()
  await userEvent.type(canvas.getByLabelText('Search Criteria 1'), 'Catheter')
  await expect(submit).toBeEnabled()
}

/** Icon-only 86×40 submit, grey and disabled until a field has text. */
export const MobileEmpty: Story = { globals: mobile }

/** Icon-only submit in eIFU teal once a field has text. */
export const MobileWithQuery: Story = { globals: mobile, play: typeQuery }

/** Full-width labelled submit, grey and disabled until a field has text. */
export const DesktopEmpty: Story = { globals: desktop }

/** Full-width labelled submit in eIFU teal with white text once a field has text. */
export const DesktopWithQuery: Story = { globals: desktop, play: typeQuery }
