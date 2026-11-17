import type { SstRecipe } from '../recipe'
import { hierarchy } from './hierarchy'
import { newSst, newSstResults } from './new-sst'
import { simple } from './simple'
import { simpleModern } from './simple-modern'

export { hierarchy, newSst, newSstResults, simple, simpleModern }

export const RECIPES: SstRecipe[] = [simpleModern, hierarchy, simple, newSst, newSstResults]
