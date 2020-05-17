import axios from 'axios'
import { SessionStorageItem, errorHandler } from '../utils'

const baseUrl = '/api/'

export const getAll = async (type: string) => {
  const path = `${baseUrl}${type}`
  const config = {
    headers: { 'Authorization': `bearer ${sessionStorage.getItem(SessionStorageItem.Authorization)}` }
  }
  try {
    const response = await axios.get(`${path}/all`, config)
    return response.data
  } catch (error) {
    errorHandler(error)
  }
}
