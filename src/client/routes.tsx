export enum ClientRoutePath {
    FrontPage = '/'
}

export function getClientRoute(path: ClientRoutePath): string {
    console.log('PATH')
    return path
}