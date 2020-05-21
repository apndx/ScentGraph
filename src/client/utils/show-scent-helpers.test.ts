import { getNames } from '../utils'
import { ScentItem } from '../../common/data-classes'
import { loadFixtureFile } from '../../common/test-utils'

describe('Show scent helpers', () => {

    const scentItems = loadFixtureFile<ScentItem[]>('scent-items.json')
    const expectedNames = loadFixtureFile<string[]>('name-list.json')

    it('should return names of scent items', async () => {
        const names: string[] = getNames(scentItems)
        expect(names).toEqual(expectedNames)
    })

})
