# eIFU Document Viewer (React)

React + TypeScript + Vite rebuild of the eIFU document viewer prototype (`../index.html`).

- **Screens:** Figma "new SST themes" → "paper rebuild" (node 239:110): mobile and desktop doc view, actions menu, QR menu, doc info.
- **Components:** Figma "new SST themes" → "Generic UI components" (node 249:123), in `src/components/ui/`.
- **Tokens:** enLabel Design System (Figma `JvNBwULcdsKmpdhv35eRvR`, Colors / Semantic node 1055:150), in `src/styles/tokens.css`.

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
| `src/assets/icons/` | The Figma `Icon/*` SVGs, rendered as masks so they take `currentColor` |
| `src/viewer/` | The document page: pdf.js viewer, doc info panel/sheet, toasts, sample data |

Components bind only to usage tokens. To theme for eDraw, change the `--color-brand-*` semantic values.

## Behavior

- PDF rendered in-page with pdf.js (lazy per page, DPR capped at 2), page `n of N` input, zoom 50–200%, fit width.
- Doc info: side panel on desktop, bottom sheet on mobile. Tabs jump within the panel and follow its scroll.
- Actions menu (favorite toggle, download, print, email, copy link) and QR popover, with keyboard support and focus return. Escape closes the popover first, then the panel.
- Product codes copy on click; actions confirm with a `role="status"` toast.
