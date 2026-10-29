type FooterColumn = { heading: string; links: string[] }

/** Site footer (Figma 14:356): four columns, two below 1280px, one below 600px. */
export function SiteFooter({ columns }: { columns: FooterColumn[] }) {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        {columns.map((col) => {
          const id = `footer-${col.heading.toLowerCase().replace(/\W+/g, '-')}`
          return (
            <nav key={col.heading} className="foot-col" aria-labelledby={id}>
              <h2 id={id}>{col.heading}</h2>
              <ul>
                {col.links.map((label) => (
                  <li key={label}>
                    <a href="#">{label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          )
        })}
      </div>
    </footer>
  )
}
