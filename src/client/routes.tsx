export enum ClientRoutePath {
    FrontPage = '/',
    UserCreation = '/newUser',
    AdminTools = '/adminTools',
    Login = '/login',
    Logout = '/logout'
}

export function getClientRoute(path: ClientRoutePath): string {
    return path
}
