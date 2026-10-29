import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { Icon, type IconName } from './Icon'
import { Badge } from './data-display'
import { TextLink } from './actions'

export type MenuEntry = { id: string; label: string; icon: IconName }

type MenuProps = {
  items: MenuEntry[]
  onSelect: (id: string) => void
  onClose: () => void
  label: string
  id?: string
  className?: string
}

/**
 * Figma "Menu" (252:160) built from "Menu Item" (252:159). Focus moves to the
 * first item on open; ArrowUp/ArrowDown/Home/End move; Escape closes.
 */
export function Menu({ items, onSelect, onClose, label, id, className }: MenuProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    refs.current[0]?.focus()
  }, [])

  const onKey = (e: KeyboardEvent, i: number) => {
    let next = i
    if (e.key === 'ArrowDown') next = (i + 1) % items.length
    else if (e.key === 'ArrowUp') next = (i - 1 + items.length) % items.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = items.length - 1
    else if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      onClose()
      return
    } else if (e.key === 'Tab') {
      onClose()
      return
    } else return
    e.preventDefault()
    refs.current[next]?.focus()
  }

  return (
    <div id={id} role="menu" aria-label={label} className={['ui-menu', className].filter(Boolean).join(' ')}>
      {items.map((item, i) => (
        <button
          key={item.id}
          ref={(el) => {
            refs.current[i] = el
          }}
          type="button"
          role="menuitem"
          tabIndex={-1}
          className="ui-menu-item"
          onClick={() => onSelect(item.id)}
          onKeyDown={(e) => onKey(e, i)}
        >
          <Icon name={item.icon} />
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  )
}

type MediaPopoverProps = {
  src: string
  alt: string
  downloadLabel?: string
  downloadName?: string
  id?: string
  label: string
  className?: string
}

/** Figma "Media Popover" (252:206): an image with a download link. */
export function MediaPopover({ src, alt, downloadLabel = 'Download', downloadName, id, label, className }: MediaPopoverProps) {
  return (
    <div id={id} role="dialog" aria-label={label} className={['ui-media-popover', className].filter(Boolean).join(' ')}>
      <img src={src} alt={alt} className="ui-media-popover__media" />
      <TextLink href={src} download={downloadName} underline={false}>
        {downloadLabel}
      </TextLink>
    </div>
  )
}

type PanelHeaderProps = {
  title: string
  icon?: IconName
  onClose: () => void
  titleId?: string
}

/** Figma "Panel Header" (252:214): icon + title, Close link on the right. */
export function PanelHeader({ title, icon = 'info', onClose, titleId }: PanelHeaderProps) {
  return (
    <div className="ui-panel-header">
      <div className="ui-panel-header__title-group">
        <Icon name={icon} className="ui-panel-header__icon" />
        <h2 id={titleId} className="ui-panel-header__title">
          {title}
        </h2>
      </div>
      <TextLink underline={false} icon="close" onClick={onClose}>
        Close
      </TextLink>
    </div>
  )
}

type AccordionProps = {
  title: string
  count?: number
  defaultOpen?: boolean
  children: ReactNode
}

/**
 * Figma "Accordion Header" (252:244) with its content below. The chevron
 * rotates and the content slides open.
 */
export function Accordion({ title, count, defaultOpen = false, children }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen)
  const id = useId()
  return (
    <section className={['ui-accordion', open && 'ui-accordion--open'].filter(Boolean).join(' ')}>
      <h3 className="ui-accordion__heading">
        <button
          type="button"
          className="ui-accordion__header"
          aria-expanded={open}
          aria-controls={`${id}-content`}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="ui-accordion__title-group">
            <span>{title}</span>
            {count !== undefined && <Badge count={count} />}
          </span>
          <Icon name="chevron-down" className="ui-chevron" />
        </button>
      </h3>
      <div id={`${id}-content`} className="ui-accordion__content" inert={!open}>
        <div className="ui-accordion__inner">{children}</div>
      </div>
    </section>
  )
}

/** Figma "Content Card" (252:245): bordered container for a block of content. */
export function ContentCard({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={['ui-content-card', className].filter(Boolean).join(' ')}>{children}</div>
}
