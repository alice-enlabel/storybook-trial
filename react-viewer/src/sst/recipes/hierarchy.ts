import type { SstRecipe } from '../recipe'
import { FOOTER } from './content'

/** Live "Hierarchy" on subscriber.eifualpha.com, rebuilt from blocks. */
export const hierarchy: SstRecipe = {
  id: 'hierarchy',
  name: 'Hierarchy (live)',
  description: 'Title header, barcode scan beside a filtered text search, publisher hierarchy tree.',
  skin: 'default',
  header: { type: 'header', props: { variant: 'title', title: 'Hierarchy', signIn: false } },
  sections: [
    {
      type: 'row',
      props: { columns: '1fr 1fr' },
      children: [
        { type: 'barcodeScan', props: {} },
        { type: 'search', props: { variant: 'filtered', fields: ['Product Product Code', 'Document GTIN / UDI'] } },
      ],
    },
    {
      type: 'row',
      props: { columns: 'minmax(260px, 340px) 1fr' },
      children: [
        {
          type: 'hierarchy',
          props: {
            nodes: [
              { label: 'eIFU_Pirates', children: [{ label: 'Pirates IFUs' }] },
              { label: 'eIFU_Alpha', children: [{ label: 'Alpha IFUs' }] },
            ],
          },
        },
      ],
    },
  ],
  footer: { type: 'footer', props: { columns: FOOTER } },
}
