import { useEffect, useId, useRef, useState, type InputHTMLAttributes, type KeyboardEvent } from 'react'
import { Icon, type IconName } from './Icon'

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  showLabel?: boolean
  /** Icon inside the box, before the text (e.g. `search` for SST search bars). */
  leadingIcon?: IconName
  /** Shows a scan-barcode button inside the box, after the text. */
  scan?: boolean
  onScan?: () => void
  /** Accessible name of the scan button. Defaults to "Scan barcode for {label}". */
  scanLabel?: string
  /** Ids for the wrapper and label, so SST blocks keep their `eifu_*` styling hooks. */
  rootId?: string
  labelId?: string
}

/**
 * Figma "Text Field" (250:159): labelled single-line text input.
 * With `leadingIcon` and/or `scan` it becomes the search bar SSTs share:
 * icon and placeholder left-aligned, scan-barcode button on the right.
 */
export function TextField({
  label,
  showLabel = true,
  leadingIcon,
  scan = false,
  onScan,
  scanLabel,
  rootId,
  labelId,
  className,
  id,
  ...rest
}: TextFieldProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  const adorned = Boolean(leadingIcon) || scan
  return (
    <div id={rootId} className={['ui-field', className].filter(Boolean).join(' ')}>
      <label id={labelId} htmlFor={inputId} className={showLabel ? 'ui-field__label' : 'visually-hidden'}>
        {label}
      </label>
      {adorned ? (
        <div className="ui-field__control ui-field__control--adorned" data-disabled={rest.disabled || undefined}>
          {leadingIcon && <Icon name={leadingIcon} className="ui-field__lead" />}
          <input id={inputId} className="ui-field__input" {...rest} />
          {scan && (
            <button
              type="button"
              className="ui-field__scan"
              aria-label={scanLabel ?? `Scan barcode for ${label}`}
              disabled={rest.disabled}
              onClick={onScan}
            >
              <Icon name="barcode-scan" />
            </button>
          )}
        </div>
      ) : (
        <input id={inputId} className="ui-field__control" {...rest} />
      )}
    </div>
  )
}

export type SelectOption = { value: string; label: string }

type SelectProps = {
  label: string
  showLabel?: boolean
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  className?: string
}

/**
 * Figma "Select" (250:163): labelled dropdown trigger that opens a listbox.
 * A custom listbox keeps the popup the width of its field, which a native
 * <select> popup does not guarantee.
 */
export function Select({ label, showLabel = true, options, value, onChange, className }: SelectProps) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(() => Math.max(0, options.findIndex((o) => o.value === value)))
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const current = options.find((o) => o.value === value) ?? options[0]

  useEffect(() => {
    if (!open) return
    listRef.current?.focus()
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])

  const close = (commit?: number) => {
    if (commit !== undefined) onChange(options[commit].value)
    setOpen(false)
    triggerRef.current?.focus()
  }

  const onListKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') setActive((i) => Math.min(options.length - 1, i + 1))
    else if (e.key === 'ArrowUp') setActive((i) => Math.max(0, i - 1))
    else if (e.key === 'Home') setActive(0)
    else if (e.key === 'End') setActive(options.length - 1)
    else if (e.key === 'Enter' || e.key === ' ') close(active)
    else if (e.key === 'Escape' || e.key === 'Tab') close()
    else return
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <div ref={rootRef} className={['ui-field', 'ui-select', className].filter(Boolean).join(' ')}>
      <span id={`${id}-label`} className={showLabel ? 'ui-field__label' : 'visually-hidden'}>
        {label}
      </span>
      <button
        ref={triggerRef}
        type="button"
        className="ui-field__control ui-select__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${id}-label ${id}-value`}
        onClick={() => {
          setActive(Math.max(0, options.findIndex((o) => o.value === value)))
          setOpen((o) => !o)
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault()
            setOpen(true)
          }
        }}
      >
        <span id={`${id}-value`} className="ui-select__value">
          {current?.label}
        </span>
        <Icon name="chevron-down" className="ui-chevron" />
      </button>
      {open && (
        <ul
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={`${id}-label`}
          aria-activedescendant={`${id}-opt-${active}`}
          className="ui-select__list"
          onKeyDown={onListKey}
        >
          {options.map((o, i) => (
            <li
              key={o.value}
              id={`${id}-opt-${i}`}
              role="option"
              aria-selected={o.value === value}
              className={['ui-select__option', i === active && 'is-active'].filter(Boolean).join(' ')}
              onPointerEnter={() => setActive(i)}
              onClick={() => close(i)}
            >
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
