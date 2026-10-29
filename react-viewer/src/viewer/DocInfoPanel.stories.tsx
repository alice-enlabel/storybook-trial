import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { DocInfoPanel } from './DocInfoPanel'
import { sampleDocument } from './document-data'

const meta = {
  title: 'Viewer/Doc Info Panel',
  component: DocInfoPanel,
  parameters: { layout: 'padded' },
  args: { doc: sampleDocument, onClose: fn(), onCopyCode: fn() },
  // The desktop side panel: fixed width, its own scroller so the tabs can jump.
  decorators: [
    (Story) => (
      <div className="stage__panel" style={{ position: 'static', width: 620, height: 760, animation: 'none' }}>
        {Story()}
      </div>
    ),
  ],
} satisfies Meta<typeof DocInfoPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
