export enum ClientRoutePath {
    FrontPage = '/',
    UserCreation = '/newUser',
    ScentCreation = '/scentCreate',
    AdminTools = '/adminTools',
    Login = '/login',
    Logout = '/logout'
}

export function getClientRoute(path: ClientRoutePath): string {
    return path
}
