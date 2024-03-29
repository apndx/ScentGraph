export enum ClientRoutePath {
    FrontPage = '/',
    Current = '/',
    UserCreation = '/newUser',
    ScentCreation = '/addScent',
    NoteCreation = '/addNotes',
    ShowCategoryScents = '/showScents',
    AdminTools = '/adminTools',
    Login = '/login',
    Logout = '/logout',
    Info = '/info'
}

export function getClientRoute(path: ClientRoutePath): string {
    return path
}
