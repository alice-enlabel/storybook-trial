import type { SstRecipe } from '../recipe'
import { hierarchy } from './hierarchy'
import { aliceSstConcept } from './alice-sst-concept'
import { simple } from './simple'
import { simpleModern } from './simple-modern'

export { aliceSstConcept, hierarchy, simple, simpleModern }

export const RECIPES: SstRecipe[] = [simpleModern, hierarchy, simple, aliceSstConcept]
