import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { FOOTER, HIERARCHY, LABEL_GUIDE_TEXT } from '../recipes/content'
import { BarcodeScan } from './BarcodeScan'
import { CategoryCarousel } from './CategoryCarousel'
import { RelatedDocs } from '../../viewer/RelatedDocs'
import { Footer } from './Footer'
import { HierarchyTree } from './HierarchyTree'
import { IntroCard } from './IntroCard'
import { LabelGuide } from './LabelGuide'
import { Resources } from './Resources'
import { inBand, inPage } from './story-utils'

/*
 * The content blocks an SST places below its hero. Each one renders alone here
 * with placeholder publisher content; recipes pass the real content as props.
 */
const meta = {
  title: 'SST/Blocks/Content',
  decorators: [inBand],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/** Figma new SST / simple SST "How to Read Product Labels". */
export const LabelGuideImageLeft: Story = {
  name: 'Label Guide · image left',
  render: () => <LabelGuide heading="How to Read Product Labels" text={LABEL_GUIDE_TEXT} />,
}

/** Live SimpleModernSST label guide. */
export const LabelGuideImageTop: Story = {
  name: 'Label Guide · image top',
  render: () => <LabelGuide heading="Where to find the REF number" text={['The REF number is printed on the product label.']} layout="image-top" />,
}

/** Figma simple SST 35:85. */
export const Intro: Story = {
  render: () => <IntroCard heading="Instructions for Use" text="Search for your product to view and download its IFU." logoCaption="BIOHEART" />,
}

/** Live Hierarchy "Scan Barcode". */
export const Scan: Story = {
  render: () => (
    <div style={{ maxWidth: 520 }}>
      <BarcodeScan />
    </div>
  ),
}

/** Figma new SST "Search by Category". */
export const Categories: Story = {
  render: () => <CategoryCarousel categories={['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5'].map((label) => ({ label }))} />,
}

/** Figma new SST "Recently Published": the document page's Related carousel with its own heading. */
export const RecentlyPublished: Story = {
  render: () => (
    <RelatedDocs heading="Recently Published" docs={Array.from({ length: 6 }, () => ({ title: 'Document Title', crumb: 'Hierarchy > Hierarchy 2' }))} />
  ),
}

/** Figma new SST "Additional Resources": links beside an FAQ accordion. */
export const AdditionalResources: Story = {
  render: () => (
    <Resources
      links={[{ title: 'Configurable Link Title', blurb: 'Configurable blurb describing link.' }]}
      faqs={[
        { question: 'Configured question by Publisher', answer: 'Answer configured by Publisher.' },
        { question: 'Another configured question', answer: 'Another answer.' },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const q = canvas.getByRole('button', { name: 'Configured question by Publisher' })
    await expect(q).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(q)
    await expect(q).toHaveAttribute('aria-expanded', 'true')
    await expect(canvas.getByText('Answer configured by Publisher.')).toBeVisible()
  },
}

/** Live Hierarchy SST, Figma new SST search results. */
export const Hierarchy: Story = {
  render: () => (
    <div style={{ maxWidth: 320 }}>
      <HierarchyTree
        rootLabel="Single Enterprise's Name"
        nodes={HIERARCHY}
        defaultExpanded={['Parent Category', 'Child Category']}
        selected="Selected Category"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: 'Selected Category' })).toHaveAttribute('aria-current', 'true')
    await userEvent.click(canvas.getByRole('button', { name: 'Collapse All' }))
    await expect(canvas.queryByRole('button', { name: 'Selected Category' })).toBeNull()
  },
}

export const SiteFooter: Story = {
  decorators: [inPage],
  render: () => <Footer columns={FOOTER} />,
}
