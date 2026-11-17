import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { DocInfoPanel } from './DocInfoPanel'
import { PdfViewer } from './PdfViewer'
import { sampleDocument } from './document-data'

// The panel renders inside the document page's real stage, next to the PDF
// viewer, so viewer.css sizes it exactly as the app and the HTML demos do:
// - mobile (<900px): a bottom sheet, capped at 75dvh of the viewport.
// - desktop (>=900px): a side panel as tall as the viewer, min(84dvh, 1300px).
// Its width and height follow the browser viewport, so neither is fixed here.
// The layout switch is a viewport media query, so each story pins a viewport.
// There is no autodocs page: it would render every story at the docs column width.
const meta = {
  title: 'Viewer/Doc Info Panel',
  component: DocInfoPanel,
  parameters: { layout: 'fullscreen' },
  args: { doc: sampleDocument, onClose: fn(), onCopyCode: fn() },
  decorators: [
    (Story, { args }) => (
      <div className="doc-page doc-page--info-open">
        <main className="page__main" style={{ paddingBlock: 16 }}>
          <div className="stage stage--with-info">
            <div className="stage__viewer">
              <PdfViewer url={args.doc.pdfUrl} title={args.doc.title} onToast={() => {}} />
            </div>
            <div className="stage__panel-slot">
              <div id="docinfo" className="stage__panel" data-state="open">
                {Story()}
              </div>
            </div>
          </div>
        </main>
      </div>
    ),
  ],
} satisfies Meta<typeof DocInfoPanel>

export default meta
type Story = StoryObj<typeof meta>

/** Bottom sheet over the viewer, capped at 75% of the viewport height. */
export const Mobile: Story = { globals: { viewport: { value: 'mobile2', isRotated: false } } }

/** Side panel beside the viewer, matching the rendered PDF viewer's height. */
export const Desktop: Story = { globals: { viewport: { value: 'desktop', isRotated: false } } }

/** No pinned viewport: resize the canvas or pick any device to see it adapt. */
export const Responsive: Story = {}
