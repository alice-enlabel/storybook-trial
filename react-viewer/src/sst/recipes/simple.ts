import type { SstRecipe } from '../recipe'
import { FOOTER, LABEL_GUIDE_TEXT } from './content'

/** Figma "new SST themes" simpler concept (node 35:85). */
export const simple: SstRecipe = {
  id: 'simple',
  name: 'Simple (Figma 35:85)',
  description: 'Text-link header, brand wordmark hero, intro card, one search field, label guide.',
  skin: 'eifu',
  header: {
    type: 'header',
    props: { variant: 'links', items: ['Home', 'Favorites', 'Recent', 'Setup'], menu: false },
  },
  sections: [
    { type: 'hero', props: { variant: 'wordmark', wordmark: 'BIOHEART' } },
    {
      type: 'intro',
      props: {
        heading: 'Instructions for Use',
        text: 'Search for your product by its REF number, GTIN or name to view and download its Instructions for Use.',
        logoCaption: 'BIOHEART',
      },
    },
    { type: 'search', props: { variant: 'card', fields: ['Search Criteria 1'] } },
    { type: 'labelGuide', props: { heading: 'How to Read Product Labels', text: LABEL_GUIDE_TEXT } },
  ],
  footer: { type: 'footer', props: { columns: FOOTER } },
}
