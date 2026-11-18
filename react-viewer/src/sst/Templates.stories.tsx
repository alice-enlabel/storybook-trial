import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import type { SstRecipe } from './recipe'
import { aliceSstConcept, hierarchy, simple, simpleModern } from './recipes'
import type { BlockSpec } from './registry'
import { SKINS, type Skin } from './skins'
import { SstPage } from './SstPage'

/*
 * An SST is a recipe (./recipes): header, ordered sections, footer, each a
 * block from the library (./registry) in one of its variants, plus a skin.
 * These stories render each recipe as a full page.
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

/** A full-page story of `recipe`, in its own skin unless `skin` names another one. */
function template(recipe: SstRecipe, skin?: Skin): Story {
  return {
    name: skin ? `${recipe.name} · ${skin.title}` : recipe.name,
    args: { recipe },
    globals: { skin: skin?.id ?? recipe.skin },
    parameters: { docs: { description: { story: recipe.description } } },
    play: async ({ canvasElement }) => {
      // Every block in the recipe rendered, so no spec was silently dropped.
      await expect(canvasElement.querySelectorAll('[data-block]')).toHaveLength(blockCount(recipe))
    },
  }
}

const highContrast = SKINS.find((s) => s.id === 'sample-high-contrast')!

export const SimpleModern = template(simpleModern)
export const SimpleModernHighContrast = template(simpleModern, highContrast)
export const Hierarchy = template(hierarchy)
export const HierarchyHighContrast = template(hierarchy, highContrast)
export const Simple = template(simple)
export const SimpleHighContrast = template(simple, highContrast)
export const AliceSstConcept = template(aliceSstConcept)
export const AliceSstConceptHighContrast = template(aliceSstConcept, highContrast)
