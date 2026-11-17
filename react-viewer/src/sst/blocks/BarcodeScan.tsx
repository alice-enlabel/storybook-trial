import { blockParts, blockRoot } from '../parts'

export type BarcodeScanProps = {
  heading?: string
  status?: string
  hint?: string
  uploadLabel?: string
  onScan?: () => void
  onUpload?: () => void
  idBase?: string
}

/** Camera scan card with image upload fallback (live Hierarchy "Scan Barcode"). */
export function BarcodeScan({
  heading = 'Scan Barcode',
  status = 'Ready to Scan',
  hint = 'Allow eIFU to access camera.',
  uploadLabel = 'Upload Image',
  onScan,
  onUpload,
  idBase = 'barcode_scan',
}: BarcodeScanProps) {
  const p = blockParts(idBase)
  return (
    <section {...blockRoot(p, 'barcode-scan')} aria-labelledby={p('header')}>
      <h2 className="sst-scan__heading" id={p('header')}>
        {heading}
      </h2>
      <button type="button" className="sst-scan__viewport" id={p('viewport')} onClick={onScan}>
        <svg viewBox="0 0 48 48" width="48" height="48" aria-hidden fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M4 16V4h12M32 4h12v12M44 32v12H32M16 44H4V32" />
        </svg>
        <strong>{status}</strong>
        <span>{hint}</span>
      </button>
      <button type="button" className="sst-scan__upload" id={p('upload')} onClick={onUpload}>
        {uploadLabel}
      </button>
    </section>
  )
}
