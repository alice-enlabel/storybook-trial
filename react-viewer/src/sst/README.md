# SST blocks

An SST (Subscriber Site Template) is assembled from three layers. Storybook shows each one under **SST/**.

| Layer | Where | What it decides | Storybook |
|---|---|---|---|
| Blocks | `blocks/` | Reusable page sections, each with variants | SST/Blocks |
| Recipe | `recipes/` | Which blocks, in which variant and order, with which publisher content | SST/Templates |
| Skin | `skins/` | Colour, font and radius, as token overrides only | SST/Skins, toolbar **Skin** |

## Make a new SST

1. Open **SST/Templates → Composer** and edit `recipe` in the Controls panel until the page is right.
2. Copy that JSON into `recipes/<id>.ts` as an `SstRecipe`, add it to `recipes/index.ts`, and add a story line in `Templates.stories.tsx`. The story's test fails if any block in the recipe does not render.
3. If the subscriber needs its own colours, copy `skins/_template.css`, register it in `skins/index.ts`, and set the recipe's `skin`.

A recipe that names an unknown variant or prop fails the typecheck: `BlockSpec` checks each block's props against its component.

## Add a block

1. Add `blocks/<Name>.tsx`. Use `blockParts` / `blockRoot` from `parts.ts` so the block gets `eifu_<block>_<part>` ids (the live app's scheme, which existing SST CSS targets) and `data-block` / `data-variant` hooks.
2. Style it in `sst.css` with design tokens only, scoped to its block class.
3. Register it in `registry.ts`. Every recipe can now use it.
4. Add stories for each variant.

## Blocks and their sources

| Block | Variants | Source |
|---|---|---|
| `header` | title, bar, glass, links | live Default / Hierarchy, live SimpleModernSST, Figma 157:2834, Figma 35:85 |
| `hero` | brand, image, wordmark | live SimpleModernSST, Figma 157:2834, Figma 35:85 |
| `search` | bar, filtered, card | live SimpleModernSST, live Hierarchy, Figma 35:85 |
| `barcodeScan` | | live Hierarchy |
| `intro` | | Figma 35:85 |
| `labelGuide` | image-left, image-top | Figma 157:2834 / 35:85, live SimpleModernSST |
| `categories` | | Figma 157:2834 "Search by Category" |
| `shelf` | | Figma 157:2834 "Recently Published" |
| `resources` | | Figma 157:2834 "Additional Resources" |
| `hierarchy` | | live Hierarchy, Figma 57:489 |
| `footer` | | shared with the document viewer |
| `row` | | layout: blocks side by side |

Not yet blocks: the search results list, Recent Activity, and the Request a Hardcopy flow (all in Figma 157:2834). The document view is the separate viewer refresh in `../viewer`.
