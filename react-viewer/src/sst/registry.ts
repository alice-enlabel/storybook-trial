/*
 * Every block an SST can use, by the name a recipe refers to it with.
 * Add a block here and it is immediately available to every recipe.
 */
import type { ComponentProps, ComponentType } from 'react'
import { BarcodeScan } from './blocks/BarcodeScan'
import { CategoryCarousel } from './blocks/CategoryCarousel'
import { DocumentShelf } from './blocks/DocumentShelf'
import { Footer } from './blocks/Footer'
import { Hero } from './blocks/Hero'
import { HierarchyTree } from './blocks/HierarchyTree'
import { IntroCard } from './blocks/IntroCard'
import { LabelGuide } from './blocks/LabelGuide'
import { Resources } from './blocks/Resources'
import { Row } from './blocks/Row'
import { SearchBlock } from './blocks/SearchBlock'
import { SiteHeader } from './blocks/SiteHeader'

export const BLOCKS = {
  header: SiteHeader,
  hero: Hero,
  search: SearchBlock,
  barcodeScan: BarcodeScan,
  intro: IntroCard,
  labelGuide: LabelGuide,
  categories: CategoryCarousel,
  shelf: DocumentShelf,
  resources: Resources,
  hierarchy: HierarchyTree,
  footer: Footer,
  row: Row,
} satisfies Record<string, ComponentType<never>>

export type BlockType = keyof typeof BLOCKS

/**
 * One block in a recipe. `props` is type-checked against the block's component,
 * so a typo in a recipe fails the build instead of rendering nothing.
 */
export type BlockSpec = {
  [K in BlockType]: {
    type: K
    props: Omit<ComponentProps<(typeof BLOCKS)[K]>, 'children'>
    /** Nested blocks, for container blocks (hero, row). */
    children?: BlockSpec[]
    /** Width of the band this block sits in. Default: contained. */
    width?: 'full' | 'contained'
  }
}[BlockType]
