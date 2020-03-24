import axios from 'axios'
import { SessionStorageItem } from '../utils'
const baseUrl = '/api/login'

export const login = async (credentials: any) => {
    const response = await axios.post(baseUrl, credentials)
    response.status
    handleLoginResponse(response.status, response.data.token)
    return response.data
}

function handleLoginResponse(status: number, token: string) {
    if (status === 200) {
        sessionStorage.setItem(SessionStorageItem.Authorization, token)
    }
}
