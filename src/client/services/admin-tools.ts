import axios from 'axios'
import { SessionStorageItem } from '../utils'
const baseUrl = '/api/'

export const createItem = async (newObject) => {
    const path = `${baseUrl}${newObject.type}`
    const config = {
     headers: { 'Authorization': `bearer ${sessionStorage.getItem(SessionStorageItem.Authorization)}` }
    }
  
    const response = await axios.post(`${path}/add`, newObject, config)
    return response.data
  }
