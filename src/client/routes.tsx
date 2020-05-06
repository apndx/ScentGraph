export enum ClientRoutePath {
    FrontPage = '/',
    UserCreation = '/newUser',
    ScentCreation = '/addScent',
    NoteCreation = '/addNotes',
    ShowCategoryScents = '/showScents',
    AdminTools = '/adminTools',
    Login = '/login',
    Logout = '/logout'
}

export function getClientRoute(path: ClientRoutePath): string {
    return path
}
