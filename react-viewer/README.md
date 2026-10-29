# eIFU Document Viewer (React)

React + TypeScript + Vite rebuild of the eIFU document viewer prototype (`../index.html`).

- **Screens:** Figma "new SST themes" → "paper rebuild" (node 239:110): mobile and desktop doc view, actions menu, QR menu, doc info.
- **Components:** Figma "new SST themes" → "Generic UI components" (node 249:123), in `src/components/ui/`.
- **Tokens:** enLabel Design System (Figma `JvNBwULcdsKmpdhv35eRvR`, Colors / Semantic node 1055:150), in `src/styles/tokens.css`.
- **Parity reference:** the HTML prototype `../index.html` sets sizes, motion and the content below the viewer; its `../assets/` (logo, product icons, related cover, divider) are copied into `src/assets/`.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production build
```

## Layout

| Path | Holds |
|---|---|
| `src/styles/tokens.css` | Usage tokens (`--color-text-*`, `--color-surface-*`, `--color-border-*`, `--color-icon-*`), spacing, radius, and the mobile/desktop type scale (desktop from 900px) |
| `src/components/ui/` | Generic UI library: Icon, Button, IconButton, TextLink, TextField, Select, Badge, Chip, KeyValueRow, DescriptionItem, ContentHeader, Breadcrumb, BackLink, TabBar, AppHeader, Menu, MediaPopover, PanelHeader, Accordion, ContentCard |
| `src/assets/icons/` | Product icons from the prototype's `assets/icon-*.svg`, Figma `Icon/*` glyphs, and viewer toolbar glyphs in `toolbar/`; all rendered as masks so they take `currentColor` |
| `src/viewer/` | The document page: pdf.js viewer with mobile/desktop toolbars, doc info panel/sheet, ratings, related documents, footer, toasts, sample data |
| `src/stories/`, `.storybook/` | Storybook 10 (`npm run storybook`) |

Components bind only to usage tokens. To theme for eDraw, change the `--color-brand-*` semantic values.

## Behavior

- PDF rendered in-page with pdf.js (lazy per page, DPR capped at 2), page `n of N` input, zoom 50–200%, fit width, full screen. The desktop toolbar drops tools in steps as the viewer narrows (container queries); tools beyond zoom, fit, page, print, save and full screen are placeholders.
- Doc info: side panel on desktop (slides in and out while the viewer resizes), bottom sheet on mobile (slides up and down). Tabs jump within the panel and follow its scroll.
- Ratings with live average, related-document cards, four-column footer.
- Actions menu (favorite toggle, download, print, email, copy link) and QR popover, with keyboard support and focus return. Escape closes the popover first, then the panel.
- Product codes copy on click; actions confirm with a `role="status"` toast.
