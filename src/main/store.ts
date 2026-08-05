import StoreCtor from 'electron-store'
import type ElectronStore from 'electron-store'
import { defaults, type Settings } from '../shared/types'

const Store = (
  (StoreCtor as unknown as { default?: typeof ElectronStore }).default ??
  StoreCtor
) as typeof ElectronStore

const store = new Store<Settings>({
  defaults,
  name: 'settings',
})

export { defaults, type Settings }
export default store
