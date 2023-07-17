import { ScentItem } from '../../../common/data-classes'
import { sortNames } from '../../utils'

export function sortByName(response: any) {
  return response.sort((a: { name: string }, b: { name: string }) => { return sortNames(a.name, b.name) })
}

export function getItemNames(items: ScentItem[]): string[] {
  return items.map(item => item.name)
}
