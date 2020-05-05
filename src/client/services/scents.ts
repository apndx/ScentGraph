import axios from 'axios'
import { SessionStorageItem, errorHandler } from '../utils'

const baseUrl = '/api/'

export const createScent = async (newObject) => {
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

export const getScentsFromCategory = async (categoryname: string) => {
  const path = `${baseUrl}scents/allFromCategory`
  const config = {
    headers: { 'Authorization': `bearer ${sessionStorage.getItem(SessionStorageItem.Authorization)}` }
  }
  const categoryObject = { categoryname: categoryname }
  try {
    const response = await axios.post(`${path}`, categoryObject, config)
    return response.data
  } catch (error) {
    errorHandler(error)
  }
}
