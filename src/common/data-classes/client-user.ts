export interface ClientUser {
  name?: string,
  username: string,
  password?: string,
  token?: string,
  role?: string
}

export interface Token {
  username: string,
  user_id: string,
  role: string
}
