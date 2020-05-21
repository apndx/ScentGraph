import axios from 'axios'
import { SessionStorageItem, errorHandler } from '../utils'
const baseUrl = '/api/users'

export const createUser = async newObject => {
  const config = {
    headers: { 'Authorization': sessionStorage.getItem(SessionStorageItem.Authorization) }
  }
  try {
    const response = await axios.post(`${baseUrl}/add`, newObject, config)
    return response.data
  } catch (error) {
    errorHandler(error)
  }
}

export const getUser = async (username: string) => {
  const path = `${baseUrl}/loggedUser`
  const config = {
    headers: { 'Authorization': `bearer ${sessionStorage.getItem(SessionStorageItem.Authorization)}` }
  }
  try {
    const response = await axios.post(path, username, config)
    return response.data
  } catch (error) {
    errorHandler(error)
  }
}
