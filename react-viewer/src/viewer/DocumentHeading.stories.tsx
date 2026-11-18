import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { DocumentHeading } from './DocumentHeading'
import { sampleDocument } from './document-data'

// The heading switches layout on viewport media queries (420px and 900px), so
// each story pins a viewport. The spec tables are in DocumentHeading.mdx.
const meta = {
  title: 'Viewer/Document Heading',
  component: DocumentHeading,
  parameters: { layout: 'fullscreen' },
  args: { doc: sampleDocument, infoOpen: false, favorite: false, onToggleInfo: fn(), onAction: fn() },
  decorators: [
    (Story) => (
      <div className="doc-page">
        <main className="page__main" style={{ paddingBottom: 360 }}>
          {Story()}
        </main>
      </div>
    ),
  ],
} satisfies Meta<typeof DocumentHeading>

export default meta
type Story = StoryObj<typeof meta>

const smallPhone = { viewport: { value: 'mobile1', isRotated: false } }
const mobile = { viewport: { value: 'mobile2', isRotated: false } }
const desktop = { viewport: { value: 'desktop', isRotated: false } }

/** ‹ Documents link, 22px bold title with the action bar on its row, 14px metadata line below. */
export const Mobile: Story = { globals: mobile }

/** Under 420px: 20px title, 13px metadata, 32×36 triggers with no gap. */
export const SmallPhone: Story = { globals: smallPhone }

/** Breadcrumbs and Back to Search, 44px title, 20px metadata, 54px triggers, rules above and below. */
export const Desktop: Story = { globals: desktop }

/** Document Information trigger selected while the panel is open. */
export const InfoOpen: Story = { globals: desktop, args: { infoOpen: true } }

/** QR popover under its trigger, with the PNG download. */
export const QrOpen: Story = {
  globals: desktop,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'QR Code' }))
    await waitFor(() => expect(canvas.getByRole('img', { name: /QR code linking to/ })).toBeVisible())
  },
}

/** Actions menu: favorites, print, download, paper copy, email, copy link. Choosing one closes the menu. */
export const ActionsOpen: Story = {
  globals: desktop,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Actions' }))
    await expect(canvas.getAllByRole('menuitem')).toHaveLength(6)
  },
}

/** Actions menu on a phone, with the scrim behind it. */
export const ActionsOpenMobile: Story = { ...ActionsOpen, globals: mobile }

/** Once the document is a favorite, the first item reads "Remove from favorites". */
export const Favorited: Story = {
  globals: desktop,
  args: { favorite: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Actions' }))
    await waitFor(() => expect(canvas.getByRole('menuitem', { name: 'Remove from favorites' })).toBeVisible())
  },
}

/** Choosing an action reports its id and closes the menu; Escape closes it too. */
export const ChoosesAction: Story = {
  globals: desktop,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Actions' }))
    await userEvent.click(canvas.getByRole('menuitem', { name: 'Download' }))
    await expect(args.onAction).toHaveBeenCalledWith('download')
    await expect(canvas.queryByRole('menu')).toBeNull()

    await userEvent.click(canvas.getByRole('button', { name: 'QR Code' }))
    await userEvent.keyboard('{Escape}')
    await expect(canvas.queryByRole('dialog')).toBeNull()
  },
}
