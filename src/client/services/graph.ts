import axios from 'axios'
import { SessionStorageItem, errorHandler } from '../utils'
import { AdminContent } from '../../common/data-classes'

const baseUrl = '/api/'

export const getScentsFrom = async (item: AdminContent) => {
  const path = `${baseUrl}graph/allFrom`
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

export const notesForGraph = async (scentname: string) => {
  const path = `${baseUrl}graph/scentNotesForGraph`
  const config = {
    headers: { 'Authorization': `bearer ${sessionStorage.getItem(SessionStorageItem.Authorization)}` }
  }
  try {
    const response = await axios.post(`${path}`, {scentname: scentname}, config)
    return response.data
  } catch (error) {
    errorHandler(error)
  }
}
