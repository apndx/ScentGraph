import axios from 'axios'
const baseUrl = '/api/users'

export const create = async (newObject) => {
    //const config = {
    //  headers: { 'Authorization': token }
    //}
  
    //const response = await axios.post(baseUrl, newObject, config)
    const response = await axios.post(`${baseUrl}/add`, newObject)
    return response.data
  }
