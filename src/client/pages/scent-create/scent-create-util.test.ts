import { ScentItem } from '../../../common/data-classes'
import { getItemNames, sortByName } from './scent-create-util'
import { loadFixtureFile } from '../../../common/test-utils'

describe('Item names', () => {

  it('should be converted correctly', async () => {
    const scentItems = loadFixtureFile<ScentItem[]>('scent-items.json')
    const scentNames = loadFixtureFile<string[]>('name-list.json')
    expect(getItemNames(scentItems)).toEqual(scentNames)
  })

})

describe('Item list sorting', () => {

  it('should be done by name', async () => {
    const scentItems = loadFixtureFile<ScentItem[]>('scent-items.json')
    const scentNames = loadFixtureFile<string[]>('sorted-scent-items.json')
    expect(sortByName(scentItems)).toEqual(scentNames)
  })

})
