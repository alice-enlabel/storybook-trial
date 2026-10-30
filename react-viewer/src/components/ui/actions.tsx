import { forwardRef, useEffect, useState, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Icon, type IconName } from './Icon'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /**
   * Outline = secondary action, Muted = low-emphasis action, Primary = main
   * action (e.g. search submit): eIFU teal, greyed out while disabled.
   */
  variant?: 'outline' | 'muted' | 'primary'
  icon?: IconName
  block?: boolean
}

/** Figma "Button" (250:129): text button with optional leading icon. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'outline', icon, block, className, children, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={['ui-button', `ui-button--${variant}`, block && 'ui-button--block', className]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {icon && <Icon name={icon} />}
      {children && <span>{children}</span>}
    </button>
  )
})

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: IconName
  /** Accessible name; also shown as the hover/focus tooltip. */
  label: string
  /** Marks the action whose panel or menu is open. */
  selected?: boolean
  /** Hide the tooltip, e.g. while the trigger's own menu is open. */
  hideTooltip?: boolean
}

/** Figma "Icon Button" (250:146): square icon-only action. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, label, selected, hideTooltip, className, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      data-tooltip={hideTooltip ? undefined : label}
      className={['ui-icon-button', selected && 'ui-icon-button--selected', className].filter(Boolean).join(' ')}
      {...rest}
    >
      <Icon name={icon} />
    </button>
  )
})

type TextLinkProps = {
  /** Underline on for navigation links, off for in-panel actions such as Close. */
  underline?: boolean
  icon?: IconName
  children: ReactNode
  className?: string
} & (
  | ({ href: string } & AnchorHTMLAttributes<HTMLAnchorElement>)
  | ({ href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>)
)

/** Figma "Text Link" (250:155): inline text action with optional trailing icon. */
export function TextLink({ underline = true, icon, children, className, ...rest }: TextLinkProps) {
  const cls = ['ui-text-link', underline && 'ui-text-link--underline', className].filter(Boolean).join(' ')
  const content = (
    <>
      <span>{children}</span>
      {icon && <Icon name={icon} size="0.8em" />}
    </>
  )
  if (rest.href !== undefined) {
    return (
      <a className={cls} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {content}
      </a>
    )
  }
  return (
    <button type="button" className={cls} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {content}
    </button>
  )
}

type CopyCodeProps = {
  code: string
  /** What the code is, for the accessible name: "Copy {kind} {code}". */
  kind?: string
  /** Copy to the clipboard and confirm (e.g. a toast). */
  onCopy: (code: string) => void
}

/** How long the Copied state shows after a click. */
const COPIED_MS = 1200

/**
 * Figma "Copy Code": a monospace code value that copies itself on click.
 * Default: plain text. Hover/focus: grey fill and the copy icon appears.
 * Copied: eIFU teal with white text for 1.2s after a click.
 */
export function CopyCode({ code, kind = 'code', onCopy }: CopyCodeProps) {
  const [copiedAt, setCopiedAt] = useState(0)
  useEffect(() => {
    if (!copiedAt) return
    const t = window.setTimeout(() => setCopiedAt(0), COPIED_MS)
    return () => window.clearTimeout(t)
  }, [copiedAt])
  return (
    <button
      type="button"
      className={['ui-copy-code', copiedAt && 'ui-copy-code--copied'].filter(Boolean).join(' ')}
      onClick={() => {
        onCopy(code)
        setCopiedAt(Date.now())
      }}
      aria-label={`Copy ${kind} ${code}`}
    >
      {code}
      <Icon name="copy-link" size={14} />
    </button>
  )
}

/** Wrapping list of Copy Codes, e.g. a document's product codes. */
export function CopyCodeList({ codes, kind, onCopy }: { codes: string[] } & Omit<CopyCodeProps, 'code'>) {
  return (
    <ul className="ui-copy-code-list">
      {codes.map((code) => (
        <li key={code}>
          <CopyCode code={code} kind={kind} onCopy={onCopy} />
        </li>
      ))}
    </ul>
  )
}
