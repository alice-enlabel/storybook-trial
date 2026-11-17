/*
 * Placeholder publisher content shared by the recipes. In production these
 * come from the subscriber API (footers, notices, preferences, lbl* strings).
 */
import type { FooterProps } from '../blocks/Footer'

export const FOOTER: FooterProps['columns'] = [
  { heading: 'About Us', links: ['Contact Information', 'Business', 'About', 'Partners'] },
  { heading: 'eIFU', links: ['Terms & Conditions', 'Footer notice placeholder', 'Help', 'Become a Publisher'] },
  { heading: 'Support', links: ['Tutorial'] },
  { heading: 'Site Information', links: ['Safe Harbor Privacy Policy', 'Site Privacy', 'Cookie Policy'] },
]

export const LABEL_GUIDE_TEXT = [
  'This is space for the customer to upload an annotated image of their product labels to assist users in finding relevant search terms.',
  'The space here can also be used to write more detailed instructions on how to find critical information on a product label.',
]

export const HIERARCHY = [
  {
    label: 'Parent Category',
    children: [
      {
        label: 'Child Category',
        children: [{ label: 'Final Category' }, { label: 'Selected Category' }, { label: 'Category with a super long name that wraps' }],
      },
    ],
  },
  { label: 'Second Parent Category', children: [{ label: 'Child Category 2' }] },
  { label: 'Third Parent Category', children: [{ label: 'Child Category 3' }] },
]
