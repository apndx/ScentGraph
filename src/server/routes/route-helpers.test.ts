import { scentGraphParams, nodeConverter, timeHelper } from './route-helpers'
import { AdminContent, GraphNodeIn, GraphNodeOut } from '../../common/data-classes'
import { loadFixtureFile } from '../../common/test-utils'

describe('Route helper', () => {

  it('should create correct params', async () => {
    const item: AdminContent = { type: 'Season', itemName: 'Winter' }
    const params = scentGraphParams(item)
    const expected = { seasonname: 'winter' }
    expect(params).toEqual(expected)
  })

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
