import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { DocumentPage } from './DocumentPage'
import { sampleDocument } from './document-data'

// The whole document viewer page, exactly as the app renders it (App.tsx):
// site header and search, document heading, PDF viewer with the Document
// Information panel, ratings, the Related carousel and the footer.
// Layout switches on viewport media queries (420px and 900px), so each story
// pins a viewport. There is no autodocs page: it would squeeze the page into
// the docs column.
const meta = {
  title: 'Viewer/Document Page',
  component: DocumentPage,
  parameters: { layout: 'fullscreen' },
  args: { doc: sampleDocument },
} satisfies Meta<typeof DocumentPage>

export default meta
type Story = StoryObj<typeof meta>

const smallPhone = { viewport: { value: 'mobile1', isRotated: false } }
const mobile = { viewport: { value: 'mobile2', isRotated: false } }
const desktop = { viewport: { value: 'desktop', isRotated: false } }

/** Full page at desktop width: breadcrumbs, side-by-side stage, four-column footer. */
export const Desktop: Story = { globals: desktop }

/** Full page on a phone: edge-to-edge viewer, info panel as a bottom sheet. */
export const Mobile: Story = { globals: mobile }

/** Under 420px: the compact heading and trigger sizes. */
export const SmallPhone: Story = { globals: smallPhone }

/** Desktop with the Document Information panel opened beside the viewer. */
export const DesktopInfoOpen: Story = {
  globals: desktop,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Document Information' })
    await userEvent.click(trigger)
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'))
  },
}

/** No pinned viewport: resize the canvas or pick any device to see it adapt. */
export const Responsive: Story = {}
