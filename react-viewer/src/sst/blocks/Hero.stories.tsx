import type { Meta, StoryObj } from '@storybook/react-vite'
import { Hero } from './Hero'
import { SearchBlock } from './SearchBlock'
import { inPage } from './story-utils'

const meta = {
  title: 'SST/Blocks/Hero',
  component: Hero,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  decorators: [inPage],
  args: { variant: 'brand', title: 'Welcome to the eIFU Website' },
} satisfies Meta<typeof Hero>

export default meta
type Story = StoryObj<typeof meta>

/** Live SimpleModernSST. Recipes put a SearchBlock in the hero's slot. */
export const Brand: Story = {
  args: {
    subtitle: 'View and download Instructions for Use',
    blurb: 'Enter the REF number from the product label and select "Search".',
    children: <SearchBlock variant="bar" />,
  },
}

/** Figma new SST: photo with scrim. `imageUrl` sets the photo. */
export const Image: Story = {
  args: {
    variant: 'image',
    title: 'Welcome to [BRAND NAME] eIFU',
    blurb: 'Search Instructions Blurb.',
    children: <SearchBlock variant="bar" fields={['SKU Number']} submitLabel="Enter" suggestions={['Popular Suggestion 1', 'Popular Suggestion 2']} />,
  },
}

/** Figma simple SST 35:85: gradient with the subscriber's brand name as a wordmark. */
export const Wordmark: Story = { args: { variant: 'wordmark', title: undefined, wordmark: 'BIOHEART' } }
