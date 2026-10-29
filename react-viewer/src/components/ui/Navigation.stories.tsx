import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { AppHeader, BackLink, Breadcrumb, TabBar } from './navigation'
import logo from '../../assets/images/eifu-logo.png'

const meta = {
  title: 'Generic UI/Navigation',
  component: Breadcrumb,
  parameters: { layout: 'padded' },
  args: {
    items: [{ label: 'Home', href: '#' }, { label: 'Documents', href: '#' }, { label: 'Guides', href: '#' }, { label: 'eIFU Comprehensive Guide' }],
  },
} satisfies Meta<typeof Breadcrumb>

export default meta
type Story = StoryObj<typeof meta>

export const BreadcrumbStory: Story = { name: 'Breadcrumb' }

export const Back: Story = { render: () => <BackLink href="#">Back to Search</BackLink> }

/** Arrow keys move between tabs; the active tab has the teal underline. */
export const Tabs: Story = {
  render: function Render() {
    const [active, setActive] = useState('overview')
    return (
      <TabBar
        label="Document info sections"
        active={active}
        onSelect={setActive}
        tabs={[
          { id: 'overview', label: 'Overview' },
          { id: 'details', label: 'Details' },
          { id: 'notices', label: 'Notices' },
        ]}
      />
    )
  },
}

export const SiteHeader: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => <AppHeader logo={<img src={logo} alt="eIFU" height={52} />} onMenu={fn()} />,
}
