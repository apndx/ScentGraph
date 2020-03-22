export enum ClientRoutePath {
    FrontPage = '/',
    UserCreation = '/newUser',
    Login = '/login',
    Logout = '/logout'
}

export function getClientRoute(path: ClientRoutePath): string {
    return path
}
