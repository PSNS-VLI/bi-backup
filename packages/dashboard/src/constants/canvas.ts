import { getUniID, getCategories } from '../utils'

import { Module } from './common'
import { ComponentCategory } from './component'

// Canvas built-in element ID.
export const ComponentID = {
  INTERNAL_FERRYMAN: getUniID(
    Module.DASHBOARD,
    getCategories(ComponentCategory.INTERNAL, 'ferryman')
  )
}
