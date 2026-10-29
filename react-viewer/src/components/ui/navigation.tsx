import { useRef, type KeyboardEvent, type ReactNode } from 'react'
import { Icon } from './Icon'

type Crumb = { label: string; href?: string }

/** Figma "Breadcrumb" (251:177): hierarchy trail above the page title. */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="ui-breadcrumb">
      <ol>
        {items.map((c, i) => (
          <li key={`${c.label}-${i}`}>
            {c.href && i < items.length - 1 ? <a href={c.href}>{c.label}</a> : <span aria-current={i === items.length - 1 ? 'page' : undefined}>{c.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}

/** Figma "Back Link" (251:179): return to the previous list or search results. */
export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="ui-back-link">
      <Icon name="arrow-left" size="1.1em" />
      <span>{children}</span>
    </a>
  )
}

export type TabItem = { id: string; label: string }

type TabBarProps = {
  tabs: TabItem[]
  active: string
  onSelect: (id: string) => void
  label: string
  /** id prefix shared with the panels each tab controls. */
  controlsPrefix?: string
}

/**
 * Figma "Tab Bar" (251:188) of "Tab" (251:187). Active tab shows a 4px accent
 * underline. Arrow keys move between tabs.
 */
export function TabBar({ tabs, active, onSelect, label, controlsPrefix }: TabBarProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const onKey = (e: KeyboardEvent, i: number) => {
    let next = i
    if (e.key === 'ArrowRight') next = (i + 1) % tabs.length
    else if (e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = tabs.length - 1
    else return
    e.preventDefault()
    refs.current[next]?.focus()
    onSelect(tabs[next].id)
  }
  return (
    <div role="tablist" aria-label={label} className="ui-tab-bar">
      {tabs.map((t, i) => (
        <button
          key={t.id}
          ref={(el) => {
            refs.current[i] = el
          }}
          role="tab"
          type="button"
          aria-selected={t.id === active}
          aria-controls={controlsPrefix ? `${controlsPrefix}-${t.id}` : undefined}
          tabIndex={t.id === active ? 0 : -1}
          className={['ui-tab', t.id === active && 'ui-tab--active'].filter(Boolean).join(' ')}
          onClick={() => onSelect(t.id)}
          onKeyDown={(e) => onKey(e, i)}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

type AppHeaderProps = {
  logo: ReactNode
  onMenu?: () => void
}

/** Figma "App Header" (251:195): brand logo slot and a menu Icon Button. */
export function AppHeader({ logo, onMenu }: AppHeaderProps) {
  return (
    <header className="ui-app-header">
      <div className="ui-app-header__logo">{logo}</div>
      {onMenu && (
        <button type="button" className="ui-app-header__menu" aria-label="Open site menu" onClick={onMenu}>
          <Icon name="menu" />
        </button>
      )}
    </header>
  )
}
