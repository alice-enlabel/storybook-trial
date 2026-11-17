import type { Decorator } from '@storybook/react-vite'

/** Renders a block the way SstPage places it: in the page frame, in a contained band. */
export const inBand: Decorator = (Story) => (
  <div className="sst-page" style={{ paddingBlock: 32 }}>
    <div className="sst-band sst-band--contained">{Story()}</div>
  </div>
)

/** Full-bleed blocks (header, hero, footer). */
export const inPage: Decorator = (Story) => <div className="sst-page">{Story()}</div>

export const desktop = { viewport: { value: 'desktop', isRotated: false } }
export const mobile = { viewport: { value: 'mobile2', isRotated: false } }
