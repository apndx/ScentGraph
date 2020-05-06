export interface ScentToCreate {
  scentname: string,
  description?: string,
  url?: string,
  addedusername?: string,
  brandname: string,
  seasonname?: string,
  gendername?: string,
  categoryname?: string,
  timename?: string,
  notenames?: string[],
  username?: string
}

export interface ScentItem {
  id: number,
  name: string
}

export interface NeodeBatchQueryItem {
  query: string,
  params: object
}

export interface NoteItem  {
  name: string
}
