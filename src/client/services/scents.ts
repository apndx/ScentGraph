import axios from 'axios'
import { SessionStorageItem, errorHandler } from '../utils'
import { AdminContent, ScentItem } from '../../common/data-classes'

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

export const getScentsFrom = async (item: AdminContent) => {
  const path = `${baseUrl}scents/allFrom`
  const config = {
    headers: { 'Authorization': `bearer ${sessionStorage.getItem(SessionStorageItem.Authorization)}` }
  }
  try {
    const response = await axios.post(`${path}`, item, config)
    return response.data
  } catch (error) {
    errorHandler(error)
  }
}

export const noteToScent = async (newObject: ScentItem) => {
  const path = `${baseUrl}scents`
  const config = {
    headers: { 'Authorization': `bearer ${sessionStorage.getItem(SessionStorageItem.Authorization)}` }
  }
  try {
    const response = await axios.post(`${path}/addNote`, newObject, config)
    return response.data
  } catch (error) {
    errorHandler(error)
  }
}
