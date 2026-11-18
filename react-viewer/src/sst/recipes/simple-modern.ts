import type { SstRecipe } from '../recipe'
import { FOOTER } from './content'

/** Live "SimpleModernSST" on subscriber.eifualpha.com, rebuilt from blocks. */
export const simpleModern: SstRecipe = {
  id: 'simple-modern',
  name: 'SimpleModernSST (live)',
  description: 'Brand bar header, brand hero with one search bar, label guide.',
  skin: 'default',
  header: { type: 'header', props: { variant: 'bar', title: 'SimpleModernSST', menu: true } },
  sections: [
    {
      type: 'hero',
      props: {
        variant: 'brand',
        title: 'Welcome to the eIFU Website',
        subtitle: 'View and download Instructions for Use',
        blurb: 'Enter the REF number from the product label and select "Search".',
      },
      children: [{ type: 'search', props: { variant: 'bar', fields: ['Search'] } }],
    },
    {
      type: 'labelGuide',
      props: {
        heading: 'Where to find the REF number',
        text: ['The REF number is printed on the product label and the patient implant card.'],
        layout: 'image-top',
      },
    },
  ],
  footer: { type: 'footer', props: { columns: FOOTER } },
}
