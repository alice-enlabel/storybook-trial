import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import type { SstRecipe } from './recipe'
import { hierarchy, newSst, newSstResults, simple, simpleModern } from './recipes'
import type { BlockSpec } from './registry'
import { SstPage } from './SstPage'

/*
 * An SST is a recipe (./recipes): header, ordered sections, footer, each a
 * block from the library (./registry) in one of its variants, plus a skin.
 * These stories render each recipe as a full page. To prototype a new SST,
 * open Composer and edit its recipe in the Controls panel.
 */

const meta = {
  title: 'SST/Templates',
  component: SstPage,
  parameters: { layout: 'fullscreen' },
  globals: { viewport: { value: 'desktop', isRotated: false } },
} satisfies Meta<typeof SstPage>

export default meta
type Story = StoryObj<typeof meta>

/** Count of blocks a recipe asks for, nested ones included. */
function blockCount(recipe: SstRecipe): number {
  const count = (specs: BlockSpec[]): number => specs.reduce((n, s) => n + 1 + count(s.children ?? []), 0)
  return (recipe.header ? 1 : 0) + count(recipe.sections) + (recipe.footer ? 1 : 0)
}

function template(recipe: SstRecipe): Story {
  return {
    name: recipe.name,
    args: { recipe },
    globals: { skin: recipe.skin },
    parameters: { docs: { description: { story: recipe.description } } },
    play: async ({ canvasElement }) => {
      // Every block in the recipe rendered, so no spec was silently dropped.
      await expect(canvasElement.querySelectorAll('[data-block]')).toHaveLength(blockCount(recipe))
    },
  }
}

export const SimpleModern = template(simpleModern)
export const Hierarchy = template(hierarchy)
export const Simple = template(simple)
export const NewSst = template(newSst)
export const NewSstResults = template(newSstResults)

/** The simple SST at phone width: blocks stack below 900px. */
export const SimpleMobile: Story = { ...template(simple), name: 'Simple · mobile', globals: { skin: simple.skin, viewport: { value: 'mobile2', isRotated: false } } }

/**
 * Start a new SST here: edit `recipe` in the Controls panel (add, remove or
 * reorder sections, switch a block's variant, change its content) and the page
 * re-renders. Copy the JSON into a new file in src/sst/recipes/ when it works.
 */
export const Composer: Story = {
  args: {
    recipe: {
      id: 'draft',
      name: 'Draft SST',
      description: 'Scratch recipe for composing a new SST.',
      skin: 'eifu',
      header: { type: 'header', props: { variant: 'links', items: ['Home', 'Favorites', 'Recent'] } },
      sections: [
        { type: 'hero', props: { variant: 'brand', title: 'Welcome to the eIFU Website' }, children: [{ type: 'search', props: { variant: 'bar', fields: ['REF number'] } }] },
        { type: 'labelGuide', props: { heading: 'How to Read Product Labels', text: ['Configurable instructions.'] } },
        { type: 'categories', props: { categories: [{ label: 'Category 1' }, { label: 'Category 2' }, { label: 'Category 3' }, { label: 'Category 4' }] } },
      ],
      footer: { type: 'footer', props: { columns: [{ heading: 'Support', links: ['Tutorial'] }] } },
    },
  },
}
