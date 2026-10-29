import type { CSSProperties } from 'react'
import arrowLeft from '../../assets/icons/arrow-left.svg'
import chevronDown from '../../assets/icons/chevron-down.svg'
import close from '../../assets/icons/close.svg'
import copyLink from '../../assets/icons/copy-link.svg'
import download from '../../assets/icons/download.svg'
import email from '../../assets/icons/email.svg'
import favorite from '../../assets/icons/favorite.svg'
import favoriteFilled from '../../assets/icons/favorite-filled.svg'
import info from '../../assets/icons/info.svg'
import menu from '../../assets/icons/menu.svg'
import moreVertical from '../../assets/icons/more-vertical.svg'
import print from '../../assets/icons/print.svg'
import qrCode from '../../assets/icons/qr-code.svg'
import search from '../../assets/icons/search.svg'

// Product icons come from the prototype's assets/icon-*.svg (32px square);
// arrow, chevron, close, menu and search from the Figma "Icon/*" set; viewer
// toolbar glyphs from assets/icons/toolbar/. `w`/`h` are the glyph's share of
// the icon frame, so non-square Figma glyphs keep their exported proportions.
const toolbar = import.meta.glob<string>('../../assets/icons/toolbar/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
})
const tool = (name: string) => ({ src: toolbar[`../../assets/icons/toolbar/${name}.svg`], w: 1, h: 1 })

const ICONS = {
  'arrow-left': { src: arrowLeft, w: 0.9, h: 0.9 },
  'chevron-down': { src: chevronDown, w: 0.59, h: 0.34 },
  close: { src: close, w: 0.58, h: 0.58 },
  menu: { src: menu, w: 0.94, h: 0.66 },
  search: { src: search, w: 0.84, h: 1 },
  'copy-link': { src: copyLink, w: 1, h: 1 },
  download: { src: download, w: 1, h: 1 },
  email: { src: email, w: 1, h: 1 },
  favorite: { src: favorite, w: 1, h: 1 },
  'favorite-filled': { src: favoriteFilled, w: 1, h: 1 },
  info: { src: info, w: 1, h: 1 },
  'more-vertical': { src: moreVertical, w: 1, h: 1 },
  print: { src: print, w: 1, h: 1 },
  'qr-code': { src: qrCode, w: 1, h: 1 },
  'tool-thumbnails': tool('thumbnails'),
  'tool-contents': tool('contents'),
  'tool-search': tool('search'),
  'tool-minus': tool('minus'),
  'tool-plus': tool('plus'),
  'tool-highlight': tool('highlight'),
  'tool-marker': tool('marker'),
  'tool-draw': tool('draw'),
  'tool-erase': tool('erase'),
  'tool-textbox': tool('textbox'),
  'tool-read-aloud': tool('read-aloud'),
  'tool-text': tool('text'),
  'tool-pen': tool('pen'),
  'tool-image': tool('image'),
  'tool-more': tool('more-tools'),
  'tool-fit-width': tool('fit-width'),
  'tool-rotate': tool('rotate'),
  'tool-two-page': tool('two-page'),
  'tool-printer': tool('printer'),
  'tool-save': tool('save'),
  'tool-settings': tool('settings'),
  'tool-expand': tool('expand'),
  'tool-collapse': tool('collapse'),
} as const

export type IconName = keyof typeof ICONS

type IconProps = {
  name: IconName
  /** Overrides --icon-size, e.g. 16 or "20px". */
  size?: number | string
  className?: string
}

/**
 * Renders an icon as a mask filled with currentColor, so its colour always
 * follows the parent (eIFU teal on triggers and menus).
 */
export function Icon({ name, size, className }: IconProps) {
  const icon = ICONS[name]
  const style = {
    '--glyph-w': icon.w,
    '--glyph-h': icon.h,
    '--glyph-src': `url("${icon.src}")`,
    ...(size !== undefined && { '--icon-size': typeof size === 'number' ? `${size}px` : size }),
  } as CSSProperties
  return (
    <span className={['ui-icon', className].filter(Boolean).join(' ')} style={style} aria-hidden="true">
      <span className="ui-icon__glyph" />
    </span>
  )
}
