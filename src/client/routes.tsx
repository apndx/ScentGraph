export enum ClientRoutePath {
    FrontPage = '/',
    UserCreation = '/newUser',
    ScentCreation = '/addScent',
    ShowCategoryScents = '/scentsFromCategory',
    AdminTools = '/adminTools',
    Login = '/login',
    Logout = '/logout'
}

export function getClientRoute(path: ClientRoutePath): string {
    return path
}
