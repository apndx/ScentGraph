export enum ClientRoutePath {
    FrontPage = '/',
    UserCreation = '/newUser'
}

export function getClientRoute(path: ClientRoutePath): string {
    return path
}
