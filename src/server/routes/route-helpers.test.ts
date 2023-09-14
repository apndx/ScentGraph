import { nodeConverter, paramDecider } from './route-helpers'
import { AdminContent, GraphNodeIn, GraphNodeOut } from '../../common/data-classes'
import { loadFixtureFile } from '../../common/test-utils'
import { seasonDecider, timeDecider } from '../../common/utils'

describe('Param decider', () => {

  it('should create correct params for name item', async () => {
    const item: AdminContent = { type: 'scent', itemName: 'Virgin Mojito - The Body Shop' }
    const params = paramDecider(item)
    const expected = { scentname: 'Virgin Mojito', brandname: 'The Body Shop' }
    expect(params).toEqual(expected)
  })

  it('should create correct params for current item', async () => {
    const item: AdminContent = { type: 'current', itemName: 'current' }
    const params = paramDecider(item)
    const season = seasonDecider(new Date())
    const time = timeDecider()
    const expected = { seasonname: season, timename: time }
    expect(params).toEqual(expected)
  })

  it('should create correct params for default item', async () => {
    const item: AdminContent = { type: 'Season', itemName: 'Winter' }
    const params = paramDecider(item)
    const expected = { seasonname: 'winter' }
    expect(params).toEqual(expected)
  })

})

describe('Node converter', () => {

  it('should convert node correctly', async () => {
    const categoryIn = loadFixtureFile<GraphNodeIn[]>('categories-in.json')[0]
    const categoryOut = loadFixtureFile<GraphNodeOut[]>('categories-out.json')[0]
    expect(nodeConverter(categoryIn)).toEqual(categoryOut)
  })

  it('should leave timestamp empty if it does not exist', async () => {
    const categoryIn = loadFixtureFile<GraphNodeIn[]>('categories-in.json')[1]
    const categoryOut = loadFixtureFile<GraphNodeOut[]>('categories-out.json')[1]
    expect(nodeConverter(categoryIn)).toEqual(categoryOut)
  })

  it('should add 0 to hours and minutes that are length 1', async () => {
    const categoryIn = loadFixtureFile<GraphNodeIn[]>('categories-in.json')[8]
    const categoryOut = loadFixtureFile<GraphNodeOut[]>('categories-out.json')[2]
    expect(nodeConverter(categoryIn)).toEqual(categoryOut)
  })

})
