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

export enum Season {
  Winter = "Winter",
  Spring = "Spring",
  Summer = "Summer",
  Autumn = "Autumn"
}

export enum TimeOfDay {
  Day = "Day",
  Night = "Night",
}
