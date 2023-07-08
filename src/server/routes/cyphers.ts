import { AdminContent } from "../../common/data-classes"

export function getScentfromNameCypher(): string {
  return `
    MATCH (scent:Scent{scentname:$scentname}) -[belcategory:BELONGS]->(category:Category)
    MATCH (scent:Scent) -[belbrand:BELONGS]->(brand:Brand{brandname:$brandname})
    MATCH (scent:Scent) -[belseason:BELONGS]->(season:Season)
    MATCH (scent:Scent) -[beltime:BELONGS]->(time:TimeOfDay)
    MATCH (scent:Scent) -[belgender:BELONGS]->(gender:Gender)
    MATCH (scent:Scent)<-[addedby:ADDED]-(user:User)
    return scent, category, brand, season, time, gender, user,
    belcategory, belbrand, belseason, beltime, belgender, addedby`
}

export function getScentFromCypher(item: AdminContent): string {
  const type = item.type.toLowerCase()
  const name = `${type}name`
  return `
    MATCH (scent:Scent) -[belcategory:BELONGS]->(category:Category)
    MATCH (scent:Scent) -[belbrand:BELONGS]->(brand:Brand)
    MATCH (scent:Scent) -[belseason:BELONGS]->(season:Season)
    MATCH (scent:Scent) -[beltime:BELONGS]->(time:TimeOfDay)
    MATCH (scent:Scent) -[belgender:BELONGS]->(gender:Gender)
    MATCH (scent:Scent)<-[addedby:ADDED]-(user:User)
    WHERE toLower(${type}.${name}) = toLower($${name})
    return scent, category, brand, season, time, gender, user,
    belcategory, belbrand, belseason, beltime, belgender, addedby`
}

export function getScentFromNoteCypher(item: AdminContent): string {
  const type = item.type.toLowerCase()
  const name = `${type}name`
  return `
    MATCH (scent:Scent) -[belcategory:BELONGS]->(category:Category)
    MATCH (scent:Scent) -[belbrand:BELONGS]->(brand:Brand)
    MATCH (scent:Scent) -[belseason:BELONGS]->(season:Season)
    MATCH (scent:Scent) -[beltime:BELONGS]->(time:TimeOfDay)
    MATCH (scent:Scent) -[belgender:BELONGS]->(gender:Gender)
    MATCH (scent:Scent) -[hasnote:HAS]->(note:Note)
    MATCH (scent:Scent)<-[addedby:ADDED]-(user:User)
    WHERE toLower(${type}.${name}) = toLower($${name})
    return scent, category, brand, season, time, gender, note, user,
    belcategory, belbrand, belseason, beltime, belgender, hasnote, addedby`
}

export function getallScentsCypher(item: AdminContent): string {
  const type = item.type.toLowerCase()
  const name = `${type}name`
  return `
    MATCH (scent:Scent) -[belcategory:BELONGS]->(category:Category)
    MATCH (scent:Scent) -[belbrand:BELONGS]->(brand:Brand)
    MATCH (scent:Scent) -[belseason:BELONGS]->(season:Season)
    MATCH (scent:Scent) -[beltime:BELONGS]->(time:TimeOfDay)
    MATCH (scent:Scent) -[belgender:BELONGS]->(gender:Gender)
    OPTIONAL MATCH (scent:Scent) -[hasnote:HAS]->(note:Note)
    WHERE toLower(${type}.${name}) = toLower($${name})
    return scent, category, brand, season, time, gender, note,
    belcategory, belbrand, belseason, beltime, belgender, hasnote`
}


export function getCurrentScentCypher(): string {
  return `
	MATCH (scent:Scent) -[belcategory:BELONGS]->(category:Category)
    MATCH (scent:Scent) -[belbrand:BELONGS]->(brand:Brand)
    MATCH (scent:Scent) -[belseason:BELONGS]->(season:Season)
    MATCH (scent:Scent) -[beltime:BELONGS]->(time:TimeOfDay)
    MATCH (scent:Scent) -[belgender:BELONGS]->(gender:Gender)
    MATCH (scent:Scent)<-[addedby:ADDED]-(user:User)
    WHERE toLower(season.seasonname) = toLower($seasonname)
    AND toLower(time.timename) = toLower($timename)
    return scent, category, brand, season, time, gender, user,
    belcategory, belbrand, belseason, beltime, belgender, addedby`
}
