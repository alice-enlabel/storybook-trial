import type { ReactNode } from 'react'

/** Figma "Badge" (250:172): count pill next to a heading. */
export function Badge({ count }: { count: number | string }) {
  return <span className="ui-badge">{count}</span>
}

/** Figma "Chip" (250:174): read-only tag for categorical values. */
export function Chip({ children }: { children: ReactNode }) {
  return <span className="ui-chip">{children}</span>
}

type KeyValueRowProps = {
  label: string
  children: ReactNode
}

/**
 * Figma "Key-Value Row" (251:130): one row of a definition list. Render rows
 * inside <KeyValueList>; pass a link as children for the Value=Link variant.
 */
export function KeyValueRow({ label, children }: KeyValueRowProps) {
  return (
    <div className="ui-kv">
      <dt className="ui-kv__key">{label}</dt>
      <dd className="ui-kv__value">{children}</dd>
    </div>
  )
}

export function KeyValueList({ children }: { children: ReactNode }) {
  return <dl className="ui-kv-list">{children}</dl>
}

type DescriptionItemProps = {
  heading: string
  children: ReactNode
  className?: string
}

/** Figma "Description Item" (251:131): heading with supporting text. */
export function DescriptionItem({ heading, children, className }: DescriptionItemProps) {
  return (
    <div className={['ui-description', className].filter(Boolean).join(' ')}>
      <h3 className="ui-description__heading">{heading}</h3>
      <div className="ui-description__body">{children}</div>
    </div>
  )
}

type ContentHeaderProps = {
  title: string
  meta?: string
  actions?: ReactNode
}

/** Figma "Content Header" (251:134): title + metadata line with trailing Icon Buttons. */
export function ContentHeader({ title, meta, actions }: ContentHeaderProps) {
  return (
    <header className="ui-content-header">
      <div className="ui-content-header__text">
        <h1 className="ui-content-header__title">{title}</h1>
        {meta && <p className="ui-content-header__meta">{meta}</p>}
      </div>
      {actions && <div className="ui-content-header__actions">{actions}</div>}
    </header>
  )
}
