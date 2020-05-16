import { ScentItem } from '../../common/data-classes'

export function scentNamesBrands(items: ScentItem[]): string[] {
    return items.map(item => `${item.name} - ${item.brand}`)
}
