import nock from 'nock'
import { Token } from '../../common/data-classes'
import request from 'request-promise'

const jwt = require('jsonwebtoken')
const username = 'da-test-dude'
const role = 'admin'
const user_id = 'da-user-id'
const secret = process.env.SECRET || ''
const port = process.env.PORT || 3002
const apiUrl = process.env.API_URL || 'http://localhost:5000'
const userForToken: Token = { username, user_id, role }
const token = jwt.sign(userForToken, secret)
export const MOCK_AUTHORIZATION = `bearer ${token}`

export async function doTestRequest(
  method: 'GET' | 'POST' | 'DELETE',
  apiPath: string,
  body?: object,
  query?: object,
  authorization: string = MOCK_AUTHORIZATION
): Promise<request.RequestPromise> {
  const uri = `http://localhost:${port}/${apiPath}`
  return request({
    json: true,
    method,
    uri,
    body,
    headers: {
      'user-agent': 'scent-graph',
      'Authorization': authorization,
      'accepth': 'application/json',
      'content-type': 'application/json'
    },
    useQuerystring: !!query,
    qs: query,
  })
}


export function mockApiRequest(): nock.Scope {
  return nock(`${apiUrl}`, {
    reqheaders: {
      'user-agent' : 'scent-graph',
      'Authorization': MOCK_AUTHORIZATION,
      'accept': 'application/json',
      'content-type': 'application/json'
    },
    allowUnmocked: true
  })
  .get('/*').reply(404)
}

export function cleanTestSuite(): void {
  nock.cleanAll()
}
