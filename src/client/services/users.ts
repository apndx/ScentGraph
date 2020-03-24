import axios from 'axios'
import { SessionStorageItem } from '../utils'
const baseUrl = '/api/users'

export const create = async (newObject) => {
    const config = {
     headers: { 'Authorization': sessionStorage.getItem(SessionStorageItem.Authorization) }
    }
  
    const response = await axios.post(`${baseUrl}/add`, newObject, config)
    return response.data
  }
