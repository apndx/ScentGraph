import { doTestRequest, mockApiRequest, cleanTestSuite } from '../../utils/test-utils'

describe('Season route', () => {
  jest.setTimeout(30000)
  beforeAll(cleanTestSuite)
  it('should create a new season', async () => {

    const NEO4J_API_PATH = '/season/add'
    const expectedResponse = `Season Gardening created`
    const body = { itemName: 'Gardening' }
    mockApiRequest()
      .post(NEO4J_API_PATH, body)
      .reply(200, expectedResponse)

    const response = await doTestRequest('POST', `api${NEO4J_API_PATH}`, body)
    expect(response).toEqual(expectedResponse)
  })

  it('should delete a season', async () => {

    const NEO4J_API_PATH = '/season/delete'
    const expectedResponse = 'Season deleted'
    const body = { itemName: 'Gardening' }
    mockApiRequest()
    .delete(NEO4J_API_PATH, body)
    .reply(200, expectedResponse)

    const response = await doTestRequest('DELETE', `api${NEO4J_API_PATH}`, body)
    expect(response).toEqual(expectedResponse)

  })

})
