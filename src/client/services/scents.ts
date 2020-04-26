import axios from 'axios'
import { SessionStorageItem } from '../utils'
const baseUrl = '/api/'

export const createScent = async (newObject) => {
  const path = `${baseUrl}scents`
  const config = {
    headers: { 'Authorization': `bearer ${sessionStorage.getItem(SessionStorageItem.Authorization)}` }
  }
  const response = await axios.post(`${path}/add`, newObject, config)
  return response.data
}

export const getAll = async (type: string) => {
  const path = `${baseUrl}${type}`
  const config = {
    headers: { 'Authorization': `bearer ${sessionStorage.getItem(SessionStorageItem.Authorization)}` }
  }
  const response = await axios.get(`${path}/all`, config)
  return response.data
}

export const getScentsFromCategory = async (category: string) => {
  const path = `${baseUrl}scents/allFromCategory/${category}`
  const config = {
    headers: { 'Authorization': `bearer ${sessionStorage.getItem(SessionStorageItem.Authorization)}` }
  }
  const response = await axios.get(`${path}`, config)
  return response.data
}
