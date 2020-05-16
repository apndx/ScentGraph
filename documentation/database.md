# ScentGraph Database

ScentGraph has Neo4J graph database, and more precicely [GrapheneDB](https://elements.heroku.com/addons/graphenedb) in Heroku.

The database queries are done using [Cypher](https://neo4j.com/developer/cypher-query-language/) and [neode](https://www.npmjs.com/package/neode).

The queries used in ScentGraph can be found in project [routes](https://github.com/apndx/ScentGraph/tree/master/src/server/routes) codebase.

The database has some constraints:

```
CREATE CONSTRAINT ON (season:Season) ASSERT season.seasonname IS UNIQUE
CREATE CONSTRAINT ON (brand:Brand) ASSERT brand.brandname IS UNIQUE
CREATE CONSTRAINT ON (note:Note) ASSERT note.notename IS UNIQUE
CREATE CONSTRAINT ON (time:TimeOfDay) ASSERT time.timename IS UNIQUE
CREATE CONSTRAINT ON (category:Category) ASSERT category.categoryname IS UNIQUE
CREATE CONSTRAINT ON (gender:Gender) ASSERT gender.gendername IS UNIQUE
CREATE CONSTRAINT ON (user:User) ASSERT user.username IS UNIQUE

```
