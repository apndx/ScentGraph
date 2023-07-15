import { ScentItem } from '../../../common/data-classes'
import { sortNames } from '../../utils'

export function sortByName(response: any) {
  return response.sort((a, b) => { return sortNames(a.name, b.name) })
}

export function categoryNames(items: ScentItem[]): string[] {
  return items.map(item => item.name)
}

export function brandNames(items: ScentItem[]): string[] {
  return items.map(item => item.name)
}
