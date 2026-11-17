import type { SstRecipe } from '../recipe'
import type { BlockSpec } from '../registry'
import { FOOTER, HIERARCHY, LABEL_GUIDE_TEXT } from './content'

const header: SstRecipe['header'] = {
  type: 'header',
  props: { variant: 'glass', items: ['English', 'USA', 'For Patients'] },
}

const heroSearch: BlockSpec = {
  type: 'search',
  props: { variant: 'bar', fields: ['SKU Number'], submitLabel: 'Enter', suggestions: ['Popular Suggestion 1', 'Popular Suggestion 2', 'Popular Suggestion 3'] },
}

/** Figma "new SST themes" home page (157:2834, "fluffier sst" 13:477). */
export const newSst: SstRecipe = {
  id: 'new-sst',
  name: 'New SST home (Figma 157:2834)',
  description: 'Glass nav over a photo hero with search, label guide, categories, recently published, resources and FAQ.',
  skin: 'eifu',
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
      props: { documents: Array.from({ length: 6 }, () => ({ title: 'Document Title', path: 'Hierarchy > Hierarchy 2 > Hierarchy 3' })) },
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

/** Figma new SST search results (57:489): same shell, hierarchy beside the results. */
export const newSstResults: SstRecipe = {
  id: 'new-sst-results',
  name: 'New SST search results (Figma 57:489)',
  description: 'Same header and hero as the home page; hierarchy tree in a side column, then the label guide.',
  skin: 'eifu',
  header,
  sections: [
    { type: 'hero', props: { variant: 'image', title: 'Search Results' }, children: [heroSearch] },
    {
      type: 'row',
      props: { columns: 'minmax(240px, 300px) 1fr' },
      children: [
        {
          type: 'hierarchy',
          props: {
            rootLabel: "Single Enterprise's Name",
            nodes: HIERARCHY,
            defaultExpanded: ['Parent Category', 'Child Category'],
            selected: 'Selected Category',
          },
        },
      ],
    },
    { type: 'labelGuide', props: { heading: 'How to Read Product Labels', text: LABEL_GUIDE_TEXT } },
  ],
  footer: { type: 'footer', props: { columns: FOOTER } },
}
