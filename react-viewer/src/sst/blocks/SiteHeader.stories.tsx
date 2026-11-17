import type { Meta, StoryObj } from '@storybook/react-vite'
import { SITE_NAMES } from '../recipes/content'
import { SiteHeader } from './SiteHeader'
import { desktop, inPage, mobile } from './story-utils'

const meta = {
  title: 'SST/Blocks/Site Header',
  component: SiteHeader,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  decorators: [inPage],
  args: { variant: 'title', title: 'Hierarchy', sites: SITE_NAMES, currentSite: 'Hierarchy' },
} satisfies Meta<typeof SiteHeader>

export default meta
type Story = StoryObj<typeof meta>

/** Live Default / Hierarchy SSTs. */
export const Title: Story = { args: { signIn: false } }

/** Live SimpleModernSST. */
export const Bar: Story = { args: { variant: 'bar', title: 'SimpleModernSST', currentSite: 'SimpleModernSST' } }

/** Figma new SST: floats over the hero, so the story gives it a dark backdrop. */
export const Glass: Story = {
  args: { variant: 'glass', title: undefined, items: ['English', 'USA', 'For Patients'], sites: ['New SST'] },
  decorators: [(Story) => <div style={{ position: 'relative', height: 120, background: '#4b5a63' }}>{Story()}</div>],
}

/** Figma simple SST 35:85. */
export const Links: Story = {
  args: { variant: 'links', title: undefined, items: ['Home', 'Favorites', 'Recent', 'Setup'], sites: ['Simple'], menu: false },
}

export const LinksMobile: Story = { ...Links, globals: mobile }
export const BarDesktop: Story = { ...Bar, globals: desktop }
