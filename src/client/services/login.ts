import axios from 'axios'
import { SessionStorageItem } from '../utils'
import { ClientUser } from '../../common/data-classes'
const baseUrl = '/api/login'

export const login = async (credentials: any) => {
    const response = await axios.post(baseUrl, credentials)
    response.status
    handleLoginResponse(response.status, response.data.token, response.data.user)
    return response.data
}

function handleLoginResponse(status: number, token: string, user: ClientUser) {
    if (status === 200) {
        window.sessionStorage.setItem(SessionStorageItem.LoginRole, user.role)
        window.sessionStorage.setItem(SessionStorageItem.LoginUser, user.username)
        window.sessionStorage.setItem(SessionStorageItem.Authorization, token)
    }
}
