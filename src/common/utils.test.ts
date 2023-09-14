import { Season } from './data-classes'
import { seasonDecider } from './utils'

describe('Season decider', () => {

  it('should give correct season for winter months', async () => {

    const december = new Date(2023, 11, 14)
    const january = new Date(2023, 0, 14)
    const february = new Date(2023, 1, 14)

    const season1 = seasonDecider(december)
    const season2 = seasonDecider(january)
    const season3 = seasonDecider(february)

    expect(season1).toEqual(Season.Winter)
    expect(season2).toEqual(Season.Winter)
    expect(season3).toEqual(Season.Winter)
  })

  it('should give correct season for spring months', async () => {
    const march = new Date(2023, 2, 14)
    const april = new Date(2023, 3, 14)
    const may = new Date(2023, 4, 14)
    const season1 = seasonDecider(march)
    const season2 = seasonDecider(april)
    const season3 = seasonDecider(may)
    expect(season1).toEqual(Season.Spring)
    expect(season2).toEqual(Season.Spring)
    expect(season3).toEqual(Season.Spring)
  })

  it('should give correct season for summer months', async () => {
    const june = new Date(2023, 5, 14)
    const july = new Date(2023, 6, 14)
    const august = new Date(2023, 7, 14)
    const season1 = seasonDecider(june)
    const season2 = seasonDecider(july)
    const season3 = seasonDecider(august)
    expect(season1).toEqual(Season.Summer)
    expect(season2).toEqual(Season.Summer)
    expect(season3).toEqual(Season.Summer)
  })

  it('should give correct season for autumn months', async () => {
    const september = new Date(2023, 8, 14)
    const october = new Date(2023, 9, 14)
    const november = new Date(2023, 10, 14)
    const season1 = seasonDecider(september)
    const season2 = seasonDecider(october)
    const season3 = seasonDecider(november)
    expect(season1).toEqual(Season.Autumn)
    expect(season2).toEqual(Season.Autumn)
    expect(season3).toEqual(Season.Autumn)
  })

})
