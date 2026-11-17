import logo from '../../assets/images/eifu-logo.png'
import { Icon } from '../../components/ui/Icon'
import { blockParts, blockRoot } from '../parts'

export type SiteHeaderProps = {
  /**
   * `title`: logo, centred site title, SST switcher, menu (live Default / Hierarchy).
   * `bar`: brand-colour bar, title right, switcher, menu, Sign In (live SimpleModernSST).
   * `glass`: floating pill over the hero with locale chips (Figma new SST 157:2834).
   * `links`: logo, text nav links, switcher, Sign In (Figma simple SST 35:85).
   */
  variant: 'title' | 'bar' | 'glass' | 'links'
  title?: string
  logoSrc?: string
  /** Nav links (`links`) or locale/audience chips (`glass`). */
  items?: string[]
  /** Names in the SST switcher. Omit to hide it. */
  sites?: string[]
  currentSite?: string
  signIn?: boolean
  menu?: boolean
  idBase?: string
}

export function SiteHeader({
  variant,
  title,
  logoSrc = logo,
  items = [],
  sites,
  currentSite,
  signIn = true,
  menu = true,
  idBase = 'header',
}: SiteHeaderProps) {
  const p = blockParts(idBase)
  return (
    <header {...blockRoot(p, 'header', variant)}>
      <div className="sst-header__inner" id={p('inner')}>
        <a href="#" className="sst-header__logo" id={p('icon')} aria-label="Home">
          <img src={logoSrc} alt="" id={p('icon_image')} />
        </a>
        {title && variant !== 'links' && (
          <h1 className="sst-header__title" id={p('title')}>
            {title}
          </h1>
        )}
        {items.length > 0 && (
          <nav className="sst-header__items" id={p('items')} aria-label={variant === 'links' ? 'Main' : 'Preferences'}>
            {items.map((item) => (
              <a key={item} href="#" className="sst-header__item">
                {item}
              </a>
            ))}
          </nav>
        )}
        <div className="sst-header__actions" id={p('actions')}>
          {sites && sites.length > 0 && (
            <label className="sst-header__sites" id={p('subscriber_sites_label')}>
              <span className="visually-hidden">Site template</span>
              <select id={p('subscriber_sites')} defaultValue={currentSite}>
                {sites.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
          )}
          {menu && (
            <button type="button" className="sst-header__menu" id={p('hamburger')} aria-label="Menu">
              <Icon name="menu" />
            </button>
          )}
          {signIn && (
            <button type="button" className="sst-header__sign-in" id={p('sign_in')}>
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
