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
  username?: string
}

export interface ScentItem {
  id?: number,
  name: string,
  brand?: string,
  note?: string
}
