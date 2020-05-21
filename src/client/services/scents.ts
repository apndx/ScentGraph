import axios from 'axios'
import { SessionStorageItem, errorHandler } from '../utils'

const baseUrl = '/api/'

export const createScent = async newObject => {
  const path = `${baseUrl}scents`
  const config = {
    headers: { 'Authorization': `bearer ${sessionStorage.getItem(SessionStorageItem.Authorization)}` }
  }
  try {
    const response = await axios.post(`${path}/add`, newObject, config)
    return response.data
  } catch (error) {
    errorHandler(error)
  }
}
