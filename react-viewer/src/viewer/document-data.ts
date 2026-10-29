import qrCode from '../assets/images/qr-code.png'
import watermark from '../assets/images/watermark.png'
import relatedCover from '../assets/images/related-cover.png'

type MetadataRow = { label: string; value: string; href?: string }

// Sample document shown by the prototype. Production takes these fields from
// the eIFU document API (getDocContents / findDocumentsByPath).
export const sampleDocument = {
  title: 'eIFU Comprehensive Guide',
  pdfUrl: `${import.meta.env.BASE_URL}eifu-comprehensive-guide.pdf`,
  meta: { format: 'PDF', pages: 29, size: '319 KB', version: 1, released: '12/19/2025' },
  breadcrumb: [
    { label: 'Home', href: '#' },
    { label: 'Documents', href: '#' },
    { label: 'Guides', href: '#' },
    { label: 'eIFU Comprehensive Guide' },
  ],
  versions: [
    { value: 'v1', label: 'Version 1 · Released 12/19/2025' },
    { value: 'v0.9', label: 'Draft 0.9 · Released 11/02/2025' },
  ],
  enterprise: 'enLabel Global Services',
  summary: 'A comprehensive guide that revolves around best practices for businesses looking to implement eIFU.',
  qrCode,
  metadata: [
    { label: 'Enterprise', value: 'enLabel Global Services' },
    { label: 'File name', value: 'eifu comprehensive guide.pdf' },
    { label: 'File size', value: '319.49 KB' },
    { label: 'Article URL', value: '/eIFUGuide', href: '/eIFUGuide' },
    { label: 'Metadata Field', value: 'Metadata' },
  ] as MetadataRow[],
  extraMetadata: [
    { label: 'Document ID', value: 'EIFU-00412' },
    { label: 'Document type', value: 'Instructions for Use' },
    { label: 'Pages', value: '29' },
    { label: 'Effective date', value: '12/19/2025' },
    { label: 'Region', value: 'US, EU, APAC' },
  ] as MetadataRow[],
  productCodes: [
    'RPTR071128', 'RPTR071132', 'RPTR074120', 'RPTR074132', 'BAT-100HPF',
    'BAT-010HPF', 'BAT-LBSC1W', 'BAT-KIT-01', 'BAT-KIT-02', 'BAT-KIT-03',
  ],
  languages: ['English', 'Mandarin', 'French'],
  notices: {
    contact: [
      { heading: 'Phone', lines: ['USA', 'Phone: 800.722.0822', 'Fax: 800.648.4309', 'International', 'Phone: 1.434.975.8000', 'Fax: 1.434.975.4134'] },
      { heading: 'Email', lines: ['inquiry@microaire.com'] },
      { heading: 'Website', lines: ['www.microaire.com'] },
    ],
    legalHref: '#',
    watermark,
    count: 3,
  },
  ratingCategories: ['Completeness', 'Ease of Use', 'Format', 'Overall'],
  related: Array.from({ length: 6 }, (_, i) => ({
    id: `related-${i + 1}`,
    title: 'Document Title',
    crumb: 'Hierarchy > Hierarchy 2 > Hierarchy 3',
    cover: relatedCover,
  })),
  footer: [
    { heading: 'About Us', links: ['Contact Information', 'Business', 'About', 'Partners'] },
    { heading: 'eIFU', links: ['Terms & Conditions', 'Footer notice placeholder', 'Help', 'Become a Publisher'] },
    { heading: 'Support', links: ['Tutorial'] },
    { heading: 'Site Information', links: ['Safe Harbor Privacy Policy', 'Site Privacy', 'Cookie Policy'] },
  ],
}

export type ViewerDocument = typeof sampleDocument
