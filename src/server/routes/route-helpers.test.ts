import { paramsForScentGraph } from './route-helpers'
import { AdminContent } from '../../common/data-classes'

describe('Route helper', () => {

  it('should create correct params', async () => {
    const item: AdminContent = { type: 'Season', itemName: 'Winter' }
    const params = paramsForScentGraph(item)
    const expected = { seasonname: 'winter' }
    expect(params).toEqual(expected)
  })

})
