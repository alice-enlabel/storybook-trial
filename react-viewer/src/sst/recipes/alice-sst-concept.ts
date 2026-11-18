import type { SstRecipe } from '../recipe'
import type { BlockSpec } from '../registry'
import { FOOTER, LABEL_GUIDE_TEXT } from './content'

const header: SstRecipe['header'] = {
  type: 'header',
  props: { variant: 'glass', items: ['English', 'USA', 'For Patients'] },
}

const heroSearch: BlockSpec = {
  type: 'search',
  props: { variant: 'bar', fields: ['SKU Number'], submitLabel: 'Enter', suggestions: ['Popular Suggestion 1', 'Popular Suggestion 2', 'Popular Suggestion 3'] },
}

/** Alice SST Concept: Figma "new SST themes" home page (157:2834, "fluffier sst" 13:477). */
export const aliceSstConcept: SstRecipe = {
  id: 'alice-sst-concept',
  name: 'Alice SST Concept',
  description: 'Glass nav over a photo hero with search, label guide, categories, recently published, resources and FAQ.',
  skin: 'default',
  header,
  sections: [
    {
      type: 'hero',
      props: { variant: 'image', title: 'Welcome to [BRAND NAME] eIFU', blurb: 'Search Instructions Blurb. Lorem ipsum dolor sit amet consectetur.' },
      children: [heroSearch],
    },
    { type: 'labelGuide', props: { heading: 'How to Read Product Labels', text: LABEL_GUIDE_TEXT } },
    { type: 'categories', props: { categories: ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5', 'Category 6'].map((label) => ({ label })) } },
    {
      type: 'shelf',
      props: { heading: 'Recently Published', docs: Array.from({ length: 6 }, () => ({ title: 'Document Title', crumb: 'Hierarchy > Hierarchy 2 > Hierarchy 3' })) },
    },
    {
      type: 'resources',
      props: {
        links: Array.from({ length: 3 }, (_, i) => ({ title: `Configurable Link Title ${i + 1}`, blurb: 'Configurable blurb describing link.' })),
        faqs: Array.from({ length: 5 }, (_, i) => ({
          question: `Configured question by Publisher ${i + 1}`,
          answer: 'Answer configured by Publisher. Lorem ipsum dolor sit amet consectetur.',
        })),
      },
    },
  ],
  footer: { type: 'footer', props: { columns: FOOTER } },
}
