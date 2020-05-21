import { ScentItem } from '../../common/data-classes'

export function getNames(items: ScentItem[]): string[] {
  return items.map(item => item.name)
}
